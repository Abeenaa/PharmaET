import { useAuthStore } from '@/hooks/useAuth'

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore()
  return { isAuthenticated, isLoading }
}

export function useRequireRole(roles: string[]) {
  const { userRole } = useAuthStore()
  return roles.includes(userRole || '')
}
