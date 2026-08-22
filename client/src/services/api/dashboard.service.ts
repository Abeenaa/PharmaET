import { apiClient } from './auth.service'
import { DashboardSummary, InventoryStatus, DashboardAlerts, Alert } from '@/types/api.types'

export const dashboardService = {
  async getSummary(branchId?: string, date?: string) {
    const response = await apiClient.get<DashboardSummary>('/dashboard/summary', {
      params: { branchId, date },
    })
    return response.data
  },

  async getInventoryStatus(branchId?: string) {
    const response = await apiClient.get<InventoryStatus>('/dashboard/inventory', {
      params: { branchId },
    })
    return response.data
  },

  async getAlerts(branchId?: string) {
    const response = await apiClient.get<DashboardAlerts>('/dashboard/alerts', {
      params: { branchId },
    })
    return response.data
  },

  async acknowledgeAlert(alertId: string) {
    const response = await apiClient.patch<Alert>(`/alerts/${alertId}/acknowledge`)
    return response.data
  },

  async getTopMedicines(limit: number = 5, branchId?: string) {
    const response = await apiClient.get('/dashboard/top-medicines', {
      params: { limit, branchId },
    })
    return response.data
  },
}
