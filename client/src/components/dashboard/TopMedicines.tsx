import { Medicine } from '@/types/api.types'
import { Pill } from 'lucide-react'

interface TopMedicinesProps {
  medicines?: (Medicine & { quantity_sold: number })[]
  loading?: boolean
}

export default function TopMedicines({ medicines, loading }: TopMedicinesProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-teal-50 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (!medicines || medicines.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-teal-600 font-semibold text-sm">No sales data</p>
        <p className="text-teal-500 text-xs mt-1">Sales will appear here</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-teal-200">
            <th className="text-left py-3 px-3 text-xs font-semibold text-teal-700 uppercase">Rank</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-teal-700 uppercase">Medicine</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-teal-700 uppercase">Category</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-teal-700 uppercase">Sold</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine, idx) => (
            <tr key={medicine.id} className="border-b border-teal-100 hover:bg-teal-50 transition">
              <td className="py-3 px-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold">
                  {idx + 1}
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <Pill size={16} className="text-teal-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-teal-900 text-xs truncate">{medicine.name}</p>
                    <p className="text-xs text-teal-600 truncate">{medicine.sku}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3 text-teal-700 text-xs">{medicine.category?.name || '—'}</td>
              <td className="py-3 px-3 text-right">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-md font-semibold text-xs">
                  {medicine.quantity_sold}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
