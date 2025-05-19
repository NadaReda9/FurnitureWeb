import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

    if (!userId) {
      alert("You must be logged in to place an order.");
      return;
    }

    if (!name || !address || !phone) {
      alert("Please fill in all the fields.");
      return;
    }

    const orderData = {
      userId,
      items: cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      amount: cart.reduce((acc, item) => acc + item.productId.price * item.quantity, 0),
      paymentMethod,
      customerInfo: { name, address, phone },
    };

    if (paymentMethod === "cash") {
      axios.post("http://localhost:8000/api/orders/place", orderData)
        .then(() => {
          alert("Order placed successfully!");
          navigate("/order-success");
        })
        .catch((error) => {
          console.error("Failed to place order", error);
          alert("Failed to place order.");
        });
    } else {
      // Navigate to payment page with order data
      navigate("/payment", { state: { orderData } });
    }
  };

  return (
    <div className="min-h-screen main_color2 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {/* User Info Inputs */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mb-5 w-full p-2 border rounded"
        />

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Select Payment Method:</label>
          <div className="space-y-2">
            <label>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <span className="ml-2">Cash on Delivery</span>
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <span className="ml-2">Credit Card</span>
            </label>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handlePlaceOrder}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          {paymentMethod === "cash" ? "Place Order" : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
