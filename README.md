# EV Spare Parts E-commerce Platform

A full-stack e-commerce platform for electric vehicle spare parts built with Next.js, Express.js, and MongoDB.

## Features

- 🛒 **Shopping Cart**: Add/remove items, quantity management
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔍 **Product Search**: Search products by name or code
- 📂 **Category Navigation**: Browse products by categories
- 📋 **Order Management**: Place orders with customer details
- 💬 **WhatsApp Integration**: Direct order placement via WhatsApp
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- 🔄 **Real-time Updates**: Dynamic product and category loading
- 📊 **Admin API**: RESTful API for managing products, categories, and orders

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elyf-evspare-clone
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run install:backend
   ```

3. **Environment Setup**
   
   The project includes pre-configured `.env` files:
   - `.env.local` (frontend)
   - `backend/.env` (backend)
   
   Update MongoDB connection string if needed:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ev-spare-parts
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually:
   # Frontend: npm run dev
   # Backend: npm run dev:backend
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health check: http://localhost:5000/api/health

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── category/          # Category pages
│   ├── checkout/          # Checkout page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── backend/               # Express.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── seeders/          # Database seeders
│   └── server.js         # Express server
├── components/           # React components
├── lib/                 # Utility functions and API client
├── public/              # Static assets
└── styles/              # Additional styles
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:slug` - Get products by category

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

## Development

### Adding New Products
1. Use the database seeder or add directly to MongoDB
2. Products automatically appear in the frontend

### Adding New Categories
1. Add to the categories collection in MongoDB
2. Update the sidebar component if needed

### Customizing the UI
- Modify components in the `components/` directory
- Update styles in `app/globals.css` or component files
- Use Tailwind CSS classes for styling

## Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Create a new app on your hosting platform
2. Set environment variables
3. Deploy the `backend` directory

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Run the seeder to populate data

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```env
MONGODB_URI=mongodb://localhost:27017/ev-spare-parts
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
PORT=5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.