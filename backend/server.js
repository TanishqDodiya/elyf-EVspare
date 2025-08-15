const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EV Spare Parts API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// --- MongoDB Connection (Commented out for now) ---
// require('dotenv').config();
// console.log('MongoDB URI from env:', `'${process.env.MONGODB_URI}'`);

// const mongooseOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // poolSize: 10, // Uncomment to control connection pool size
//   serverSelectionTimeoutMS: 5000, // Fail fast if cannot connect
// };

// mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//       console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//     });
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   });

// Start server without MongoDB for now
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Note: Running without MongoDB connection');
});

// Graceful shutdown for MongoDB
// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('MongoDB connection closed due to app termination (SIGINT)');
//   process.exit(0);
// });
// process.on('SIGTERM', async () => {
//   await mongoose.connection.close();
//   console.log('MongoDB connection closed due to app termination (SIGTERM)');
//   process.exit(0);
// });

module.exports = app; 