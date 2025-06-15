export interface Category {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  code: string
  description?: string
  price: number
  unit: string
  image: string
  category: string
  minimumQuantity: number
  inStock: boolean
}

export interface CartItem extends Product {
  quantity: number
}
