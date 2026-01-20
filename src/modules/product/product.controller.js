import { ProductModel } from "./products.model.js";

export const getProducts = async (req, res, next) => {
    try {
        const products = await ProductModel.find();
        return res.status(200).json({
            success: true,
            data: products,
        })
    } catch (error) {
            return next(error);
        }
}

export const getProduct = async (req, res, next) =>{
    const { id } = req.params;

    try {
        const products = await ProductModel.findById(id)
        return res.status(200).json({
            success: true,
            data: products,
        })
    } catch (error) {
        error.status = 500;
        error.name = error.name || "DatabaseError";
        error.message = error.message || "Failed to get a product";
        return next(error);
    }
};

