import React from 'react';
import { Box, Typography } from '@mui/material';

export const InventarioPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventario General
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Vista general del inventario.
      </Typography>
    </Box>
  );
};
