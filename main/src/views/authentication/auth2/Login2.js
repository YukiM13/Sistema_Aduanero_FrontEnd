import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
  usua_Nombre: yup.string().required('El Nombre es requerido'),
  usua_Contrasenia: yup.string().required('La Contraseña es requerida'),
});

const Login2 = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: {
      usua_Nombre: '',
      usua_Contrasenia: '',
    },
    validationSchema,
    onSubmit: (values) => {
      axios
        .post(`${apiUrl}/api/Usuarios/Login`, values, {
          headers: { XApiKey: apiKey },
        })
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            localStorage.setItem('DataUsuario', JSON.stringify(response.data.data));
            window.location.href = '/dashboards/modern';
          } else {
            setAlertMessage(response.data.message || 'Error desconocido.');
            setAlertSeverity('error');
            setOpenSnackbar(true);
          }
        })
        .catch((error) => {
          console.error('Error al iniciar sesión:', error);
          setAlertMessage('Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo.');
          setAlertSeverity('error');
          setOpenSnackbar(true);
        });
    },
  });

  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      formik.setFieldTouched('usua_Nombre', true);
      formik.setFieldTouched('usua_Contrasenia', true);
    }
  }, [formik.errors, formik.submitCount]);

  return (
    <PageContainer title="Login" description="Login page">
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: '100vh' }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card elevation={3}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Logo />
              <Typography variant="h4" gutterBottom>
                Bienvenido
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Inicia sesión para continuar
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {/* Form wrapper */}
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>
                  <CustomFormLabel htmlFor="usua_Nombre">Nombre</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="usua_Nombre"
                    name="usua_Nombre"
                    value={formik.values.usua_Nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.usua_Nombre && Boolean(formik.errors.usua_Nombre)}
                    helperText={formik.touched.usua_Nombre && formik.errors.usua_Nombre}
                  />
                  <CustomFormLabel htmlFor="usua_Contrasenia">Contraseña</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="usua_Contrasenia"
                    name="usua_Contrasenia"
                    type="password"
                    value={formik.values.usua_Contrasenia}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.usua_Contrasenia && Boolean(formik.errors.usua_Contrasenia)}
                    helperText={formik.touched.usua_Contrasenia && formik.errors.usua_Contrasenia}
                  />
                </Stack>
                <Stack spacing={2} sx={{ p: 3 }} alignItems="center">
                  <Button variant="contained" type="submit">
                    Guardar
                  </Button>
                  <Link to="/auth/register">Create an account</Link>
                </Stack>
              </form>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Login2;