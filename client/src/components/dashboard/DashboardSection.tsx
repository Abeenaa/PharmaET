interface DashboardSectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  loading?: boolean
}

export default function DashboardSection({
  title,
  description,
  icon,
  action,
  children,
  loading,
}: DashboardSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-teal-100 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {icon && <div className="text-lg text-teal-700 mt-0.5 flex-shrink-0">{icon}</div>}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-teal-900">{title}</h3>
            {description && <p className="text-xs text-teal-600 mt-1">{description}</p>}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-teal-50 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
