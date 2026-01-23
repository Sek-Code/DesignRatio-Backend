import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProductModel } from "../product/products.model.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithBot = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: true,
        message: "Message is required",
      });
    }

    const products = await ProductModel.find().select("name price description type");

    const productContext = products.map(p => 
      `- ${p.name} (${p.type}): $${p.price} - ${p.description || "No description"}`
    ).join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const systemMessage = `You are Design Ratio Tea Shop assistant. Help customers about our products:\n${productContext}\n\nUser: ${message}`;
    
    const result = await model.generateContent(systemMessage);
    const responseText = result.response.text();

    res.status(200).json({
      error: false,
      message: responseText,
      userMessage: message,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    next(error);
  }
};