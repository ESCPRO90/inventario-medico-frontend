import { AxiosError } from 'axios'; // Import AxiosError at the top

// Tipos basados en tu backend del Sistema de Inventario Médico

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'bodeguero' | 'facturador' | 'vendedor';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  fecha_vencimiento?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  categoria?: Categoria;
}

export interface Proveedor {
  id: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  tipo: 'hospital' | 'clinica' | 'medico' | 'otro';
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  limite_credito?: number;
  credito_disponible?: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Entrada {
  id: number;
  numero_entrada: string;
  proveedor_id: number;
  fecha_entrada: string;
  estado: 'pendiente' | 'recibida' | 'anulada';
  total: number;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  proveedor?: Proveedor;
  detalles?: DetalleEntrada[];
}

export interface DetalleEntrada {
  id: number;
  entrada_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_vencimiento?: string;
  lote?: string;
  createdAt: string;
  updatedAt: string;
  producto?: Producto;
}

export interface Salida {
  id: number;
  numero_salida: string;
  cliente_id?: number;
  tipo: 'venta' | 'consignacion' | 'maleta' | 'devolucion';
  fecha_salida: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  total: number;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
  detalles?: DetalleSalida[];
}

export interface DetalleSalida {
  id: number;
  salida_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  producto?: Producto;
}

// Interfaces para el inventario
export interface InventarioItem {
  producto_id: number;
  producto_nombre: string;
  categoria_nombre: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  precio_compra: number;
  precio_venta: number;
  valor_inventario: number;
  fecha_vencimiento?: string;
  estado_stock: 'normal' | 'bajo' | 'critico' | 'exceso';
}

// Tipos para formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface ProductoForm {
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_maximo: number;
  fecha_vencimiento?: string;
}

export interface CategoriaForm {
  nombre: string;
  descripcion?: string;
}

export interface ProveedorForm {
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface ClienteForm {
  nombre: string;
  tipo: 'hospital' | 'clinica' | 'medico' | 'otro';
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  limite_credito?: number;
}

export interface EntradaForm {
  proveedor_id: number;
  fecha_entrada: string;
  observaciones?: string;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    fecha_vencimiento?: string;
    lote?: string;
  }[];
}

export interface SalidaForm {
  cliente_id?: number;
  tipo: 'venta' | 'consignacion' | 'maleta' | 'devolucion';
  fecha_salida: string;
  observaciones?: string;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

// Tipos para AuthState (usado en authStore.ts y tests)
export interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: Usuario, token: string) => void;
  setUser: (user: Usuario) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}


// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros y búsquedas
export interface ProductoFilters {
  nombre?: string;
  categoria_id?: number;
  stock_bajo?: boolean;
  proximo_vencer?: boolean;
  activo?: boolean;
}

export interface ProveedorFilters {
  nombre?: string;
  activo?: boolean;
}

export interface ClienteFilters {
  nombre?: string;
  tipo?: string;
  activo?: boolean;
}

export interface EntradaFilters {
  fecha_inicio?: string;
  fecha_fin?: string;
  proveedor_id?: number;
  estado?: string;
}

export interface SalidaFilters {
  fecha_inicio?: string;
  fecha_fin?: string;
  cliente_id?: number;
  tipo?: string;
  estado?: string;
}

// Tipos para reportes y estadísticas
export interface EstadisticasInventario {
  total_productos: number;
  productos_activos: number;
  productos_stock_bajo: number;
  productos_vencidos: number;
  valor_total_inventario: number;
}

export interface EstadisticasMovimientos {
  entradas_mes: number;
  salidas_mes: number;
  valor_entradas_mes: number;
  valor_salidas_mes: number;
}

// Tipos para errores de Axios personalizados
export interface ErrorCustomData {
  status?: number;
  message: string;
  originalError: unknown; // Se mantiene unknown porque el tipo original puede variar
}

export interface AxiosErrorWithCustomData extends AxiosError { // Use the imported AxiosError
  customData?: ErrorCustomData;
}

// Tipos para filtros de reportes
export interface ReporteInventarioFilters {
  fecha_inicio?: string;
  fecha_fin?: string;
  categoria_id?: number;
  proveedor_id?: number;
  // Considerar añadir más filtros específicos si son necesarios
}

export interface ReporteMovimientosFilters {
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo_movimiento?: 'entrada' | 'salida' | 'ajuste'; // Ejemplo de tipos de movimiento
  producto_id?: number;
  // Considerar añadir más filtros específicos si son necesarios
}