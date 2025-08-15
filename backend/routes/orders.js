const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// Validation middleware
const validateOrder = [
  body('customer.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid customer email is required'),
  body('customer.phone').trim().notEmpty().withMessage('Customer phone is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod').optional().isIn(['cod', 'online', 'bank_transfer']).withMessage('Invalid payment method'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

// GET /api/orders - Get orders (Admin only)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  query('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.email) {
      filter['customer.email'] = req.query.email.toLowerCase();
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name code price unit image')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: orders,
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
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/orders/customer/:email - Get orders by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const orders = await Order.findByCustomerEmail(req.params.email);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name code price unit image category');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/orders - Create new order
router.post('/', validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, customer, shippingAddress, paymentMethod, notes } = req.body;

    // Validate and fetch products
    const orderItems = [];
    let subtotal = 0;
    let gstAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ 
          success: false, 
          message: `Product with ID ${item.product} not found` 
        });
      }

      if (!product.inStock) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${product.name} is out of stock` 
        });
      }

      if (item.quantity < product.minimumQuantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Minimum quantity for ${product.name} is ${product.minimumQuantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      const itemGST = (itemTotal * product.gstRate) / 100;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        unit: product.unit,
        gstRate: product.gstRate
      });

      subtotal += itemTotal;
      gstAmount += itemGST;
    }

    const totalAmount = subtotal + gstAmount;

    const order = new Order({
      customer,
      shippingAddress,
      items: orderItems,
      subtotal,
      gstAmount,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      notes
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name code price unit image category');

    res.status(201).json({ 
      success: true, 
      data: populatedOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string'),
  body('estimatedDelivery').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = req.body.status;
    
    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }
    
    if (req.body.estimatedDelivery) {
      order.estimatedDelivery = new Date(req.body.estimatedDelivery);
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name code price unit image category');

    res.json({ 
      success: true, 
      data: updatedOrder,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/orders/:id/payment-status - Update payment status (Admin only)
router.put('/:id/payment-status', [
  body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.json({ 
      success: true, 
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router; 