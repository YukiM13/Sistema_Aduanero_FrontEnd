import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert, Button, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import Cargos from '../../../models/cargosmodel';
import StyledButton from 'src/components/shared/StyledButton';
const validationSchema = yup.object({
  carg_Nombre: yup.string().required('El nombre del cargo es requerido'),
});

const CargosEditComponent = ({ cargo = Cargos, onCancelar, onGuardadoExitoso }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1
  const formik = useFormik({
    initialValues: cargo,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      values.carg_FechaModificacion = new Date();
      values.usua_UsuarioModificacion = user;
      axios.post(`${apiUrl}/api/Cargos/Editar`, values, {
        headers: { 'XApiKey': apiKey },
      })
        .then(() => {
          if (onGuardadoExitoso) onGuardadoExitoso();
        })
        .catch((error) => {
          console.error('Error al editar el cargo:', error);
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
          <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                    <StyledButton  
                      sx={{}} 
                      title="Cancelar"
                      event={onCancelar}
                      variant="cancel"
                      >
                      
                    </StyledButton>
                    
                    <StyledButton  
                      sx={{}} 
                      title="Guardar"
                      type='submit'
                      variant="save"
                      >
                      
                    </StyledButton>
          
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

export default CargosEditComponent;
