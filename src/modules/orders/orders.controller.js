import { OrderModel } from "./orders.model.js";

/**
 * ดึงคำสั่งซื้อทั้งหมด
 */
export const getOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find();
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * ดึงคำสั่งซื้อตามรหัส ID
 */
export const getOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id);
    
    if (!order) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get order";
    return next(error);
  }
};

/**
 * สร้างคำสั่งซื้อใหม่
 * ต้องระบุ: order_no, user_id, order_items, delivery_option, payment_option, grandTotal
 */
export const createOrder = async (req, res, next) => {
  const { _id, order_no, user_id, order_items, delivery_option, payment_option, grandTotal } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!_id || !order_no || !user_id || !order_items || !delivery_option || !payment_option || grandTotal === undefined) {
    const error = new Error(
      "_id, order_no, user_id, order_items, delivery_option, payment_option, and grandTotal are required"
    );
    error.name = "ValidationError";
    error.status = 400;
    return next(error);
  }

  try {
    const doc = await OrderModel.create({
      _id,
      order_no,
      user_id,
      order_items,
      delivery_option,
      payment_option,
      grandTotal,
    });

    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.name = "DuplicateKeyError";
      error.message = "Order number already exists";
    } else {
      error.status = 500;
      error.name = error.name || "DatabaseError";
      error.message = error.message || "Failed to create order";
    }
    return next(error);
  }
};

/**
 * อัปเดตคำสั่งซื้อตามรหัส ID
 */
export const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const updated = await OrderModel.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to update order";
    return next(error);
  }
};

/**
 * ลบคำสั่งซื้อตามรหัส ID
 */
export const deleteOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleted = await OrderModel.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to delete order";
    return next(error);
  }
};

/**
 * ดึงคำสั่งซื้อของผู้ใช้ตามรหัส user_id
 */
export const getOrdersByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const orders = await OrderModel.find({ user_id: userId });

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No orders found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get orders";
    return next(error);
  }
};

/**
 * อัปเดตสถานะคำสั่งซื้อ (payment_status หรือ delivery_status)
 */
export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { payment_status, delivery_status } = req.body;

  if (!payment_status && !delivery_status) {
    const error = new Error("payment_status or delivery_status is required");
    error.status = 400;
    return next(error);
  }

  try {
    const updateData = {};
    if (payment_status) updateData["status_order.payment_status"] = payment_status;
    if (delivery_status) updateData["status_order.delivery_status"] = delivery_status;

    const updated = await OrderModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to update order status";
    return next(error);
  }
};
