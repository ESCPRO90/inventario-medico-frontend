import React from 'react';
import { Box, Typography } from '@mui/material';

export const CategoriasPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Categorías
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gestión de categorías de productos.
      </Typography>
    </Box>
  );
};
