import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, user, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    // Simular verificación de token al cargar
    const token = localStorage.getItem('token');
    if (token && !user) {
      setLoading(true);
      // Aquí podrías hacer una verificación del token con el backend
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [user, setLoading]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles si se especificaron
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.rol);
    if (!hasRequiredRole) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={2}
          p={3}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Acceso Denegado
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No tienes permisos suficientes para acceder a esta página.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tu rol actual: <strong>{user.rol}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Roles requeridos: <strong>{roles.join(', ')}</strong>
          </Typography>
        </Box>
      );
    }
  }

  return <>{children}</>;
};