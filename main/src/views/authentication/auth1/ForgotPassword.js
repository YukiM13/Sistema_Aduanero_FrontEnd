import React, { useState } from 'react';
import { Grid, Box, Typography, Card, Button, Snackbar, Alert, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/bgdelogin.jpg';
import img from 'src/assets/images/logos/LOGOAZUL.svg';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { useNavigate, Link } from 'react-router-dom';
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
        setIsRedirecting(false);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error al enviar el código:', error);
      setIsRedirecting(false);
      setAlertConfig({ severity: 'error', message: 'Error al enviar el código. Intente nuevamente.' });
      setOpenSnackbar(true);
    }
  };

  return (
    <PageContainer title="Enviar codigo" description="this is Forgot Password page">
      {/* Imagen de fondo en toda la pantalla */}
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
          <Box sx={{ width: '100%', maxWidth: 420 }}>
            <Card sx={{ backgroundColor: '#ffffff50', position: 'relative', zIndex: 1, width: '100%' }}>
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
                  {isRedirecting ? 'Enviando Código...' : 'Enviar Código'}
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