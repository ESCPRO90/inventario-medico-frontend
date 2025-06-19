import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Configuración
import { theme } from '@/theme';
import { queryClient } from '@/hooks/useQuery';

// Componentes
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Páginas
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductosPage } from '@/pages/productos/ProductosPage';
import { CategoriasPage } from '@/pages/productos/CategoriasPage';
import { ProveedoresPage } from '@/pages/proveedores/ProveedoresPage';
import { ClientesPage } from '@/pages/clientes/ClientesPage';
import { EntradasPage } from '@/pages/inventario/EntradasPage';
import { SalidasPage } from '@/pages/inventario/SalidasPage';
import { InventarioPage } from '@/pages/inventario/InventarioPage';
import { ReportesPage } from '@/pages/reportes/ReportesPage';
import { NotFoundPage } from '@/pages/NotFoundPage'; // Import NotFoundPage

// Store
import { useAuthStore } from '@/store/authStore'; // Keep this for the login route redirect logic

const App: React.FC = () => {
  // Used to redirect if already authenticated and trying to access /login
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              } 
            />

            {/* Rutas principales protegidas por autenticación general */}
            <Route
              path="/*"
              element={
                // This ProtectedRoute ensures user is authenticated.
                // It does NOT apply specific roles here.
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      {/* Dashboard (no specific role, just needs authentication) */}
                      <Route path="dashboard" element={<DashboardPage />} />

                      {/* Productos y Categorías */}
                      <Route
                        path="productos"
                        element={
                          <ProtectedRoute roles={['admin', 'bodeguero']}>
                            <ProductosPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="categorias"
                        element={
                          <ProtectedRoute roles={['admin', 'bodeguero']}>
                            <CategoriasPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Proveedores */}
                      <Route
                        path="proveedores"
                        element={
                          <ProtectedRoute roles={['admin', 'bodeguero']}>
                            <ProveedoresPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Clientes */}
                      <Route
                        path="clientes"
                        element={
                          <ProtectedRoute roles={['admin', 'vendedor', 'facturador']}>
                            <ClientesPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Inventario */}
                      <Route
                        path="entradas"
                        element={
                          <ProtectedRoute roles={['admin', 'bodeguero']}>
                            <EntradasPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="salidas"
                        element={
                          <ProtectedRoute roles={['admin', 'vendedor', 'facturador']}>
                            <SalidasPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="inventario"
                        element={
                          <ProtectedRoute roles={['admin', 'bodeguero']}>
                            <InventarioPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Reportes */}
                      <Route 
                        path="reportes"
                        element={
                          <ProtectedRoute roles={['admin', 'bodeguero', 'facturador']}>
                            <ReportesPage />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Redirigir raíz ("/") a dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />

                      {/* Página 404 para cualquier otra ruta dentro del layout */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Consider a top-level 404 route if /* doesn't catch all unhandled non-layout paths */}
            {/* However, with this structure, all non-login paths go through the /* route */}
          </Routes>
        </Router>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#f44336',
                secondary: '#fff',
              },
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
