import api from "./api";
import type { Product, Category } from "./types";

// Fetch categories from API
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categories');
    const categories = Array.isArray(response.data) ? response.data : [];
    return categories.map((category: any) => ({
      id: category._id || category.id,
      name: category.name || 'Unknown Category',
      slug: category.slug || 'unknown'
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to static categories
    try {
      const categories = await import('./categories');
      return categories.default;
    } catch (importError) {
      console.error('Error importing static categories:', importError);
      return [];
    }
  }
};

// Fetch products from API
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    const products = Array.isArray(response.data) ? response.data : [];
    return products.map((product: any) => ({
      id: product._id || product.id,
      name: product.name || 'Unknown Product',
      code: product.code || 'N/A',
      description: product.description || '',
      price: product.price || 0,
      unit: product.unit || 'PCS',
      image: product.image || '/placeholder.svg?height=200&width=200',
      category: product.category?.slug || 'unknown',
      minimumQuantity: product.minimumQuantity || 1,
      inStock: product.inStock !== false,
      gst: `${product.gstRate || 18}%`
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return some fallback products if API fails
    return [
      {
        id: "1",
        name: "EV Charger Cable Type 2",
        code: "EVCC001",
        description: "High-quality Type 2 charging cable for electric vehicles",
        price: 299.99,
        unit: "PCS",
        image: "/placeholder.svg?height=200&width=200",
        category: "ev-chargers",
        minimumQuantity: 1,
        inStock: true,
        gst: "18%"
      }
    ];
  }
};

// Fetch single product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const response = await api.get(`/products/${id}`);
    const product = response.data;
    return {
      id: product._id,
      name: product.name,
      code: product.code,
      description: product.description,
      price: product.price,
      unit: product.unit,
      image: product.image || '/placeholder.svg?height=200&width=200',
      category: product.category?.slug || 'unknown',
      minimumQuantity: product.minimumQuantity,
      inStock: product.inStock,
      gst: `${product.gstRate}%`
    };
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return undefined;
  }
};

// Fetch products by category
export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  try {
    const response = await api.get(`/products/category/${categorySlug}`);
    return response.data.map((product: any) => ({
      id: product._id,
      name: product.name,
      code: product.code,
      description: product.description,
      price: product.price,
      unit: product.unit,
      image: product.image || '/placeholder.svg?height=200&width=200',
      category: product.category?.slug || categorySlug,
      minimumQuantity: product.minimumQuantity,
      inStock: product.inStock,
      gst: `${product.gstRate}%`
    }));
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
};

// Legacy export for backward compatibility
export { default as categories } from './categories';
