import e from "express";
import mongoose from "mongoose";
import { use } from "react";

const productSchema = new mongoose.Schema(
  {
    // ชื่อสินค้า
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // รูปสินค้า
    image: {
      type: String,
      required: true,
    },

    // ขนาด + ราคา + stock
    variants: [
      {
        size: {
          type: String,
          required: true,
          enum: ["S", "M", "L"],
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        stock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
      },
    ],

    // เปิด/ปิดขาย
    isActive: {
      type: Boolean,
      default: true,
    },

    // ใช้แยกจาก custom
    type: {
      type: String,
      default: "ready",
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    // เจ้าของตะกร้า
    userId: {
      type: Number,
      required: true,
    },

    // รายการสินค้าในตะกร้า
    cartItems: [
      {
        // แยกประเภทสินค้า
        kind: {
          type: String,
          required: true,
          enum: ["ready", "custom"],
        },

        // ชื่อสินค้า (custom ซ้ำได้)
        name: {
          type: String,
          default: "Custom Tea",
        },

        // จำนวน
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },

        // ตัวเลือกจากหน้า Blending
        option: {
          // Step 1: Size (เลือก 1)
          size: {
            value: {
              type: String,
              required: true,
              enum: ["S", "M", "L"],
            },
            price: {
              type: Number,
              default: 0,
              min: 0,
            },
          },

          // Step 2: Tea Base (เลือกได้หลาย)
          teaBase: [
            {
              value: {
                type: String,
                required: true,
                enum: [
                  "Black Tea",
                  "Green Tea",
                  "Oolong Tea",
                  "Yellow Tea",
                  "White Tea",
                ],
              },
              price: {
                type: Number,
                default: 0,
                min: 0,
              },
            },
          ],

          // Step 3: Ingredients (เลือกหลาย / 3 หมวด)
          ingredients: [
            {
              name: {
                type: String,
                required: true,
              },
              category: {
                type: String,
                required: true,
                enum: ["Herbs", "Spices", "Fruits"],
              },
              price: {
                type: Number,
                default: 0,
                min: 0,
              },
            },
          ],
        },

        // ราคา snapshot
        unitPrice: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },

        totalPrice: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
      },
    ],

    delivery: {
      method: {
        type: String,
        enum: ["Post Thailand", "KEX", "Flash Express"],
        default: "Post Thailand",
      },
      fee: {
        type: Number,
        default: 40,
        min: 0,
      },
    },

    payment: {
      method: {
        type: String,
        enum: ["Credit Card", "QR Code"],
        default: "QR Code",
      },
    },

    // ราคารวมทั้งตะกร้า
    grandTotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true, minlength: 6 },
});
