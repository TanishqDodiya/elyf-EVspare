# Frontend Integration Guide

This guide explains how to integrate your existing Next.js frontend with the new backend API.

## Quick Setup

### 1. Install Axios (Recommended)

```bash
cd ..  # Go back to root directory
npm install axios
```

### 2. Create API Service

Create a new file `lib/api.js` in your frontend:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Update Environment Variables

Add to your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Integration Examples

### Fetching Categories

Replace your static data import with API call:

```javascript
// Before (static data)
import { categories } from "@/lib/data"

// After (API call)
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;

  return (
    // Your existing sidebar JSX
  );
}
```

### Fetching Products

```javascript
// Before (static data)
import { products } from "@/lib/data"

// After (API call)
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ProductList({ categorySlug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/products';
        if (categorySlug) {
          // First get category ID by slug
          const categoryResponse = await api.get(`/categories/slug/${categorySlug}`);
          const categoryId = categoryResponse.data.data._id;
          url = `/products/category/${categoryId}`;
        }
        
        const response = await api.get(url);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  if (loading) return <div>Loading products...</div>;

  return (
    // Your existing product list JSX
  );
}
```

### Creating Orders

Update your checkout component:

```javascript
import { useState } from 'react';
import api from '@/lib/api';
import { useCart } from '@/components/cart-provider';

export default function CheckoutDetails() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        paymentMethod: 'cod'
      };

      const response = await api.post('/orders', orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      alert('Order placed successfully! Order number: ' + response.data.data.orderNumber);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error placing order: ' + error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your existing form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}
```

## Authentication Integration

### Login Component

```javascript
import { useState } from 'react';
import api from '@/lib/api';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (error) {
      alert('Login failed: ' + error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Data Structure Mapping

### Frontend to Backend Mapping

| Frontend Field | Backend Field | Notes |
|----------------|---------------|-------|
| `product.id` | `product._id` | MongoDB ObjectId |
| `product.category` | `product.category.slug` | Use category slug for routing |
| `product.price` | `product.price` | Base price without GST |
| `product.priceWithGST` | `product.priceWithGST` | Virtual field with GST |

### API Response Format

All API responses follow this format:

```javascript
{
  success: true,
  data: [...], // or single object
  message: "Optional message",
  pagination: { // for paginated responses
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }
}
```

## Error Handling

```javascript
try {
  const response = await api.get('/products');
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.request);
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

## Migration Checklist

- [ ] Install axios: `npm install axios`
- [ ] Create `lib/api.js` service file
- [ ] Update environment variables
- [ ] Replace static data imports with API calls
- [ ] Update product/category components
- [ ] Implement order creation
- [ ] Add authentication (if needed)
- [ ] Test all functionality
- [ ] Handle loading states
- [ ] Add error handling

## Testing the Integration

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Test API endpoints: `http://localhost:5000/api/health`
4. Verify data loading in frontend
5. Test order creation
6. Test authentication (if implemented)

## Common Issues

### CORS Errors
- Ensure backend CORS is configured for `http://localhost:3000`
- Check environment variables

### Authentication Errors
- Verify JWT token is being sent in headers
- Check token expiration

### Data Mapping Issues
- Verify API response structure matches frontend expectations
- Check field name differences (e.g., `id` vs `_id`)

## Next Steps

1. **Admin Dashboard**: Create admin interface for managing products/orders
2. **Image Upload**: Implement product image upload functionality
3. **Search**: Add product search functionality
4. **Pagination**: Implement pagination for large product lists
5. **Real-time Updates**: Add WebSocket support for order status updates 