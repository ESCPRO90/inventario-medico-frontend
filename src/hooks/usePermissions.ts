import { useAuthStore } from '../store/authStore';
import { Usuario } from '../types';

export const usePermissions = () => {
  // Ensure useAuthStore is called to get the user.
  // If using selectors: const user = useAuthStore(state => state.user);
  // If getting the whole state: const { user } = useAuthStore();
  // Applying selector for performance:
  const user = useAuthStore(state => state.user);

  // Define UserRole based on Usuario type, specific to this hook's needs.
  type UserRole = Usuario['rol'];

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    const allowedRoles: UserRole[] = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.rol);
  };

  // Define specific permission checks based on hasRole
  const canManageProducts = () => hasRole(['admin', 'bodeguero']);
  const canManageProviders = () => hasRole(['admin', 'bodeguero']);
  const canManageClients = () => hasRole(['admin', 'vendedor', 'facturador']);
  const canManageInventory = () => hasRole(['admin', 'bodeguero']);
  const canCreateSales = () => hasRole(['admin', 'vendedor', 'facturador']);
  const canViewReports = () => hasRole(['admin', 'bodeguero', 'facturador']);
  const canManageUsers = () => hasRole('admin');

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
