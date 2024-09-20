import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, backgroundColor: '#f5f5f5', position: 'fixed', width: '100%', bottom: 0 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          Task & Job Management © 2024
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;