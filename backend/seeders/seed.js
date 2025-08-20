const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config();

// Sample categories data
const categoriesData = [
  { name: "DISC PAD & LEVERS", slug: "disc-pad-levers" },
  { name: "DISC ASSY", slug: "disc-assy" },
  { name: "POWER CONNECTOR (SB 50)", slug: "power-connector-sb-50" },
  { name: "POWER CONNECTOR (IEC & XTs)", slug: "power-connector-iec-xts" },
  { name: "POWER CONNECTOR (CHOKARI)", slug: "power-connector-chokari" },
  { name: "XLRs & CHARGING CABLES", slug: "xlrs-charging-cables" },
  { name: "SILICON CABLES", slug: "silicon-cables" },
  { name: "THROTTLES COMMON", slug: "throttles-common" },
  { name: "THROTTLES PREMIUM", slug: "throttles-premium" },
  { name: "BULBS & LIGHTS", slug: "bulbs-lights" },
  { name: "SPEEDOMETER", slug: "speedometer" },
  { name: "GLASS", slug: "glass" },
  { name: "LINERS & BRAKE CABLES", slug: "liners-brake-cables" },
  { name: "BODY PARTS", slug: "body-parts" },
  { name: "MOTOR & ACCESSORIES", slug: "motor-accessories" },
  { name: "CONTROLLER", slug: "controller" },
  { name: "EV CONVERSION KIT", slug: "ev-conversion-kit" },
  { name: "CONVERTOR & TRANSVERTOR", slug: "convertor-transvertor" },
  { name: "MIRRORS", slug: "mirrors" },
  { name: "BALL RACER & BEARING", slug: "ball-racer-bearing" },
  { name: "ESS CONNECTOR", slug: "ess-connector" },
  { name: "ECYCLE PARTS", slug: "ecycle-parts" },
  { name: "FLASHER MCB & COUPLER", slug: "flasher-mcb-coupler" },
  { name: "FOOTRESTS & IRON PARTS", slug: "footrests-iron-parts" },
  { name: "HANDLE TEE", slug: "handle-tee" },
  { name: "SUSPENSION REAR", slug: "suspension-rear" },
  { name: "IG LOCK", slug: "ig-lock" },
  { name: "OIL SEALS", slug: "oil-seals" },
  { name: "SEAT COVERS", slug: "seat-covers" },
  { name: "SWITCHES", slug: "switches" },
  { name: "TAPES & PAINTS", slug: "tapes-paints" },
  { name: "GREASE", slug: "grease" },
  { name: "TYRES", slug: "tyres" },
  { name: "EV CELL", slug: "ev-cell" },
  { name: "BATTERY METAL BOX", slug: "battery-metal-box" },
  { name: "BMS LFP DALY", slug: "bms-lfp-daly" },
  { name: "BMS DALY NMC", slug: "bms-daly-nmc" },
  { name: "BMS LFP JBD", slug: "bms-lfp-jbd" },
  { name: "BMS NMC JBD", slug: "bms-nmc-jbd" },
  { name: "BATTERY ACCESSORIES", slug: "battery-accessories" },
  { name: "DK MACHINES", slug: "dk-machines" },
  { name: "SUNKKO MACHINES", slug: "sunkko-machines" },
  { name: "TESTING MACHINE", slug: "testing-machine" },
  { name: "MOSFETS & ICS", slug: "mosfets-ics" },
  { name: "EPOXY RESIN BOARD", slug: "epoxy-resin-board" },
  { name: "HST (HEAT SHRINK TUBE)", slug: "hst-heat-shrink-tube" },
  { name: "INSULATION PAPER", slug: "insulation-paper" },
  { name: "NICKEL PLATED", slug: "nickel-plated" },
  { name: "PVC", slug: "pvc" },
];

// Sample products data
const getProductsData = (categories) => [
  {
    name: "EV Charger Cable Type 2",
    code: "EVCC001",
    description: "High-quality Type 2 charging cable for electric vehicles",
    price: 299.99,
    unit: "PCS",
    category: categories.find(c => c.slug === "xlrs-charging-cables")?._id,
    minimumQuantity: 1,
    stockQuantity: 50,
    gstRate: 18
  },
  {
    name: "Battery Management System",
    code: "BMS001",
    description: "Advanced BMS for lithium-ion battery packs",
    price: 599.99,
    unit: "PCS",
    category: categories.find(c => c.slug === "bms-lfp-daly")?._id,
    minimumQuantity: 1,
    stockQuantity: 25,
    gstRate: 18
  },
  {
    name: "Motor Controller",
    code: "MC001",
    description: "High-performance motor controller for EVs",
    price: 899.99,
    unit: "PCS",
    category: categories.find(c => c.slug === "controller")?._id,
    minimumQuantity: 1,
    stockQuantity: 15,
    gstRate: 18
  },
  {
    name: "Silicon Cable 14AWG",
    code: "SC001",
    description: "High-temperature silicon cable for EV applications",
    price: 89.90,
    unit: "MTR",
    category: categories.find(c => c.slug === "silicon-cables")?._id,
    minimumQuantity: 5,
    stockQuantity: 100,
    gstRate: 18
  },
  {
    name: "LED Headlight Bulb",
    code: "LED001",
    description: "High-brightness LED headlight bulb for electric vehicles",
    price: 149.99,
    unit: "PCS",
    category: categories.find(c => c.slug === "bulbs-lights")?._id,
    minimumQuantity: 2,
    stockQuantity: 75,
    gstRate: 18
  },
  {
    name: "Digital Speedometer",
    code: "SPD001",
    description: "Digital speedometer with LCD display",
    price: 249.99,
    unit: "PCS",
    category: categories.find(c => c.slug === "speedometer")?._id,
    minimumQuantity: 1,
    stockQuantity: 30,
    gstRate: 18
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ev-spare-parts');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`Inserted ${categories.length} categories`);

    // Insert products
    const productsData = getProductsData(categories);
    const products = await Product.insertMany(productsData);
    console.log(`Inserted ${products.length} products`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();