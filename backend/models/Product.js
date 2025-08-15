const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Product code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Product unit is required'],
    enum: ['PCS', 'SET', 'PAIR', 'KG', 'METER', 'LITER'],
    default: 'PCS'
  },
  image: {
    type: String,
    default: '/placeholder.svg?height=200&width=200'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  minimumQuantity: {
    type: Number,
    required: [true, 'Minimum quantity is required'],
    min: [1, 'Minimum quantity must be at least 1'],
    default: 1
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  gstRate: {
    type: Number,
    default: 18,
    min: [0, 'GST rate cannot be negative'],
    max: [100, 'GST rate cannot exceed 100%']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  specifications: {
    type: Map,
    of: String
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for price with GST
productSchema.virtual('priceWithGST').get(function() {
  return this.price + (this.price * this.gstRate / 100);
});

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toFixed(2)}`;
});

// Virtual for formatted price with GST
productSchema.virtual('formattedPriceWithGST').get(function() {
  return `₹${this.priceWithGST.toFixed(2)}`;
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ isActive: 1 });

// Pre-save middleware to update inStock based on stockQuantity
productSchema.pre('save', function(next) {
  if (this.stockQuantity <= 0) {
    this.inStock = false;
  } else {
    this.inStock = true;
  }
  next();
});

// Static method to get products by category
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, isActive: true }).populate('category');
};

// Static method to get featured products
productSchema.statics.findFeatured = function() {
  return this.find({ featured: true, isActive: true }).populate('category');
};

// Static method to search products
productSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { code: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  }).populate('category');
};

module.exports = mongoose.model('Product', productSchema); 