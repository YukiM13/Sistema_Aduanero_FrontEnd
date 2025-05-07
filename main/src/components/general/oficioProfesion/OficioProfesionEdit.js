
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
    ofpr_Nombre: yup.string().required('La descripcion es requerida'),

});


   
const OficioEditComponent = ({ oficioProfesion,onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const formik = useFormik({
        
        initialValues: oficioProfesion,
        validationSchema,
        onSubmit: (values) => {
          values.usua_UsuarioModificacion = 1;
          values.ofpr_FechaModificacion =  new Date().toISOString()
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/Oficio_Profesiones/Editar`, values, {
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
                <Grid item lg={12} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Descripcion</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="ofpr_Nombre"
                            name="ofpr_Nombre"
                            type="text"
                            value={formik.values.ofpr_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ofpr_Nombre && Boolean(formik.errors.ofpr_Nombre)}
                            helperText={formik.touched.ofpr_Nombre && formik.errors.ofpr_Nombre}
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

export default OficioEditComponent;
