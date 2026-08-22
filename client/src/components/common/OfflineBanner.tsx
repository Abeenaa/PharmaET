import React from 'react'
import { useUIStore } from '@/store/ui.store'
import { useOfflineStore } from '@/store/offline.store'

export default function OfflineBanner() {
  const { isOnline } = useUIStore()
  const { isSyncing, pendingOperations } = useOfflineStore()

  if (isOnline && !isSyncing && pendingOperations.length === 0) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-50 border-b-2 border-amber-300 p-3 z-40">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
          {!isOnline ? (
            <div>
              <p className="text-sm font-semibold text-amber-900">You're Offline</p>
              <p className="text-xs text-amber-700">
                Changes will sync when connection is restored
              </p>
            </div>
          ) : isSyncing ? (
            <div>
              <p className="text-sm font-semibold text-teal-900">Syncing...</p>
              <p className="text-xs text-teal-700">
                Uploading {pendingOperations.length} pending operation
                {pendingOperations.length !== 1 ? 's' : ''}
              </p>
            </div>
          ) : null}
        </div>
        {pendingOperations.length > 0 && (
          <span className="inline-block bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold">
            {pendingOperations.length} Pending
          </span>
        )}
      </div>
    </div>
  )
}
