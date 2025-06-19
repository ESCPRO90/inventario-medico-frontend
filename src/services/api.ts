import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = '/login';
    }
    
    // Manejar otros errores
    if (error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción.');
    }
    
    if (error.response?.status === 404) {
      toast.error('Recurso no encontrado.');
    }
    
    if (error.response?.status >= 500) {
      toast.error('Error del servidor. Por favor, intenta más tarde.');
    }
    
    if (error.code === 'ECONNABORTED') {
      toast.error('La solicitud tardó demasiado tiempo.');
    }
    
    if (!error.response) {
      toast.error('Error de conexión. Verifica tu conexión a internet.');
    }
    
    return Promise.reject(error);
  }
);

export default api;