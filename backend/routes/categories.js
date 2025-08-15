const express = require('express');
const router = express.Router();

// Static category data
const categories = [
  {
    id: "1",
    name: "EV Chargers",
    slug: "ev-chargers",
    description: "Electric vehicle charging equipment and accessories",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: "2",
    name: "Battery Systems",
    slug: "battery-systems",
    description: "Battery management systems and related components",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: "3",
    name: "Motor Systems",
    slug: "motor-systems",
    description: "Electric motor controllers and related systems",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: "4",
    name: "Silicon Cables",
    slug: "silicon-cables",
    description: "High-temperature silicon cables for EV applications",
    image: "/placeholder.svg?height=200&width=200"
  }
];

// GET /api/categories - Get all categories
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/categories/:id - Get category by ID
router.get('/:id', (req, res) => {
  try {
    const category = categories.find(c => c.id === req.params.id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', (req, res) => {
  try {
    const category = categories.find(c => c.slug === req.params.slug);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 