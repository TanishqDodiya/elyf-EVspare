const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Validation middleware
const validateUserUpdate = [
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('role').optional().isIn(['admin', 'manager', 'staff']).withMessage('Invalid role'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

// GET /api/users - Get all users (Admin only)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['admin', 'manager', 'staff']).withMessage('Invalid role'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
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
    
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const users = await User.find(filter)
      .select('-password -passwordResetToken -passwordResetExpires')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: users,
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
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/users/:id - Get single user (Admin only)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -passwordResetToken -passwordResetExpires');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', validateUserUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user fields
    Object.assign(user, req.body);
    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password -passwordResetToken -passwordResetExpires');

    res.json({ 
      success: true, 
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();

    res.json({ 
      success: true, 
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/users/:id/activate - Activate user (Admin only)
router.put('/:id/activate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.json({ 
      success: true, 
      message: 'User activated successfully'
    });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/users/:id/deactivate - Deactivate user (Admin only)
router.put('/:id/deactivate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ 
      success: true, 
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router; 