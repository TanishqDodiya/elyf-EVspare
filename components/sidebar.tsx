"use client"

import Link from "next/link"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { Category } from "@/lib/types"

interface SidebarProps {
  categories: Category[]
  activeCategory?: string
}

export default function Sidebar({ categories, activeCategory }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="md:hidden p-4 border-b">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex items-center justify-between w-full">
          <span className="font-medium">Categories</span>
          {mobileMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Sidebar content */}
      <aside className={`w-full md:w-64 bg-white ${mobileMenuOpen ? "block" : "hidden"} md:block`}>
        <nav className="p-4">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className={`block py-2 px-3 rounded-md hover:bg-gray-100 ${
                    activeCategory === category.slug
                      ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
