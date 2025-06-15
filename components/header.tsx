"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-provider"

export default function Header() {
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Maa Ashapura Enterprise"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">Maa Ashapura Enterprise</span>
        </Link>

        <div className="hidden md:flex items-center relative w-full max-w-md mx-4">
          <input type="search" placeholder="Search" className="w-full py-2 px-4 bg-gray-100 rounded-md pr-10" />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>

        <Link href="/checkout" className="relative">
          <ShoppingBag className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
