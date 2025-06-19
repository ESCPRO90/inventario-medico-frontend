import React from 'react';
import { Box, Typography } from '@mui/material';

export const ReportesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reportes
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Generación de reportes del sistema.
      </Typography>
    </Box>
  );
};
