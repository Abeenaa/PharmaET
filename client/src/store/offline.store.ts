import { create } from 'zustand'
import { PendingOperation, SyncConflict } from '@/types/api.types'

interface OfflineStore {
  isSyncing: boolean
  pendingOperations: PendingOperation[]
  syncConflicts: SyncConflict[]
  lastSyncTime: string | null

  addPendingOperation: (operation: PendingOperation) => void
  removePendingOperation: (operationId: string) => void
  setPendingOperations: (operations: PendingOperation[]) => void
  addSyncConflict: (conflict: SyncConflict) => void
  removeSyncConflict: (conflictId: string) => void
  setSyncing: (isSyncing: boolean) => void
  setLastSyncTime: (time: string) => void
}

export const useOfflineStore = create<OfflineStore>((set) => ({
  isSyncing: false,
  pendingOperations: [],
  syncConflicts: [],
  lastSyncTime: null,

  addPendingOperation: (operation: PendingOperation) =>
    set((state) => ({
      pendingOperations: [...state.pendingOperations, operation],
    })),

  removePendingOperation: (operationId: string) =>
    set((state) => ({
      pendingOperations: state.pendingOperations.filter((op) => op.id !== operationId),
    })),

  setPendingOperations: (operations: PendingOperation[]) =>
    set({ pendingOperations: operations }),

  addSyncConflict: (conflict: SyncConflict) =>
    set((state) => ({
      syncConflicts: [...state.syncConflicts, conflict],
    })),

  removeSyncConflict: (conflictId: string) =>
    set((state) => ({
      syncConflicts: state.syncConflicts.filter((c) => c.id !== conflictId),
    })),

  setSyncing: (isSyncing: boolean) => set({ isSyncing }),

  setLastSyncTime: (time: string) => set({ lastSyncTime: time }),
}))
