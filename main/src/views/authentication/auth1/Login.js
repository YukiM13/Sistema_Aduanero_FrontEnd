import React from 'react';
import { Grid, Box, Typography, Card } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/bgdelogin.jpg';
import img from 'src/assets/images/logos/LOGOAZUL.svg';
import AuthLogin from '../authForms/AuthLogin';

const Login = () => (
  <PageContainer title="Inicio Sesion" description="this is Login page">
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    >
      <img
        src={img1}
        alt="bg"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          filter: 'blur(1px)',
        }}
      />
    </Box>

    <Grid
      container
      sx={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={5}
        xl={4}
        sx={{
          ml: 'auto',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(107, 163, 194, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420,}}>
          <Card sx={{ backgroundColor: '#ffffff50', position: 'relative', zIndex: 1 , width: '100%'}}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <Typography variant="h3" gutterBottom sx={{ color: '#003857' }}>
                  Bienvenido
                </Typography>
              </Box>
              <img src={img} alt="logo" width={180} style={{ marginTop: '8px' }} />
            </Box>
            <AuthLogin />
          </Card>
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Login;