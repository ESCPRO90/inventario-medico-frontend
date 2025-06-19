import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LocalHospital,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { LoginForm, ApiResponse, Usuario, AxiosErrorWithCustomData } from '@/types';

// Esquema de validación
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  // Local isLoading removed
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth); // Using selector for setAuth

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Destructure isSubmitting
    setError,
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    // setIsLoading(true) removed; RHF handles isSubmitting
    try {
      const response = await api.post<ApiResponse<{
        user: Usuario;
        token: string;
      }>>('/auth/login', data);

      if (response.data.success) {
        const { user, token } = response.data.data;
        setAuth(user, token);
        toast.success(`Bienvenido, ${user.nombre}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      const err = error as AxiosErrorWithCustomData;
      console.error('Error en login:', err);

      const status = err.customData?.status ?? err.response?.status;
      const message = err.customData?.message;

      if (status === 401) {
        setError('root', {
          message: message || 'Email o contraseña incorrectos'
        });
      } else if (status === 403) {
        setError('root', {
          message: message || 'Tu cuenta está inactiva. Contacta al administrador.'
        });
      } else {
        setError('root', {
          message: message || 'Error de conexión. Intenta nuevamente.'
        });
      }
    }
    // finally { setIsLoading(false) } removed; RHF handles isSubmitting
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          {/* Logo y título */}
          <Box sx={{ mb: 3 }}>
            <LocalHospital
              sx={{
                fontSize: 60,
                color: 'primary.main',
                mb: 2
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Inventario Médico
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Ingresa a tu cuenta para continuar
            </Typography>
          </Box>

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            {/* Error general */}
            {errors.root && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.root.message}
              </Alert>
            )}

            {/* Campo Email */}
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              disabled={isSubmitting} // Disable fields when submitting
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Campo Contraseña */}
            <TextField
              {...register('password')}
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              disabled={isSubmitting} // Disable fields when submitting
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={isSubmitting} // Disable toggle when submitting
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Botón Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting} // Use isSubmitting for disabled state
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {isSubmitting ? ( // Use isSubmitting for loader display
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </Box>

          {/* Información adicional */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Sistema de Inventario Médico v1.0.0
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
