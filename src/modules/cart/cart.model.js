import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
            index: true
        },

        items: [
            {
                product_id: {
                    type: String,
                    require: true,
                    ref: "Product",
                },
               
                product_type: {
                    type: String,
                    enum:["ready","custom"],
                    required: true,
                },
                
                name: {
                    type: String,
                    required: true,
                },

                variant: {
                    variant_id: { type: String, required: true },
                    size: { type: String, enum: ["S","M","L"] },
                    gram: { type: Number },
                },

                selections: {
                    tea_bases: [
                        {
                            product_id: { type: String, ref: "Product"},
                            name: String,
                            price: Number,
                        },
                    ],
                ingredients: [
                        {
                            product_id: {type: String, ref: "Product"},
                            name: String,
                            category: {
                                type: String,
                                enum: ["Herbs", "Spices", "Fruits"],
                            },
                            price: Number
                        },
                    ],
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
        }]
    },
    {
        timestamps: true,
    }
);

export const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema)

