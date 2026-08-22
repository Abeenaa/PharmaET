import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface DashboardKpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  loading?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const variantStyles = {
  default: {
    bg: 'bg-white',
    border: 'border-slate-200',
    iconBg: 'bg-slate-50',
    textValue: 'text-slate-900',
    textLabel: 'text-slate-600',
    icon: 'text-teal-600',
  },
  success: {
    bg: 'bg-white',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-50',
    textValue: 'text-emerald-900',
    textLabel: 'text-emerald-700',
    icon: 'text-emerald-600',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-amber-100',
    iconBg: 'bg-amber-50',
    textValue: 'text-amber-900',
    textLabel: 'text-amber-700',
    icon: 'text-amber-600',
  },
  danger: {
    bg: 'bg-white',
    border: 'border-red-100',
    iconBg: 'bg-red-50',
    textValue: 'text-red-900',
    textLabel: 'text-red-700',
    icon: 'text-red-600',
  },
}

export default function DashboardKpiCard({
  title,
  value,
  icon,
  trend,
  loading,
  variant = 'default',
}: DashboardKpiCardProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-semibold ${styles.textLabel} uppercase tracking-tight mb-2`}>
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-32 bg-teal-200 rounded animate-pulse" />
          ) : (
            <>
              <p className={`text-3xl font-bold ${styles.textValue} tracking-tight`}>{value}</p>
              {trend && (
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs font-semibold flex items-center gap-0.5 ${
                      trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-teal-600">vs last period</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className={`${styles.iconBg} rounded-lg p-3 ml-4 flex-shrink-0`}>
          <div className={`${styles.icon} text-2xl`}>{icon}</div>
        </div>
      </div>
    </div>
  )
}
