
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Aduana from 'src/models/aduana';
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

const validationSchema = yup.object({
  adua_Codigo: yup.string().required('El código es requerido'),
  adua_Nombre: yup.string().required('El nombre de la aduana es requerida'),
  adua_Direccion_Exacta: yup.string().required('La dirección es requerida'),
  ciud_Id: yup.number().required('La ciudad es requerida')
  .moreThan(0,'La ciudad es requerida')
});


   
const AduanasCreateComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  
const [ciudades, setCiudades] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1;

  const listarCiudades = () => {
    axios.get(`${apiUrl}/api/Ciudades/Listar`, {
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
        
        initialValues: Aduana,
        validationSchema,
        onSubmit: (values) => {
          values.adua_FechaCreacion = new Date().toISOString();
          values.usua_UsuarioCreacion = user;
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/Aduanas/Insertar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar la aduana:', error);
          });
          
        },
      });
      useEffect(() => {

        listarCiudades();
    
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.errors, formik.submitCount]);
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={6} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Código de la aduana</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="adua_Codigo"
                            name="adua_Codigo"
                            type="text"
                            value={formik.values.adua_Codigo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.adua_Codigo && Boolean(formik.errors.adua_Codigo)}
                            helperText={formik.touched.adua_Codigo && formik.errors.adua_Codigo}
                        />
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Nombre de la aduana</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="adua_Nombre"
                            name="adua_Nombre"
                            type="text"
                            value={formik.values.adua_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.adua_Nombre && Boolean(formik.errors.adua_Nombre)}
                            helperText={formik.touched.adua_Nombre && formik.errors.adua_Nombre}
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
                  helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
                >
                  {ciudades.map((ciudad) => (
                    <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
                      {ciudad.ciud_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Dirección exacta</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="adua_Direccion_Exacta"
                            name="adua_Direccion_Exacta"
                            type="text"
                            value={formik.values.adua_Direccion_Exacta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.adua_Direccion_Exacta && Boolean(formik.errors.adua_Direccion_Exacta)}
                            helperText={formik.touched.adua_Direccion_Exacta && formik.errors.adua_Direccion_Exacta}
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

export default AduanasCreateComponent;