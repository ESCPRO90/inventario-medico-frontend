import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '@/types';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: Usuario, token: string) => void;
  setUser: (user: Usuario) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user: Usuario, token: string) => {
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      },

      setUser: (user: Usuario) => {
        set({ user });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook para verificar permisos por rol
export const usePermissions = () => {
  const { user } = useAuthStore();

  // Use Usuario['rol'] to ensure type safety with defined roles
  type UserRole = Usuario['rol'];

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;

    const allowedRoles: UserRole[] = Array.isArray(roles) ? roles : [roles];
    // This check remains valid as user.rol is of type UserRole
    return allowedRoles.includes(user.rol);
  };

  const canManageProducts = () => hasRole(['admin', 'bodeguero']);
  const canManageProviders = () => hasRole(['admin', 'bodeguero']);
  const canManageClients = () => hasRole(['admin', 'vendedor', 'facturador']);
  const canManageInventory = () => hasRole(['admin', 'bodeguero']);
  const canCreateSales = () => hasRole(['admin', 'vendedor', 'facturador']);
  const canViewReports = () => hasRole(['admin', 'bodeguero', 'facturador']);
  const canManageUsers = () => hasRole('admin'); // This will also be type-checked

  return {
    hasRole,
    canManageProducts,
    canManageProviders,
    canManageClients,
    canManageInventory,
    canCreateSales,
    canViewReports,
    canManageUsers,
  };
};
