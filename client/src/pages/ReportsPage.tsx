import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/common/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { salesService } from '@/services/api/sales.service'
import { apiClient } from '@/services/api/auth.service'
import { SalesReport, InventoryReport } from '@/types/api.types'

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'sales' | 'inventory'>('sales')
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const { data: salesReport, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-report', startDate, endDate],
    queryFn: () => salesService.getSalesReport(startDate, endDate),
    enabled: reportType === 'sales',
  })

  const { data: inventoryReport, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory-report'],
    queryFn: async () => {
      const response = await apiClient.get<InventoryReport>('/reports/inventory')
      return response.data
    },
    enabled: reportType === 'inventory',
  })

  const isLoading = reportType === 'sales' ? salesLoading : inventoryLoading

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await salesService.exportSalesReport(format, startDate, endDate)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales-report.${format}`
      a.click()
    } catch (error) {
      alert('Failed to export report')
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>

        {/* Report Type Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setReportType('sales')}
            className={`px-4 py-2 rounded-lg transition ${
              reportType === 'sales'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setReportType('inventory')}
            className={`px-4 py-2 rounded-lg transition ${
              reportType === 'inventory'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Inventory Report
          </button>
        </div>

        {/* Date Range Filter (for sales) */}
        {reportType === 'sales' && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner message="Generating report..." />
          </div>
        )}

        {/* Sales Report */}
        {reportType === 'sales' && salesReport && !isLoading && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${salesReport.summary.total_revenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm mb-1">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {salesReport.summary.transaction_count}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                <p className="text-gray-600 text-sm mb-1">Avg Transaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${salesReport.summary.avg_transaction_value?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            {/* Medicine Details Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">Sales by Medicine</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                        Qty Sold
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                        Transactions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport.medicine_details?.map((item) => (
                      <tr key={item.medicine_id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{item.medicine_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.category_name}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          {item.quantity_sold}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          ${item.revenue?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-700">
                          {item.transactions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Report */}
        {reportType === 'inventory' && inventoryReport && !isLoading && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Inventory Summary</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Medicines</p>
                  <p className="text-2xl font-bold">{inventoryReport.total_medicines}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Stock</p>
                  <p className="text-2xl font-bold">{inventoryReport.total_stock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">Stock Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">SKU</th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-700">Stock</th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-700">
                        Batches
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-700">Active</th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-700">Expiring</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryReport.items?.map((item) => (
                      <tr key={item.medicine_id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{item.medicine_name}</td>
                        <td className="px-6 py-4 font-mono">{item.sku}</td>
                        <td className="px-6 py-4 text-right font-semibold">{item.total_stock}</td>
                        <td className="px-6 py-4 text-right">{item.batch_count}</td>
                        <td className="px-6 py-4 text-right text-green-700">
                          {item.batch_details.active.count}
                        </td>
                        <td className="px-6 py-4 text-right text-amber-700">
                          {item.batch_details.expiring_soon.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
