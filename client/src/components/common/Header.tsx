import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/ui.store'

interface HeaderProps {
  title?: string
}

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  const { user, logout } = useAuth()
  const { toggleSidebar, isOnline } = useUIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-teal-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-teal-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-teal-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Sync Status */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-1 text-emerald-600">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600">
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Offline</span>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-teal-900">{user?.name}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-teal-200 z-50">
                <div className="p-3 border-b border-teal-200">
                  <p className="text-sm font-semibold text-teal-900">{user?.name}</p>
                  <p className="text-xs text-slate-600">{user?.email}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role?.replace(/_/g, ' ')}</p>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setShowUserMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
