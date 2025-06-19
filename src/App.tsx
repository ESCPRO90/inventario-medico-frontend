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

// Store
import { useAuthStore } from '@/store/authStore';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Ruta de login */}
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

            {/* Rutas protegidas */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      {/* Dashboard */}
                      <Route path="/dashboard" element={<DashboardPage />} />

                      {/* Productos y Categorías */}
                      <Route path="/productos" element={<ProductosPage />} />
                      <Route path="/categorias" element={<CategoriasPage />} />

                      {/* Proveedores */}
                      <Route path="/proveedores" element={<ProveedoresPage />} />

                      {/* Clientes */}
                      <Route path="/clientes" element={<ClientesPage />} />

                      {/* Inventario */}
                      <Route path="/entradas" element={<EntradasPage />} />
                      <Route path="/salidas" element={<SalidasPage />} />
                      <Route path="/inventario" element={<InventarioPage />} />

                      {/* Reportes */}
                      <Route path="/reportes" element={<ReportesPage />} />

                      {/* Redirigir raíz a dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />

                      {/* Página 404 */}
                      <Route 
                        path="*" 
                        element={
                          <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <h2>Página no encontrada</h2>
                            <p>La página que buscas no existe.</p>
                          </div>
                        } 
                      />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>

        {/* Notificaciones Toast */}
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

        {/* React Query Devtools (solo en desarrollo) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;