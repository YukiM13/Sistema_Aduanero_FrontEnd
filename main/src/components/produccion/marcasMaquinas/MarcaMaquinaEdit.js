
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import InputMask from 'react-input-mask';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,
    // MenuItem

  } from '@mui/material';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
  
    
    marq_Nombre: yup.string().required('La Nombre de la MarcaMaquina es requerida'),
  

});


   
const MarcaMaquinaEditComponent = ({MarcaMaquina, onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear

const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

 
    

  const formik = useFormik({
        
        initialValues: MarcaMaquina,
        validationSchema,
        onSubmit: (values) => {
          values.marq_FechaModificacion = new Date();
          values.usua_UsuarioModificacion = 1;
          
          
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/MarcasMaquinas/Editar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar la MarcaMaquina:', error);
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
                

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Nombre</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="marq_Nombre"
                            name="marq_Nombre"
                            type="text"
                            value={formik.values.marq_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.marq_Nombre && Boolean(formik.errors.marq_Nombre)}
                            helperText={formik.touched.marq_Nombre && formik.errors.marq_Nombre}
                        />

                        {/* <CustomFormLabel>Nombre</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="marq_Nombre"
                            name="marq_Nombre"
                            type="text"
                            value={formik.values.marq_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.marq_Nombre && Boolean(formik.errors.marq_Nombre)}
                            helperText={formik.touched.marq_Nombre && formik.errors.marq_Nombre}
                        /> */}
                  

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

export default MarcaMaquinaEditComponent;
