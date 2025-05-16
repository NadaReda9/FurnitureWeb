import React from 'react';
import img1 from "./../../assets/contact.jpg";

export default function ContactUS() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 main_color2">
      <div className="container mx-auto max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Contact Form Section */}
          <div className="lg:w-1/2 p-8 md:p-12 lg:p-16">
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Get in Touch</h1>
            <p className='text-gray-600 mb-8'>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="fullname" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="John Doe" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="your@email.com" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea 
                  id="message" 
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full main_color text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Image Section */}
          <div className="lg:w-1/2 hidden lg:block relative">
            <img 
              src={img1} 
              alt="Contact us" 
              className='w-full h-full object-cover'
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-20"></div>
            <div className="absolute bottom-8 left-8 text-gray-800">
              <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
              <p className="mb-1">✉️ info@yourcompany.com</p>
              <p className="mb-1">📞 +1 (123) 456-7890</p>
              <p>📍 123 Business St, City, Country</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}