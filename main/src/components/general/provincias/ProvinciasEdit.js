import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import {
  Button,
  Grid
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import ProvinciaModel from 'src/models/provinciaModel';
import StyledButton from 'src/components/shared/StyledButton';
const validationSchema = yup.object({
    pvin_Codigo: yup.string().required('El código de la provincia es requerido'),
    pvin_Nombre: yup.string().required('El nombre de la provincia es requerido'),
    pais_Id: yup.number().required('El país es requerido'),
});

const ProvinciasEdit = ({ provinciaInicial, onCancelar, onGuardadoExitoso }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
        
    initialValues: provinciaInicial,
    validationSchema,
    onSubmit: (values) => {
    //   values.pers_FechaModificacion = new Date();
    //   values.usua_UsuarioModificacion = 1;
    //   values.pers_RTN.replace(/\?/g, '');
    //   values.pers_FormaRepresentacion = Boolean(values.pers_FormaRepresentacion);
    //   console.log("Valores antes de enviar:", values);
    //   axios.post(`${apiUrl}/api/Ciudades/Editar`, values, {
    //     headers: { 'XApiKey': apiKey }
    //   })
    const datosParaEnviar = {
    pvin_Id: values.ciud_Id,
    pvin_Codigo: values.pvin_Codigo,
    pvin_Nombre: values.pvin_Nombre,
    pais_Id: values.pais_Id,
    pvin_esAduana: true,
    usua_UsuarioModificacion: 1,
    pvin_FechaModificacion: new Date()
    };
              
    console.log("Datos que se enviarán al backend:", datosParaEnviar);
    
    axios.post(`${apiUrl}/api/Provincias/Editar`, datosParaEnviar, {
    headers: { 
        'XApiKey': apiKey }
    })
    .then(() => {
        if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
      })
      .catch(error => {
        console.error('Error al editar la provincia:', error);
      });
      
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3} mb={3}>

      <Grid item lg={6} md={12} sm={12}>
          <CustomFormLabel>Código de la provincia</CustomFormLabel>
          <CustomTextField
            fullWidth
            id="pvin_Codigo"
            name="pvin_Codigo"
            value={formik.values.pvin_Codigo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pvin_Codigo && Boolean(formik.errors.pvin_Codigo)}
            helperText={formik.touched.pvin_Codigo && formik.errors.pvin_Codigo}
          />
        </Grid>

        <Grid item lg={6} md={12} sm={12}>
          <CustomFormLabel>Nombre de la provincia</CustomFormLabel>
          <CustomTextField
            fullWidth
            id="pvin_Nombre"
            name="pvin_Nombre"
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
            fullWidth
            id="pais_Id"
            name="pais_Id"
            value={formik.values.pais_Id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pais_Id && Boolean(formik.errors.pais_Id)}
            helperText={formik.touched.pais_Id && formik.errors.pais_Id}
          />
        </Grid>
      </Grid>

     
    </form>
  );
};

export default ProvinciasEdit;
