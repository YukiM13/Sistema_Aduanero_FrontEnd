import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';
import axios from 'axios';

const validationSchema = yup.object({
  usua_Nombre: yup.string().required('El Usuario es requerido'),
  usua_Contrasenia: yup.string().required('La Contraseña es requerida'),
});

const AuthLogin = ({ title, subtitle, subtext }) => {
  localStorage.removeItem('DataUsuario');

  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('error');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

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

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <AuthSocialButtons title="Sign in with" />
      <Box>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
          >
          </Typography>
        </Divider>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ color: '#003857', mt:5, textAlign:'center'  }}>
        Inicia sesión para continuar
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" style={{ marginTop: '6px', px: 3 }}>
        <Stack spacing={1}>
          <Box>
            <CustomFormLabel htmlFor="usua_Nombre">Usuario</CustomFormLabel>
            <CustomTextField
              id="usua_Nombre"
              name="usua_Nombre"
              variant="outlined"
              fullWidth
              value={formik.values.usua_Nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.usua_Nombre && Boolean(formik.errors.usua_Nombre)}
              helperText={formik.touched.usua_Nombre && formik.errors.usua_Nombre}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="usua_Contrasenia">Contraseña</CustomFormLabel>
            <CustomTextField
              id="usua_Contrasenia"
              name="usua_Contrasenia"
              type="password"
              variant="outlined"
              fullWidth
              value={formik.values.usua_Contrasenia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.usua_Contrasenia && Boolean(formik.errors.usua_Contrasenia)}
              helperText={formik.touched.usua_Contrasenia && formik.errors.usua_Contrasenia}
            />
          </Box>
        </Stack>
        <Box mt={3}>
          <Button color='primary' variant="contained" size="large" fullWidth type="submit">
            Iniciar sesión
          </Button>
        </Box>
        <Stack justifyContent="space-around" direction="row" alignItems="center" my={2}>
          <Typography
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            ¿Olvidaste tu contraseña?
          </Typography>
        </Stack>
      </form>

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

      {subtitle}
    </>
  );
};

export default AuthLogin;