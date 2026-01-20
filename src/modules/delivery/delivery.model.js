import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", //เชื่อมกับไฟล์คำสั่งซื้อ
    required: true
  },

  recipient: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },

  //แยกที่อยู่ออกจากข้อมูล recipient เพราะถ้ามีการแก้ที่อยู่จะได้ไม่ต้องเพิ่มข้อมูลผู้รับใหม่อีกอัน
  address: {
    line1: { type: String, required: true },
    line2: String,
    district: String,
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Thailand" }
  },

  carrier: {
    type: String,
    enum: ["thai_post", "kex", "flash"]
  },

  trackingNumber: String,

  shippingFee: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: [
      "pending",
      "packed"
    ],
    default: "pending"
  },

}, { timestamps: true });

export const Delivery = mongoose.model("Delivery", deliverySchema);