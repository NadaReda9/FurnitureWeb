import React, { useState } from "react";
import livingRoomImage from "./../../assets/about (1).jpg";
import bedroomImage from "./../../assets/JoseBedFrameGallery1.webp";
import officeImage from "./../../assets/office.jpg";
import diningRoomImage from "./../../assets/dining-room.jpg";
import sofa1 from "./../../assets/sofa1.png";
import "./Servies.css";
import { NavLink } from "react-router-dom";

const services = [
  {
    title: "Living Room Furniture",
    image: livingRoomImage,
    description: "Premium living room furniture for your home. Choose from our wide range of sofas, coffee tables, and entertainment units.",
    cta: "Explore Collection"
  },
  {
    title: "Bedroom Furniture",
    image: bedroomImage,
    description: "Create your perfect sanctuary with our luxurious beds, wardrobes, and nightstands designed for comfort and style.",
    cta: "View Products"
  },
  {
    title: "Sofas & Couches",
    image: sofa1,
    description: "Discover our curated selection of modern and classic sofas available in various colors and sizes to match any space.",
    cta: "Browse Selection"
  },
  {
    title: "Office Furniture",
    image: officeImage,
    description: "Ergonomic and stylish office solutions including desks, chairs, and storage units to enhance your workspace.",
    cta: "Shop Now"
  },
  {
    title: "Dining Room Furniture",
    image: diningRoomImage,
    description: "Elevate your dining experience with our exquisite tables and chairs, perfect for entertaining and family meals.",
    cta: "View Collection"
  },
];

export default function Services() {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const changeService = (direction) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentServiceIndex((prevIndex) => {
        if (direction === 'next') {
          return prevIndex === services.length - 1 ? 0 : prevIndex + 1;
        } else {
          return prevIndex === 0 ? services.length - 1 : prevIndex - 1;
        }
      });
      setIsAnimating(false);
    }, 300);
  };

  const { title, image, description, cta } = services[currentServiceIndex];

  return (
    <section className="services-section main_color2">
      <div className="services-header main_color2">
        <h2 className="section-title">Our Premium Services</h2>
        <p className="section-subtitle">Discover our exclusive furniture collections</p>
      </div>

      <div className={`service-container main_color2 ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        <div className="service-slider">
          <button 
            className="nav-btn prev-btn main_color2" 
            onClick={() => changeService('prev')}
            aria-label="Previous"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="service-card main_color2">
            <div className="image-container">
              <img 
                src={image} 
                alt={title} 
                className="service-image" 
                loading="lazy"
              />
              <div className="image-overlay main_color2"></div>
            </div>
            
            <div className="service-content bg-white">
              <h3 className="service-title">{title}</h3>
              <p className="service-description">{description}</p>
              
              <div className="service-indicators">
                {services.map((_, index) => (
                  <span 
                    key={index}
                    className={`indicator main_color2 ${index === currentServiceIndex ? 'active' : ''}`}
                    onClick={() => {
                      setIsAnimating(true);
                      setTimeout(() => {
                        setCurrentServiceIndex(index);
                        setIsAnimating(false);
                      }, 300);
                    }}
                  ></span>
                ))}
              </div>
              
              <NavLink 
                to="/product" 
                className="service-cta-btn main_color text-white"
              >
                {cta}
                <i className="fas fa-arrow-right"></i>
              </NavLink>
            </div>
          </div>

          <button 
            className="nav-btn next-btn main_color2" 
            onClick={() => changeService('next')}
            aria-label="Next"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}