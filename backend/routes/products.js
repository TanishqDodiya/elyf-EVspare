const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Try to import models, fallback to static data if MongoDB is not available
let Product, Category;
try {
  Product = require('../models/Product');
  Category = require('../models/Category');
} catch (error) {
  console.warn('MongoDB models not available, using static data');
}

// Static product data (fallback when MongoDB is not available)
const staticProducts = [
  {
    _id: "1",
    name: "EV Charger Cable Type 2",
    code: "EVCC001",
    description: "High-quality Type 2 charging cable for electric vehicles",
    price: 299.99,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    category: { _id: "1", name: "EV Chargers", slug: "ev-chargers" },
    minimumQuantity: 1,
    stockQuantity: 50,
    gstRate: 18,
    inStock: true,
    isActive: true
  },
  {
    _id: "2",
    name: "Battery Management System",
    code: "BMS001",
    description: "Advanced BMS for lithium-ion battery packs",
    price: 599.99,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    category: { _id: "2", name: "Battery Systems", slug: "battery-systems" },
    minimumQuantity: 1,
    stockQuantity: 25,
    gstRate: 18,
    inStock: true,
    isActive: true
  },
  {
    _id: "3",
    name: "Motor Controller",
    code: "MC001",
    description: "High-performance motor controller for EVs",
    price: 899.99,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    category: { _id: "3", name: "Motor Systems", slug: "motor-systems" },
    minimumQuantity: 1,
    stockQuantity: 15,
    gstRate: 18,
    inStock: true,
    isActive: true
  },
  {
    _id: "4",
    name: "Silicon Cable 14AWG",
    code: "SC001",
    description: "High-temperature silicon cable for EV applications",
    price: 89.90,
    unit: "MTR",
    image: "/placeholder.svg?height=200&width=200",
    category: { _id: "4", name: "Silicon Cables", slug: "silicon-cables" },
    minimumQuantity: 5,
    stockQuantity: 100,
    gstRate: 18,
    inStock: true,
    isActive: true
  }
];

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1 && Product && Category;
};

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    let products, total;

    if (isMongoConnected()) {
      // Use MongoDB
      const filter = { isActive: true };
      
      if (req.query.category) {
        filter['category.slug'] = req.query.category;
      }
      
      if (req.query.inStock !== undefined) {
        filter.inStock = req.query.inStock === 'true';
      }
      
      if (req.query.search) {
        const searchTerm = req.query.search;
        filter.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { code: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      products = await Product.find(filter)
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      total = await Product.countDocuments(filter);
    } else {
      // Use static data
      let filteredProducts = [...staticProducts];
      
      if (req.query.category) {
        filteredProducts = filteredProducts.filter(p => p.category.slug === req.query.category);
      }
      
      if (req.query.inStock !== undefined) {
        const inStock = req.query.inStock === 'true';
        filteredProducts = filteredProducts.filter(p => p.inStock === inStock);
      }
      
      if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.code.toLowerCase().includes(searchTerm) ||
          (p.description && p.description.toLowerCase().includes(searchTerm))
        );
      }
      
      total = filteredProducts.length;
      products = filteredProducts.slice(skip, skip + limit);
    }
    
    const totalPages = Math.ceil(total / limit);

    // Return products directly (not wrapped in success/data structure)
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  try {
    let product;

    if (isMongoConnected()) {
      product = await Product.findById(req.params.id).populate('category', 'name slug');
    } else {
      product = staticProducts.find(p => p._id === req.params.id);
    }
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/products/category/:category - Get products by category slug
router.get('/category/:categorySlug', async (req, res) => {
  try {
    let products;

    if (isMongoConnected()) {
      // First find the category by slug
      const category = await Category.findOne({ slug: req.params.categorySlug });
      if (!category) {
        return res.json([]); // Return empty array if category not found
      }
      
      products = await Product.find({ 
        category: category._id, 
        isActive: true 
      }).populate('category', 'name slug');
    } else {
      products = staticProducts.filter(p => p.category.slug === req.params.categorySlug);
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 