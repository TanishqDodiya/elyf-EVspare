import ProductCard from "./product-card"
import type { Product } from "@/lib/types"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
