import { useState } from 'react'

interface DashboardFiltersProps {
  onDateRangeChange?: (startDate: string, endDate: string) => void
  onBranchChange?: (branchId: string) => void
  selectedBranch?: string
  branches?: { id: string; name: string }[]
  isSuperAdmin?: boolean
}

type DateRange = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom'

export default function DashboardFilters({
  onDateRangeChange,
  onBranchChange,
  selectedBranch,
  branches,
  isSuperAdmin,
}: DashboardFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange>('today')
  const [showCustom, setShowCustom] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const calculateDateRange = (range: DateRange) => {
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch (range) {
      case 'today':
        start = new Date(today)
        end = new Date(today)
        break
      case 'yesterday':
        start = new Date(today)
        start.setDate(start.getDate() - 1)
        end = new Date(start)
        break
      case 'last7days':
        start.setDate(start.getDate() - 7)
        end = new Date(today)
        break
      case 'last30days':
        start.setDate(start.getDate() - 30)
        end = new Date(today)
        break
      case 'custom':
        if (customStart && customEnd) {
          start = new Date(customStart)
          end = new Date(customEnd)
        }
        break
    }

    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]

    onDateRangeChange?.(startStr, endStr)
  }

  const handleDateRangeSelect = (range: DateRange) => {
    setDateRange(range)
    if (range === 'custom') {
      setShowCustom(true)
    } else {
      setShowCustom(false)
      calculateDateRange(range)
    }
  }

  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      calculateDateRange('custom')
      setShowCustom(false)
    }
  }

  const dateOptions = [
    { value: 'today' as DateRange, label: 'Today' },
    { value: 'yesterday' as DateRange, label: 'Yesterday' },
    { value: 'last7days' as DateRange, label: '7 Days' },
    { value: 'last30days' as DateRange, label: '30 Days' },
    { value: 'custom' as DateRange, label: 'Custom' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Branch Selector */}
        {isSuperAdmin && branches && branches.length > 0 && (
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Branch</label>
            <select
              value={selectedBranch || 'all'}
              onChange={(e) => onBranchChange?.(e.target.value)}
              className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-teal-500 focus:ring-0 outline-none transition bg-white"
            >
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range Selector */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs font-semibold text-slate-700 uppercase">Date Range</label>
          <div className="flex flex-wrap gap-2">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateRangeSelect(option.value)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition border ${
                  dateRange === option.value
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {showCustom && (
        <div className="flex flex-col md:flex-row gap-2 pt-2 border-t border-slate-200">
          <div className="flex-1 flex gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-teal-500 focus:ring-0 outline-none transition"
            />
            <span className="px-2 flex items-center text-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-teal-500 focus:ring-0 outline-none transition"
            />
          </div>
          <button
            onClick={handleCustomDateApply}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
