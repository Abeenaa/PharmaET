import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { User, UserRole } from '@/types/api.types';
import { authService } from '@/services/api/auth.service';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  error: string | null;
  initialized: boolean;

  // Actions
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

/**
 * Zustand store for authentication state
 * Persists token to localStorage
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  userRole: null,
  error: null,
  initialized: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        userRole: response.user.role,
        isLoading: false,
      });
      
      return response.user;
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      userRole: null,
    });
  },

  setUser: (user: User) => {
    set({ user, userRole: user.role });
  },

  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
    set({ token });
  },

  clearError: () => set({ error: null }),

  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const user = await authService.getCurrentUser();
        set({
          user,
          token,
          isAuthenticated: true,
          userRole: user.role,
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        userRole: null,
        initialized: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

/**
 * Hook for authentication
 * Usage: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const navigate = useNavigate();
  const store = useAuthStore();
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    // Only initialize once on app load
    if (!initialized) {
      store.initialize();
    }
  }, [initialized, store]);

  const login = useCallback(
    async (email: string, password: string) => {
      const user = await store.login(email, password);
      // Check if password change is required (first login)
      if (user?.requires_password_change) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    },
    [store, navigate]
  );

  const logout = useCallback(() => {
    store.logout();
    navigate('/login');
  }, [store, navigate]);

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    userRole: store.userRole,
    error: store.error,
    login,
    logout,
    clearError: store.clearError,
  };
}

/**
 * Check if user has specific role
 */
export function useHasRole(requiredRoles: UserRole | UserRole[]) {
  const { userRole } = useAuth();
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Check if user can access branch
 */
export function useCanAccessBranch(branchId: string) {
  const { user } = useAuth();
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  return user.branch_id === branchId;
}
