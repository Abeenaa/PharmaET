import { create } from 'zustand'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  isRead?: boolean
  createdAt: Date
}

interface NotificationsStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  clearAll: () => void
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],

  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) =>
    set((state) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: new Date(),
      }
      return { notifications: [newNotification, ...state.notifications] }
    }),

  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  markAsRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  clearAll: () => set({ notifications: [] }),
}))
