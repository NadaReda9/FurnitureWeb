import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function Layout() {
  return (
    <>
      <Navbar />

      {/* Page Content */}
      <Outlet />

      <Footer />

      {/* Global Toast Notifications */}
      <ToastContainer
        toastClassName="bg-neutral-100 text-[#270708] border border-[#270708] shadow"
        progressClassName="bg-[#270708]"
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
