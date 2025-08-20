import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/src/assets/hero-dog.JPG',
    title: 'A collar of Care',
    subtitle: 'A promise of Safety',
    description: 'Our QR-enabled reflective collars protect stray animals and help reunite them with their caregivers.',
    buttonText: 'Protect a life today',
    overlay: 'from-black/50 via-black/30 to-transparent'
  },
  {
    id: 2,
    image: '/src/assets/CustomerStories/Cow.JPG',
    title: 'Stories of Hope',
    subtitle: 'Every Animal Matters',
    description: 'Join thousands of pet parents who trust our quality products to keep their beloved companions safe.',
    buttonText: 'Read Their Stories',
    overlay: 'from-blue-900/40 via-blue-800/20 to-transparent'
  },
  {
    id: 3,
    image: '/src/assets/strayanimal.png',
    title: 'Technology Meets',
    subtitle: 'Compassion',
    description: 'Advanced QR technology combined with durable materials creates the perfect safety solution for all animals.',
    buttonText: 'Learn More',
    overlay: 'from-green-900/50 via-green-800/30 to-transparent'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-5rem)] min-h-[420px] max-h-[900px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: (mousePosition.x - 0.5) * 20,
            y: (mousePosition.y - 0.5) * 20
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ 
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {/* Responsive Background Image - contain for mobile, cover for md+ */}
          <div 
            className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              minHeight: '100%',
              maxHeight: '100%',
              width: '100%',
              height: '100%',
              objectPosition: 'bottom',
              transform: `scale(1.01) translate3d(${(mousePosition.x - 0.5) * -10}px, ${(mousePosition.y - 0.5) * -10}px, 0)`
            }}
          />
          {/* Overlay - ensure it covers the image fully */}
          <div
            className={`fixed top-0 left-0 w-[calc(100%+50px)] h-full pointer-events-none bg-gradient-to-b ${slides[currentSlide].overlay}`}
            style={{
              zIndex: 2,
              inset: 0
            }}
          />
          
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%'
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Responsive Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-2xl mx-auto px-3 sm:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ 
                duration: 0.8,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Responsive Title */}
              <motion.h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight break-words"
                style={{ wordBreak: 'break-word' }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              {/* Responsive Subtitle */}
              <motion.h2 
                className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white/90 mb-3 sm:mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {slides[currentSlide].subtitle}
              </motion.h2>

              {/* Responsive Description */}
              <motion.p 
                className="text-sm xs:text-base sm:text-lg md:text-xl text-white/80 mb-4 sm:mb-8 max-w-xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: 1.0,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {slides[currentSlide].description}
              </motion.p>

              {/* CTA Button */}
              <motion.button
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8,
                  delay: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{slides[currentSlide].buttonText}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center z-20 transition-all duration-300"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center z-20 transition-all duration-300"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              index === currentSlide 
                ? 'w-12 h-3 bg-white rounded-full' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 + index * 0.1 }}
          >
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                layoutId="activeSlide"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center text-white/60 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <span className="text-sm mb-2 rotate-90 origin-center">Scroll</span>
        <motion.div
          className="w-0.5 h-8 bg-white/60"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
