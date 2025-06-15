import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import ProductList from "@/components/product-list"
import Cart from "@/components/cart"
import { categories, products } from "@/lib/data"

export default function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const categorySlug = params.slug
  const category = categories.find((c) => c.slug === categorySlug)
  const categoryProducts = products.filter((product) => product.category === categorySlug)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar categories={categories} activeCategory={categorySlug} />
        <main className="flex-1 p-4 md:p-6 border-x">
          <h1 className="text-2xl font-bold mb-6">{category?.name || "Products"}</h1>
          <ProductList products={categoryProducts} />
        </main>
        <div className="w-full md:w-80 lg:w-96">
          <Cart />
        </div>
      </div>
    </div>
  )
}
