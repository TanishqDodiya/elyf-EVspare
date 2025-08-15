const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

// Sample data from your front-end
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
];

const productsData = [
  {
    name: "DISC PAD [DP01 COMMON] (+GST 28%)",
    code: "(04e0)",
    price: 25.9,
    unit: "SET",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-pad-levers",
    minimumQuantity: 10,
    inStock: true,
    gstRate: 28,
  },
  {
    name: "DISC PAD [DP101 HEAVY] (+GST 28%)",
    code: "(0e55)",
    price: 49.9,
    unit: "SET",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-pad-levers",
    minimumQuantity: 5,
    inStock: true,
    gstRate: 28,
  },
  {
    name: "DISC PAD [DP02] (+GST 28%)",
    code: "(04dd)",
    price: 49.9,
    unit: "SET",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-pad-levers",
    minimumQuantity: 5,
    inStock: false,
    gstRate: 28,
  },
  {
    name: "[CHARGER TESTER] (+GST 18%)",
    code: "(1c1e)",
    price: 399,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "power-connector-sb-50",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "[IMP 67.2V+6A] LITHIUM CHARGER (+GST 5%)",
    code: "(0268)",
    price: 1025,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "xlrs-charging-cables",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 5,
  },
  {
    name: "13 INCH HYDRAULIC BLUE CAP",
    code: "(s001)",
    price: 899,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "12 INCH ADJUSTABLE BLK INDIAN",
    code: "(s002)",
    price: 799,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "12 INCH ADJUSTABLE WHITE INDIAN",
    code: "(s003)",
    price: 799,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "12 INCH ADJUSTABLE GRN INDIAN",
    code: "(s004)",
    price: 799,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "OKIWAWA INDIAN",
    code: "(s005)",
    price: 899,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "OALA INDIAN",
    code: "(s006)",
    price: 899,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "15 INCH DOUBLE SPRING",
    code: "(s007)",
    price: 999,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "13 INCH ORANGE LINE",
    code: "(s008)",
    price: 899,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "LOADER 10.5 INCH BLK",
    code: "(s009)",
    price: 799,
    unit: "PAIR",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "E1] EV Lead Acid Charger (Low Cost)",
    code: "(c001)",
    price: 399,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "xlrs-charging-cables",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "E2] EV Lead Acid Charger (Leaf)",
    code: "(c002)",
    price: 499,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "xlrs-charging-cables",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "E3] EV Lead Acid Charger (Percent)",
    code: "(c003)",
    price: 599,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "xlrs-charging-cables",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "E4] EV Lead Acid Charger (Pulse)",
    code: "(c004)",
    price: 699,
    unit: "PCS",
    image: "/placeholder.svg?height=200&width=200",
    categorySlug: "xlrs-charging-cables",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 18,
  },
  {
    name: "INNER FENDER OKIWA BIG (+GST 28%)",
    code: "(2c3c)",
    price: 79.90,
    unit: "PCS",
    image: "/inner-fender-okiwa.jpg",
    categorySlug: "disc-assy",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 28,
  },
];

const adminUser = {
  name: "Admin User",
  email: "admin@maaashapura.com",
  password: "admin123",
  role: "admin",
  phone: "+91-9876543210"
};

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ev-spare-parts');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });
    console.log('Cleared existing data');

    // Create categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`Created ${categories.length} categories`);

    // Create category slug to ID mapping
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.slug] = category._id;
    });

    // Create products with category references
    const productsWithCategories = productsData.map(product => ({
      ...product,
      category: categoryMap[product.categorySlug],
      stockQuantity: product.inStock ? 100 : 0 // Set default stock quantity
    }));

    // Remove categorySlug from products
    const productsToInsert = productsWithCategories.map(({ categorySlug, ...product }) => product);
    
    const products = await Product.insertMany(productsToInsert);
    console.log(`Created ${products.length} products`);

    // Create admin user
    const user = new User(adminUser);
    await user.save();
    console.log('Created admin user');

    console.log('Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    console.log('\nAPI Endpoints:');
    console.log('GET /api/health - Health check');
    console.log('GET /api/categories - Get all categories');
    console.log('GET /api/products - Get all products');
    console.log('POST /api/auth/login - Admin login');
    console.log('POST /api/orders - Create order');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData; 