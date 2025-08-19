// Optimize images with smaller placeholder sizes and WebP format when possible
export const categoryProducts = {
    Collars: [
        { 
            id: 1, 
            name: 'QR-Enabled Reflective Collar (Pack of 5)', 
            author: 'Pawsitivity', 
            rating: 5, 
            reviewCount: 120, 
            format: 'Pack of 5', 
            price: 299, 
            originalPrice: 399,
            // Use smaller, optimized placeholder images
            image: 'https://placehold.co/400x400/FBBF24/333333?text=QR+Collar&format=webp', 
            images: [
                'https://placehold.co/400x400/FBBF24/333333?text=QR+Collar&format=webp',
                'https://placehold.co/400x400/F59E0B/333333?text=Detail+1&format=webp',
                'https://placehold.co/400x400/D97706/333333?text=Detail+2&format=webp'
            ],
            inStock: true,
            stockCount: 45,
            category: 'Collars',
            description: 'Advanced QR-enabled reflective collar designed for pet safety and identification. Features waterproof QR codes, high-visibility reflective strips, and durable construction.',
            features: [
                'Waterproof QR code technology',
                'High-visibility reflective strips (25mm)',
                'Adjustable buckle system',
                'Weather-resistant materials',
                'Quick-scan QR identification'
            ],
            specifications: {
                'Material': 'Premium Nylon with Reflective Coating',
                'Size Range': 'Adjustable 30-50cm',
                'Weight': '50g per collar',
                'Waterproof Rating': 'IPX7',
                'QR Code': 'Permanent laser etching'
            },
            benefits: [
                'Reduces pet loss by 90%',
                'Increases nighttime visibility by 300%',
                'Instant owner contact via QR scan',
                'Durable construction lasts 2+ years'
            ]
        },
        {
            id: 7,
            name: 'Advanced Premium QR Enabled Reflective Collar Pack of 5pcs',
            author: 'Pawsitivity',
            rating: 5,
            reviewCount: 98,
            format: 'Pack of 5',
            price: 399,
            originalPrice: 499,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=Premium&format=webp',
            images: [
                'https://placehold.co/400x400/FBBF24/333333?text=Premium&format=webp',
                'https://placehold.co/400x400/F59E0B/333333?text=Premium+Detail&format=webp',
                'https://placehold.co/400x400/D97706/333333?text=Premium+Close&format=webp'
            ],
            inStock: true,
            stockCount: 32,
            category: 'Collars',
            description: 'Premium quality QR-enabled reflective collar with enhanced durability and advanced features for maximum pet safety.',
            features: [
                'Premium waterproof QR technology',
                'Extra-wide reflective strips (30mm)',
                'Premium buckle system',
                'Weather-resistant premium materials',
                'Enhanced QR scanning range'
            ],
            specifications: {
                'Material': 'Ultra-Premium Nylon with Enhanced Reflective Coating',
                'Size Range': 'Adjustable 25-55cm',
                'Weight': '55g per collar',
                'Waterproof Rating': 'IPX8',
                'QR Code': 'Laser-etched with protective coating'
            },
            benefits: [
                'Reduces pet loss by 95%',
                'Increases nighttime visibility by 400%',
                'Extended scanning range',
                'Premium construction lasts 3+ years'
            ]
        },
        {
            id: 2,
            name: 'Anti-Theft Buckle Collar (Pack of 5)',
            author: 'Pawsitivity',
            rating: 4,
            reviewCount: 85,
            format: 'Pack of 5',
            price: 349,
            originalPrice: 449,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=Anti-Theft&format=webp',
            images: [
                'https://placehold.co/400x400/FBBF24/333333?text=Anti-Theft&format=webp',
                'https://placehold.co/400x400/F59E0B/333333?text=Buckle+Detail&format=webp'
            ],
            inStock: false,
            stockCount: 0,
            category: 'Collars',
            description: 'Secure anti-theft collar with tamper-proof buckle system designed to prevent collar removal by unauthorized persons.',
            features: [
                'Anti-theft buckle mechanism',
                'Tamper-proof design',
                'High-visibility strips',
                'Durable construction',
                'QR identification'
            ],
            specifications: {
                'Material': 'Reinforced Nylon',
                'Size Range': 'Adjustable 28-48cm',
                'Weight': '60g per collar',
                'Security Rating': 'High',
                'QR Code': 'Embedded protection'
            },
            benefits: [
                'Prevents collar theft',
                'Enhanced security',
                'Reliable identification',
                'Long-lasting durability'
            ]
        },
        {
            id: 8,
            name: 'QR-Enabled Reflective Collars for Stray Animals (Pack of 5 – With Anti-Theft Buckle & D-Ring, 25mm Strip)',
            author: 'Pawsitivity',
            rating: 4,
            reviewCount: 75,
            format: 'Pack of 5',
            price: 379,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=D-Ring&format=webp',
            inStock: true,
            stockCount: 38,
            category: 'Collars',
            description: 'Specialized collar designed for stray animals with anti-theft features and D-ring attachment.',
            features: [
                'Anti-theft buckle system',
                'Stainless steel D-ring',
                '25mm reflective strip',
                'QR code identification',
                'Weather-resistant design'
            ],
            specifications: {
                'Material': 'Heavy-duty Nylon',
                'Size Range': 'Adjustable 32-52cm',
                'Weight': '65g per collar',
                'Waterproof Rating': 'IPX6',
                'D-Ring': 'Stainless steel'
            }
        },
        {
            id: 5,
            name: 'Paw-some Glow Collar (Single)',
            author: 'Pawsitivity',
            rating: 4,
            reviewCount: 95,
            format: 'Single Collar',
            price: 149,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=Glow+Collar&format=webp',
            inStock: true,
            stockCount: 28,
            category: 'Collars',
            description: 'LED-enhanced collar with glow-in-the-dark features for enhanced nighttime visibility.',
            features: [
                'LED light strips',
                'Glow-in-the-dark material',
                'Rechargeable battery',
                'Multiple light modes',
                'Water-resistant design'
            ],
            specifications: {
                'Material': 'Silicone with LED strips',
                'Size Range': 'Adjustable 25-45cm',
                'Weight': '45g',
                'Battery Life': '8-12 hours',
                'Charging': 'USB-C'
            }
        }
    ],
    Tags: [
        {
            id: 3,
            name: 'Smart QR Code Pet ID Tag',
            author: 'Pawsitivity',
            rating: 5,
            reviewCount: 250,
            format: 'Single Tag',
            price: 99,
            originalPrice: 129,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=ID+Tag&format=webp',
            images: [
                'https://placehold.co/400x400/FBBF24/333333?text=ID+Tag&format=webp',
                'https://placehold.co/400x400/F59E0B/333333?text=QR+Code&format=webp'
            ],
            inStock: true,
            stockCount: 67,
            category: 'Tags',
            description: 'Smart QR code pet ID tag with instant owner contact information and medical details access.',
            features: [
                'Smart QR code technology',
                'Instant contact access',
                'Medical information storage',
                'Waterproof design',
                'Lightweight construction'
            ],
            specifications: {
                'Material': 'Anodized Aluminum',
                'Dimensions': '25mm x 35mm',
                'Weight': '8g',
                'Waterproof Rating': 'IPX7',
                'QR Capacity': '500 characters'
            },
            benefits: [
                'Instant pet recovery',
                'Medical emergency access',
                'Waterproof durability',
                'Lightweight comfort'
            ]
        },
        {
            id: 6,
            name: 'Custom Engraved Pet Tag',
            author: 'Pawsitivity',
            rating: 5,
            reviewCount: 180,
            format: 'Single Tag',
            price: 129,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=Engraved+Tag&format=webp',
            inStock: true,
            stockCount: 45,
            category: 'Tags',
            description: 'Personalized engraved pet tag with custom text and contact information.',
            features: [
                'Custom laser engraving',
                'Multiple font options',
                'Durable materials',
                'Fade-resistant text',
                'Multiple shape options'
            ],
            specifications: {
                'Material': 'Stainless Steel',
                'Dimensions': '30mm x 40mm',
                'Weight': '12g',
                'Engraving': 'Laser precision',
                'Colors': '5 available'
            }
        }
    ],
    Cattle: [
        {
            id: 4,
            name: 'Reflective Cattle Collar (Pack of 2)',
            author: 'Pawsitivity',
            rating: 4,
            reviewCount: 40,
            format: 'Pack of 2',
            price: 399,
            originalPrice: 499,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=Cattle+Collar&format=webp',
            images: [
                'https://placehold.co/400x400/FBBF24/333333?text=Cattle+Collar&format=webp',
                'https://placehold.co/400x400/F59E0B/333333?text=Cattle+Detail&format=webp'
            ],
            inStock: true,
            stockCount: 25,
            category: 'Cattle',
            description: 'Heavy-duty reflective collar designed specifically for cattle with enhanced visibility and durability.',
            features: [
                'Heavy-duty construction',
                'Extra-wide reflective strips',
                'Weather-resistant materials',
                'Adjustable sizing',
                'QR identification system'
            ],
            specifications: {
                'Material': 'Heavy-duty Nylon',
                'Size Range': 'Adjustable 60-90cm',
                'Weight': '150g per collar',
                'Waterproof Rating': 'IPX6',
                'Reflective Width': '50mm'
            },
            benefits: [
                'Enhanced cattle visibility',
                'Reduced vehicle collisions',
                'Durable construction',
                'Easy identification'
            ]
        },
        {
            id: 14,
            name: 'Heavy Duty QR Cattle Collar with GPS',
            author: 'Pawsitivity',
            rating: 5,
            reviewCount: 35,
            format: 'Single Collar',
            price: 899,
            image: 'https://placehold.co/400x400/FBBF24/333333?text=GPS+Cattle&format=webp',
            inStock: true,
            stockCount: 15,
            category: 'Cattle',
            description: 'Advanced GPS-enabled cattle collar with real-time tracking and QR identification.',
            features: [
                'GPS tracking capability',
                'Real-time location updates',
                'Solar-powered battery',
                'Weather-resistant design',
                'Mobile app integration'
            ],
            specifications: {
                'Material': 'Reinforced Polymer',
                'Size Range': 'Adjustable 65-95cm',
                'Weight': '200g',
                'Battery Life': '30 days',
                'GPS Accuracy': '3-5 meters'
            }
        }
    ]
};

// Memoized functions for better performance
export const getAllProducts = () => {
    return Object.values(categoryProducts).flat();
};

export const getProductById = (id) => {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
    if (category === 'All') {
        return getAllProducts();
    }
    return categoryProducts[category] || [];
};
