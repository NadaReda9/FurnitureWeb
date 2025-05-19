import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RPpvwHHsbvbtXKSKOO7dgGMMYs4FZnkRToFgU0jzVF5CPQIN66SXeF3CgNMeL5z6kCKBhfTBIyeRN4bDviVLyZh004DhxdABy");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !orderData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: orderData.amount * 100 }) // تحويل من جنيه لسنت
      });

      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name",
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // الدفع تم بنجاح – سجل الأوردر في الداتابيز
        try {
          await axios.post("http://localhost:8000/api/orders/place", orderData);
          alert("Payment successful and order saved!");
          navigate("/order-success");
        } catch (dbErr) {
          console.error("Error saving order:", dbErr);
          alert("Payment succeeded but failed to save order.");
        }
      }
    } catch (err) {
      setError("Payment failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Credit Card Payment</h2>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />

      {error && <div className="text-red-600 mt-2">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center main_color2 p-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default PaymentPage;
