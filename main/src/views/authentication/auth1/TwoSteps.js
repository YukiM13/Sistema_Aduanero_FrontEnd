import React, { useState } from 'react';
import { Grid, Box, Typography, Card, Button, Snackbar, Alert, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/bgdelogin.jpg';
import img from 'src/assets/images/logos/LOGOAZUL.svg';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TwoSteps = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    const input = value.slice(0, 6);

    if (input.length === 6) {
      setCode(input.split(''));
      document.getElementById(`code-input-5`).focus();
      return;
    }

    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  const handleVerifyCode = () => {
    setIsVerifying(true);
    const storedCode = localStorage.getItem('ForgotPasswordCode');
    const enteredCode = code.join('');

    setTimeout(() => {
      if (enteredCode !== storedCode) {
        setAlertConfig({ severity: 'error', message: 'El código ingresado es incorrecto.' });
        setOpenSnackbar(true);
        setIsVerifying(false);
        return;
      }

      setAlertConfig({ severity: 'success', message: 'Código verificado correctamente.' });
      setOpenSnackbar(true);
      setIsCodeVerified(true);
      setIsVerifying(false);
    }, 2000);
  };

  const handleChangePassword = async () => {
    const username = localStorage.getItem('ForgotPasswordUser');

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setAlertConfig({ severity: 'error', message: 'Ambos campos de contraseña son requeridos.' });
      setOpenSnackbar(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertConfig({ severity: 'error', message: 'Las contraseñas no coinciden.' });
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

        setIsRedirecting(true);

        setTimeout(() => navigate('/auth/login'), 1000);
      } else {
        setAlertConfig({ severity: 'error', message: response.data.message || 'Error al restablecer la contraseña.' });
        setOpenSnackbar(true);
      }
    } catch (error) {
      setAlertConfig({ severity: 'error', message: 'Error al restablecer la contraseña. Intente nuevamente.' });
      setOpenSnackbar(true);
    }
  };

  return (
    <PageContainer title="Restablecer Contraseña" description="this is Two Steps page">
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
            filter: 'blur(2px)',
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
            <Card elevation={20} sx={{ backgroundColor: '#ffffff30', position: 'relative', zIndex: 1, width: '110%' }}>
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
                    Verificación
                  </Typography>
                </Box>
                <img src={img} alt="logo" width={180} style={{ marginTop: '8px' }} />
              </Box>
              <Box mt={4}>
                {!isCodeVerified ? (
                  <>
                    <CustomFormLabel>Código de Seguridad</CustomFormLabel>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {code.map((digit, index) => (
                        <CustomTextField
                          key={index}
                          id={`code-input-${index}`}
                          value={digit}
                          onChange={(e) => handleCodeChange(e.target.value.toUpperCase(), index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', fontSize: '1.5rem' },
                          }}
                          sx={{ width: '3rem' }}
                        />
                      ))}
                    </Stack>
                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ mt: 3 }}
                      onClick={handleVerifyCode}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verificando...' : 'Verificar Código'}
                    </Button>
                  </>
                ) : (
                  <>
                    <CustomFormLabel htmlFor="newPassword">Nueva Contraseña</CustomFormLabel>
                    <CustomTextField
                      id="newPassword"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <CustomFormLabel htmlFor="confirmPassword" sx={{ mt: 2 }}>
                      Confirmar Contraseña
                    </CustomFormLabel>
                    <CustomTextField
                      id="confirmPassword"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ mt: 3 }}
                      onClick={handleChangePassword}
                      disabled={isRedirecting}
                    >
                      {isRedirecting ? 'Redirigiendo...' : 'Restablecer Contraseña'}
                    </Button>
                  </>
                )}
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

export default TwoSteps;