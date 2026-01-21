import { Order } from "./order.model.js";
import { TeaUser } from "../users/users.model.js";

// Helper function to format response order
const formatOrder = (order) => {
  const obj = order.toObject ? order.toObject() : order;
  return {
    _id: obj._id,
    order_no: obj.order_no,
    user_id: obj.user_id,
    order_items: obj.order_items,
    delivery_option: obj.delivery_option,
    payment_option: obj.payment_option,
    status_order: obj.status_order,
    grandTotal: obj.grandTotal,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const makeError = (message, { status = 500, name = "InternalServerError" } = {}) => {
  const error = new Error(message);
  error.status = status;
  error.name = name;
  return error;
};

const normalizeDbError = (error, fallbackMessage) => {
  // Invalid ObjectId, etc.
  if (error?.name === "CastError") {
    error.status = 400;
    error.name = "ValidationError";
    error.message = error.message || "Invalid id";
    return error;
  }

  // Mongoose schema validation
  if (error?.name === "ValidationError") {
    error.status = 400;
    error.name = "ValidationError";
    error.message = error.message || fallbackMessage;
    return error;
  }

  error.status = error.status || 500;
  error.name = error.name || "DatabaseError";
  error.message = error.message || fallbackMessage;
  return error;
};

// Get all orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate(
      "user_id",
      "userName userLast email",
    );

    const formattedOrders = orders.map(formatOrder);

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: formattedOrders,
    });
  } catch (error) {
    return next(normalizeDbError(error, "Failed to retrieve orders"));
  }
};

// Get order by ID
export const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate(
      "user_id",
      "userName userLast email",
    );

    if (!order) {
      return next(makeError("Order not found", { status: 404, name: "NotFoundError" }));
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: formatOrder(order),
    });
  } catch (error) {
    return next(normalizeDbError(error, "Failed to retrieve order"));
  }
};

// Create new order
export const createOrder = async (req, res, next) => {
  const { user_id, order_items, delivery_option, payment_option, grandTotal } =
    req.body;

  // Validation - order_no is auto-generated, don't require it
  if (
    !user_id ||
    !order_items ||
    !delivery_option ||
    !payment_option ||
    grandTotal === undefined ||
    grandTotal === null
  ) {
    return next(
      makeError(
        "Please provide all required fields: user_id, order_items, delivery_option, payment_option, grandTotal",
        { status: 400, name: "ValidationError" },
      ),
    );
  }

  if (!Array.isArray(order_items) || order_items.length === 0) {
    return next(
      makeError("order_items must be a non-empty array", {
        status: 400,
        name: "ValidationError",
      }),
    );
  }

  try {
    const userExists = await TeaUser.exists({ _id: user_id });
    if (!userExists) {
      return next(
        makeError("User not found", { status: 404, name: "NotFoundError" }),
      );
    }

    const newOrder = new Order({
      user_id,
      order_items,
      delivery_option,
      payment_option,
      status_order: {
        payment_status: "pending",
        delivery_status: "preparing",
      },
      grandTotal,
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await savedOrder.populate(
      "user_id",
      "userName userLast email",
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: formatOrder(populatedOrder),
    });
  } catch (error) {
    return next(normalizeDbError(error, "Failed to create order"));
  }
};

// Update order
export const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("user_id", "userName userLast email");

    if (!updatedOrder) {
      return next(makeError("Order not found", { status: 404, name: "NotFoundError" }));
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: formatOrder(updatedOrder),
    });
  } catch (error) {
    return next(normalizeDbError(error, "Failed to update order"));
  }
};

// Delete order
export const deleteOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return next(makeError("Order not found", { status: 404, name: "NotFoundError" }));
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: formatOrder(deletedOrder),
    });
  } catch (error) {
    return next(normalizeDbError(error, "Failed to delete order"));
  }
};
