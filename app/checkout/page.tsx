import Header from "@/components/header"
import CheckoutDetails from "@/components/checkout-details"
import OrderSummary from "@/components/order-summary"

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 gap-6">
        <div className="flex-1">
          <CheckoutDetails />
        </div>
        <div className="w-full md:w-80 lg:w-96">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
