import{ Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;
  const guestId = localStorage.getItem('guestId') || null;



  
  

  // Setup headers including auth if token exists
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Fetch cart items from backend

const fetchCart = async () => {
  try {
    
    const params = {};
    if (userId) params.userId = userId;
    if (guestId) params.guestId = guestId;

    const res = await axios.get('http://localhost:8000/api/cart', { headers, params });
    setCart(res.data.items || []);
    console.log("Cart items:", res.data.items);
    console.log("User ID:", userId);
    console.log("Guest ID:", guestId);
  } catch (err) {
    console.error('Failed to fetch cart:', err);
  }
  finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCart();
  }, [userId, guestId]);

  //update cart items
  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put('http://localhost:8000/api/cart/update', {userId,guestId,productId,quantity}, { headers });
      fetchCart();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  }

  //remove cart items
  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/remove`, { data: { userId, guestId, productId }, headers });
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  //clear cart items
  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/clear`, { data: { userId, guestId }, headers });
      setCart([]);
      fetchCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.productId.price;
      return total + price * item.quantity;
    }, 0);
  };

  const checkout = async () => {
    try {
      if (!userId) {
        toast(
  <span className="text-[#270708] font-semibold">
    YOU HAVE TO{" "}
    <Link to="/signup" className="underline text-[#270708] font-bold">
      SIGN UP FIRST!
    </Link>
  </span>,
  {
    icon: "⚠️",
    style: {
      backgroundColor: "#fff8dc", // sandy beige background
      color: "#270708",
      borderLeft: "6px solid #270708",
    },
    progressClassName: "marbella-progress-bar", // custom progress bar class
  }
);

      } else {
        navigate("/checkout", { state: { cart } });
      }
    } catch (err) {
      console.error("Failed to proceed to checkout:", err);
    }
  };


  useEffect(() => {
    if (userId && token) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen main_color2">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

    return (
    <div className="min-h-screen main_color2">
      <div className="cart-page py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Your Shopping Cart
            <i className="cart-icon fa-solid fa-cart-shopping ml-2"></i>
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                Your cart is empty
              </p>
              <Link
                to="/product"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300" style={{backgroundColor: "#270708", color: "#fff"}}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <div key={`${item.productId._id}-${index}`} className="py-4 flex flex-col sm:flex-row items-center">
                    <img 
                      className="w-24 h-24 object-cover rounded-lg mr-4 mb-4 sm:mb-0" 
                      src={item.productId.imageUrl} 
                      alt={item.productId.name} 
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.productId.name}</h3>
                      <p className="text-gray-600">₹{item.productId.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          className="px-3 py-1 text-lg focus:outline-none disabled:opacity-50"
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          className="px-3 py-1 text-lg focus:outline-none"
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId._id)} 
                        className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Subtotal:</span>
                  <span className="text-lg font-bold">₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={clearCart} 
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button 
                    onClick={checkout}
                    className="px-6 py-2 main_color text-white rounded-md  transition-colors"
                  >
                    Proceed to Checkout
                  </button>














                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;