
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,
    MenuItem

  } from '@mui/material';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import StyledButton from 'src/components/shared/StyledButton';
const validationSchema = yup.object({
  copa_Descripcion: yup.string().required('El concepto es requerido')
});


   
const ConceptosDePagoEditComponent = ({concepto, onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  


 
    

  const formik = useFormik({
        
        initialValues: concepto,
        validationSchema,
        onSubmit: (values) => {
          values.copa_FechaModificacion = new Date();
          values.usua_UsuarioModificacion = 1;
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/ConceptoPago/Editar`, values, {
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
                  
                  <CustomFormLabel>Nombre del concepto de pago</CustomFormLabel>
                  <CustomTextField
                      fullWidth
                      id="copa_Descripcion"
                      name="copa_Descripcion"
                      type="text"
                      value={formik.values.copa_Descripcion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.copa_Descripcion && Boolean(formik.errors.copa_Descripcion)}
                      helperText={formik.touched.copa_Descripcion && formik.errors.copa_Descripcion}
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

export default ConceptosDePagoEditComponent;
