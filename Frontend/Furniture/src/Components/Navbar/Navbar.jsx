import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { RiLogoutCircleLine } from "react-icons/ri";
import logo from "./../../assets/logo.png";
import axios from "axios";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            client: "not-browser",
          },
        }
      );

      if (response.data.success) {
        localStorage.removeItem("token");
        setToken(false);
        alert("You have been logged out!");
        navigate("/");
      } else {
        alert("Logout failed!");
      }
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert("An error occurred while logging out!");
    }
  };

  const handleIconClick = () => {
    setIsIconPressed(!isIconPressed);
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(true);
        alert("Login Successful!");
        navigate("/");
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("An error occurred during login!");
    }
  };

  return (
    <nav className="main_color border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8 w-[100px] h-[80px]" alt="Furni Logo" />
        </a>
        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 focus:outline-none"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Navigation Links */}
        <div
          className={`w-full lg:flex lg:w-auto lg:items-center ${
            isOpen ? "block" : "hidden"
          } lg:flex`}
        >
          <ul className="main_color flex flex-col text-white font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-main_color dark:bg-main_color md:dark:bg-main_color dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                className="Nav_link block py-2 text-white text-sm rounded-sm "
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/product"
                className="Nav_link block py-2 text-white text-sm rounded-sm "
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/servies"
                className="Nav_link block py-2 text-white text-sm rounded-sm  "
              >
                Services
              </NavLink>
            </li>
               <li>
              <NavLink
                to="/feedback"
                className="Nav_link block py-2 text-white text-sm rounded-sm  "
              >
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink
                to="contactUs"
                className="Nav_link block py-2 text-white text-sm rounded-sm"
              >
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                className="block lg:ms-12 py-2 text-lg text-white rounded-sm"
              >
                <BsCart3 />
              </NavLink>
            </li>
            <li>
              <NavLink
                to={token ? "/logout" : "/signUp"}
                className="block me-5 text-2xl py-2 text-white rounded-sm"
              >
              <FaUserAlt className="text-blue-500 text-2xl" />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
