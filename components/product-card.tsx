"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { useCart } from "./cart-provider"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToQuote = () => {
    addItem(product)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 border-b pb-6">
      <div className="w-full md:w-32 h-32 relative">
        <Image
          src={product.image || "/placeholder.svg?height=128&width=128"}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.code}</p>

        <div className="mt-2">
          <p className="text-sm">Minimum quantity</p>
          <p className="font-medium">{product.minimumQuantity}</p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <p className="text-xl font-bold">₹{product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">/ {product.unit}</p>
        </div>

        {product.inStock ? (
          <button
            onClick={handleAddToQuote}
            className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50"
          >
            <Plus size={16} />
            Add to Quote
          </button>
        ) : (
          <button disabled className="text-gray-500 border border-gray-300 rounded-md px-4 py-2 bg-gray-50">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
}
