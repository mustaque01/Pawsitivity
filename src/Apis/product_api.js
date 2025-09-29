
import axios from "axios";
import { API_BASE_URL, ENDPOINTS, getAuthHeaders } from "../config/api.config.js";
// import multer from 'multer';
// import path from 'path';

// Create a separate instance for products API
const PRODUCTS_API_URL = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/products`,
  headers: getAuthHeaders()
});

// Add axios interceptor to include token in requests for products API
PRODUCTS_API_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await PRODUCTS_API_URL.get('/allProducts');
    
    return {
      success: true,
      data: response.data,
      products: response.data.products || response.data,
      message: 'Products fetched successfully'
    };
  } catch (error) {
    console.error("Get All Products API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch products',
      error: error.message
    };
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await PRODUCTS_API_URL.get(`/${productId}`);
    
    return {
      success: true,
      data: response.data,
      product: response.data.product || response.data,
      message: 'Product fetched successfully'
    };
  } catch (error) {
    console.error("Get Product By ID API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch product',
      error: error.message
    };
  }
};


// for admin

// Create a new product (admin only)
export const createProduct = async (productData) => {
  try {
    let config = {};
    // If productData is FormData, set multipart header
    if (productData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await PRODUCTS_API_URL.post('/create-product', productData, config);
    return {
      success: true,
      data: response.data,
      product: response.data.product || response.data,
      message: 'Product created successfully'
    };
  } catch (error) {
    console.error("Create Product API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create product',
      error: error.message
    };
  }
}
// Update a product by ID (admin only)
export const updateProduct = async (productId, productData) => {
  try {
    const response = await PRODUCTS_API_URL.put(`/product/${productId}`, productData);
    return {
      success: true,
      data: response.data,
      product: response.data.product || response.data,
      message: 'Product updated successfully'
    };
  } catch (error) {
    console.error("Update Product API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update product',
      error: error.message
    };
  }
};

// Delete a product by ID (admin only)
export const deleteProduct = async (productId) => {
  try {
    const response = await PRODUCTS_API_URL.delete(`/product/${productId}`);
    return {
      success: true,
      data: response.data,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    console.error("Delete Product API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete product',
      error: error.message
    };
  }
};


// Set up storage engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Ensure this directory exists
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// File filter to allow only images
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Only images are allowed'));
//     }
// };

// Initialize multer with storage engine and file filter
// export const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
// });

// Export the PRODUCTS_API_URL instance for other API calls if needed
export default PRODUCTS_API_URL;

// GET all products for admin
export const getAllProductsByAdmin = async () => {
  try {
    const response = await PRODUCTS_API_URL.get('/admin/allProducts');
    
    return {
      success: true,
      data: response.data,
      products: response.data.products || response.data,
      message: 'Admin products fetched successfully'
    };
  } catch (error) {
    console.error("Get All Products By Admin API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch admin products',
      error: error.message
    };
  }
};

// Additional functions for reviews and image uploads can be added here following similar patterns. 

// Add a product review
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await PRODUCTS_API_URL.post(`/${productId}/review`, reviewData);
    
    return {
      success: true,
      data: response.data,
      review: response.data.review || response.data,
      message: 'Review added successfully'
    };
  } catch (error) {
    console.error("Add Product Review API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add review',
      error: error.message
    };
  }
};

// Get product reviews
export const getProductReviews = async (productId) => {
  try {
    const response = await PRODUCTS_API_URL.get(`/${productId}/reviews`);
    
    return {
      success: true,
      data: response.data,
      reviews: response.data.reviews || response.data,
      message: 'Reviews fetched successfully'
    };
  } catch (error) {
    console.error("Get Product Reviews API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch reviews',
      error: error.message
    };
  }
};

// Delete a product review
export const deleteProductReview = async (productId, reviewId) => {
  try {
    const response = await PRODUCTS_API_URL.delete(`/${productId}/reviews/${reviewId}`);
    
    return {
      success: true,
      data: response.data,
      message: 'Review deleted successfully'
    };
  } catch (error) {
    console.error("Delete Product Review API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete review',
      error: error.message
    };
  }
};

// Upload product images
export const uploadProductImages = async (productId, formData) => {
  try {
    const response = await PRODUCTS_API_URL.post(
      `/${productId}/upload-images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return {
      success: true,
      data: response.data,
      images: response.data.images || response.data,
      message: 'Images uploaded successfully'
    };
  } catch (error) {
    console.error("Upload Product Images API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload images',
      error: error.message
    };
  }
};

// Delete product images
export const deleteProductImages = async (productId, imageIds) => {
  try {
    const response = await PRODUCTS_API_URL.delete(`/${productId}/delete-images`, { data: { imageIds } });
    
    return {
      success: true,
      data: response.data,
      message: 'Images deleted successfully'
    };
  } catch (error) {
    console.error("Delete Product Images API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete images',
      error: error.message
    };
  }
};


// order api
const ORDER_API_URL = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/orders`,
  headers: getAuthHeaders()
});
ORDER_API_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const createOrder = async (orderData) => {
  try {
    const response = await ORDER_API_URL.post('/new-order', orderData);
    return {
      success: true,
      message: 'Order created successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Create Order API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create order',
      error: error.message
    };
  }
};
export const getUserOrders = async (userId) => {
  try {
    const response = await ORDER_API_URL.get(`/user/${userId}`);
    return {
      success: true,
      message: 'User orders fetched successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Get User Orders API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user orders',
      error: error.message
    };
  }
};

export const getAllOrders = async () => {
  try {
    const response = await ORDER_API_URL.get('/all');
    return {
      success: true,
      message: 'All orders fetched successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Get All Orders API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch all orders',
      error: error.message
    };
  }
};

// Add offers

export const addProductOffer = async (productId, offerData) => {
  try {
    const response = await PRODUCTS_API_URL.put(`/${productId}/add-offer`, offerData);
    return {
      success: true,
      data: response.data,
      message: 'Product offer added successfully'
    };
  } catch (error) {
    console.error("Add Product Offer API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add product offer',
      error: error.message
    };
  }
};

// Get all products with offers
export const getProductsWithOffers = async () => {
  try {
    const response = await PRODUCTS_API_URL.get('/offers/all');
    return {
      success: true,
      products: response.data.products || [],
      message: response.data.message || 'Offers fetched successfully'
    };
  } catch (error) {
    console.error("Get Products With Offers API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch offers',
      error: error.message
    };
  }
};

// Remove offer from a product (admin only)
export const removeProductOffer = async (productId) => {
  try {
    const response = await PRODUCTS_API_URL.put(`/${productId}/remove-offer`);
    return {
      success: true,
      product: response.data.product,
      message: response.data.message || 'Offer removed successfully'
    };
  } catch (error) {
    console.error("Remove Product Offer API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove offer',
      error: error.message
    };
  }
};