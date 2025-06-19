import React from 'react';
import { Box, Typography } from '@mui/material';

export const ProveedoresPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Proveedores
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gestión de proveedores.
      </Typography>
    </Box>
  );
};
