const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: true
  },
  gstRate: {
    type: Number,
    default: 18
  }
}, {
  timestamps: true
});

// Virtual for item total with GST
orderItemSchema.virtual('totalWithGST').get(function() {
  return (this.price * this.quantity) + ((this.price * this.quantity * this.gstRate) / 100);
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true
    }
  },
  shippingAddress: {
    address: {
      type: String,
      required: [true, 'Shipping address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true
    }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  gstAmount: {
    type: Number,
    required: true,
    min: [0, 'GST amount cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'bank_transfer'],
    default: 'cod'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  estimatedDelivery: {
    type: Date
  },
  trackingNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order summary
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for formatted amounts
orderSchema.virtual('formattedSubtotal').get(function() {
  return `₹${this.subtotal.toFixed(2)}`;
});

orderSchema.virtual('formattedGSTAmount').get(function() {
  return `₹${this.gstAmount.toFixed(2)}`;
});

orderSchema.virtual('formattedTotalAmount').get(function() {
  return `₹${this.totalAmount.toFixed(2)}`;
});

// Indexes for better query performance
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const orderCount = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    this.orderNumber = `EV${year}${month}${day}${String(orderCount + 1).padStart(4, '0')}`;
  }
  next();
});

// Static method to get orders by customer email
orderSchema.statics.findByCustomerEmail = function(email) {
  return this.find({ 'customer.email': email }).populate('items.product').sort({ createdAt: -1 });
};

// Static method to get orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('items.product').sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema); 