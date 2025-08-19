import React, { useState, useEffect, useRef } from 'react';
import IMG from "../../assets/strayanimals.png";
import './Stats.css';

// A custom hook for the count-up animation.
const useCountUp = (end, duration = 1600, startOnMount = false) => {
    const [count, setCount] = useState(0);
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);

    useEffect(() => {
        if (!startOnMount) {
            setCount(0);
            return;
        }

        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.round(end * easeOutProgress);
            
            setCount(currentCount);

            if (frame === totalFrames) {
                clearInterval(counter);
                setCount(end); // Ensure it ends on the exact value
            }
        }, frameRate);

        return () => clearInterval(counter);
    }, [end, duration, startOnMount, frameRate, totalFrames]);

    return count;
};

// A custom hook to detect when an element is visible in the viewport.
const useInView = (options) => {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, inView];
};

// The individual stat card component.
const StatCard = ({ value, label, description, startAnimation }) => {
    // Handle values that might not be numbers (like "33%")
    const endValue = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
    const animatedValue = useCountUp(endValue, 2500, startAnimation);
    const suffix = String(value).replace(/[0-9]/g, '').trim();

    return (
        <div className="stat-card">
            <p className="stat-card-value">
                {animatedValue.toLocaleString()}{suffix}
            </p>
            <p className="stat-card-label">{label}</p>
            <p className="stat-card-description">{description}</p>
        </div>
    );
};

// The main component that recreates the page section.
export default function Stats() {
    const statsData = [
        { value: '33%', label: 'Reduce Accidents Rates', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { value: '2000000+', label: 'Collar Distributed', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { value: '150+', label: 'Women Empowered', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { value: '23+', label: 'NGO Partners', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    ];

    const [statsRef, statsInView] = useInView({ threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    return (
        <div className="dark-theme-container rounded-xl">
            <div className="content-wrapper">
                {/* Header Section */}
                <header className="header-section">
                    <div className="header-title-wrapper">
                        <span className="header-badge">
                            Contribute towards a better world
                        </span>
                        <h2 className="mt-4 text-2xl font-bold leading-tight text-white md:text-2xl">
                            PROGRESSING
                            TOWARD OUR TARGET,
                            WE HAVE
                            ACCOMPLISHED A LOT
                        </h2>
                    </div>
                </header>

                {/* Image Section */}
                <div className="image-section">
                     <img 
                        src={IMG}
                        alt="A group of stray animals including a cow, dogs, and cats on a city street" 
                        className="main-image"
                     />
                </div>

                {/* Stats Grid Section */}
                <div ref={statsRef} className="stats-grid">
                    {statsData.map((stat, index) => (
                        <StatCard 
                            key={index} 
                            value={stat.value} 
                            label={stat.label}
                            // description={stat.description}
                            startAnimation={statsInView}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
