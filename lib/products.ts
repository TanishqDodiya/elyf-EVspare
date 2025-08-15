import type { Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products.map((product: any) => ({
      id: product._id,
      name: product.name,
      code: product.code,
      price: product.price,
      unit: product.unit,
      image: product.image || '/placeholder.svg?height=200&width=200',
      category: product.category.slug,
      minimumQuantity: product.minimumQuantity,
      inStock: product.stockQuantity > 0,
      gst: `${product.gstRate}%`
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const product = await response.json();
    return {
      id: product._id,
      name: product.name,
      code: product.code,
      price: product.price,
      unit: product.unit,
      image: product.image || '/placeholder.svg?height=200&width=200',
      category: product.category.slug,
      minimumQuantity: product.minimumQuantity,
      inStock: product.stockQuantity > 0,
      gst: `${product.gstRate}%`
    };
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return undefined;
  }
};

export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products?category=${categorySlug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const products = await response.json();
    return products.map((product: any) => ({
      id: product._id,
      name: product.name,
      code: product.code,
      price: product.price,
      unit: product.unit,
      image: product.image || '/placeholder.svg?height=200&width=200',
      category: product.category.slug,
      minimumQuantity: product.minimumQuantity,
      inStock: product.stockQuantity > 0,
      gst: `${product.gstRate}%`
    }));
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
};