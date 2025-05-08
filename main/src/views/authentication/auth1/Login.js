import React from 'react';
import { Grid, Box, Typography, Card } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/bgdelogin.jpg';
import img from 'src/assets/images/logos/LOGOAZUL.svg';
import AuthLogin from '../authForms/AuthLogin';

const Login = () => (
  <PageContainer title="Login" description="this is Login page">
    <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
      <Grid
        item
        xs={12}
        sm={12}
        lg={7}
        xl={8}
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(rgb(48, 60, 97),rgb(0, 0, 0),rgb(48, 60, 97))',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.5',
          },
        }}
      >
        <Box position="relative">
          <Box
            alignItems="center"
            justifyContent="center"
            height={'calc(100vh)'}
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
            }}
          >
            <img
              src={img1}
              alt="bg"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -1,
                opacity: 1,
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        lg={5}
        xl={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="#003857"
      >
        <Box p={4} sx={{ position: 'relative'}}>
          <Card elevation={20} sx={{ p: 4, backgroundColor: '#fff', position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <Typography variant="h3" gutterBottom sx={{  color: '#003857' }}>
                  Bienvenido
                </Typography>
              </Box>
              <img src={img} alt="logo" width={180} style={{ marginTop: '8px' }} />
            </Box>
            <AuthLogin/>
          </Card>
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Login;
