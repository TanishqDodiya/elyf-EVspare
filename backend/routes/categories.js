const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Try to import models, fallback to static data if MongoDB is not available
let Category;
try {
  Category = require('../models/Category');
} catch (error) {
  console.warn('MongoDB models not available, using static data');
}

// Static category data (fallback when MongoDB is not available)
const staticCategories = [
  { _id: "1", name: "DISC PAD & LEVERS", slug: "disc-pad-levers" },
  { _id: "2", name: "DISC ASSY", slug: "disc-assy" },
  { _id: "3", name: "POWER CONNECTOR (SB 50)", slug: "power-connector-sb-50" },
  { _id: "4", name: "POWER CONNECTOR (IEC & XTs)", slug: "power-connector-iec-xts" },
  { _id: "5", name: "POWER CONNECTOR (CHOKARI)", slug: "power-connector-chokari" },
  { _id: "6", name: "XLRs & CHARGING CABLES", slug: "xlrs-charging-cables" },
  { _id: "7", name: "SILICON CABLES", slug: "silicon-cables" },
  { _id: "8", name: "THROTTLES COMMON", slug: "throttles-common" },
  { _id: "9", name: "THROTTLES PREMIUM", slug: "throttles-premium" },
  { _id: "10", name: "BULBS & LIGHTS", slug: "bulbs-lights" },
  { _id: "11", name: "SPEEDOMETER", slug: "speedometer" },
  { _id: "12", name: "GLASS", slug: "glass" },
  { _id: "13", name: "LINERS & BRAKE CABLES", slug: "liners-brake-cables" },
  { _id: "14", name: "BODY PARTS", slug: "body-parts" },
  { _id: "15", name: "MOTOR & ACCESSORIES", slug: "motor-accessories" },
  { _id: "16", name: "CONTROLLER", slug: "controller" },
  { _id: "17", name: "EV CONVERSION KIT", slug: "ev-conversion-kit" },
  { _id: "25", name: "CONVERTOR & TRANSVERTOR", slug: "convertor-transvertor" },
  { _id: "26", name: "MIRRORS", slug: "mirrors" },
  { _id: "27", name: "BALL RACER & BEARING", slug: "ball-racer-bearing" },
  { _id: "28", name: "ESS CONNECTOR", slug: "ess-connector" },
  { _id: "29", name: "ECYCLE PARTS", slug: "ecycle-parts" },
  { _id: "30", name: "FLASHER MCB & COUPLER", slug: "flasher-mcb-coupler" },
  { _id: "31", name: "FOOTRESTS & IRON PARTS", slug: "footrests-iron-parts" },
  { _id: "34", name: "HANDLE TEE", slug: "handle-tee" },
  { _id: "35", name: "SUSPENSION REAR", slug: "suspension-rear" },
  { _id: "36", name: "IG LOCK", slug: "ig-lock" },
  { _id: "37", name: "OIL SEALS", slug: "oil-seals" },
  { _id: "38", name: "SEAT COVERS", slug: "seat-covers" },
  { _id: "39", name: "SWITCHES", slug: "switches" },
  { _id: "40", name: "TAPES & PAINTS", slug: "tapes-paints" },
  { _id: "41", name: "GREASE", slug: "grease" },
  { _id: "42", name: "TYRES", slug: "tyres" },
  { _id: "43", name: "EV CELL", slug: "ev-cell" },
  { _id: "44", name: "BATTERY METAL BOX", slug: "battery-metal-box" },
  { _id: "45", name: "BMS LFP DALY", slug: "bms-lfp-daly" },
  { _id: "46", name: "BMS DALY NMC", slug: "bms-daly-nmc" },
  { _id: "47", name: "BMS LFP JBD", slug: "bms-lfp-jbd" },
  { _id: "48", name: "BMS NMC JBD", slug: "bms-nmc-jbd" },
  { _id: "49", name: "BATTERY ACCESSORIES", slug: "battery-accessories" },
  { _id: "50", name: "DK MACHINES", slug: "dk-machines" },
  { _id: "51", name: "SUNKKO MACHINES", slug: "sunkko-machines" },
  { _id: "52", name: "TESTING MACHINE", slug: "testing-machine" },
  { _id: "53", name: "MOSFETS & ICS", slug: "mosfets-ics" },
  { _id: "54", name: "EPOXY RESIN BOARD", slug: "epoxy-resin-board" },
  { _id: "55", name: "HST (HEAT SHRINK TUBE)", slug: "hst-heat-shrink-tube" },
  { _id: "56", name: "INSULATION PAPER", slug: "insulation-paper" },
  { _id: "57", name: "NICKEL PLATED", slug: "nickel-plated" },
  { _id: "58", name: "PVC", slug: "pvc" },
];

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1 && Category;
};

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    let categories;

    if (isMongoConnected()) {
      categories = await Category.find({ isActive: true }).sort({ name: 1 });
    } else {
      categories = staticCategories;
    }

    res.json(categories);
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
router.get('/:id', async (req, res) => {
  try {
    let category;

    if (isMongoConnected()) {
      category = await Category.findById(req.params.id);
    } else {
      category = staticCategories.find(c => c._id === req.params.id);
    }
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json(category);
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
router.get('/slug/:slug', async (req, res) => {
  try {
    let category;

    if (isMongoConnected()) {
      category = await Category.findOne({ slug: req.params.slug });
    } else {
      category = staticCategories.find(c => c.slug === req.params.slug);
    }
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json(category);
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