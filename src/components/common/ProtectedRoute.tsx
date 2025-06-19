import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { Usuario } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Usuario['rol'][];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles
}) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const setLoading = useAuthStore(state => state.setLoading);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // If there's a token but no user object and not authenticated yet,
    // it implies a potential pending auth verification during initial app load.
    // Actual verification logic (e.g., API call to fetch user based on token)
    // should manage setting isLoading to false.
    if (token && !user && !isAuthenticated) {
      setLoading(true);
    } else if (isLoading && (user || !token)) {
      // If loading was true but we now have a user, or there's no token,
      // it's reasonable to stop loading. This covers cases where initial
      // auth state resolves quickly or token is invalid/removed.
      setLoading(false);
    }
    // This useEffect is a simplified approach. A robust solution would involve
    // an API call during app initialization to verify the token and fetch user data,
    // which would then be the source of truth for isLoading, isAuthenticated, and user state.
  }, [user, isAuthenticated, setLoading, isLoading]); // Added isLoading and isAuthenticated

  // Display loading indicator if auth state is still loading
  // This covers initial app load where token might be verifying
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

  // If not loading and not authenticated, or no user object exists, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and user exists, check roles if specified
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.rol);
    if (!hasRequiredRole) {
      // User does not have the required role(s), show access denied message
      // Or redirect to a dedicated "Access Denied" page
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="calc(100vh - 120px)" // Assuming some app bar height
          gap={2}
          p={3}
          textAlign="center"
        >
          <Typography variant="h4" color="error" gutterBottom>
            Acceso Denegado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No tienes los permisos necesarios para acceder a esta página.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Tu rol: {user.rol} | Roles requeridos: {roles.join(', ')})
          </Typography>
          {/* Consider adding a button to navigate back or to dashboard */}
        </Box>
      );
    }
  }

  // If all checks pass (authenticated, user exists, and has required roles if any), render children
  return <>{children}</>;
};
