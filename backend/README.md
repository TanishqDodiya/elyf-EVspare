# EV Spare Parts Backend API

A robust Node.js/Express.js backend API for the Maa Ashapura Enterprise EV Spare Parts e-commerce platform.

## Features

- **Product Management**: CRUD operations for products with categories
- **Order Management**: Complete order lifecycle with status tracking
- **User Authentication**: JWT-based authentication with role-based access
- **Category Management**: Product categorization and filtering
- **GST Integration**: Built-in GST calculation for Indian market
- **Search & Filtering**: Advanced product search and filtering capabilities
- **Pagination**: Efficient data pagination for large datasets
- **Validation**: Comprehensive input validation and error handling
- **Security**: Rate limiting, CORS, and security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example file
   cp env.example .env
   
   # Edit .env file with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Seed Database**
   ```bash
   # Populate database with sample data
   node seeders/seedData.js
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ev-spare-parts
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/ev-spare-parts

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products
- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/customer/:email` - Get orders by customer email
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/payment-status` - Update payment status (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/:id/activate` - Activate user (Admin only)
- `PUT /api/users/:id/deactivate` - Deactivate user (Admin only)

### Health Check
- `GET /api/health` - API health check

## Data Models

### Product
```javascript
{
  name: String,           // Product name
  code: String,           // Unique product code
  description: String,    // Product description
  price: Number,          // Base price
  unit: String,           // Unit (PCS, SET, PAIR, etc.)
  image: String,          // Product image URL
  category: ObjectId,     // Category reference
  minimumQuantity: Number, // Minimum order quantity
  inStock: Boolean,       // Stock availability
  stockQuantity: Number,  // Available stock
  gstRate: Number,        // GST percentage
  isActive: Boolean,      // Product status
  featured: Boolean,      // Featured product flag
  specifications: Map,    // Product specifications
  tags: [String]          // Product tags
}
```

### Category
```javascript
{
  name: String,           // Category name
  slug: String,           // URL-friendly slug
  description: String,    // Category description
  image: String,          // Category image URL
  isActive: Boolean       // Category status
}
```

### Order
```javascript
{
  orderNumber: String,    // Unique order number
  customer: {             // Customer information
    name: String,
    email: String,
    phone: String
  },
  shippingAddress: {      // Shipping address
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  items: [OrderItem],     // Order items
  subtotal: Number,       // Subtotal amount
  gstAmount: Number,      // GST amount
  totalAmount: Number,    // Total amount
  status: String,         // Order status
  paymentStatus: String,  // Payment status
  paymentMethod: String,  // Payment method
  notes: String,          // Order notes
  estimatedDelivery: Date, // Estimated delivery date
  trackingNumber: String  // Tracking number
}
```

## Frontend Integration

The backend is designed to work seamlessly with your existing Next.js frontend. Key integration points:

1. **API Base URL**: Configure your frontend to use `http://localhost:5000/api`
2. **CORS**: Backend is configured to accept requests from `http://localhost:3000`
3. **Data Structure**: API responses match your frontend data models
4. **Authentication**: JWT tokens for secure API access

## Default Admin Credentials

After running the seeder:
- **Email**: admin@maaashapura.com
- **Password**: admin123

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### File Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── seeders/         # Database seeders
├── uploads/         # File uploads
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # Documentation
```

## Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **Password Hashing**: Secure password storage
- **JWT Authentication**: Stateless authentication

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use production MongoDB URI
   - Set strong JWT secret
   - Configure CORS origin

2. **Process Management**
   - Use PM2 or similar process manager
   - Set up proper logging
   - Configure monitoring

3. **Security**
   - Use HTTPS
   - Set up firewall rules
   - Regular security updates
   - Database backup strategy

## Support

For support and questions, please contact the development team.

## License

This project is proprietary software for Maa Ashapura Enterprise. 