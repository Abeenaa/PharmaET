import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/common/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { medicinesService } from '@/services/api/medicines.service'
import { useAuth } from '@/hooks/useAuth'
import { Medicine, MedicineBatch } from '@/types/api.types'

interface CartItem {
  medicine: Medicine
  batch: MedicineBatch
  quantity: number
  unit_price: number
}

export default function POSPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const { data: medicines, isLoading } = useQuery({
    queryKey: ['medicines-pos', searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return medicinesService.searchMedicines(searchQuery)
      }
      return []
    },
  })

  const addToCart = (medicine: Medicine) => {
    if (!medicine.batches || medicine.batches.length === 0) {
      alert('No active batches available for this medicine')
      return
    }

    const activeBatch = medicine.batches.find((b) => b.status === 'ACTIVE')
    if (!activeBatch) {
      alert('No active batches available')
      return
    }

    const existingItem = cart.find(
      (item) => item.medicine.id === medicine.id && item.batch.id === activeBatch.id
    )

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          medicine,
          batch: activeBatch,
          quantity: 1,
          unit_price: 0, // Would come from pricing service
        },
      ])
    }
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index)
      return
    }
    setCart(
      cart.map((item, i) => (i === index ? { ...item, quantity } : item))
    )
  }

  const total = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }
    alert('Sale recorded: ' + total.toFixed(2))
    setCart([])
  }

  if (isLoading && searchQuery) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner message="Searching medicines..." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Results - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Point of Sale</h1>
              <p className="text-slate-600">Search and add medicines to cart</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <input
                type="text"
                placeholder="Search medicine name, SKU, or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-600 focus:ring-0 outline-none transition text-base"
                autoFocus
              />
            </div>

            {searchQuery && medicines && medicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="bg-white rounded-xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition p-5 space-y-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{medicine.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{medicine.generic_name}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {medicine.strength} • {medicine.form}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-b border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Stock</p>
                        <p className="text-2xl font-bold text-slate-900">{medicine.total_stock || 0}</p>
                      </div>
                      <div className="text-3xl">{medicine.total_stock! > 0 ? '✓' : '✗'}</div>
                    </div>
                    <button
                      onClick={() => addToCart(medicine)}
                      disabled={!medicine.total_stock || medicine.total_stock <= 0}
                      className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-lg text-slate-600 font-medium">No medicines found</p>
                <p className="text-sm text-slate-500 mt-1">Try a different search</p>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-lg text-slate-600 font-medium">Start searching</p>
                <p className="text-sm text-slate-500 mt-1">Type medicine name or barcode above</p>
              </div>
            )}
          </div>

          {/* Shopping Cart - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-20 max-h-[calc(100vh-150px)]">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  🛒 Cart
                  {cart.length > 0 && (
                    <span className="bg-white text-emerald-600 rounded-full px-3 py-1 text-sm font-bold">
                      {cart.length}
                    </span>
                  )}
                </h3>
              </div>

              <div className="p-4 flex flex-col h-full overflow-y-auto">
                {cart.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4 flex-1 overflow-y-auto">
                      {cart.map((item, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-slate-900 truncate">
                                {item.medicine.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                Batch: {item.batch.batch_number}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(i)}
                              className="text-rose-600 hover:text-rose-700 font-bold text-sm flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 bg-white rounded border border-slate-200">
                              <button
                                onClick={() => updateQuantity(i, item.quantity - 1)}
                                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold"
                              >
                                −
                              </button>
                              <span className="px-2 py-1 text-sm font-semibold text-slate-900 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(i, item.quantity + 1)}
                                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-sm font-bold text-emerald-600">
                              ETB {(item.unit_price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Items:</span>
                        <span className="font-bold text-slate-900">{cart.length}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold border-t border-slate-100 pt-3">
                        <span className="text-slate-900">Total:</span>
                        <span className="text-emerald-600">ETB {total.toFixed(2)}</span>
                      </div>

                      <div className="space-y-2 pt-3">
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm font-medium focus:border-emerald-600 focus:ring-0 outline-none transition"
                        >
                          <option value="cash">💵 Cash</option>
                          <option value="card">💳 Card</option>
                          <option value="transfer">💸 Transfer</option>
                        </select>

                        <button
                          onClick={handleCheckout}
                          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold hover:shadow-lg transition"
                        >
                          Complete Sale
                        </button>

                        <button
                          onClick={() => setCart([])}
                          className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                        >
                          Clear Cart
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <p className="text-4xl mb-3">🛍️</p>
                    <p className="text-slate-700 font-semibold">Cart is empty</p>
                    <p className="text-sm text-slate-500 mt-1">Add medicines to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
