import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/common/Layout'
import { dashboardService } from '@/services/api/dashboard.service'
import { branchesService } from '@/services/api/branches.service'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/ui.store'
import DashboardKpiCard from '@/components/dashboard/DashboardKpiCard'
import DashboardSection from '@/components/dashboard/DashboardSection'
import DashboardAlerts from '@/components/dashboard/DashboardAlerts'
import InventoryHealth from '@/components/dashboard/InventoryHealth'
import TopMedicines from '@/components/dashboard/TopMedicines'
import SyncStatus from '@/components/dashboard/SyncStatus'
import DashboardFilters from '@/components/dashboard/DashboardFilters'
import { DollarSign, ShoppingCart, Package, AlertTriangle, Bell, BarChart3, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, userRole } = useAuth()
  const { isOnline } = useUIStore()
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })
  const [selectedBranch, setSelectedBranch] = useState(user?.branch_id || '')
  const [availableBranches, setAvailableBranches] = useState<Array<{ id: string; name: string }>>([])

  // Fetch branches for super admin
  const { data: allBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => branchesService.getAllBranches(),
    enabled: userRole === 'SUPER_ADMIN',
  })

  useEffect(() => {
    if (userRole === 'SUPER_ADMIN' && allBranches && allBranches.length > 0) {
      setAvailableBranches(allBranches.map(b => ({ id: b.id, name: b.name })))
      if (!selectedBranch) {
        setSelectedBranch(allBranches[0].id)
      }
    } else if (userRole !== 'SUPER_ADMIN' && user?.branch_id) {
      setAvailableBranches([{ id: user.branch_id, name: 'Your Branch' }])
      setSelectedBranch(user.branch_id)
    }
  }, [allBranches, userRole, user?.branch_id, selectedBranch])

  useEffect(() => {
    if (userRole === 'CASHIER') {
      navigate('/pos')
    }
  }, [userRole, navigate])

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary', selectedBranch, dateRange],
    queryFn: () => dashboardService.getSummary(selectedBranch, dateRange.start),
    enabled: !!selectedBranch,
  })

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory-status', selectedBranch],
    queryFn: () => dashboardService.getInventoryStatus(selectedBranch),
    enabled: !!selectedBranch,
  })

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard-alerts', selectedBranch],
    queryFn: () => dashboardService.getAlerts(selectedBranch),
    enabled: !!selectedBranch,
  })

  const isSuperAdmin = userRole === 'SUPER_ADMIN'
  const isBranchAdmin = userRole === 'BRANCH_ADMIN'
  const isPharmacist = userRole === 'PHARMACIST'

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate })
  }

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId === 'all' ? '' : branchId)
  }

  const branches = [
    { id: 'branch-1', name: 'Bole Branch' },
    { id: 'branch-2', name: 'Nifas Silk Branch' },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-teal-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-teal-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-teal-900">Dashboard</h1>
                <p className="text-sm text-teal-700 mt-1">
                  {isSuperAdmin
                    ? 'Organization-wide pharmacy operations'
                    : isBranchAdmin
                    ? 'Branch operations overview'
                    : 'Inventory management'}
                </p>
              </div>
              <SyncStatus syncing={false} lastSyncTime={new Date()} pendingOperations={0} />
            </div>

            {/* Filters Row */}
            <div className="pt-4 border-t border-teal-100">
              <DashboardFilters
                onDateRangeChange={handleDateRangeChange}
                onBranchChange={handleBranchChange}
                selectedBranch={selectedBranch}
                branches={userRole === 'SUPER_ADMIN' ? availableBranches : undefined}
                isSuperAdmin={isSuperAdmin}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isSuperAdmin ? (
              <>
                <DashboardKpiCard
                  title="Total Sales"
                  value={`ETB ${(summary?.total_sales || 0).toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}`}
                  icon={<DollarSign size={24} />}
                  variant="success"
                  loading={summaryLoading}
                  trend={{ value: 12, isPositive: true }}
                />
                <DashboardKpiCard
                  title="Transactions"
                  value={summary?.transaction_count || 0}
                  icon={<ShoppingCart size={24} />}
                  loading={summaryLoading}
                  trend={{ value: 8, isPositive: true }}
                />
                <DashboardKpiCard
                  title="Total Items"
                  value={inventory?.total_medicines || 0}
                  icon={<Package size={24} />}
                  loading={inventoryLoading}
                />
                <DashboardKpiCard
                  title="Low Stock"
                  value={inventory?.low_stock_count || 0}
                  icon={<AlertTriangle size={24} />}
                  variant="warning"
                  loading={inventoryLoading}
                />
              </>
            ) : isBranchAdmin ? (
              <>
                <DashboardKpiCard
                  title="Today's Sales"
                  value={`ETB ${(summary?.total_sales || 0).toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}`}
                  icon={<DollarSign size={24} />}
                  variant="success"
                  loading={summaryLoading}
                />
                <DashboardKpiCard
                  title="Transactions"
                  value={summary?.transaction_count || 0}
                  icon={<ShoppingCart size={24} />}
                  loading={summaryLoading}
                />
                <DashboardKpiCard
                  title="Low Stock"
                  value={inventory?.low_stock_count || 0}
                  icon={<AlertTriangle size={24} />}
                  variant="warning"
                  loading={inventoryLoading}
                />
                <DashboardKpiCard
                  title="Expiring Soon"
                  value={inventory?.expiring_soon_count || 0}
                  icon={<TrendingUp size={24} />}
                  variant="danger"
                  loading={inventoryLoading}
                />
              </>
            ) : (
              <>
                <DashboardKpiCard
                  title="Total Medicines"
                  value={inventory?.total_medicines || 0}
                  icon={<Package size={24} />}
                  variant="success"
                  loading={inventoryLoading}
                />
                <DashboardKpiCard
                  title="Low Stock"
                  value={inventory?.low_stock_count || 0}
                  icon={<AlertTriangle size={24} />}
                  variant="warning"
                  loading={inventoryLoading}
                />
                <DashboardKpiCard
                  title="Expiring Soon"
                  value={inventory?.expiring_soon_count || 0}
                  icon={<TrendingUp size={24} />}
                  variant="danger"
                  loading={inventoryLoading}
                />
                <DashboardKpiCard
                  title="Expired"
                  value={inventory?.expired_count || 0}
                  icon={<AlertTriangle size={24} />}
                  variant="danger"
                  loading={inventoryLoading}
                />
              </>
            )}
          </div>

          {/* Main Grid: Alerts + Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alerts - 2/3 width */}
            <div className="lg:col-span-2">
              <DashboardSection
                title="Active Alerts"
                description="System notifications and warnings"
                icon={<Bell size={20} />}
                loading={alertsLoading}
              >
                <DashboardAlerts alerts={alerts} />
              </DashboardSection>
            </div>

            {/* Inventory Health - 1/3 width */}
            <div>
              <DashboardSection
                title="Inventory Status"
                description="Quick stock overview"
                icon={<Package size={20} />}
                loading={inventoryLoading}
              >
                <InventoryHealth inventory={inventory} />
              </DashboardSection>
            </div>
          </div>

          {/* Top Selling Medicines - Full Width */}
          {(isSuperAdmin || isBranchAdmin) && (
            <DashboardSection
              title="Top Selling Medicines"
              description="Performance metrics for today"
              icon={<BarChart3 size={20} />}
              loading={summaryLoading}
            >
              <TopMedicines medicines={summary?.top_selling_medicines} />
            </DashboardSection>
          )}

          {/* Offline Banner */}
          {!isOnline && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-4">
              <Bell size={24} className="text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Offline Mode</p>
                <p className="text-sm text-amber-700">
                  You are currently working offline. All changes will be synced when your connection is restored.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
