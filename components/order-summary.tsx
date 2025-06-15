"use client"

import { useCart } from "./cart-provider"

export default function OrderSummary() {
  const { items, totalPrice } = useCart()

  const handlePlaceOrder = () => {
    // Create WhatsApp message with order details
    const orderItems = items.map((item) => `${item.name} (${item.quantity} x ₹${item.price.toFixed(2)})`).join("\n")

    const message = `Hello, I would like to place an order for:\n\n${orderItems}\n\nTotal: ₹${totalPrice.toFixed(2)}`

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message)

    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} Items)</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-4">
          <span className="font-bold">Total</span>
          <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 text-white py-3 rounded-md text-center flex items-center justify-center gap-2 font-medium hover:bg-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M9 14a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5Z" />
          </svg>
          Place order on WhatsApp
        </button>
      </div>
    </div>
  )
}
