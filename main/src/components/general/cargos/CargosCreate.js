import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert, Button, Grid, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
  carg_Nombre: yup.string().required('El nombre del cargo es requerido'),
});

const CargosCreateComponent = ({ onCancelar, onGuardadoExitoso }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: {
      carg_Nombre: '',
    },
    validationSchema,
    onSubmit: (values) => {
      axios.post(`${apiUrl}/api/Cargos/Crear`, values, {
        headers: { 'XApiKey': apiKey },
      })
        .then(() => {
          if (onGuardadoExitoso) onGuardadoExitoso();
        })
        .catch((error) => {
          console.error('Error al crear el cargo:', error);
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
          <Grid item lg={12} md={12} sm={12}>
            <CustomFormLabel>Nombre del Cargo</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="carg_Nombre"
              name="carg_Nombre"
              type="text"
              value={formik.values.carg_Nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.carg_Nombre && Boolean(formik.errors.carg_Nombre)}
              helperText={formik.touched.carg_Nombre && formik.errors.carg_Nombre}
            />
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

export default CargosCreateComponent;
