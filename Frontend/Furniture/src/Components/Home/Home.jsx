import React, { useState, useEffect } from "react";
import img1 from "./../../assets/headerChair.png";
import { NavLink, Link } from "react-router-dom";
import Products from "../Products/Products";
import light from "./../../assets/light-bulb_8534606.png";
import InteriorDesign from "./../../assets/interior-design_2400622.png";
import OutdoorDesign from "./../../assets/painting_2821314.png";
import { CiTimer, CiShoppingBasket } from "react-icons/ci";
import { FiDollarSign } from "react-icons/fi";
import { MdOutlinePolicy } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err.message);
      });
  }, []);

  const displayedProducts = products.slice(0, 4);

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  const guestId = localStorage.getItem("guestId");
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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
    <>
      {/* Home Section */}
      <div className="Home main_color min-h-100">
        <div className="lg:flex">
          <div className="w-full md:w-1/2 lg:mt-10 p-10 lg:ms-10">
            <h1 className="mt-10">Modern Interior Design Studio</h1>
            <p className="mt-5">
              Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet
              velit. Aliquam vulputate velit imperdiet dolor tempor tristique.
            </p>
            <div className="flex mt-10">
              <NavLink to="/product" className="HomeShop">
                Shop Now
              </NavLink>
            </div>
          </div>
          <div className="Home_chair md:w-1/2 lg:me-40 w-full">
            <img src={img1} alt="Home chair" />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="main_color2 py-10">
        <h1 className="text-center text-3xl font-bold mb-8">
          Best Sellers This Week
        </h1>

        <div className="flex flex-wrap gap-6 justify-center">
          {displayedProducts.map((product) => (
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
                <h2 className="text-gray-900 text-lg font-semibold">
                  {product.name}
                </h2>
                <p className=" text-gray-700 mb-3">Price: ${product.price}</p>
                <button
                  onClick={() => addToCart(product._id)}
                  className="main_color hover:bg-green-400 hover:main_color2 text-white text-xl w-10 h-10 rounded-full shadow-md"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 text-right">
          <NavLink
            to="/product"
            className="inline-block main_color text-white font-semibold py-2 px-4 rounded-lg"
          >
            All Products 🔜
          </NavLink>
        </div>
      </div>

      {/* Why You Choose Us */}
      <div className="main_color2">
        <h1 className="text-center text-2xl font-bold pt-10">
          Why You Choose Us
        </h1>
        <div className="flex flex-wrap mt-10">
          {[
            {
              icon: <CiTimer />,
              title: "Fast Delivery",
              desc:
                "We ensure your orders are delivered quickly and on time, right to your doorstep.",
            },
            {
              icon: <MdOutlinePolicy />,
              title: "Secure Policies",
              desc:
                "Enjoy peace of mind with our clear return, refund, and privacy policies.",
            },
            {
              icon: <CiShoppingBasket />,
              title: "Simple Shopping",
              desc:
                "Our platform is easy to use, making your shopping experience smooth and enjoyable.",
            },
            {
              icon: <FiDollarSign />,
              title: "Flexible Payment",
              desc:
                "We offer multiple secure payment options to suit your convenience and comfort.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="w-1/2 lg:w-1/4 text-center flex"
            >
              <div className="about m-2 h-full border rounded-lg p-4 flex flex-col justify-between">
                <div className="flex">
                  <p className="text-xl text-gray-800 p-2 ms-auto">
                    {feature.icon}
                  </p>
                  <p className="text-xl font-bold mt-1 me-auto">
                    {feature.title}
                  </p>
                </div>
                <p className="text-xl p-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Services */}
      <div className="main_color2">
        <div className="px-10 pb-5">
          <h1 className="text-center text-4xl font-bold p-10">
            Our Services
          </h1>

          {[
            {
              img: light,
              title: "Lighting Design",
              desc:
                "We create custom lighting solutions that enhance the mood, function, and beauty of your space.",
            },
            {
              img: InteriorDesign,
              title: "Interior Design",
              desc:
                "We transform interiors into functional environments that reflect your taste and lifestyle.",
            },
            {
              img: OutdoorDesign,
              title: "Outdoor Design",
              desc:
                "We design outdoor spaces that blend nature with structure for comfort and gatherings.",
            },
          ].map((service, index) => (
            <div key={index} className="Servies flex mt-2">
              <div className="w-1/4 lg:ps-20">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-[100px] mt-10 lg:mt-3"
                />
              </div>
              <div className="w-3/4">
                <h2 className="text-2xl font-bold text-center">
                  {service.title}
                </h2>
                <p className="text-gray-800 mt-2 ms-2 lg:ms-0">{service.desc}</p>
              </div>
            </div>
          ))}

          <div className="p-4">
            <NavLink to="/servies" className="btn_product block ms-auto">
              More Services 🔜
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

