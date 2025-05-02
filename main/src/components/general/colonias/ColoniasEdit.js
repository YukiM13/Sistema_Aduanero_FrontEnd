import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert, Button, Grid, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import Colonias from '../../../models/coloniasmodel'; // Import the Colonias model

const validationSchema = yup.object({
  colo_Nombre: yup.string().required('El nombre de la colonia es requerido'),
  ciud_Id: yup.number().required('La ciudad es requerida').moreThan(0, 'La ciudad es requerida'),
});

const ColoniasEditComponent = ({ colonia = Colonias, onCancelar, onGuardadoExitoso }) => {
  const [ciudades, setCiudades] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const listarCiudades = () => {
    axios.get(`${apiUrl}/api/Ciudades/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setCiudades(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener las ciudades:', error);
      });
  };

  useEffect(() => {
    listarCiudades();
  }, []);

  const handleCityChange = (event) => {
    const ciudadId = event.target.value;
    formik.setFieldValue('ciud_Id', ciudadId);
  };

  const formik = useFormik({
    initialValues: colonia,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      values.colo_FechaModificacion = new Date();
      values.usua_UsuarioModificacion = 1;
      axios.post(`${apiUrl}/api/Colonias/Editar`, values, {
        headers: { 'XApiKey': apiKey },
      })
        .then(() => {
          if (onGuardadoExitoso) onGuardadoExitoso();
        })
        .catch((error) => {
          console.error('Error al editar la colonia:', error);
        });
    },
  });

  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      setOpenSnackbar(true);
    }
  }, [formik.errors, formik.submitCount]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Nombre de la Colonia</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="colo_Nombre"
              name="colo_Nombre"
              type="text"
              value={formik.values.colo_Nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.colo_Nombre && Boolean(formik.errors.colo_Nombre)}
              helperText={formik.touched.colo_Nombre && formik.errors.colo_Nombre}
            />
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Ciudad</CustomFormLabel>
            <CustomTextField
              select
              fullWidth
              id="ciud_Id"
              name="ciud_Id"
              value={formik.values.ciud_Id}
              onChange={handleCityChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
              helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      overflowY: 'auto',
                    },
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                },
              }}
            >
              {ciudades.map((ciudad) => (
                <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
                  {ciudad.ciud_Nombre}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" spacing={2} mt={2}>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={onCancelar}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              type="submit"
              startIcon={<SaveIcon />}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          No puede haber campos vacíos.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ColoniasEditComponent;
