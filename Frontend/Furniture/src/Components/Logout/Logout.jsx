import React, { useState, useEffect } from 'react';

export default function Logout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setShowSidebar(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowSidebar(false);
    window.location.href = '/login';
  };

  const handleClose = () => {
    setShowSidebar(false);
    window.location.href = '/';
  };

  return (
    <>
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        ></div>
      )}

      {showSidebar && (
        <div className="fixed main_color top-0 right-0 w-72 h-full text-white p-6 shadow-2xl z-50 flex flex-col">
          <button
            onClick={handleClose}
            className="self-end text-gray-600 hover:text-black text-xl font-bold"
          >
            ✖
          </button>

          <div className="mt-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2 mt-10">Welcome back!</h2>
              <p className="text-md mb-4">You're successfully logged in.</p>
              <p className="text-sm text-gray-400">Would you like to log out?</p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
