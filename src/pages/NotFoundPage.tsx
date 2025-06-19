import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 120px)" // Adjust height considering AppBar and Toolbar
      textAlign="center"
      p={3}
    >
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Página No Encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </Typography>
      <Button component={Link} to="/dashboard" variant="contained" color="primary">
        Volver al Dashboard
      </Button>
    </Box>
  );
};
