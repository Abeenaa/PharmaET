import React from 'react'
import { useUIStore } from '@/store/ui.store'
import Header from './Header'
import Sidebar from './Sidebar'
import OfflineBanner from './OfflineBanner'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, isOnline } = useUIStore()

  return (
    <div className="flex h-screen bg-gray-100">
      {!isOnline && <OfflineBanner />}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
