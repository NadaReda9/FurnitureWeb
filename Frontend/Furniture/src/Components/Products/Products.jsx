import React, { useState, useEffect } from 'react';
import './products.css';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, NavLink } from 'react-router-dom';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;
  const guestId = localStorage.getItem("guestId");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  /////////////////
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
  /////////////
  if (loading) return <div className="loader"></div>;
  if (error) return <div>An error occurred: {error}</div>;

  return (
    <div className='main_color2 p-6'>
      {/* Search Toggle */}
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-gray-700 hover:text-black p-2"
        >
          <FaSearch size={22} />
        </button>

        {showSearch && (
          <input
            type="text"
            placeholder="Search for product..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="ml-3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 transition-all duration-300 w-64"
          />
        )}
      </div>

      {/* Products List */}
      <div className="flex flex-wrap gap-6 justify-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product._id}
              className="main_color2 shadow-lg rounded-2xl overflow-hidden w-72 text-center transform hover:scale-105 transition duration-300"
            >
              <NavLink to={`/productDetails/${product._id}`}>
                <div className="p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </NavLink>
              <div className="px-4 pb-4">
                <h2 className="text-gray-900 text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-700 mb-3">Price: ${product.price}</p>
                <button
                  onClick={() => addToCart(product._id)}
                  className="main_color hover:bg-green-400 text-white text-xl w-10 h-10 rounded-full shadow-md"
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Sorry, we don't have this 🥲</p>
        )}
      </div>
    </div>
  );
};

export default Products;
