import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Tagline() {
  const shiningRef = useRef(null);
  const hopeRef = useRef(null);
  const foreveryRef = useRef(null);
  const pawRef = useRef(null);

  useEffect(() => {
    // Set initial state
    gsap.set([shiningRef.current, hopeRef.current, foreveryRef.current, pawRef.current], {
      opacity: 0
    });

    const tl = gsap.timeline({ 
      defaults: { ease: "power3.out" },
      onComplete: () => {
        // Force final opacity to 1 and clear GSAP properties
        gsap.set([shiningRef.current, hopeRef.current, foreveryRef.current, pawRef.current], {
          opacity: 1,
        //   clearProps: "all"
        });
      }
    });

    // Responsive animation values based on screen size
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    
    const slideDistance = isMobile ? 30 : isTablet ? 50 : 80;
    const bounceDistance = isMobile ? 20 : 30;

    // "shining" slides in from left
    tl.to(shiningRef.current, {
      x: 0, // Reset to normal position
      opacity: 1,
      duration: 1
    });

    // "HOPE" scales in for a pop effect
    tl.to(hopeRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3"); 

    // "FOR EVERY" slides from right
    tl.to(foreveryRef.current, {
      x: 0, // Reset to normal position
      opacity: 1,
      duration: 0.7
    }, "-=0.4");

    // "paw" + paw icon bounces
    tl.to(pawRef.current, {
      y: 10, // Reset to normal position
      opacity: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.3");

    // Handle window resize
    const handleResize = () => {
      // Refresh animation on resize if needed
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="text-center lg:text-left leading-tight w-full max-w-4xl pt-20 lg:pt-5">
      <h2 className="space-y-1 sm:space-y-2">
        {/* shining HOPE - combined in one line, shifted upwards */}
        <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 lg:ml-[-200px] xl:ml-[-280px] sm:-mt-6 lg:-mt-6 xl:-mt-8">
          <div 
            ref={shiningRef} 
            className="font-script font-bold text-amber-400
                       text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-8xl"
            style={{ transform: 'translateX(-30px)', opacity: 0 }}>
            shining
          </div>

          <div 
            ref={hopeRef} 
            className="font-serif text-gray-900 uppercase font-bold
                       text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-[84px]"
            style={{ transform: 'scale(0.5)', opacity: 0 }}>
            HOPE
          </div>
        </div>

        {/* FOR EVERY and paw - combined in one line */}
        <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-2">
          <span 
            ref={foreveryRef} 
            className="font-sans text-gray-800 tracking-wide
                       text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl"
            style={{ transform: 'translateX(30px)', opacity: 0 }}>
            FOR EVERY
          </span>

          <div 
            ref={pawRef} 
            className="flex items-center"
            style={{ transform: 'translateY(20px)', opacity: 0 }}>
            <span className="font-script text-gray-900 font-bold mr-2
                             text-3xl sm:text-4xl md:text-6xl lg:text-6xl xl:text-8xl">
              Paw
            </span>
            {/* <span className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-[#2bb6b1]">🐾</span> */}
            {/* <span className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl text-pink-400 ml-1">✨</span> */}
          </div>
        </div>
      </h2>
    </div>
  );
}
