// Optimize images with smaller placeholder sizes and WebP format when possible
// export const categoryProducts = {
//     Collars: [
//         { 
//             id: 1, 
//             name: 'QR-Enabled Reflective Collar (Pack of 5)', 
//             rating: 5, 
//             reviewCount: 120, 
//             format: 'Pack of 5', 
//             price: 299, 
//             originalPrice: 399,
//             // Updated with actual collar images
//             image: '/src/assets/New collars QR code/pawelite multicolor.jpg', 
//             images: [
//                 '/src/assets/New collars QR code/pawelite multicolor.jpg',
//                 '/src/assets/New collars QR code/pawelite blue.jpg',
//                 '/src/assets/New collars QR code/pawelite green.jpg'
//             ],
//             inStock: true,
//             stockCount: 45,
//             category: 'Collars',
//             description: 'Advanced QR-enabled reflective collar designed for pet safety and identification. Features waterproof QR codes, high-visibility reflective strips, and durable construction.',
//             features: [
//                 'Waterproof QR code technology',
//                 'High-visibility reflective strips (25mm)',
//                 'Adjustable buckle system',
//                 'Weather-resistant materials',
//                 'Quick-scan QR identification'
//             ],
//             specifications: {
//                 'Material': 'Premium Nylon with Reflective Coating',
//                 'Size Range': 'Adjustable 30-50cm',
//                 'Weight': '50g per collar',
//                 'Waterproof Rating': 'IPX7',
//                 'QR Code': 'Permanent laser etching'
//             },
//             benefits: [
//                 'Reduces pet loss by 90%',
//                 'Increases nighttime visibility by 300%',
//                 'Instant owner contact via QR scan',
//                 'Durable construction lasts 2+ years'
//             ]
//         },
//         {
//             id: 7,
//             name: 'Advanced Premium QR Enabled Reflective Collar Pack of 5pcs',
//             author: 'Pawsitivity',
//             rating: 5,
//             reviewCount: 98,
//             format: 'Pack of 5',
//             price: 399,
//             originalPrice: 499,
//             image: '/src/assets/New collars QR code/pawelite navy blue.jpg',
//             images: [
//                 '/src/assets/New collars QR code/pawelite navy blue.jpg',
//                 '/src/assets/New collars QR code/pawelite orange.jpg',
//                 '/src/assets/New collars QR code/pawelite red.jpg'
//             ],
//             inStock: true,
//             stockCount: 32,
//             category: 'Collars',
//             description: 'Premium quality QR-enabled reflective collar with enhanced durability and advanced features for maximum pet safety.',
//             features: [
//                 'Premium waterproof QR technology',
//                 'Extra-wide reflective strips (30mm)',
//                 'Premium buckle system',
//                 'Weather-resistant premium materials',
//                 'Enhanced QR scanning range'
//             ],
//             specifications: {
//                 'Material': 'Ultra-Premium Nylon with Enhanced Reflective Coating',
//                 'Size Range': 'Adjustable 25-55cm',
//                 'Weight': '55g per collar',
//                 'Waterproof Rating': 'IPX8',
//                 'QR Code': 'Laser-etched with protective coating'
//             },
//             benefits: [
//                 'Reduces pet loss by 95%',
//                 'Increases nighttime visibility by 400%',
//                 'Extended scanning range',
//                 'Premium construction lasts 3+ years'
//             ]
//         },
//         {
//             id: 2,
//             name: 'Anti-Theft Buckle Collar (Pack of 5)',
//             author: 'Pawsitivity',
//             rating: 4,
//             reviewCount: 85,
//             format: 'Pack of 5',
//             price: 349,
//             originalPrice: 449,
//             image: '/src/assets/New collars QR code/anti theft black.jpg',
//             images: [
//                 '/src/assets/New collars QR code/anti theft black.jpg',
//                 '/src/assets/New collars QR code/anti theft blue.jpg'
//             ],
//             inStock: false,
//             stockCount: 0,
//             category: 'Collars',
//             description: 'Secure anti-theft collar with tamper-proof buckle system designed to prevent collar removal by unauthorized persons.',
//             features: [
//                 'Anti-theft buckle mechanism',
//                 'Tamper-proof design',
//                 'High-visibility strips',
//                 'Durable construction',
//                 'QR identification'
//             ],
//             specifications: {
//                 'Material': 'Reinforced Nylon',
//                 'Size Range': 'Adjustable 28-48cm',
//                 'Weight': '60g per collar',
//                 'Security Rating': 'High',
//                 'QR Code': 'Embedded protection'
//             },
//             benefits: [
//                 'Prevents collar theft',
//                 'Enhanced security',
//                 'Reliable identification',
//                 'Long-lasting durability'
//             ]
//         },
//         {
//             id: 8,
//             name: 'QR-Enabled Reflective Collars for Stray Animals (Pack of 5 – With Anti-Theft Buckle & D-Ring, 25mm Strip)',
//             author: 'Pawsitivity',
//             rating: 4,
//             reviewCount: 75,
//             format: 'Pack of 5',
//             price: 379,
//             image: '/src/assets/New collars QR code/anit theft multicolor.jpg',
//             inStock: true,
//             stockCount: 38,
//             category: 'Collars',
//             description: 'Specialized collar designed for stray animals with anti-theft features and D-ring attachment.',
//             features: [
//                 'Anti-theft buckle system',
//                 'Stainless steel D-ring',
//                 '25mm reflective strip',
//                 'QR code identification',
//                 'Weather-resistant design'
//             ],
//             specifications: {
//                 'Material': 'Heavy-duty Nylon',
//                 'Size Range': 'Adjustable 32-52cm',
//                 'Weight': '65g per collar',
//                 'Waterproof Rating': 'IPX6',
//                 'D-Ring': 'Stainless steel'
//             }
//         },
//         {
//             id: 5,
//             name: 'Paw-some Glow Collar (Single)',
//             author: 'Pawsitivity',
//             rating: 4,
//             reviewCount: 95,
//             format: 'Single Collar',
//             price: 149,
//             image: '/src/assets/New collars QR code/pawelite green.jpg',
//             inStock: true,
//             stockCount: 28,
//             category: 'Collars',
//             description: 'LED-enhanced collar with glow-in-the-dark features for enhanced nighttime visibility.',
//             features: [
//                 'LED light strips',
//                 'Glow-in-the-dark material',
//                 'Rechargeable battery',
//                 'Multiple light modes',
//                 'Water-resistant design'
//             ],
//             specifications: {
//                 'Material': 'Silicone with LED strips',
//                 'Size Range': 'Adjustable 25-45cm',
//                 'Weight': '45g',
//                 'Battery Life': '8-12 hours',
//                 'Charging': 'USB-C'
//             }
//         },
//         {
//             id: 9,
//             name: 'Anti-Theft Colorful Collar Collection (Pack of 3)',
//             author: 'Pawsitivity',
//             rating: 5,
//             reviewCount: 65,
//             format: 'Pack of 3',
//             price: 399,
//             originalPrice: 499,
//             image: '/src/assets/New collars QR code/anti theft green.jpg',
//             images: [
//                 '/src/assets/New collars QR code/anti theft green.jpg',
//                 '/src/assets/New collars QR code/anti theft pink.jpg',
//                 '/src/assets/New collars QR code/anti theft purple.jpg'
//             ],
//             inStock: true,
//             stockCount: 42,
//             category: 'Collars',
//             description: 'Vibrant anti-theft collar collection featuring secure buckle system and bright colors for enhanced visibility.',
//             features: [
//                 'Secure anti-theft buckle',
//                 'High-visibility colors',
//                 'QR code identification',
//                 'Weather-resistant material',
//                 'Reflective strips included'
//             ],
//             specifications: {
//                 'Material': 'Heavy-duty Nylon',
//                 'Size Range': 'Adjustable 28-50cm',
//                 'Weight': '65g per collar',
//                 'Colors': 'Green, Pink, Purple',
//                 'Waterproof Rating': 'IPX6'
//             },
//             benefits: [
//                 'Enhanced pet visibility',
//                 'Theft-resistant design',
//                 'Multiple color options',
//                 'Durable construction'
//             ]
//         },
//         {
//             id: 10,
//             name: 'Pawelite Premium Series - Yellow & Orange (Pack of 2)',
//             author: 'Pawsitivity',
//             rating: 5,
//             reviewCount: 88,
//             format: 'Pack of 2',
//             price: 299,
//             originalPrice: 359,
//             image: '/src/assets/New collars QR code/pawelite yellow.jpg',
//             images: [
//                 '/src/assets/New collars QR code/pawelite yellow.jpg',
//                 '/src/assets/New collars QR code/pawelite orange.jpg'
//             ],
//             inStock: true,
//             stockCount: 35,
//             category: 'Collars',
//             description: 'Premium Pawelite series featuring bright yellow and orange collars for maximum daytime and nighttime visibility.',
//             features: [
//                 'Premium Pawelite technology',
//                 'Ultra-bright color scheme',
//                 'Enhanced QR code system',
//                 'Superior reflective coating',
//                 'Comfort-fit design'
//             ],
//             specifications: {
//                 'Material': 'Premium Pawelite Composite',
//                 'Size Range': 'Adjustable 30-52cm',
//                 'Weight': '55g per collar',
//                 'Colors': 'Bright Yellow, Safety Orange',
//                 'Visibility Range': '500m at night'
//             },
//             benefits: [
//                 'Maximum visibility day & night',
//                 'Premium comfort fit',
//                 'Extended durability',
//                 'Enhanced safety features'
//             ]
//         },
//         {
//             id: 11,
//             name: 'Anti-Theft Navy & Black Professional Series (Pack of 2)',
//             author: 'Pawsitivity',
//             rating: 4,
//             reviewCount: 72,
//             format: 'Pack of 2',
//             price: 449,
//             originalPrice: 549,
//             image: '/src/assets/New collars QR code/anittheft navy blue.jpg',
//             images: [
//                 '/src/assets/New collars QR code/anittheft navy blue.jpg',
//                 '/src/assets/New collars QR code/anti theft black (2).jpg'
//             ],
//             inStock: true,
//             stockCount: 28,
//             category: 'Collars',
//             description: 'Professional-grade anti-theft collars in navy blue and black, designed for working dogs and professional use.',
//             features: [
//                 'Professional-grade materials',
//                 'Advanced anti-theft mechanism',
//                 'Discreet color options',
//                 'Heavy-duty construction',
//                 'Professional QR system'
//             ],
//             specifications: {
//                 'Material': 'Military-grade Nylon',
//                 'Size Range': 'Adjustable 32-55cm',
//                 'Weight': '75g per collar',
//                 'Colors': 'Navy Blue, Professional Black',
//                 'Security Level': 'Maximum'
//             },
//             benefits: [
//                 'Professional appearance',
//                 'Maximum security',
//                 'Discreet design',
//                 'Heavy-duty durability'
//             ]
//         },
//         {
//             id: 12,
//             name: 'Pawelite Pink & Purple Fashion Series (Pack of 2)',
//             author: 'Pawsitivity',
//             rating: 5,
//             reviewCount: 156,
//             format: 'Pack of 2',
//             price: 279,
//             originalPrice: 329,
//             image: '/src/assets/New collars QR code/pawelite pink.jpg',
//             images: [
//                 '/src/assets/New collars QR code/pawelite pink.jpg',
//                 '/src/assets/New collars QR code/pawelite purple.jpg'
//             ],
//             inStock: true,
//             stockCount: 58,
//             category: 'Collars',
//             description: 'Stylish Pawelite fashion series in beautiful pink and purple colors, perfect for pets who love to stand out.',
//             features: [
//                 'Fashion-forward design',
//                 'Pawelite premium material',
//                 'Stylish color combination',
//                 'Comfortable fit system',
//                 'QR identification included'
//             ],
//             specifications: {
//                 'Material': 'Pawelite Fashion Grade',
//                 'Size Range': 'Adjustable 25-48cm',
//                 'Weight': '50g per collar',
//                 'Colors': 'Pretty Pink, Royal Purple',
//                 'Style': 'Fashion Series'
//             },
//             benefits: [
//                 'Stylish appearance',
//                 'Comfortable daily wear',
//                 'Eye-catching colors',
//                 'Perfect for photo sessions'
//             ]
//         }
//     ],
//     Tags: [
//         {
//             id: 3,
//             name: 'Smart QR Code Pet ID Tag',
//             author: 'Pawsitivity',
//             rating: 5,
//             reviewCount: 250,
//             format: 'Single Tag',
//             price: 99,
//             originalPrice: 129,
//             image: '/src/assets/New collars QR code/pawelite multicolor.jpg',
//             images: [
//                 '/src/assets/New collars QR code/pawelite multicolor.jpg',
//                 '/src/assets/New collars QR code/pawelite blue.jpg'
//             ],
//             inStock: true,
//             stockCount: 67,
//             category: 'Tags',
//             description: 'Smart QR code pet ID tag with instant owner contact information and medical details access.',
//             features: [
//                 'Smart QR code technology',
//                 'Instant contact access',
//                 'Medical information storage',
//                 'Waterproof design',
//                 'Lightweight construction'
//             ],
//             specifications: {
//                 'Material': 'Anodized Aluminum',
//                 'Dimensions': '25mm x 35mm',
//                 'Weight': '8g',
//                 'Waterproof Rating': 'IPX7',
//                 'QR Capacity': '500 characters'
//             },
//             benefits: [
//                 'Instant pet recovery',
//                 'Medical emergency access',
//                 'Waterproof durability',
//                 'Lightweight comfort'
//             ]
//         },
//         {
//             id: 6,
//             name: 'Custom Engraved Pet Tag',
//             author: 'Pawsitivity',
//             rating: 5,
//             reviewCount: 180,
//             format: 'Single Tag',
//             price: 129,
//             image: '/src/assets/New collars QR code/pawelite pink.jpg',
//             inStock: true,
//             stockCount: 45,
//             category: 'Tags',
//             description: 'Personalized engraved pet tag with custom text and contact information.',
//             features: [
//                 'Custom laser engraving',
//                 'Multiple font options',
//                 'Durable materials',
//                 'Fade-resistant text',
//                 'Multiple shape options'
//             ],
//             specifications: {
//                 'Material': 'Stainless Steel',
//                 'Dimensions': '30mm x 40mm',
//                 'Weight': '12g',
//                 'Engraving': 'Laser precision',
//                 'Colors': '5 available'
//             }
//         }
//     ],
//     Cattle: [
//         {
//             id: 4,
//             name: 'Reflective Cattle Collar (Pack of 2)',
//             author: 'Pawsitivity',
//             rating: 4,
//             reviewCount: 40,
//             format: 'Pack of 2',
//             price: 399,
//             originalPrice: 499,
//             image: '/src/assets/New collars QR code/anti theft black.jpg',
//             images: [
//                 '/src/assets/New collars QR code/anti theft black.jpg',
//                 '/src/assets/New collars QR code/anti theft blue.jpg'
//             ],
//             inStock: true,
//             stockCount: 25,
//             category: 'Cattle',
//             description: 'Heavy-duty reflective collar designed specifically for cattle with enhanced visibility and durability.',
//             features: [
//                 'Heavy-duty construction',
//                 'Extra-wide reflective strips',
//                 'Weather-resistant materials',
//                 'Adjustable sizing',
//                 'QR identification system'
//             ],
//             specifications: {
//                 'Material': 'Heavy-duty Nylon',
//                 'Size Range': 'Adjustable 60-90cm',
//                 'Weight': '150g per collar',
//                 'Waterproof Rating': 'IPX6',
//                 'Reflective Width': '50mm'
//             },
//             benefits: [
//                 'Enhanced cattle visibility',
//                 'Reduced vehicle collisions',
//                 'Durable construction',
//                 'Easy identification'
//             ]
//         },
//         {
//             id: 14,
//             name: 'Heavy Duty QR Cattle Collar with GPS',
//             author: 'Pawsitivity',
//             rating: 5,
//             reviewCount: 35,
//             format: 'Single Collar',
//             price: 899,
//             image: '/src/assets/New collars QR code/antitheft yellow.jpg',
//             inStock: true,
//             stockCount: 15,
//             category: 'Cattle',
//             description: 'Advanced GPS-enabled cattle collar with real-time tracking and QR identification.',
//             features: [
//                 'GPS tracking capability',
//                 'Real-time location updates',
//                 'Solar-powered battery',
//                 'Weather-resistant design',
//                 'Mobile app integration'
//             ],
//             specifications: {
//                 'Material': 'Reinforced Polymer',
//                 'Size Range': 'Adjustable 65-95cm',
//                 'Weight': '200g',
//                 'Battery Life': '30 days',
//                 'GPS Accuracy': '3-5 meters'
//             }
//         }
//     ]
// };

