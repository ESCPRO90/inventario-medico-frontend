import React from 'react';
import { Box, Typography } from '@mui/material';

export const SalidasPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Salidas de Inventario
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Registro de salidas de productos.
      </Typography>
    </Box>
  );
};
