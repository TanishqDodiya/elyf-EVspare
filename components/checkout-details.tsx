"use client"

import { useState } from 'react'
import { useCart } from './cart-provider'
import api from '@/lib/api'

export default function CheckoutDetails() {
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        paymentMethod: 'cod',
        notes: formData.notes
      }

      const response = await api.post('/orders', orderData)
      
      // Clear cart and show success message
      clearCart()
      alert(`Order placed successfully! Order number: ${response.data.orderNumber || 'N/A'}`)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
      })
      
    } catch (error: any) {
      console.error('Error creating order:', error)
      const errorMessage = error.response?.data?.message || 'Something went wrong'
      alert(`Error placing order: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md" 
                required 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md" 
                required 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number *
              </label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md" 
                required 
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">Shipping Address</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address *
              </label>
              <input 
                type="text" 
                id="address" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  City *
                </label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium mb-1">
                  Pincode *
                </label>
                <input 
                  type="text" 
                  id="pincode" 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md" 
                  required 
                />
              </div>
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State *
              </label>
              <input 
                type="text" 
                id="state" 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md" 
                required 
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">Additional Notes</h2>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Order Notes (Optional)
            </label>
            <textarea 
              id="notes" 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border rounded-md" 
              placeholder="Any special instructions for your order..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : `Place Order (₹${totalPrice.toFixed(2)})`}
          </button>
        </div>
      </form>
    </div>
  )
}
