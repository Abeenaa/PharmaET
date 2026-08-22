import { create } from 'zustand'

export type ModalType = 'create-sale' | 'create-po' | 'create-grn' | 'stock-adjustment' | null

interface UIStore {
  isSidebarOpen: boolean
  activeModal: ModalType
  theme: 'light' | 'dark'
  isOnline: boolean

  toggleSidebar: () => void
  openModal: (modal: ModalType) => void
  closeModal: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setOnlineStatus: (isOnline: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: true,
  activeModal: null,
  theme: 'light',
  isOnline: navigator.onLine,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (modal: ModalType) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  setOnlineStatus: (isOnline: boolean) => set({ isOnline }),
}))
