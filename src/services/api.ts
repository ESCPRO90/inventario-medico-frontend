import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { AxiosErrorWithCustomData } from '../types'; // Ajusta la ruta si es necesario

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * @type {import('axios').AxiosInstance}
 * Pre-configured Axios instance for application API calls.
 * It includes the base URL, default headers, and timeout.
 * It also includes interceptors for request and response handling.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request interceptor to add the JWT token to the Authorization header.
 * @param {import('axios').InternalAxiosRequestConfig} config - The Axios request configuration.
 * @returns {import('axios').InternalAxiosRequestConfig} The modified request configuration.
 */
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

/**
 * Response interceptor to handle API responses and errors.
 *
 * Global Error Handling:
 * - 401 Unauthorized: Clears authentication data, shows a toast, and redirects to login.
 *
 * Structured Error Handling:
 * For other HTTP errors (4xx, 5xx) and network errors, it attaches a `customData` object
 * to the error, providing more context for the calling code (e.g., React Query mutations).
 *
 * `customData` includes:
 * - `status`: The HTTP status code.
 * - `message`: A default error message based on the status or error type.
 * - `originalError`: The original Axios error object.
 *
 * The promise is always rejected to allow specific error handling in the calling code.
 *
 * @param {import('axios').AxiosResponse} response - The Axios response object.
 * @returns {import('axios').AxiosResponse} The response object if successful.
 * @throws {import('../types').AxiosErrorWithCustomData} The Axios error object with added `customData`.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const customError = error as AxiosErrorWithCustomData;

    // Initialize customData on the error object
    customError.customData = {
      originalError: error,
      status: customError.response?.status,
      message: 'Ocurrió un error inesperado.', // Default error message
    };

    // Handle 401 Unauthorized errors (global handling)
    if (customError.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      // It's important to check if `window` is defined for SSR or test environments
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      // Reject with the original error to stop further processing in calling code
      return Promise.reject(customError);
    }

    // Handle other HTTP errors (4xx, 5xx)
    if (customError.response) {
      const status = customError.response.status;
      customError.customData.status = status; // Ensure status is set from response

      if (status === 403) {
        customError.customData.message = 'No tienes permisos para realizar esta acción.';
      } else if (status === 404) {
        customError.customData.message = 'Recurso no encontrado.';
      } else if (status >= 500) {
        customError.customData.message = 'Error del servidor. Por favor, intenta más tarde.';
      } else if (status >= 400 && status < 500) { // Catch-all for other 4xx errors
        customError.customData.message = 'Error en la solicitud. Verifica los datos enviados.';
      }
    } else if (customError.code === 'ECONNABORTED') {
      // Handle timeout errors
      customError.customData.message = 'La solicitud tardó demasiado tiempo.';
      customError.customData.status = undefined; // No HTTP status for timeout
    } else if (customError.request) {
      // Handle network errors (e.g., no internet connection after request is sent)
      // `error.request` is present but `error.response` is not
      customError.customData.message = 'Error de conexión. Verifica tu conexión a internet.';
      customError.customData.status = undefined; // No HTTP status for network error
    } else {
      // Handle errors in setting up the request that prevented it from being sent
      // (e.g. an issue in the request interceptor or a more fundamental network issue)
      customError.customData.message = 'Error al enviar la solicitud. Intenta de nuevo.';
      customError.customData.status = undefined;
    }

    // Reject the promise with the modified error, allowing calling code to handle it
    return Promise.reject(customError);
  }
);

export default api;
