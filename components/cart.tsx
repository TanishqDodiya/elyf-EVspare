"use client"

import { Minus, Plus, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "./cart-provider"

export default function Cart() {
  const { items, updateItemQuantity, removeItem, totalPrice } = useCart()

  return (
    <div className="h-full p-4 md:p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Cart</h2>
        {items.length > 0 && (
          <button
            onClick={() => items.forEach((item) => removeItem(item.id))}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 py-3 border-b">
                <div className="relative w-16 h-16">
                  <Image
                    src={item.image || "/placeholder.svg?height=64&width=64"}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{item.code}</p>
                  <p className="font-medium">
                    ₹{item.price.toFixed(2)} / {item.unit}
                  </p>

                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="w-10 h-8 flex items-center justify-center border-t border-b">{item.quantity}</div>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 rounded-md text-center block font-medium hover:bg-blue-700"
            >
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
