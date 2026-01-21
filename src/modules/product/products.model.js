import mongoose from "mongoose";

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

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
        nameref: {
            type: String,
            unique: true,
            sparse: true // Allows multiple documents to have a null value for the field
        },
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

ProductSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    const nameSlug = slugify(this.name);
    const idPart = this._id ? this._id.toString().slice(-6) : Math.random().toString(36).substring(2,8); // Fallback for _id not available
    this.nameref = `${nameSlug}-${idPart}`;
  }
  next();
});

export const ProductModel =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);