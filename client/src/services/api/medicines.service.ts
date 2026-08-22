import { apiClient } from './auth.service'
import { Medicine, MedicineBatch, Category } from '@/types/api.types'

export const medicinesService = {
  async getMedicines(branchId?: string) {
    const response = await apiClient.get<Medicine[]>('/medicines', {
      params: { branchId },
    })
    return response.data
  },

  async getMedicineById(id: string) {
    const response = await apiClient.get<Medicine>(`/medicines/${id}`)
    return response.data
  },

  async searchMedicines(query: string) {
    const response = await apiClient.get<Medicine[]>('/medicines/search', {
      params: { q: query },
    })
    return response.data
  },

  async getMedicinesByBarcode(barcode: string) {
    const response = await apiClient.get<Medicine>('/medicines/barcode', {
      params: { barcode },
    })
    return response.data
  },

  async createMedicine(data: Partial<Medicine>) {
    const response = await apiClient.post<Medicine>('/medicines', data)
    return response.data
  },

  async updateMedicine(id: string, data: Partial<Medicine>) {
    const response = await apiClient.patch<Medicine>(`/medicines/${id}`, data)
    return response.data
  },

  async getCategories() {
    const response = await apiClient.get<Category[]>('/medicines/categories')
    return response.data
  },

  async createCategory(data: Partial<Category>) {
    const response = await apiClient.post<Category>('/medicines/categories', data)
    return response.data
  },

  async getBatches(medicineId: string) {
    const response = await apiClient.get<MedicineBatch[]>(
      `/medicines/${medicineId}/batches`
    )
    return response.data
  },

  async getBatchById(batchId: string) {
    const response = await apiClient.get<MedicineBatch>(`/batches/${batchId}`)
    return response.data
  },
}
