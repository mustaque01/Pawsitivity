import React, { useState, useEffect, useCallback } from 'react';

// --- SLIDER DATA ---
// Aap yahan apne offers, images, aur links ko easily change kar sakte hain
const slides = [
    {
        imageUrl: 'https://i.imgur.com/gK9p2tK.png', // Image of a happy dog wearing a reflective collar
        title: 'Monsoon Sale!',
        subtitle: 'Flat 25% Off on All Reflective Collars',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        bgColor: 'bg-blue-500',
    },
    {
        imageUrl: 'https://i.imgur.com/xV3AnpD.png', // Image of a woman handcrafting a Pawsitivity collar
        title: 'Support a Cause',
        subtitle: 'Every Purchase Empowers a Woman',
        buttonText: 'Learn More',
        buttonLink: '/about',
        bgColor: 'bg-pink-500',
    },
    {
        imageUrl: 'https://i.imgur.com/wY5fJ0Q.png', // Image of a cow with a reflective collar at night
        title: 'Safety for All Animals',
        subtitle: 'Bulk Discount on Cattle Collars',
        buttonText: 'View Offers',
        buttonLink: '/shop',
        bgColor: 'bg-green-500',
    },
];

const OfferSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance for touch gestures
    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };
    
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Touch handlers for mobile swipe
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
    };

    useEffect(() => {
        const autoPlay = setInterval(nextSlide, 5000); // Har 5 seconds mein slide change hogi
        return () => clearInterval(autoPlay);
    }, [nextSlide]);

    return (
        // Slider ko full-width karne ke liye `max-w-7xl mx-auto` hata dein aur `w-full` use karein
        <div className="w-full font-sans">
            <div 
                className="relative overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* --- Slides Container --- */}
                <div 
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className={`flex-shrink-0 w-full h-[90px] flex items-center justify-between px-3 sm:px-6 text-white ${slide.bgColor}`}>
                            {/* --- Text Content --- */}
                            <div className="z-10 w-1/2">
                                <h2 className="mb-1 text-base font-bold sm:text-lg">{slide.title}</h2>
                                <p className="mb-1 text-xs sm:text-xs">{slide.subtitle}</p>
                                <a 
                                    href={slide.buttonLink}
                                    className="inline-block px-2 py-0.5 text-xs font-semibold text-gray-900 transition-colors bg-white rounded-sm hover:bg-gray-200"
                                >
                                    {slide.buttonText}
                                </a>
                            </div>
                            {/* --- Image Content --- */}
                            <div className="flex items-center justify-center w-1/2">
                               <img src={slide.imageUrl} alt={slide.title} className="max-h-[60px] object-contain"/>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Navigation Arrows --- */}
                <button 
                    onClick={prevSlide}
                    className="absolute p-1 text-white transition-colors transform -translate-y-1/2 rounded-full top-1/2 left-1 bg-black/20 hover:bg-black/40"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute p-1 text-white transition-colors transform -translate-y-1/2 rounded-full top-1/2 right-1 bg-black/20 hover:bg-black/40"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* --- Navigation Dots --- */}
                <div className="absolute flex space-x-1.5 -translate-x-1/2 bottom-1.5 left-1/2">
                    {slides.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-1 h-1 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OfferSlider;