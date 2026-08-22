import { InventoryStatus } from '@/types/api.types'
import { Package, AlertTriangle, Clock, XCircle } from 'lucide-react'

interface InventoryHealthProps {
  inventory?: InventoryStatus
  loading?: boolean
}

export default function InventoryHealth({ inventory, loading }: InventoryHealthProps) {
  if (loading) {
    return <div className="h-32 bg-slate-100 rounded animate-pulse"></div>
  }

  const metrics = [
    {
      label: 'Total Items',
      value: inventory?.total_medicines || 0,
      icon: Package,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      iconColor: 'text-teal-700',
    },
    {
      label: 'Low Stock',
      value: inventory?.low_stock_count || 0,
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-700',
    },
    {
      label: 'Expiring',
      value: inventory?.expiring_soon_count || 0,
      icon: Clock,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-700',
    },
    {
      label: 'Expired',
      value: inventory?.expired_count || 0,
      icon: XCircle,
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      iconColor: 'text-slate-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => {
        const IconComponent = metric.icon
        return (
          <div
            key={metric.label}
            className={`border ${metric.borderColor} ${metric.bgColor} rounded-lg p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <IconComponent size={16} className={metric.iconColor} />
              <p className="text-xs text-slate-600 font-semibold">{metric.label}</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
          </div>
        )
      })}
    </div>
  )
}
