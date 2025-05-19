import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-main_color2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500 text-xl p-4 bg-red-50 rounded-lg max-w-md mx-auto bg-main_color2">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="text-center mt-10 text-xl p-4 bg-gray-50 rounded-lg max-w-md mx-auto bg-main_color2">
        Product not found
      </div>
    );

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  const guestId = localStorage.getItem("guestId");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Add to cart function
  const addToCart = async (productId) => {
    
    console.log("Guest ID:", guestId);
    console.log("User ID:", userId);
    
    const cartData = {
      userId: userId || null,
      guestId: guestId || null,
      productId: productId,
      quantity: 1
    };

    try {
      const res = await axios.post('http://localhost:8000/api/cart/add', cartData, authHeader);
      toast.success(
              <span>
                Item added to cart!{" "}
                <Link to="/shop" className="underline text-[#270708] font-semibold" >
                  Go to Cart
                </Link>
              </span>,
              {
                icon: true,
                autoClose: 2000
              }
            );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  }

  return (
    <div className="min-h-screen main_color2">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg p-6">

          <div className="md:w-1/2">
            <div className="bg-white rounded-xl overflow-hidden mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">(24 reviews)</span>
            </div>

            <p className="text-3xl font-semibold text-red-800 mb-6">
              ${product.price}
            </p>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Highlights
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>High-quality materials</li>
                <li>Eco-friendly production</li>
                <li>1-year warranty included</li>
                <li>Free shipping on all orders</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
             

              <button
                onClick={() => addToCart(product._id)}
                className="flex-1 main_color  text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={() => navigate("/product")}
                className="flex items-center mt-4  mb-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;