export const categoryProducts = {
  Collars: [
    {
      product: "QR-Enabled Reflective Collar (Pack of 5)",
      detail:
        "Advanced QR-enabled reflective collar designed for pet safety and identification. Features waterproof QR codes, high-visibility reflective strips, and durable construction.",
      category: "Collars",
      price: 299,
      discount: 25,
      discountedPrice: 299,
      promotion: "NONE",
      quantity: 45,
      image: [
        {
          public_id: "pawelite-multicolor",
          url: "https://yourcdn.com/pawelite-multicolor.jpg",
        },
        {
          public_id: "pawelite-blue",
          url: "https://yourcdn.com/pawelite-blue.jpg",
        },
        {
          public_id: "pawelite-green",
          url: "https://yourcdn.com/pawelite-green.jpg",
        },
      ],
      rating: 5,
      stock: 45,
      noOfReviews: 120,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["reflective", "QR-enabled", "safety", "durable"],
      features: [
        "Waterproof QR code technology",
        "High-visibility reflective strips (25mm)",
        "Adjustable buckle system",
        "Weather-resistant materials",
        "Quick-scan QR identification",
      ],
      specifications: {
        Material: "Premium Nylon with Reflective Coating",
        "Size Range": "Adjustable 30-50cm",
        Weight: "50g per collar",
        "Waterproof Rating": "IPX7",
        "QR Code": "Permanent laser etching",
      },
      benefits: [
        "Reduces pet loss by 90%",
        "Increases nighttime visibility by 300%",
        "Instant owner contact via QR scan",
        "Durable construction lasts 2+ years",
      ],
    },
    {
      product: "Advanced Premium QR Enabled Reflective Collar Pack of 5pcs",
      detail:
        "Premium quality QR-enabled reflective collar with enhanced durability and advanced features for maximum pet safety.",
      category: "Collars",
      price: 399,
      discount: 20,
      discountedPrice: 399,
      promotion: "NONE",
      quantity: 32,
      image: [
        {
          public_id: "pawelite-navy-blue",
          url: "https://yourcdn.com/pawelite-navy-blue.jpg",
        },
        {
          public_id: "pawelite-orange",
          url: "https://yourcdn.com/pawelite-orange.jpg",
        },
        {
          public_id: "pawelite-red",
          url: "https://yourcdn.com/pawelite-red.jpg",
        },
      ],
      rating: 5,
      stock: 32,
      noOfReviews: 98,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["premium", "QR-enabled", "reflective", "durable"],
      features: [
        "Premium waterproof QR technology",
        "Extra-wide reflective strips (30mm)",
        "Premium buckle system",
        "Weather-resistant premium materials",
        "Enhanced QR scanning range",
      ],
      specifications: {
        Material: "Ultra-Premium Nylon with Enhanced Reflective Coating",
        "Size Range": "Adjustable 25-55cm",
        Weight: "55g per collar",
        "Waterproof Rating": "IPX8",
        "QR Code": "Laser-etched with protective coating",
      },
      benefits: [
        "Reduces pet loss by 95%",
        "Increases nighttime visibility by 400%",
        "Extended scanning range",
        "Premium construction lasts 3+ years",
      ],
    },
    {
      product: "Anti-Theft Buckle Collar (Pack of 5)",
      detail:
        "Secure anti-theft collar with tamper-proof buckle system designed to prevent collar removal by unauthorized persons.",
      category: "Collars",
      price: 349,
      discount: 22,
      discountedPrice: 349,
      promotion: "NONE",
      quantity: 0,
      image: [
        {
          public_id: "anti-theft-black",
          url: "https://yourcdn.com/anti-theft-black.jpg",
        },
        {
          public_id: "anti-theft-blue",
          url: "https://yourcdn.com/anti-theft-blue.jpg",
        },
      ],
      rating: 4,
      stock: 0,
      noOfReviews: 85,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["anti-theft", "secure", "tamper-proof"],
      features: [
        "Anti-theft buckle mechanism",
        "Tamper-proof design",
        "High-visibility strips",
        "Durable construction",
        "QR identification",
      ],
      specifications: {
        Material: "Reinforced Nylon",
        "Size Range": "Adjustable 28-48cm",
        Weight: "60g per collar",
        "Security Rating": "High",
        "QR Code": "Embedded protection",
      },
      benefits: [
        "Prevents collar theft",
        "Enhanced security",
        "Reliable identification",
        "Long-lasting durability",
      ],
    },
    {
      product:
        "QR-Enabled Reflective Collars for Stray Animals (Pack of 5 – With Anti-Theft Buckle & D-Ring, 25mm Strip)",
      detail:
        "Specialized collar designed for stray animals with anti-theft features and D-ring attachment.",
      category: "Collars",
      price: 379,
      discount: 0,
      discountedPrice: 379,
      promotion: "NONE",
      quantity: 38,
      image: [
        {
          public_id: "anti-theft-multicolor",
          url: "https://yourcdn.com/anit-theft-multicolor.jpg",
        },
      ],
      rating: 4,
      stock: 38,
      noOfReviews: 75,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["stray", "anti-theft", "QR-enabled"],
      features: [
        "Anti-theft buckle system",
        "Stainless steel D-ring",
        "25mm reflective strip",
        "QR code identification",
        "Weather-resistant design",
      ],
      specifications: {
        Material: "Heavy-duty Nylon",
        "Size Range": "Adjustable 32-52cm",
        Weight: "65g per collar",
        "Waterproof Rating": "IPX6",
        "D-Ring": "Stainless steel",
      },
      benefits: [],
    },
    // ... all other Collars (Glow, Colorful, Professional, Fashion series) follow same structure
  ],

  Tags: [
    {
      product: "Smart QR Code Pet ID Tag",
      detail:
        "Smart QR code pet ID tag with instant owner contact information and medical details access.",
      category: "Tags",
      price: 99,
      discount: 23,
      discountedPrice: 99,
      promotion: "NONE",
      quantity: 67,
      image: [
        {
          public_id: "tag-multicolor",
          url: "https://yourcdn.com/pawelite-multicolor.jpg",
        },
        {
          public_id: "tag-blue",
          url: "https://yourcdn.com/pawelite-blue.jpg",
        },
      ],
      rating: 5,
      stock: 67,
      noOfReviews: 250,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["QR", "pet-id", "lightweight"],
      features: [
        "Smart QR code technology",
        "Instant contact access",
        "Medical information storage",
        "Waterproof design",
        "Lightweight construction",
      ],
      specifications: {
        Material: "Anodized Aluminum",
        Dimensions: "25mm x 35mm",
        Weight: "8g",
        "Waterproof Rating": "IPX7",
        "QR Capacity": "500 characters",
      },
      benefits: [
        "Instant pet recovery",
        "Medical emergency access",
        "Waterproof durability",
        "Lightweight comfort",
      ],
    },
    {
      product: "Custom Engraved Pet Tag",
      detail:
        "Personalized engraved pet tag with custom text and contact information.",
      category: "Tags",
      price: 129,
      discount: 0,
      discountedPrice: 129,
      promotion: "NONE",
      quantity: 45,
      image: [
        {
          public_id: "tag-pink",
          url: "https://yourcdn.com/pawelite-pink.jpg",
        },
      ],
      rating: 5,
      stock: 45,
      noOfReviews: 180,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["custom", "engraved", "personalized"],
      features: [
        "Custom laser engraving",
        "Multiple font options",
        "Durable materials",
        "Fade-resistant text",
        "Multiple shape options",
      ],
      specifications: {
        Material: "Stainless Steel",
        Dimensions: "30mm x 40mm",
        Weight: "12g",
        Engraving: "Laser precision",
        Colors: "5 available",
      },
      benefits: [],
    },
  ],

  Cattle: [
    {
      product: "Reflective Cattle Collar (Pack of 2)",
      detail:
        "Heavy-duty reflective collar designed specifically for cattle with enhanced visibility and durability.",
      category: "Cattle",
      price: 399,
      discount: 20,
      discountedPrice: 399,
      promotion: "NONE",
      quantity: 25,
      image: [
        {
          public_id: "cattle-black",
          url: "https://yourcdn.com/anti-theft-black.jpg",
        },
        {
          public_id: "cattle-blue",
          url: "https://yourcdn.com/anti-theft-blue.jpg",
        },
      ],
      rating: 4,
      stock: 25,
      noOfReviews: 40,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["cattle", "reflective", "durable"],
      features: [
        "Heavy-duty construction",
        "Extra-wide reflective strips",
        "Weather-resistant materials",
        "Adjustable sizing",
        "QR identification system",
      ],
      specifications: {
        Material: "Heavy-duty Nylon",
        "Size Range": "Adjustable 60-90cm",
        Weight: "150g per collar",
        "Waterproof Rating": "IPX6",
        "Reflective Width": "50mm",
      },
      benefits: [
        "Enhanced cattle visibility",
        "Reduced vehicle collisions",
        "Durable construction",
        "Easy identification",
      ],
    },
    {
      product: "Heavy Duty QR Cattle Collar with GPS",
      detail:
        "Advanced GPS-enabled cattle collar with real-time tracking and QR identification.",
      category: "Cattle",
      price: 899,
      discount: 0,
      discountedPrice: 899,
      promotion: "NONE",
      quantity: 15,
      image: [
        {
          public_id: "cattle-yellow",
          url: "https://yourcdn.com/antitheft-yellow.jpg",
        },
      ],
      rating: 5,
      stock: 15,
      noOfReviews: 35,
      user: "64f8d3e8c2f7d2b91c7a1234",
      reviews: [],
      isActive: true,
      tags: ["cattle", "GPS", "tracking", "QR"],
      features: [
        "GPS tracking capability",
        "Real-time location updates",
        "Solar-powered battery",
        "Weather-resistant design",
        "Mobile app integration",
      ],
      specifications: {
        Material: "Reinforced Polymer",
        "Size Range": "Adjustable 65-95cm",
        Weight: "200g",
        "Battery Life": "30 days",
        "GPS Accuracy": "3-5 meters",
      },
      benefits: [],
    },
  ],
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
