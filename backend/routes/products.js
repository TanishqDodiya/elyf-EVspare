const express = require('express');
const router = express.Router();

// Static product data (simplified version of your products_fixed.ts)
const products = [
  {
    id: "1",
    name: "EV Charger Cable Type 2",
    code: "EVCC001",
    description: "High-quality Type 2 charging cable for electric vehicles",
    price: 299.99,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    category: "ev-chargers",
    minimumQuantity: 1,
    inStock: true,
    gst: "18%"
  },
  {
    id: "2",
    name: "Battery Management System",
    code: "BMS001",
    description: "Advanced BMS for lithium-ion battery packs",
    price: 599.99,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    category: "battery-systems",
    minimumQuantity: 1,
    inStock: true,
    gst: "18%"
  },
  {
    id: "3",
    name: "Motor Controller",
    code: "MC001",
    description: "High-performance motor controller for EVs",
    price: 899.99,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    category: "motor-systems",
    minimumQuantity: 1,
    inStock: true,
    gst: "18%"
  },
  {
    id: "4",
    name: "Silicon Cable 14AWG",
    code: "SC001",
    description: "High-temperature silicon cable for EV applications",
    price: 89.90,
    unit: "MTR",
    image: "/placeholder.svg?height=200&width=200",
    category: "silicon-cables",
    minimumQuantity: 5,
    inStock: true,
    gst: "18%"
  }
];

// GET /api/products - Get all products with filtering and pagination
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter object
    let filteredProducts = [...products];
    
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(p => p.category === req.query.category);
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
    
    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
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
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const categoryProducts = products.filter(p => p.category === req.params.category);
    
    res.json({
      success: true,
      data: categoryProducts,
      total: categoryProducts.length
    });
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