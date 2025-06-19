import React, { useState } from 'react';
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  Typography,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { AccountCircle, Logout, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Usuario } from '@/types';

interface UserProfileMenuProps {
  user: Usuario | null;
  onLogout: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleProfileMenuClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    handleProfileMenuClose(); // Though onLogout likely navigates, ensure menu closes
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="primary-search-account-menu"
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          {user?.nombre ? user.nombre.charAt(0).toUpperCase() : '?'}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose} // General close on any click inside menu for simplicity
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MuiMenuItem disabled>
          <Typography variant="subtitle2">{user?.nombre}</Typography>
        </MuiMenuItem>
        <MuiMenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            {user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : ''}
          </Typography>
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem onClick={() => handleNavigate('/perfil')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Perfil
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleNavigate('/configuracion')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configuración
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MuiMenuItem>
      </Menu>
    </>
  );
};
