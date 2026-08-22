import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/common/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { apiClient } from '@/services/api/auth.service'
import { useAuth } from '@/hooks/useAuth'
import { PurchaseOrder } from '@/types/api.types'

export default function PurchaseOrdersPage() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data: purchaseOrders, isLoading } = useQuery({
    queryKey: ['purchase-orders', statusFilter],
    queryFn: async () => {
      const response = await apiClient.get<PurchaseOrder[]>('/purchase-orders', {
        params: { status: statusFilter !== 'ALL' ? statusFilter : undefined },
      })
      return response.data
    },
  })

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PENDING: 'bg-blue-100 text-blue-700',
    RECEIVED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner message="Loading purchase orders..." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Purchase Orders</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Purchase Order
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex gap-2">
            {['ALL', 'DRAFT', 'PENDING', 'RECEIVED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* PO Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    PO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders && purchaseOrders.length > 0 ? (
                  purchaseOrders.map((po) => (
                    <tr key={po.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-gray-900">
                        {po.po_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {po.supplier?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {po.po_items?.length || 0} items
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[po.status]
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(po.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No purchase orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
