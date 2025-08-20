import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import ProductList from "@/components/product-list"
import Cart from "@/components/cart"
import { getCategories, getProductsByCategory } from "@/lib/data"

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const categorySlug = params.slug
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === categorySlug)
  const categoryProducts = await getProductsByCategory(categorySlug)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 p-4 md:p-6 border-x overflow-y-auto h-[calc(100vh-64px-48px)]">
            <h1 className="text-2xl font-bold mb-6">{category?.name || "Products"}</h1>
            <ProductList products={categoryProducts} />
          </main>
          <div className="w-full md:w-80 lg:w-96">
            <Cart />
          </div>
        </div>
      </div>
      <footer className="bg-gray-100 text-center py-4 text-xs text-gray-500 border-t">
        &copy; {new Date().getFullYear()} Maa Ashapura Enterprise. All rights reserved.
      </footer>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories()
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
