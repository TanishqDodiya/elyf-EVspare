"use client"

import { useSearchParams } from "next/navigation"
import { useCart } from "./cart-provider"
import type { Product } from "@/lib/types"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const searchParams = useSearchParams()
  const search = searchParams.get("q")?.toLowerCase() || ""
  const { addItem } = useCart()
  const filteredProducts = search
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.code.toLowerCase().includes(search)
      )
    : products

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Unit</th>
            <th className="px-4 py-2 text-left">Min Qty</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="px-4 py-2 font-medium">{product.name}</td>
              <td className="px-4 py-2">{product.code}</td>
              <td className="px-4 py-2">₹{product.price.toFixed(2)}</td>
              <td className="px-4 py-2">{product.unit}</td>
              <td className="px-4 py-2">{product.minimumQuantity}</td>
              <td className="px-4 py-2">
                {product.inStock ? (
                  <button
                    onClick={() => addItem(product)}
                    className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50"
                  >
                    <span className="text-lg leading-none">➕</span>
                    Add to Quote
                  </button>
                ) : (
                  <button disabled className="text-gray-500 border border-gray-300 rounded-md px-4 py-2 bg-gray-50">
                    Out of Stock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
