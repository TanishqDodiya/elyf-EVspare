export default function CheckoutDetails() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout Details</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input type="text" id="name" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input type="email" id="email" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input type="tel" id="phone" className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">Shipping Address</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address
              </label>
              <input type="text" id="address" className="w-full p-2 border rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  City
                </label>
                <input type="text" id="city" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium mb-1">
                  Pincode
                </label>
                <input type="text" id="pincode" className="w-full p-2 border rounded-md" />
              </div>
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State
              </label>
              <input type="text" id="state" className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
