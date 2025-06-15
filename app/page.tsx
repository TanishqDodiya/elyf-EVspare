import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import ProductList from "@/components/product-list"
import Cart from "@/components/cart"
import { categories, products } from "@/lib/data"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar categories={categories} />
        <main className="flex-1 p-4 md:p-6 border-x">
          <ProductList products={products} />
        </main>
        <div className="w-full md:w-80 lg:w-96">
          <Cart />
        </div>
      </div>
    </div>
  )
}
