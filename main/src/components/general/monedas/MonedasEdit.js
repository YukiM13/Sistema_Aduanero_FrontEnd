
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,

  } from '@mui/material';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
    mone_Codigo: yup.string().required('El Codigo es requerido'),
    mone_Descripcion: yup.string().required('La descripcion es requerida'),

});


   
const MonedaEditComponent = ({moneda, onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1;
  const formik = useFormik({
        
        initialValues: moneda,
        validationSchema,
        onSubmit: (values) => {
          values.usua_UsuarioModificacion = user;
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/Moneda/Editar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar la persona:', error);
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
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={6} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Codigo</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="mone_Codigo"
                            name="mone_Codigo"
                            type="text"
                            value={formik.values.mone_Codigo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.mone_Codigo && Boolean(formik.errors.mone_Codigo)}
                            helperText={formik.touched.mone_Codigo && formik.errors.mone_Codigo}
                        />
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Descripción</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="mone_Descripcion"
                            name="mone_Descripcion"
                            type="text"
                            value={formik.values.mone_Descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.mone_Descripcion && Boolean(formik.errors.mone_Descripcion)}
                            helperText={formik.touched.mone_Descripcion && formik.errors.mone_Descripcion}
                        />
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                <Grid item>
                    <Button variant="contained" color="error" onClick={onCancelar}
                         startIcon={<CancelIcon />}
                    >
                    Cancelar
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" type="submit"
                         startIcon={<SaveIcon />}
                    >
                    Guardar
                    </Button>
                </Grid>
            </Grid>
           
        </form >
        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Duración de la alerta
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          No puede haber campos vacios.
        </Alert>
      </Snackbar>                  

     
    </div>
  );
};

export default MonedaEditComponent;
