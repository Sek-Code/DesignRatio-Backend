import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
    {
        variant_id: { type: String,},

        // ใช้กับ tea_base / ready
        size: { type: String },      // "S" | "M" | "L"
        gram: { type: Number, min: 0 },

        // ใช้ทุก type
        price: { type: Number, required: true, min: 0 },
        stock_count: { type: Number, min: 0 },
    },
    { _id: false }
);

const ProductSchema = new mongoose.Schema(
    {

        type: {
            type: String,
            enum: ["tea_base", "ready", "ingredient"],
            required: true,
        },

        name: { type: String, required: true, trim: true },

        // มีเฉพาะ tea_base / ready
        image: { type: String },

        // มีเฉพาะ ingredient
        category: {
            type: String,
            enum: ["Herbs", "Spices", "Fruits"],
        },

        variants: {
            type: [VariantSchema],
            required: true,
            // validate: [() => v.length > 0, "At least one variant is required"],
        },

        is_active: { type: Boolean, default: true },

    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export const ProductModel =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);
