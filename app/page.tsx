import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import ProductList from "@/components/product-list"
import Cart from "@/components/cart"
import { getProducts } from "@/lib/data"

export default async function Home() {
  const products = await getProducts()
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 border-x">
          <ProductList products={products} />
        </main>
        <div className="w-full md:w-80 lg:w-96">
          <Cart />
        </div>
      </div>
      <footer className="bg-gray-100 text-center py-4 text-xs text-gray-500 border-t">
        &copy; {new Date().getFullYear()} Maa Ashapura Enterprise. All rights reserved.
      </footer>
    </div>
  )
}
