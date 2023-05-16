const { OrderModel } = require("../models/Order.model");
const mongoose = require("mongoose");
const { ProductModel } = require("../models/Product.model");

// NEW ORDER

const newOrderController = async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  try {
    const order = await new OrderModel({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
    await order.save();
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

// GET SINGLE ORDER

const getSingleOrderController = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found with this id",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

// GET LOGGED IN USER ORDERS
const getmyOrdersController = async (req, res) => {
  // console.log(req.user._id);

  try {
    const myOrders = await OrderModel.find({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      myOrders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};
// GET ALL ORDERS  --ADMIN
const getAllOrdersController = async (req, res) => {
  try {
    const allOrders = await OrderModel.find();
    console.log(allOrders);

    let totalAmount = 0;
    allOrders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      allOrders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

// UPDATE ORDER STATUS --ADMIN
const updateOrderController = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found with this id",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "You have already delivered this order",
      });
    }

    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

async function updateStock(id, quantity) {
  const product = await ProductModel.findById(id);
  console.log(product);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// DELETE ORDER
const deleteOrderController = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found with this id",
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};
module.exports = {
  newOrderController,
  getSingleOrderController,
  getmyOrdersController,
  getAllOrdersController,
  updateOrderController,
  deleteOrderController,
};
