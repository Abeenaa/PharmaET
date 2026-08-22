import { apiClient } from './auth.service'
import { Sale, SalesReport } from '@/types/api.types'

export const salesService = {
  async createSale(data: {
    items: Array<{ medicine_id: string; batch_id: string; quantity: number; unit_price: number }>
    branch_id: string
    cashier_id: string
  }) {
    const response = await apiClient.post<Sale>('/sales', data)
    return response.data
  },

  async getSales(branchId?: string, filters?: { start_date?: string; end_date?: string }) {
    const response = await apiClient.get<Sale[]>('/sales', {
      params: { branchId, ...filters },
    })
    return response.data
  },

  async getSaleById(id: string) {
    const response = await apiClient.get<Sale>(`/sales/${id}`)
    return response.data
  },

  async getSalesReport(startDate: string, endDate: string, branchId?: string) {
    const response = await apiClient.get<SalesReport>('/reports/sales', {
      params: { startDate, endDate, branchId },
    })
    return response.data
  },

  async exportSalesReport(format: 'csv' | 'pdf', startDate: string, endDate: string) {
    const response = await apiClient.get(`/reports/sales/export`, {
      params: { format, startDate, endDate },
      responseType: 'blob',
    })
    return response.data
  },
}
