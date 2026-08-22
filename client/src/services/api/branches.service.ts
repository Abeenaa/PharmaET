import { apiClient } from './auth.service'
import { Branch } from '@/types/api.types'

export const branchesService = {
  async getAllBranches() {
    const response = await apiClient.get<Branch[]>('/branches')
    return response.data
  },

  async getBranchById(id: string) {
    const response = await apiClient.get<Branch>(`/branches/${id}`)
    return response.data
  },
}
