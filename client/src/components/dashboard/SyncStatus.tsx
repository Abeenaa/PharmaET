import { useUIStore } from '@/store/ui.store'
import { Wifi, WifiOff, Check, AlertCircle } from 'lucide-react'

interface SyncStatusProps {
  syncing?: boolean
  lastSyncTime?: Date
  pendingOperations?: number
  syncError?: boolean
}

export default function SyncStatus({
  syncing = false,
  lastSyncTime,
  pendingOperations = 0,
  syncError = false,
}: SyncStatusProps) {
  const { isOnline } = useUIStore()

  const getRelativeTime = (date: Date | undefined) => {
    if (!date) return 'never'
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline Status */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
        isOnline
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        {isOnline ? (
          <Wifi size={14} />
        ) : (
          <WifiOff size={14} />
        )}
        {isOnline ? 'Online' : 'Offline'}
      </div>

      {/* Sync Status */}
      {isOnline && (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
          syncing
            ? 'bg-slate-100 border-slate-200 text-slate-600'
            : syncError
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {syncing ? (
            <>
              <div className="w-3 h-3 rounded-full border-2 border-transparent border-t-slate-600 animate-spin"></div>
              Syncing
            </>
          ) : syncError ? (
            <>
              <AlertCircle size={14} />
              Sync error
            </>
          ) : (
            <>
              <Check size={14} />
              Synced {getRelativeTime(lastSyncTime)}
            </>
          )}
        </div>
      )}
    </div>
  )
}
