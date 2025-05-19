const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// http://localhost:8000/api/payment

router.post("/create-payment-intent", paymentController.createPaymentIntent);

module.exports = router;
