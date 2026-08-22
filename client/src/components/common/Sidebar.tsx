import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/ui.store'
import { LayoutDashboard, ShoppingCart, Package, FileText, CheckSquare, BarChart3, Settings, LogOut } from 'lucide-react'
import newLogo from '@/assets/new-one.png'

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER'] },
  { label: 'POS', href: '/pos', icon: ShoppingCart, roles: ['CASHIER', 'BRANCH_ADMIN'] },
  { label: 'Inventory', href: '/inventory', icon: Package, roles: ['PHARMACIST', 'BRANCH_ADMIN'] },
  { label: 'Purchase Orders', href: '/purchase-orders', icon: FileText, roles: ['BRANCH_ADMIN', 'PHARMACIST'] },
  { label: 'GRN', href: '/grn', icon: CheckSquare, roles: ['BRANCH_ADMIN', 'PHARMACIST'] },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'BRANCH_ADMIN'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'BRANCH_ADMIN'] },
]

export default function Sidebar() {
  const { userRole, logout } = useAuth()
  const location = useLocation()
  const { isSidebarOpen } = useUIStore()

  const filteredItems = navigationItems.filter((item) =>
    userRole ? item.roles.includes(userRole) : false
  )

  return (
    <aside
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-white text-slate-900 shadow-lg transition-all duration-300 overflow-y-auto flex flex-col h-screen border-r border-teal-100`}
    >
      <div className="p-4 border-b border-teal-100">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={newLogo} alt="PharmaET" className={isSidebarOpen ? 'h-8 w-8' : 'h-6 w-6'} />
          {isSidebarOpen && (
            <span className="font-bold text-sm tracking-tight">
              <span style={{ color: '#0F172A' }}>Pharma</span>
              <span style={{ color: '#0F766E' }}>ET</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href
          const IconComponent = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-600'
                  : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700'
              }`}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <IconComponent size={18} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-teal-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-700 transition text-sm font-medium"
          title={!isSidebarOpen ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
