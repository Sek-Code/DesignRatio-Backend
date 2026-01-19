import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
    {
        variant_id: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock_count: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const IngredientSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true, // e.g. "ING_JASMINE"
        },
        type: {
            type: String,
            enum: ["ingredient"],
            required: true,
            default: "ingredient",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ["Herbs", "Spices", "Fruits"],
            required: true,
        },
        variants: {
            type: [VariantSchema],
            required: true,
            validate: [() => v.length > 0, "At least one variant is required"],
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
            immutable: true,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export const IngredientModel =
    mongoose.models.Ingredient || mongoose.model("Ingredient", IngredientSchema);
