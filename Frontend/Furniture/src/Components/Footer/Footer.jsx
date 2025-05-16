import React from 'react'
import img1 from './../../assets/footer.png'
import { MdOutlineMessage } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";
import logo from "./../../assets/logo.png"
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";

export default function Footer() {
  return (
   <>
   <div className="bottom-0 left-0 right-0 main_color">
    <div className="flex">
      <div className="w-1/2 text-white mt-40 ">
     <div className="flex">
    <p className='text-3xl ms-10 mt-2'> <MdOutlineMessage /></p>
     <h2 className='font-bold mt-2 lg:mt-0  lg:text-3xl ms-4 '>Subscribe to Newsletter</h2>
     </div>
     <div className="ms-10 mt-5 lg:flex ">
      <input type="text" name="name" className='me-2 border rounded-xl' placeholder='Enter your Name' id="" />
      <input type="text" name="name" className='me-2 border rounded-xl' placeholder='Enter your Enail' id="" />
      <p className='mt-2 text-3xl border-1 border-white'><FaTelegramPlane /></p>
     </div>
      </div>
      <div className="w-1/2">
      <img src={img1} alt="Footer img" className='w-[400px]'/></div>
    </div>
    <div className="mt-0 flex">
      <div className="w-1/2">
      <img src={logo} className='w-[200px]' alt="" />
      </div>
      <div className="ms-40 w-1/2 mt-4 icons text-white">
        <p className='text-xl'>Follow us</p>
        <div className="flex text-2xl gap-2 mt-2">
        <FaFacebookSquare />
        <FaInstagramSquare />
        <CiTwitter />
        <CiLinkedin />
        </div>
      </div>
    </div>
   </div>
   </>
  )
}
