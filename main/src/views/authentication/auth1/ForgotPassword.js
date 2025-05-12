import React, { useState } from 'react';
import { Grid, Box, Typography, Card, Button, Snackbar, Alert, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/bgdelogin.jpg';
import img from 'src/assets/images/logos/LOGOAZUL.svg';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleSendCode = async () => {
    if (!username.trim()) {
      setAlertConfig({ severity: 'error', message: 'El nombre de usuario es requerido.' });
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/api/Usuarios/UsuarioCorreo?usua_Nombre=${username}`, {
        headers: { 'XApiKey': apiKey },
      });

      if (response.data.success) {
        const [correo, codigo] = response.data.data.messageStatus.split(' ');

        setIsRedirecting(true);

        setTimeout(() => {
        }, 2000);

        await axios.post(`${apiUrl}/api/Email/EnviarCodigo`, {
          correoDestino: correo,
          codigo: codigo,
        }, {
          headers: { 'XApiKey': apiKey },
        });

        localStorage.setItem('ForgotPasswordUser', username);
        localStorage.setItem('ForgotPasswordCode', codigo);

        setTimeout(() => {
          navigate('/auth/two-steps');
        }, 2000);

        setAlertConfig({ severity: 'success', message: 'Código enviado al correo registrado.' });
        setOpenSnackbar(true);

      } else {
        setAlertConfig({ severity: 'error', message: response.data.message || 'Usuario no encontrado.' });
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error al enviar el código:', error);
      setAlertConfig({ severity: 'error', message: 'Error al enviar el código. Intente nuevamente.' });
      setOpenSnackbar(true);
    }
  };

  return (
    <PageContainer title="Enviar codigo" description="this is Forgot Password page">
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
          <Box p={4} sx={{ position: 'relative' }}>
            <Card elevation={20} sx={{ p: 4, backgroundColor: '#fff', position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                  <Typography variant="h3" gutterBottom sx={{ color: '#003857' }}>
                    Enviar Código
                  </Typography>
                </Box>
                <img src={img} alt="logo" width={180} style={{ marginTop: '8px' }} />
              </Box>
              <Box mt={4}>
                <CustomFormLabel htmlFor="username">Nombre de Usuario</CustomFormLabel>
                <CustomTextField
                  id="username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleSendCode}
                  disabled={isRedirecting}
                >
                  {isRedirecting ? 'Enviando Codigo...' : 'Enviar Código'}
                </Button>
              </Box>
              <Stack justifyContent="space-around" direction="row" alignItems="center" my={2}>
                <Typography
                  component={Link}
                  to="/auth/login"
                  fontWeight="500"
                  sx={{ textDecoration: 'none', color: 'primary.main' }}
                >
                  Volver al Login
                </Typography>
              </Stack>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ForgotPassword;