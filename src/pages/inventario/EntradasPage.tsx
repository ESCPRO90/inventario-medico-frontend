import React from 'react';
import { Box, Typography } from '@mui/material';

export const EntradasPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Entradas de Inventario
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Registro de entradas de productos.
      </Typography>
    </Box>
  );
};
