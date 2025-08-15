const mongoose = require('mongoose');
const { categories, products } = require('./evChargerData');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories inserted');

    // Create a map of category slugs to their IDs
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Map products with correct category IDs
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Insert products
    await Product.insertMany(productsWithCategories);
    console.log('Products inserted');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 