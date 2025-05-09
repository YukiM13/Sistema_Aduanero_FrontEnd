import React, { useState } from 'react';
import { Grid, Box, Typography, Card, Button, Snackbar, Alert } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/bgdelogin.jpg';
import img from 'src/assets/images/logos/LOGOAZUL.svg';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TwoSteps = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleVerifyCode = async () => {
    const storedCode = localStorage.getItem('ForgotPasswordCode');
    const username = localStorage.getItem('ForgotPasswordUser');

    if (code !== storedCode) {
      setAlertConfig({ severity: 'error', message: 'El código ingresado es incorrecto.' });
      setOpenSnackbar(true);
      return;
    }

    if (!newPassword.trim()) {
      setAlertConfig({ severity: 'error', message: 'La nueva contraseña es requerida.' });
      setOpenSnackbar(true);
      return;
    }

    try {
      const payload = {
        usua_Nombre: username,
        usua_Contrasenia: newPassword,
      };

      const response = await axios.post(`${apiUrl}/api/Usuarios/CambiarContrasenia`, payload, {
        headers: { 'XApiKey': apiKey },
      });

      if (response.data.success) {
        setAlertConfig({ severity: 'success', message: 'Contraseña restablecida correctamente.' });
        setOpenSnackbar(true);

        setTimeout(() => navigate('/auth/login'), 1000);
      } else {
        setAlertConfig({ severity: 'error', message: response.data.message || 'Error al restablecer la contraseña.' });
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setAlertConfig({ severity: 'error', message: 'Error al restablecer la contraseña. Intente nuevamente.' });
      setOpenSnackbar(true);
    }
  };

  return (
    <PageContainer title="Two Steps" description="this is Two Steps page">
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
                    Verificación en Dos Pasos
                  </Typography>
                </Box>
                <img src={img} alt="logo" width={180} style={{ marginTop: '8px' }} />
              </Box>
              <Box mt={4}>
                <CustomFormLabel htmlFor="code">Código de Seguridad</CustomFormLabel>
                <CustomTextField
                  id="code"
                  variant="outlined"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <CustomFormLabel htmlFor="newPassword" sx={{ mt: 3 }}>
                  Nueva Contraseña
                </CustomFormLabel>
                <CustomTextField
                  id="newPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleVerifyCode}
                >
                  Restablecer Contraseña
                </Button>
              </Box>
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

export default TwoSteps;