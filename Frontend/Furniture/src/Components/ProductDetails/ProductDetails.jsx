import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';


const ProductDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-xl">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate('/product')}
         className="btn-back"
      >
        ← back to products
      </button>

      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full max-w-md mx-auto rounded-xl shadow-md mb-6 object-cover"
      />
      <p className="text-2xl text-gray-800 mb-4">Price: ${product.price}</p>
      <p className="text-gray-600">{product.description}</p>
    </div>
  );
};

export default ProductDetails;
