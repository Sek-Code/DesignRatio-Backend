import { Delivery } from "./delivery.model.js";

// create delivery info. after successful payment
const createDelivery = async (req, res, next) => {
    const { recipient, address, carrier } = req.body;

    try {
    const delivery = await Delivery.create({
      orderId,
      recipient,
      address,
      carrier,
      status: "pending"
    });

    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    next(error);
  }
}

// For customer to see the record of each delivery
const getDelivery = async (req, res, next) => {
    const { orderId } = req.body;

    try {
    const delivery = await Delivery.find(cartId);

    if (!delivery)
    {
      const error = new Error("Not found");
      // ยังไม่ส่งให้ Frontend จะส่งให้ middleware อื่นก่อน
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {

    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get a delivery record";
    return next(error);
  }
}

// For admin to see all deliveries
const getDeliveries = async (req, res) => {
    try {
    const deliveryAll = await Delivery.find().select("-shippingFee");

    return res.status(200).json({
      success: true,
      data: deliveryAll,
    });
  } catch (error) {
    error.name = error.name || "DatabaseError";
    error.status = 500;
    return next(error);
  }
}

// update delivery info.
const updateDelivery = async (req, res, next) => {
  const {orderId} = req.params;

  const body = req.body;

  try {
    const updated = await Delivery.findByIdAndUpdate(orderId, body);

    if(!updated){
      const error = new Error("Not found")
      return next(error);
    };

    const newDelivery = updated.toObject()

    return res.status(200).json({
      success: true,
      data: newDelivery,
    });
  } catch (error) {

    if(error.code === 11000) {
      return next(error);
    };
    return next(error);
  }
}