import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import './Marquee.css';
import marqueeImage1 from './assets/marquee1.jpg';
import marqueeImage2 from './assets/marquee2.jpg';
import marqueeImage3 from './assets/marquee3.jpg';
import marqueeImage4 from './assets/marquee4.jpg';
import marqueeImage5 from './assets/marquee5.jpg';
import qrcollor from './icons/qrcollor.png';
// Import other icon images
import womenEmpowerment from './icons/womenEmpowerment.png';
import communityOutreach from './icons/communityOutreach.png';
import analytics from './icons/analytics.png';

// Use imported images directly
const marqueeImages = [
    marqueeImage1,
    marqueeImage2,
    marqueeImage3,
    marqueeImage4,
    marqueeImage5
];

// Optimized Service Card with image icons instead of emojis
const ServiceCard = React.memo(({title, description, icon, index, isVisible }) => {
    return (
        <article
            className={`group bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center px-6 py-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-amber-200 to-amber-300 rounded-xl shadow-sm p-2">
                <img 
                    src={icon} 
                    alt={title} 
                    className="w-10 h-10 object-contain rounded-lg"
                    loading="lazy"
                />
            </div>
            <div className="text-center flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </article>
    );
});

// Optimized Services Section
const ServicesSection = React.memo(({ services }) => {
    const [visibleCards, setVisibleCards] = useState([]);

    useEffect(() => {
        // Use requestAnimationFrame for better performance
        let timeouts = [];
        services.forEach((_, index) => {
            const timeout = setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
            }, index * 50);
            timeouts.push(timeout);
        });

        return () => timeouts.forEach(clearTimeout);
    }, [services]);

    return (
        <section className="space-y-12" aria-labelledby="services-heading">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {services.map((s, index) => (
                    <ServiceCard
                        {...s} 
                        index={index} 
                        isVisible={visibleCards.includes(index)}
                    />
                ))}
            </div>

            <div className={`text-center transition-all duration-300 ${
                visibleCards.length === 4 ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
                    <span className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400"></span>
                    <span className="font-medium">Our integrated approach to creating positive impact</span>
                    <span className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400"></span>
                </div>
            </div>
        </section>
    );
});

// Optimized Team Member Card
const TeamMemberCard = React.memo(({ name, title, description, imageUrl }) => (
    <article className="group p-6 text-center transition-all bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1">
        <img
            className="object-cover w-20 h-20 mx-auto mb-4 rounded-full border-4 border-gray-100 group-hover:border-amber-200 transition-all"
            src={imageUrl}
            alt={`${name}, ${title}`}
            loading="lazy"
            decoding="async"
            width="80"
            height="80"
            onError={(e) => { 
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=3B82F6&color=fff&size=80'; 
            }}
        />
        <h3 className="text-base font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm font-semibold text-amber-600 mb-2">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </article>
));

// Loading component for marquee
const MarqueeLoading = () => (
    <div className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mb-16">
            <div className="text-center">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            </div>
        </div>
        <div className="flex space-x-4 px-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-56 bg-gray-200 rounded-2xl"></div>
            ))}
        </div>
    </div>
);

