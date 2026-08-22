import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/hooks/useAuth'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ChangePasswordPage from '@/pages/ChangePasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import POSPage from '@/pages/POSPage'
import InventoryPage from '@/pages/InventoryPage'
import PurchaseOrdersPage from '@/pages/PurchaseOrdersPage'
import GRNPage from '@/pages/GRNPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'
import './App.css'

function App() {
  const setOnlineStatus = useUIStore((state) => state.setOnlineStatus)
  const initialize = useAuthStore((state) => state.initialize)

  // Initialize auth on app load
  useEffect(() => {
    initialize()
  }, [initialize])

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnlineStatus])

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pos"
            element={
              <ProtectedRoute requiredRoles={['CASHIER', 'BRANCH_ADMIN']}>
                <POSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredRoles={['PHARMACIST', 'BRANCH_ADMIN']}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute requiredRoles={['BRANCH_ADMIN', 'PHARMACIST']}>
                <PurchaseOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grn"
            element={
              <ProtectedRoute requiredRoles={['BRANCH_ADMIN', 'PHARMACIST']}>
                <GRNPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'BRANCH_ADMIN']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'BRANCH_ADMIN']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
