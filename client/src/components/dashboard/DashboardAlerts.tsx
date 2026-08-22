import { DashboardAlerts as AlertsData } from '@/types/api.types'
import { AlertCircle, Clock, X } from 'lucide-react'

interface DashboardAlertsProps {
  alerts?: AlertsData
  loading?: boolean
  onDismiss?: (alertId: string) => void
}

export default function DashboardAlerts({ alerts, loading, onDismiss }: DashboardAlertsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-teal-50 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  const hasAlerts = (alerts?.low_stock_alerts?.length || 0) + (alerts?.expiring_soon_alerts?.length || 0) > 0

  if (!hasAlerts) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">✓</div>
        <p className="text-teal-700 font-semibold text-sm">All systems healthy</p>
        <p className="text-teal-600 text-xs mt-1">No active alerts</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Low Stock Alerts */}
      {alerts?.low_stock_alerts?.map((alert) => (
        <div
          key={alert.id}
          className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-start gap-3 group"
        >
          <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-900 text-sm">Low Stock</p>
            <p className="text-amber-800 text-xs mt-0.5">{alert.medicine?.name}</p>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(alert.id)}
              className="flex-shrink-0 text-amber-600 hover:text-amber-700 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}

      {/* Expiring Soon Alerts */}
      {alerts?.expiring_soon_alerts?.map((alert) => (
        <div
          key={alert.id}
          className="border border-red-200 bg-red-50 rounded-lg p-4 flex items-start gap-3 group"
        >
          <Clock size={18} className="text-red-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-900 text-sm">Expiring Soon</p>
            <p className="text-red-800 text-xs mt-0.5">{alert.medicine?.name}</p>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(alert.id)}
              className="flex-shrink-0 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
