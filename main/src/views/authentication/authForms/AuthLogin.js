import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { BorderAllRounded } from '@mui/icons-material';

const validationSchema = yup.object({
  usua_Nombre: yup.string().required('El Usuario es requerido'),
  usua_Contrasenia: yup.string().required('La Contraseña es requerida'),
});

const obtenerPantallasPermitidas = async (roleId, apiUrl, apiKey) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/RolesPorPantallas/DibujarMenu?role_Id=${roleId}`,
      {
        headers: { XApiKey: apiKey },
      }
    );

    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data.map((item) => item.pant_Nombre);
    } else {
      console.error('Error al obtener pantallas:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    return [];
  }
};

const AuthLogin = ({ title, subtitle, subtext }) => {
  useEffect(() => {
    const localStorageData = localStorage.getItem('DataUsuario');
    if (localStorageData) {
      window.location.href = '/dashboards/modern';
    }
  }, []);

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
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${apiUrl}/api/Usuarios/Login`, values, {
          headers: { XApiKey: apiKey },
        });

        if (response.status === 200 && response.data.success) {
          const usuario = response.data.data;
          localStorage.setItem('DataUsuario', JSON.stringify(usuario));

          const pantallasPermitidas = await obtenerPantallasPermitidas(
            usuario.role_Id,
            apiUrl,
            apiKey
          );
          localStorage.setItem('PantallasPermitidas', JSON.stringify(pantallasPermitidas));

          window.location.href = '/dashboards/modern';
        } else {
          formik.setErrors({
            usua_Nombre: 'El usuario o contraseña son incorrectos',
            usua_Contrasenia: 'El usuario o contraseña son incorrectos',
          });
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setAlertMessage(
          'Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo.'
        );
        setAlertSeverity('error');
        setOpenSnackbar(true);
        formik.setErrors({
          usua_Nombre: 'Error al iniciar sesión',
          usua_Contrasenia: 'Error al iniciar sesión',
        });
      }
    },
  });

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <AuthSocialButtons title="Sign in with" />

      <Box>
        <Divider>
          <Typography component="span" color="textSecondary" variant="h6" fontWeight="400" />
        </Divider>
      </Box>

      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: '#003857', mt: 3, textAlign: 'center' }}
      >
        Inicia sesión para continuar
      </Typography>

      <form
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="off"
        style={{ marginTop: '6px', px: 3 }}
      >
        <Stack>
          <Box mb={1}>
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
              placeholder="Nombre de usuario"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon/>
                  </InputAdornment>
                ),
              }}
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
              placeholder="Contraseña"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>
        <Box mt={3}>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Iniciar sesión
          </Button>
        </Box>
        <Stack justifyContent="space-around" direction="row" alignItems="center" mb={1.5}>
          <Typography
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{ textDecoration: 'none', color: '#003857' }}
          >
            ¿Olvidaste tu contraseña?
          </Typography>
        </Stack>

        <Box>
          <Divider>
            <Typography component="span" variant="h6" fontWeight="400" />O entra como
          </Divider>
        </Box>

        <Box mt={2}>
          <Button
            color="secondary"
            size="large"
            fullWidth
            onClick={async () => {
              try {
                const response = await axios.post(
                  `${apiUrl}/api/Usuarios/Login`,
                  { usua_Nombre: 'AccesoP.', usua_Contrasenia: '123321123321' },
                  {
                    headers: { XApiKey: apiKey },
                  }
                );
              
                if (response.status === 200 && response.data.success) {
                  const usuario = response.data.data;
                  localStorage.setItem('DataUsuario', JSON.stringify(usuario));
                
                  const pantallasPermitidas = await obtenerPantallasPermitidas(
                    usuario.role_Id,
                    apiUrl,
                    apiKey
                  );
                  localStorage.setItem('PantallasPermitidas', JSON.stringify(pantallasPermitidas));
                
                  window.location.href = '/dashboards/modern';
                } else {
                  setAlertMessage('El acceso público no está disponible en este momento.');
                  setAlertSeverity('error');
                  setOpenSnackbar(true);
                }
              } catch (error) {
                console.error('Error en el acceso público:', error);
                setAlertMessage(
                  'Ocurrió un error al intentar acceder como público. Por favor, inténtelo de nuevo.'
                );
                setAlertSeverity('error');
                setOpenSnackbar(true);
              }
            }}
          >
            Acceso Público
          </Button>
        </Box>
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