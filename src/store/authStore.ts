import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '@/types'; // Usuario might still be needed by AuthState

export interface AuthState { // Exporting AuthState if it's used elsewhere, or keep it local if not
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
    (set) => ({ // 'get' parameter removed as it's not used
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Set initial isLoading to true, to reflect potential initial auth check

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
        set({ user, isAuthenticated: !!user, isLoading: false }); // Also update isAuthenticated and isLoading
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
        // isLoading is often transient and might not need persistence,
        // but if persisted, it could cause issues if app closes while true.
        // For now, matching original persisted fields minus isLoading.
      }),
    }
  )
);

// Note: The `Usuario` import is kept as it's part of `AuthState`.
// If `AuthState` itself was only for `usePermissions`, `Usuario` import could be removed.
// The `get` parameter from `persist` callback was removed as it was not used.
// Changed initial `isLoading` to `true` - common practice for initial auth state.
// Ensured `setUser` also updates `isAuthenticated` and `isLoading`.
