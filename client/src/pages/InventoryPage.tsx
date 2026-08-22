import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/common/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { medicinesService } from '@/services/api/medicines.service'
import { useAuth } from '@/hooks/useAuth'
import { Medicine } from '@/types/api.types'

export default function InventoryPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  const { data: medicines, isLoading } = useQuery({
    queryKey: ['medicines', user?.branch_id, searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return medicinesService.searchMedicines(searchQuery)
      }
      return medicinesService.getMedicines(user?.branch_id)
    },
    enabled: !!user?.branch_id,
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner message="Loading medicines..." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">Inventory</h1>
            <p className="text-slate-600">Manage medicines and stock levels</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
            + Add Medicine
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <input
            type="text"
            placeholder="Search by name, SKU, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-600 focus:ring-0 outline-none transition text-base"
          />
        </div>

        {/* Medicines Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Barcode</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Category</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines && medicines.length > 0 ? (
                  medicines.map((medicine) => (
                    <tr
                      key={medicine.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => setSelectedMedicine(medicine)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{medicine.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{medicine.generic_name}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-700">{medicine.sku}</td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{medicine.barcode}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{medicine.category?.name || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                          {medicine.total_stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            medicine.total_stock! > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {medicine.total_stock! > 0 ? '✓ Active' : '✗ Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-lg text-slate-700 font-semibold">No medicines found</p>
                      <p className="text-sm text-slate-500 mt-1">Try a different search</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Medicine Detail Modal */}
        {selectedMedicine && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{selectedMedicine.name}</h3>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="text-white hover:text-slate-200 font-bold text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold">Generic Name</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedMedicine.generic_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-1">SKU</p>
                    <p className="font-mono text-sm text-slate-900 font-semibold">{selectedMedicine.sku}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-1">Barcode</p>
                    <p className="font-mono text-sm text-slate-900 font-semibold">{selectedMedicine.barcode}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-1">Strength & Form</p>
                  <p className="text-sm text-slate-900">{selectedMedicine.strength} • {selectedMedicine.form}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-xs text-emerald-700 uppercase tracking-wide font-semibold mb-1">Total Stock</p>
                  <p className="text-3xl font-bold text-emerald-600">{selectedMedicine.total_stock} units</p>
                </div>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
