import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Usuario, AuthState } from '@/types';

let mockUserForStore: Usuario | null = null;

vi.mock('../store/authStore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../store/authStore')>();
  const mockUseAuthStore = vi.fn((selector?: (state: AuthState) => unknown) => { // Changed any to unknown
    const state: AuthState = {
      user: mockUserForStore,
      isAuthenticated: !!mockUserForStore,
      token: null,
      isLoading: false,
      setAuth: vi.fn(),
      setUser: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn(),
    };
    return selector ? selector(state) : state;
  });

  return {
    ...actual,
    useAuthStore: mockUseAuthStore,
  };
});

import { usePermissions } from './usePermissions';
import { useAuthStore } from '../store/authStore';

const setMockedUser = (user: Usuario | null) => {
  mockUserForStore = user;
};

describe('usePermissions Hook', () => {
  beforeEach(() => {
    setMockedUser(null);
    (useAuthStore as MockedFunction<typeof useAuthStore>).mockClear();
  });

  describe('when no user is authenticated', () => {
    it('hasRole should return false for any role', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('admin')).toBe(false);
      expect(result.current.hasRole(['vendedor', 'bodeguero'])).toBe(false);
    });

    it('canManageProducts should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProducts()).toBe(false);
    });

    it('canManageProviders should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProviders()).toBe(false);
    });

    it('canManageClients should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageClients()).toBe(false);
    });

    it('canManageInventory should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageInventory()).toBe(false);
    });

    it('canCreateSales should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canCreateSales()).toBe(false);
    });

    it('canViewReports should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canViewReports()).toBe(false);
    });

    it('canManageUsers should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageUsers()).toBe(false);
    });
  });

  describe('when user is admin', () => {
    const adminUser: Usuario = { id: 1, nombre: 'Admin User', email: 'admin@example.com', rol: 'admin', activo: true, createdAt: 'sometime', updatedAt: 'sometime' };

    beforeEach(() => {
      setMockedUser(adminUser);
    });

    it('hasRole("admin") should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('admin')).toBe(true);
    });

    it('hasRole(["admin", "bodeguero"]) should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole(['admin', 'bodeguero'])).toBe(true);
    });

    it('hasRole("vendedor") should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('vendedor')).toBe(false);
    });

    it('canManageProducts should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProducts()).toBe(true);
    });
    it('canManageProviders should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProviders()).toBe(true);
    });
    it('canManageClients should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageClients()).toBe(true);
    });
    it('canManageInventory should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageInventory()).toBe(true);
    });
    it('canCreateSales should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canCreateSales()).toBe(true);
    });
    it('canViewReports should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canViewReports()).toBe(true);
    });
    it('canManageUsers should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageUsers()).toBe(true);
    });
  });

  describe('when user is bodeguero', () => {
    const bodegueroUser: Usuario = { id: 2, nombre: 'Bodeguero User', email: 'bodeguero@example.com', rol: 'bodeguero', activo: true, createdAt: 'sometime', updatedAt: 'sometime' };

    beforeEach(() => {
      setMockedUser(bodegueroUser);
    });

    it('hasRole("bodeguero") should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('bodeguero')).toBe(true);
    });
    it('hasRole("admin") should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('admin')).toBe(false);
    });
    it('canManageProducts should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProducts()).toBe(true);
    });
    it('canManageProviders should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProviders()).toBe(true);
    });
    it('canManageInventory should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageInventory()).toBe(true);
    });
    it('canViewReports should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canViewReports()).toBe(true);
    });
    it('canManageClients should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageClients()).toBe(false);
    });
    it('canCreateSales should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canCreateSales()).toBe(false);
    });
    it('canManageUsers should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageUsers()).toBe(false);
    });
  });

  describe('when user is vendedor', () => {
    const vendedorUser: Usuario = { id: 3, nombre: 'Vendedor User', email: 'vendedor@example.com', rol: 'vendedor', activo: true, createdAt: 'sometime', updatedAt: 'sometime' };

    beforeEach(() => {
      setMockedUser(vendedorUser);
    });

    it('hasRole("vendedor") should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('vendedor')).toBe(true);
    });
    it('canManageClients should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageClients()).toBe(true);
    });
    it('canCreateSales should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canCreateSales()).toBe(true);
    });
    it('canManageProducts should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProducts()).toBe(false);
    });
    it('canManageProviders should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProviders()).toBe(false);
    });
    it('canManageInventory should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageInventory()).toBe(false);
    });
    it('canViewReports should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canViewReports()).toBe(false);
    });
    it('canManageUsers should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageUsers()).toBe(false);
    });
  });

  describe('when user is facturador', () => {
    const facturadorUser: Usuario = { id: 4, nombre: 'Facturador User', email: 'facturador@example.com', rol: 'facturador', activo: true, createdAt: 'sometime', updatedAt: 'sometime' };

    beforeEach(() => {
      setMockedUser(facturadorUser);
    });

    it('hasRole("facturador") should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('facturador')).toBe(true);
    });
    it('canManageClients should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageClients()).toBe(true);
    });
    it('canCreateSales should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canCreateSales()).toBe(true);
    });
    it('canViewReports should return true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canViewReports()).toBe(true);
    });
    it('canManageProducts should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProducts()).toBe(false);
    });
    it('canManageProviders should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageProviders()).toBe(false);
    });
    it('canManageInventory should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageInventory()).toBe(false);
    });
    it('canManageUsers should return false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canManageUsers()).toBe(false);
    });
  });
});
