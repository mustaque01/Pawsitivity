// src/components/Hero.jsx
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Tagline from "./Tagline";
// Import your images (you'll need to add these files to src/assets/)
import dogImage from '../assets/hero-dog.jpg';
import womanImage from '../assets/sewing-woman.jpg';
import pawImage from '../assets/paw.png';
import dogImg from '../assets/dog2.png';

export default function Hero() {
  const pawsRef = useRef([]);
  
  useEffect(() => {
    // Create walking animation with GSAP
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    
    // Desktop paw animation (horizontal)
    timeline.fromTo(pawsRef.current.slice(0, 8), 
      {
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 1.5,
        stagger: {
          amount: 1.2,
          from: "start"
        },
        ease: "power2.inOut"
      }
    )
    .to(pawsRef.current.slice(0, 8), {
      opacity: 0,
      scale: 0.5,
      x: 0,
      duration: 0.5,
      stagger: {
        amount: 0.6,
        from: "start"
      }
    }, "-=0.3");

    // Mobile paw animation (vertical upward)
    timeline.fromTo(pawsRef.current.slice(8, 16),
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.8,
        stagger: {
          amount: 1.5,
          from: "start"
        },
        ease: "power2.inOut"
      }, 0.5
    )
    .to(pawsRef.current.slice(8, 16), {
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      stagger: {
        amount: 0.8,
        from: "start"
      }
    }, "-=0.4");
    
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 overflow-hidden fixed left-0 top-0 w-full z-0">
      {/* Mobile Background - Dog Image */}
      <div className="lg:hidden absolute inset-0 z-0">
        <img
          src={dogImg}
          alt="Stray dog background"
          className="w-full h-full object-cover object-bottom-left"
        />
      </div>
      
      {/* Background decorative elements - hidden on mobile */}
      <div className="hidden lg:block absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20"></div>
      <div className="hidden lg:block absolute bottom-20 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-30"></div>
      <div className="hidden lg:block absolute top-1/2 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-25"></div>
      
      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between min-h-screen relative z-10 top-0 gap-8 xl:gap-12 2xl:gap-16">
        
        {/* Left side - Images (Desktop only) */}
        <div className="hidden lg:flex flex-1 flex-col items-start space-y-4 mb-12 lg:mb-0 max-w-md xl:max-w-lg 2xl:max-w-xl lg:pt-10">
          {/* Main dog image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src={dogImage}
              alt="Stray dog glowing"
              className="w-64 h-48 lg:w-72 lg:h-54 xl:w-80 xl:h-60 2xl:w-96 2xl:h-72 object-cover rounded-2xl shadow-[8px_8px_20px_rgba(0,0,0,0.4)]"
            />
            {/* Sparkle effect */}
            <motion.div 
              className="absolute -top-3 -right-3 text-2xl lg:text-3xl text-pink-400"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ✨
            </motion.div>
          </motion.div>
          
          {/* Secondary woman sewing image */}
          <motion.div 
            className="ml-4 lg:ml-6 xl:ml-8 2xl:ml-12"
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <img
              src={womanImage}
              alt="Woman sewing collar"
              className="w-56 h-40 lg:w-84 lg:ml-5 lg:h-58 xl:w-120 xl:h-68 xl:ml-42 2xl:w-128 2xl:h-80 2xl:ml-48 object-cover rounded-2xl shadow-[6px_6px_15px_rgba(0,0,0,0.35)]"
            />
          </motion.div>
        </div>

        {/* Right side - Content */}
        <div className="w-full lg:flex-1 flex flex-col items-center lg:items-start max-w-2xl lg:ml-8 xl:ml-12 2xl:ml-20">
          {/* Your existing tagline with animations */}
          <div className="text-white lg:text-inherit lg:scale-75 xl:scale-100 2xl:scale-110">
            <Tagline />
          </div>
          
          {/* Description text */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="lg:text-gray-600 text-base lg:text-lg xl:text-xl 2xl:text-2xl xl:ml-18 leading-relaxed text-justify lg:text-left max-w-lg xl:max-w-xl 2xl:max-w-2xl mt-6 lg:mt-12 xl:mt-20 2xl:mt-24"
          >
            At Pawsitivity, we believe in making the streets safer for animals and 
            the world kinder for humans. Our QR-enabled 
            reflective collars not only prevent accidents but also 
            create sustainable jobs for women in need.
          </motion.p>

          {/* Mobile paw animation - walking upwards from bottom right */}
          <div className="lg:hidden absolute bottom-12 right-20 w-20 h-96 z-20 rotate-30">
            <img
              ref={el => pawsRef.current[8] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '0px', bottom: '0px' }}
            />
            <img
              ref={el => pawsRef.current[9] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '20px', bottom: '40px' }}
            />
            <img
              ref={el => pawsRef.current[10] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '0px', bottom: '80px' }}
            />
            <img
              ref={el => pawsRef.current[11] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '20px', bottom: '120px' }}
            />
            <img
              ref={el => pawsRef.current[12] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '0px', bottom: '160px' }}
            />
            <img
              ref={el => pawsRef.current[13] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '20px', bottom: '200px' }}
            />
            <img
              ref={el => pawsRef.current[14] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '0px', bottom: '240px' }}
            />
            <img
              ref={el => pawsRef.current[15] = el}
              src={pawImage}
              alt="paw print"
              className="absolute w-6 h-6 opacity-0 "
              style={{ right: '20px', bottom: '280px' }}
            />
          </div>
          
          {/* Call to action button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 relative sm:fixed lg:relative bottom-6 right-6 sm:bottom-6 sm:right-6 lg:bottom-auto lg:right-auto z-30"
          >
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 lg:px-8 lg:py-4 xl:ml-20 rounded-full text-base lg:text-lg font-semibold transition-colors duration-300 shadow-lg flex items-center space-x-3">
              <span>Shop Now</span>
            </button>
            
            {/* Walking paw prints animation with GSAP */}
            <div className="absolute -bottom-16 left-20 w-80 h-20 -rotate-5 hidden lg:block xl:ml-52">
              {/* Left paw prints (dog's left side) */}
              <img
                ref={el => pawsRef.current[0] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '0px', top: '60px' }}
              />
              <img
                ref={el => pawsRef.current[1] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '60px', top: '90px' }}
              />
              <img
                ref={el => pawsRef.current[2] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '120px', top: '60px' }}
              />
              <img
                ref={el => pawsRef.current[3] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '180px', top: '90px' }}
              />
              
              {/* Right paw prints (dog's right side) - offset pattern */}
              <img
                ref={el => pawsRef.current[4] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '240px', top: '60px' }}
              />
              <img
                ref={el => pawsRef.current[5] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '300px', top: '90px' }}
              />
              <img
                ref={el => pawsRef.current[6] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '360px', top: '60px' }}
              />
              <img
                ref={el => pawsRef.current[7] = el}
                src={pawImage}
                alt="paw print"
                className="absolute w-8 h-8 opacity-0 rotate-75"
                style={{ left: '420px', top: '90px' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
