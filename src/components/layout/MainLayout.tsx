import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  // Avatar, // Removed, handled by UserProfileMenu
  // Menu, // Removed, handled by UserProfileMenu
  // MenuItem as MuiMenuItem, // Removed, handled by UserProfileMenu
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  LocalShipping,
  People,
  Assignment,
  BarChart,
  // AccountCircle, // Removed, handled by UserProfileMenu
  // Logout, // Removed, handled by UserProfileMenu
  // Settings, // Removed, handled by UserProfileMenu
  Category,
  Warning,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { usePermissions } from '@/hooks/usePermissions'; // Updated import path
import { Usuario } from '@/types';
import { UserProfileMenu } from './UserProfileMenu'; // Import the new component

const drawerWidth = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

interface MenuItemDef { // Renamed from MenuItem to avoid conflict if any other MenuItem exists
  text: string;
  icon: React.ReactElement;
  path: string;
  roles?: Usuario['rol'][];
  badge?: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Moved to UserProfileMenu

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const permissions = usePermissions();

  // menuItems definition remains the same
  const menuItems: MenuItemDef[] = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      text: 'Productos',
      icon: <Inventory />,
      path: '/productos',
      roles: ['admin', 'bodeguero'],
    },
    {
      text: 'Categorías',
      icon: <Category />,
      path: '/categorias',
      roles: ['admin', 'bodeguero'],
    },
    {
      text: 'Proveedores',
      icon: <LocalShipping />,
      path: '/proveedores',
      roles: ['admin', 'bodeguero'],
    },
    {
      text: 'Clientes',
      icon: <People />,
      path: '/clientes',
      roles: ['admin', 'vendedor', 'facturador'],
    },
    {
      text: 'Entradas',
      icon: <TrendingUp />,
      path: '/entradas',
      roles: ['admin', 'bodeguero'],
    },
    {
      text: 'Salidas',
      icon: <TrendingDown />,
      path: '/salidas',
      roles: ['admin', 'vendedor', 'facturador'],
    },
    {
      text: 'Inventario',
      icon: <Assignment />,
      path: '/inventario',
      roles: ['admin', 'bodeguero'],
      badge: 3, // Ejemplo: productos con stock bajo
    },
    {
      text: 'Reportes',
      icon: <BarChart />,
      path: '/reportes',
      roles: ['admin', 'bodeguero', 'facturador'],
    },
  ];


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // handleProfileMenuOpen and handleProfileMenuClose moved to UserProfileMenu

  const handleLogout = () => {
    logout();
    navigate('/login');
    // handleProfileMenuClose(); // This was part of old logout, not needed here as menu is separate
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return permissions.hasRole(item.roles);
  });

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          Inventario Médico
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname.startsWith(item.path) ? 'inherit' : 'text.secondary',
                }}
              >
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname.startsWith(item.path) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Inventario Médico
          </Typography>

          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error"> {/* Example badge, make dynamic */}
              <Warning />
            </Badge>
          </IconButton>

          {/* Render the new UserProfileMenu component */}
          <UserProfileMenu user={user} onLogout={handleLogout} />

        </Toolbar>
      </AppBar>

      {/* Menu for profile items removed, it's now inside UserProfileMenu */}

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'grey.100',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
