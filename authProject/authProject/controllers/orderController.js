const Order = require("../models/orderModel"); // لو لسه معملتش orderModel هنكتبه كمان
const Product = require("../models/Products"); // عشان نتأكد من المنتجات
const User = require("../models/usersModel"); // لو محتاجين نربط بالمستخدم



exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, paymentMethod } = req.body;

    // Basic validation
    if (!userId || !items || items.length === 0 || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      userId,
      items,
      amount,
      paymentMethod,
      status: paymentMethod === "cash" ? "pending" : "paid", // or adjust based on your logic
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
