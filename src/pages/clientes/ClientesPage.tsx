import React from 'react';
import { Box, Typography } from '@mui/material';

export const ClientesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Clientes
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gestión de clientes.
      </Typography>
    </Box>
  );
};
