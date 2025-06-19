import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// useNavigate import removed as it's mocked globally and not directly used in this test file
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LoginPage } from './LoginPage';
import api from '@/services/api';
// useAuthStore import removed as it's mocked globally and not directly used in this test file
import { theme } from '@/theme';
import toast from 'react-hot-toast';
import { Usuario } from '@/types';

// --- Mocks ---
// Mock react-router-dom to spy on useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actualRouter = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actualRouter,
    useNavigate: () => mockNavigate,
  };
});

// Mock api service
vi.mock('@/services/api');

// Mock react-hot-toast
vi.mock('react-hot-toast');

// Mock useAuthStore to spy on setAuth and control initial state
const setAuthSpy = vi.fn();
const mockInitialAuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  setAuth: setAuthSpy,
  setUser: vi.fn(),
  logout: vi.fn(),
  setLoading: vi.fn(),
};

vi.mock('@/store/authStore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/authStore')>();
  return {
    ...actual,
    useAuthStore: vi.fn((selector?: (state: unknown) => unknown) => { // any changed to unknown
      // Return a static part of the state for LoginPage, or selected part.
      // LoginPage uses `setAuth` and checks `isAuthenticated` (from App.tsx context, but good to have a default)
      const stateToReturn = {
        ...mockInitialAuthState,
        // If a selector is provided, apply it. Otherwise, return the whole state.
        // This part might need adjustment based on how `useAuthStore` is called by `LoginPage`
        // LoginPage calls: const { setAuth } = useAuthStore();
        // So the mock should return an object that includes setAuth.
      };
      return selector ? selector(stateToReturn) : stateToReturn;
    }),
  };
});


// --- Test Setup ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for testing
    },
  },
});

const renderLoginPage = (initialEntries = ['/login']) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard Page</div>} />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
  return { user: userEvent.setup() };
};

describe('LoginPage Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    // Reset any specific state for useAuthStore mock if needed, e.g., if isAuthenticated changes
    // For now, setAuthSpy is cleared, and mockInitialAuthState is static.
    // If tests need to simulate an already authenticated state for LoginPage's own logic,
    // then mockInitialAuthState.isAuthenticated would need to be mutable here.
  });

  it('should log in successfully and navigate to dashboard', async () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test User', email: 'test@example.com', rol: 'admin', activo: true, createdAt: 'test', updatedAt: 'test' };
    const mockToken = 'fake-token';

    (api.post as Mock).mockResolvedValue({
      data: {
        success: true,
        data: { user: mockUser, token: mockToken },
      },
    });

    const { user } = renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(setAuthSpy).toHaveBeenCalledWith(mockUser, mockToken);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(`Bienvenido, ${mockUser.nombre}!`);
    });

    await waitFor(() => {
      // Check if navigation occurred to /dashboard
      // This can be by checking if the dashboard content is rendered
      // or by checking the mockNavigate function.
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      // expect(screen.getByTestId('dashboard-page')).toBeInTheDocument(); // Alternative
    });
  });

  it('should display error message for incorrect credentials (401)', async () => {
    (api.post as Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: 'Credenciales inválidas desde API' } }, // Simulate Axios error structure
      customData: { message: 'Email o contraseña incorrectos', status: 401 }, // Our custom structure
    });

    const { user } = renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      // LoginPage uses setError('root', ...) which populates errors.root.message
      // This message is then displayed in an Alert component.
      expect(screen.getByText(/email o contraseña incorrectos/i)).toBeInTheDocument();
    });

    expect(setAuthSpy).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    // expect(toast.error).toHaveBeenCalled(); // LoginPage doesn't call toast.error for 401/403 itself
  });

  it('should display error message for inactive account (403)', async () => {
    (api.post as Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 403, data: { message: 'Cuenta inactiva desde API' } },
      customData: { message: 'Tu cuenta está inactiva. Contacta al administrador.', status: 403 },
    });

    const { user } = renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'inactive@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/tu cuenta está inactiva. contacta al administrador./i)).toBeInTheDocument();
    });

    expect(setAuthSpy).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should display generic error message for other server errors', async () => {
    (api.post as Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: { message: 'Error interno del servidor' } },
      customData: { message: 'Error del servidor. Por favor, intenta más tarde.', status: 500 },
    });

    const { user } = renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      // LoginPage uses the customData.message if available, which is "Error del servidor. Por favor, intenta más tarde."
      expect(screen.getByText(/error del servidor. por favor, intenta más tarde./i)).toBeInTheDocument();
    });

    expect(setAuthSpy).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

});
