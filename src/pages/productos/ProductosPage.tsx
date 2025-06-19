import React from 'react';
import { Box, Typography } from '@mui/material';

export const ProductosPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Productos
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gestión de productos del inventario médico.
      </Typography>
    </Box>
  );
};
