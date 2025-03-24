import OrdersModel from "../models/orderSchema.js";
import UserModel from "../models/userRegister.js";
import jwt from "jsonwebtoken";
// Get all orders for the logged-in user
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrdersModel.find({ userId: req.user._id }) // Fetch only the orders that belong to the logged-in user
      .populate("products", "title price -_id")
      .populate("userId", "first_name -_id");
    res.send({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};


export const getSingleOrder = async (req, res, next) => {
  // get a single orders from database and send to client
  try {
    /*  const singleOrder = await OrdersModel.findOne({
      title: req.params.title,
    }); */
    const singleOrder = await OrdersModel.findById(req.params.id);
    res.send({ success: true, data: singleOrder });
  } catch (err) {
    next(err);
  }
};

export const createNewOrder = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Debugging request body

    // Ensure user exists
    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Ensure products exist
    const productsExist = await Product.find({ '_id': { $in: req.body.products } });
    if (productsExist.length !== req.body.products.length) {
      return res.status(400).json({ success: false, message: "One or more products not found" });
    }

    // Create the order
    const order = await OrdersModel.create(req.body);

    // Update the user with the order
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { orders: order._id } },
      { new: true }
    );

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error("Error creating order:", err); // Log error
    next(err);
  }
};


export const updateSingleOrder = async (req, res, next) => {
  try {
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send({ success: true, data: updatedOrder });
  } catch (err) {
    next(err);
  }
};

export const deleteSingleOrder = async (req, res, next) => {
  try {
    const deletedOrder = await OrdersModel.findByIdAndDelete(req.params.id);
    res.send({ success: true, data: deletedOrder });
  } catch (err) {
    next(err);
  }
};

// model.find()
// model.findById()
// model.findOne({title:req.params.title})
// model.create()
// model.findByIdAndUpdate()
// model.findByIdAndDelete()