export default function AboutUs() {
    // Memoize static data with image icons
    const services = useMemo(() => [
        {
            title: "QR-Enabled Reflective Collars",
            description: "Advanced reflective QR collars that provide identification and enhance visibility of stray animals during nighttime, significantly reducing traffic accidents.",
            icon: qrcollor
        },
        {
            title: "Women Empowerment Training",
            description: "Comprehensive skill development programs and professional training for underprivileged women, fostering financial independence and sustainable livelihoods.",
            icon: womenEmpowerment
        },
        {
            title: "Community Outreach Programs",
            description: "Strategic community engagement initiatives that educate stakeholders and facilitate widespread distribution of protective collars for maximum impact.",
            icon: communityOutreach
        },
        {
            title: "Impact Measurement & Analytics",
            description: "Data-driven monitoring systems that track environmental impact, measure program effectiveness, and ensure sustainable practices across all operations.",
            icon: analytics
        }
    ], []);

    const teamData = useMemo(() => [
        {
            name: 'Rimjhim Shende',
            title: 'Founder & CEO',
            description: 'Visionary leader driving sustainable innovation and measurable social impact through strategic partnerships.',
            imageUrl: 'https://placehold.co/80x80/3B82F6/FFFFFF?text=RS'
        },
        {
            name: 'Tushar Shende',
            title: 'Co-Founder & CTO',
            description: 'Technology strategist with expertise in scaling mission-driven organizations and implementing innovative solutions.',
            imageUrl: 'https://placehold.co/80x80/3B82F6/FFFFFF?text=TS'
        },
        {
            name: 'Pooja Batani',
            title: 'Director of Sales',
            description: 'Strategic partnership leader focused on expanding market reach and building sustainable business relationships.',
            imageUrl: 'https://placehold.co/80x80/3B82F6/FFFFFF?text=PB'
        },
        {
            name: 'Devshree Gupta',
            title: 'Chief Operations Officer',
            description: 'Operations excellence expert driving efficiency and strategic growth across all organizational functions.',
            imageUrl: 'https://placehold.co/80x80/3B82F6/FFFFFF?text=DG'
        }
    ], []);

    return (
        <>
            {/* Hero Section - improved */}
            <div className="relative bg-gradient-to-br from-amber-200 via-pink-50 to-amber-200 pb-12">
                {/* Reduced background elements for better performance */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-200 rounded-full blur-3xl opacity-15"></div>

                <header className="relative px-4 pt-12 pb-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            What we <span className="text-yellow-500">Stand</span> for
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Pawsitivity delivers innovative solutions that create a safer world for stray animals while empowering women through meaningful, sustainable employment opportunities.
                        </p>
                    </div>
                </header>

                {/* Responsive Services Section */}
                <section className="relative px-2 sm:px-4 mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {services.map((s, index) => (
                            <ServiceCard  
                                key={s.title || index} // Ensure unique key
                                {...s} 
                                index={index} 
                                isVisible={true}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Gallery Section */}
            <section className="py-20 bg-white" aria-labelledby="gallery-heading">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mb-16">
                    <div className="text-center">
                        <h2 id="gallery-heading" className="text-3xl font-bold text-gray-900 mb-4">Our Impact in Action</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Witness the transformative change we're creating in communities across the country through our innovative programs and partnerships.
                        </p>
                    </div>
                </div>
                
                <div className="marquee-container">
                    <div className="marquee-content">
                        {[...marqueeImages, ...marqueeImages].map((src, i) => (
                            <div key={i} className="flex-shrink-0 w-80 h-56 mx-4 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                <img 
                                    src={src} 
                                    alt={`Impact Gallery ${(i % marqueeImages.length) + 1}`} 
                                    loading="lazy"
                                    decoding="async"
                                    width="320"
                                    height="224"
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <div className="bg-gray-50">
                <main className="py-20 lg:py-28">
                    <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
                                Empowering Communities for a Sustainable Future
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                                At Pawsitivity, we combine innovative technology, strategic partnerships, and data-driven approaches to create measurable, lasting change in animal welfare and women's empowerment.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 mb-16">
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    Our organization was founded on the principle that innovative solutions can address multiple social challenges simultaneously. By developing QR-enabled reflective collars for stray animals, we've created a sustainable business model that drives positive outcomes.
                                </p>
                                <p className="text-lg">
                                    Through our comprehensive <strong className="text-gray-900">QR-enabled identification system</strong>, we've enhanced animal visibility during nighttime hours while providing crucial identification capabilities that reunite lost pets with their families.
                                </p>
                            </div>
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    Our women's empowerment program has created meaningful employment opportunities for over 150 women, providing them with technical skills, financial independence, and professional development pathways.
                                </p>
                                <p className="text-lg">
                                    With over <strong className="text-gray-900">2 million animals protected</strong> and partnerships with 23+ NGOs, we continue to scale our impact while maintaining rigorous quality standards and sustainable practices.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 lg:p-12 mb-16">
                            <div className="max-w-4xl mx-auto text-center">
                                <h3 className="text-2xl font-bold text-amber-900 mb-6">Strategic Growth Initiatives</h3>
                                <div className="grid md:grid-cols-2 gap-8 text-amber-800">
                                    <div>
                                        <p className="mb-4">
                                            We're expanding our impact through large-scale deployment programs, corporate social responsibility partnerships, and comprehensive awareness campaigns that integrate animal welfare with sustainable development goals.
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            Join our mission to transform communities through innovation, compassion, and strategic action. Together, we're building a future where technology serves humanity's most pressing social challenges.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h3>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our diverse leadership team brings together expertise in technology, operations, sales, and social impact to drive sustainable growth and measurable outcomes.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {teamData.map(member => (
                                <TeamMemberCard key={member.name} {...member} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
