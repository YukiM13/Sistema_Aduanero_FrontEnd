import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import NivelComercial from 'src/models/nivelcomercial';
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
  nico_Codigo: yup.string().required('El código es requerido'),
  nico_Descripcion: yup.string().required('La descripción es requerida')
});


   
const NivelesComercialesCreateComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  
const [ciudades, setCiudades] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const listarNivelesComerciales = () => {
    axios.get(`${apiUrl}/api/NivelesComerciales/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setCiudades(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las ciudades:', error);
    });
} 
  

  const formik = useFormik({
        
        initialValues: NivelComercial,
        validationSchema,
        onSubmit: (values) => {
          values.nico_FechaCreacion = new Date().toISOString();
          values.usua_UsuarioCreacion = 1;
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/NIvelesComerciales/Insertar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar el nivel comercial:', error);
          });
          
        },
      });
      useEffect(() => {

        listarNivelesComerciales();
    
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.errors, formik.submitCount]);
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={6} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Código del nivel comercial</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="nico_Codigo"
                            name="nico_Codigo"
                            type="text"
                            value={formik.values.nico_Codigo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nico_Codigo && Boolean(formik.errors.nico_Codigo)}
                            helperText={formik.touched.nico_Codigo && formik.errors.nico_Codigo}
                        />
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Descripción</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="nico_Descripcion"
                            name="nico_Descripcion"
                            type="text"
                            value={formik.values.nico_Descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nico_Descripcion && Boolean(formik.errors.nico_Descripcion)}
                            helperText={formik.touched.nico_Descripcion && formik.errors.nico_Descripcion}
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

export default NivelesComercialesCreateComponent;