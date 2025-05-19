const Stripe = require("stripe");
const stripe = Stripe("sk_test_51RPpvwHHsbvbtXKSkxp6kpixaZAApMIyHWypSlFriHClFe87qRnovdsgv9hHvC5DAdWz3HHp7y7AwAkXX519q1Xy00lXjRn71o"); // حط الـ Secret Key بتاعك من Stripe

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // القيمة بالسنت
      currency: "usd",
      payment_method_types: ["card"]
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({ error: error.message });
  }
};
