import React from 'react';
import {
  Box,
  // Grid, // Removed unused import
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Inventory,
  TrendingUp,
  TrendingDown,
  Warning,
  AttachMoney,
  People,
  LocalShipping,
  Assignment,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  trend?: {
    value: number;
    isUp: boolean;
  };
}

interface RecentActivity {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  type: 'entrada' | 'salida' | 'alerta';
  icon: React.ReactElement;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // Datos simulados (en producción vendrían de la API)
  const stats: StatCard[] = [
    {
      title: 'Total Productos',
      value: 1245,
      subtitle: 'En inventario',
      icon: <Inventory />,
      color: 'primary',
      trend: { value: 5.2, isUp: true },
    },
    {
      title: 'Stock Bajo',
      value: 23,
      subtitle: 'Requieren atención',
      icon: <Warning />,
      color: 'warning',
    },
    {
      title: 'Valor Inventario',
      value: '$125,340',
      subtitle: 'Total en stock',
      icon: <AttachMoney />,
      color: 'success',
      trend: { value: 2.1, isUp: true },
    },
    {
      title: 'Ventas del Mes',
      value: '$45,230',
      subtitle: 'Últimos 30 días',
      icon: <TrendingUp />,
      color: 'info',
      trend: { value: 8.4, isUp: true },
    },
    {
      title: 'Clientes Activos',
      value: 89,
      subtitle: 'Con compras recientes',
      icon: <People />,
      color: 'secondary',
    },
    {
      title: 'Proveedores',
      value: 34,
      subtitle: 'Registrados',
      icon: <LocalShipping />,
      color: 'primary',
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      title: 'Nueva entrada de mercancía',
      subtitle: 'Proveedor: MedSupply Corp - 150 productos',
      time: 'Hace 2 horas',
      type: 'entrada',
      icon: <TrendingUp />,
    },
    {
      id: 2,
      title: 'Venta realizada',
      subtitle: 'Cliente: Hospital Central - $2,450',
      time: 'Hace 4 horas',
      type: 'salida',
      icon: <TrendingDown />,
    },
    {
      id: 3,
      title: 'Stock bajo detectado',
      subtitle: 'Paracetamol 500mg - Solo 5 unidades',
      time: 'Hace 6 horas',
      type: 'alerta',
      icon: <Warning />,
    },
    {
      id: 4,
      title: 'Nueva entrada de mercancía',
      subtitle: 'Proveedor: FarmaCorp - 75 productos',
      time: 'Ayer',
      type: 'entrada',
      icon: <TrendingUp />,
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'entrada': return 'success';
      case 'salida': return 'info';
      case 'alerta': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido de vuelta, {user?.nombre}. Aquí tienes un resumen de tu inventario.
        </Typography>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        {stats.map((stat) => ( // index removed as stat.title can be used for key
          <Box key={stat.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}.main`,
                      mr: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                    {stat.trend && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Chip
                          size="small"
                          label={`${stat.trend.isUp ? '+' : '-'}${stat.trend.value}%`}
                          color={stat.trend.isUp ? 'success' : 'error'}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Actividad reciente y alertas */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr',
          },
          gap: 3,
        }}
      >
        <Box>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Actividad Reciente
              </Typography>
            </Box>
            <List>
              {recentActivities.map((activity) => ( // index removed as activity.id is used for key
                <ListItem
                  key={activity.id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: `${getActivityColor(activity.type)}.main`,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {activity.subtitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Warning sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Alertas de Stock
              </Typography>
            </Box>
            <Box sx={{ space: 2 }}>
              {[
                'Paracetamol 500mg (5 unidades)',
                'Ibuprofeno 400mg (8 unidades)',
                'Alcohol 70% (12 unidades)',
              ].map((producto) => ( // index removed, producto string itself will be key
                <Chip
                  key={producto}
                  label={producto}
                  color="warning"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1, mr: 1 }}
                />
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Resumen Rápido
            </Typography>
            <Box sx={{ space: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • 23 productos con stock bajo
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • 5 productos próximos a vencer
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • 12 entradas pendientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 8 salidas por confirmar
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};