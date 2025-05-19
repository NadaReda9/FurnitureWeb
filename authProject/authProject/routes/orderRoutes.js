const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// http://localhost:8000/api/orders

router.post("/place", orderController.placeOrder);

module.exports = router;











