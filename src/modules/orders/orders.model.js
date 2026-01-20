import mongoose from "mongoose";

/**
 * OrderItemSchema - สคีมารายการสินค้าในคำสั่งซื้อ
 * ใช้สำหรับเก็บข้อมูลของสินค้าแต่ละรายการที่ลูกค้าสั่ง
 * รองรับทั้งสินค้าสำเร็จรูป (ready) และสินค้าคำสั่งเฉพาะ (custom)
 */
const OrderItemSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true }, // รหัสสินค้า - อ้างอิงถึง Product model
    type: {
      type: String,
      enum: ["ready", "custom"], // ประเภท: สินค้าสำเร็จรูป หรือ คำสั่งเฉพาะ
      required: true,
    },
    name: { type: String, required: true, trim: true }, // ชื่อสินค้า
    size: { type: String }, // ขนาด: "S" (เล็ก) | "M" (กลาง) | "L" (ใหญ่)
    quantity: { type: Number, required: true, min: 1 }, // จำนวนที่สั่ง (ต้องมากกว่า 0)
    bases: [
      {
        name: { type: String }, // ชื่อฐานชาหลัก เช่น "Green Tea", "Black Tea"
      },
    ],
    ingredients: [
      {
        component_id: { type: String }, // รหัสส่วนประกอบ - อ้างอิงถึง Product model
        name: { type: String }, // ชื่อส่วนประกอบ เช่น "Cinnamon", "Chamomile"
        category: {
          type: String,
          enum: ["Herbs", "Spices", "Fruits"], // หมวดหมู่: สมุนไพร, เครื่องเทศ, ผลไม้
        },
      },
    ],
    ingredients_total_price: { type: Number, min: 0 }, // ราคารวมของส่วนประกอบทั้งหมด
  },
  { _id: false } // ไม่สร้าง _id สำหรับ sub-document นี้
);

/**
 * DeliveryOptionSchema - สคีมาตัวเลือกการส่งสินค้า
 * ใช้เก็บข้อมูลบริการส่งที่ลูกค้าเลือก
 */
const DeliveryOptionSchema = new mongoose.Schema(
  {
    delivery_id: { type: String, required: true }, // รหัสการส่ง เช่น "del_001"
    name: { type: String, required: true, trim: true }, // ชื่อบริการส่ง เช่น "Thailand Post", "Flash Express"
  },
  { _id: false }
);

/**
 * PaymentOptionSchema - สคีมาตัวเลือกการชำระเงิน
 * ใช้เก็บวิธีการชำระเงินที่ลูกค้าเลือก
 */
const PaymentOptionSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["QR Code", "Credit Card", "Debit Card", "Bank Transfer"], // วิธีการชำระเงิน
      required: true,
    },
  },
  { _id: false }
);

/**
 * StatusOrderSchema - สคีมาสถานะคำสั่งซื้อ
 * ใช้ติดตามสถานะการชำระเงินและการส่งสินค้า
 */
const StatusOrderSchema = new mongoose.Schema(
  {
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"], // สถานะการชำระเงิน: รอชำระ, ชำระแล้ว, ล้มเหลว
      default: "pending", // ค่าเริ่มต้น: รอชำระ
    },
    delivery_status: {
      type: String,
      enum: ["preparing", "shipped", "delivered", "cancelled"], // สถานะการส่ง: เตรียม, ส่งแล้ว, ถึงแล้ว, ยกเลิก
      default: "preparing", // ค่าเริ่มต้น: กำลังเตรียม
    },
  },
  { _id: false }
);

/**
 * OrderSchema - สคีมาหลักสำหรับคำสั่งซื้อ
 * เก็บข้อมูลคำสั่งซื้อที่สมบูรณ์ รวมถึง ผู้ซื้อ, สินค้า, การส่ง, การชำระเงิน, สถานะ
 */
const OrderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // รหัสคำสั่งซื้อ เช่น "order_001"
    order_no: { type: String, required: true, unique: true, trim: true }, // หมายเลขคำสั่งซื้อที่แสดงให้ลูกค้าเห็น เช่น "DR-20260115-0001"
    user_id: { type: String, required: true }, // รหัสผู้ใช้ - อ้างอิงถึง User model
    order_items: {
      type: [OrderItemSchema], // รายการสินค้า (array ของ OrderItem)
      required: true,
      validate: [
        (v) => v.length > 0,
        "ต้องมีรายการสินค้าอย่างน้อย 1 รายการ", // ต้องมีสินค้าอย่างน้อยรายการเดียว
      ],
    },
    delivery_option: {
      type: DeliveryOptionSchema, // ตัวเลือกการส่งที่ลูกค้าเลือก
      required: true,
    },
    payment_option: {
      type: PaymentOptionSchema, // ตัวเลือกการชำระเงินที่ลูกค้าเลือก
      required: true,
    },
    status_order: {
      type: StatusOrderSchema, // สถานะการชำระเงินและการส่ง
      default: {
        payment_status: "pending",
        delivery_status: "preparing",
      }, // ค่าเริ่มต้น: รอชำระ, กำลังเตรียม
    },
    grandTotal: { type: Number, required: true, min: 0 }, // จำนวนเงินรวมทั้งหมด (รวมค่าสินค้า + ส่วนประกอบ + ค่าส่ง)
    created_at: { type: Date, default: Date.now, immutable: true }, // วันที่สร้างคำสั่ง (ไม่สามารถแก้ไขได้)
    updated_at: { type: Date, default: Date.now }, // วันที่อัปเดตคำสั่ง
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // อัปเดต updated_at โดยอัตโนมัติเมื่อมีการเปลี่ยนแปลง
  }
);

// สร้าง model "Order" - ถ้ามีอยู่แล้วให้ใช้เดิม ถ้าไม่มีให้สร้างใหม่
export const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
