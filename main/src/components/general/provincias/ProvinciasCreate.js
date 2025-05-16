
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Provincia from 'src/models/provinciaModel';
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
  pvin_Nombre: yup.string().required('El nombre es requerido'),
  pvin_Codigo: yup.string().required('El código es requerido'),
  pais_Id: yup.number().required('El país es requerido')
  .moreThan(0,'El país es requerido'),
});


   
const ProvinciasCreateComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  const [paises, setPaises] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const listarPaises = () => {
      axios.get(`${apiUrl}/api/Paises/Listar?pais_EsAduana=true`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
            setPaises(response.data.data);
        }
      })
      .catch(error => {
        if (error.response) {
          console.error("Respuesta con error de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API. Petición enviada:", error.request);
        } else {
          console.error("Error en la configuración de Axios:", error.message);
        }
      });
      
  }  


  const formik = useFormik({
        
        initialValues: Provincia,
        validationSchema,
        onSubmit: (values) => {

            console.log("Enviando datos al backend:", values); 

            if (Object.keys(formik.errors).length > 0) {
                setOpenSnackbar(true);
                return; // 👈 detiene el envío si hay errores
              }

        //   values.ciud_FechaCreacion = new Date();
        //   values.ciud_FechaModificacion = new Date();
        //   values.usua_UsuarioCreacion = 1;

        //   console.log("Valores antes de enviar:", values);
        //   axios.post(`${apiUrl}/api/Provincias/Insertar`, values, {
        //     headers: { 'XApiKey': apiKey }
        //   })
        const datosParaEnviar = {
            pvin_Codigo: values.pvin_Codigo,
            pvin_Nombre: values.pvin_Nombre,
            pais_Id: values.pais_Id,
            pvin_esAduana: true,
            usua_UsuarioCreacion: 1,
            pvin_FechaCreacion: new Date()
          };
          
          console.log("Datos que se enviarán al backend:", datosParaEnviar);
          
          axios.post(`${apiUrl}/api/Provincias/Insertar`, datosParaEnviar, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar el país:', error);
          });
          
        },
      });
      useEffect(() => {
        listarPaises(); //Aca llamamos
    
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.errors, formik.submitCount]);
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                
                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Código</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="pvin_Codigo"
                        name="pvin_Codigo"
                        type="text"
                        value={formik.values.pvin_Codigo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.pvin_Codigo && Boolean(formik.errors.pvin_Codigo)}
                        helperText={formik.touched.pvin_Codigo && formik.errors.pvin_Codigo}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Nombre</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="pvin_Nombre"
                            name="pvin_Nombre"
                            type="text"
                            value={formik.values.pvin_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.pvin_Nombre && Boolean(formik.errors.pvin_Nombre)}
                            helperText={formik.touched.pvin_Nombre && formik.errors.pvin_Nombre}
                        />
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                <CustomFormLabel>País</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="pais_Id"
                  name="pais_Id"
                  value={formik.values.pais_Id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pais_Id && Boolean(formik.errors.pais_Id)}
                  helperText={formik.touched.pais_Id && formik.errors.pais_Id}
                >
                  {paises.map((pais) => (
                    <MenuItem key={pais.pais_Id} value={pais.pais_Id}>
                      {pais.pais_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
                  
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

export default ProvinciasCreateComponent;
