import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    type: {
      type: String,
      enum: ["ready", "ingredient", "teabase"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock_count: { type: Number, required: true, min: 0 },
    size: { type: String },
    gram: { type: Number },
    is_active: { type: Boolean, default: true },
    referencename: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
