import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuración del cliente de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
      retry: (failureCount, error: any) => {
        // No reintentar en errores 404 o 401
        if (error?.response?.status === 404 || error?.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Keys para las queries - ayuda a organizar y invalidar cache
export const queryKeys = {
  // Autenticación
  auth: ['auth'] as const,
  profile: ['auth', 'profile'] as const,

  // Productos
  productos: ['productos'] as const,
  producto: (id: number) => ['productos', id] as const,
  productosSearch: (filters: any) => ['productos', 'search', filters] as const,
  productosStockBajo: ['productos', 'stock-bajo'] as const,
  productosProximosVencer: ['productos', 'proximos-vencer'] as const,

  // Categorías
  categorias: ['categorias'] as const,
  categoria: (id: number) => ['categorias', id] as const,

  // Proveedores
  proveedores: ['proveedores'] as const,
  proveedor: (id: number) => ['proveedores', id] as const,
  proveedoresActivos: ['proveedores', 'activos'] as const,

  // Clientes
  clientes: ['clientes'] as const,
  cliente: (id: number) => ['clientes', id] as const,
  clientesActivos: ['clientes', 'activos'] as const,

  // Entradas
  entradas: ['entradas'] as const,
  entrada: (id: number) => ['entradas', id] as const,
  entradasRecientes: ['entradas', 'recientes'] as const,

  // Salidas
  salidas: ['salidas'] as const,
  salida: (id: number) => ['salidas', id] as const,
  salidasRecientes: ['salidas', 'recientes'] as const,

  // Inventario
  inventario: ['inventario'] as const,
  inventarioResumen: ['inventario', 'resumen'] as const,
  kardex: (productoId: number) => ['inventario', 'kardex', productoId] as const,

  // Reportes
  reportes: ['reportes'] as const,
  reporteInventario: (filters: any) => ['reportes', 'inventario', filters] as const,
  reporteMovimientos: (filters: any) => ['reportes', 'movimientos', filters] as const,
  estadisticas: ['reportes', 'estadisticas'] as const,
} as const;

// Utilidades para invalidar queries
export const invalidateQueries = {
  productos: () => queryClient.invalidateQueries({ queryKey: queryKeys.productos }),
  categorias: () => queryClient.invalidateQueries({ queryKey: queryKeys.categorias }),
  proveedores: () => queryClient.invalidateQueries({ queryKey: queryKeys.proveedores }),
  clientes: () => queryClient.invalidateQueries({ queryKey: queryKeys.clientes }),
  entradas: () => queryClient.invalidateQueries({ queryKey: queryKeys.entradas }),
  salidas: () => queryClient.invalidateQueries({ queryKey: queryKeys.salidas }),
  inventario: () => queryClient.invalidateQueries({ queryKey: queryKeys.inventario }),
  reportes: () => queryClient.invalidateQueries({ queryKey: queryKeys.reportes }),
  all: () => queryClient.invalidateQueries(),
};

// Provider personalizado con configuración
export { QueryClientProvider, ReactQueryDevtools };