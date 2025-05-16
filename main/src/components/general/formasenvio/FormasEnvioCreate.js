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
import FormaEnvioModel from '../../../models/formasenviomodel';
import StyledButton from 'src/components/shared/StyledButton';
const validationSchema = yup.object({
  foen_Codigo: yup
    .string()
    .required('El código es requerido')
    .max(2, 'El código debe tener 2 caracteres como máximo'),
  foen_Descripcion: yup
    .string()
    .required('La descripción es requerida'),
});

const FormasEnvioCreate = ({ onCancelar, onGuardadoExitoso }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: {
      foen_Codigo: '',
      foen_Descripcion: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const formaEnvio = new FormaEnvioModel(values.foen_Descripcion.trim(), values.foen_Codigo.trim());

      axios.post(`${apiUrl}/api/FormasEnvio/Insertar`, formaEnvio, {
        headers: {
          'XApiKey': apiKey
        }
      })
        .then(() => {
          if (onGuardadoExitoso) onGuardadoExitoso();
          resetForm();
        })
        .catch((error) => {
          console.error('Error al guardar la forma de envío:', error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  // Manejador de cambio de código para convertirlo a mayúsculas y limitar a 2 caracteres
  const handleCodigoChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 2); // Convierte a mayúsculas y limita a 2 caracteres
    formik.setFieldValue('foen_Codigo', value);  // Actualiza el valor de foen_Codigo
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <CustomFormLabel>Código de la Forma de Envío</CustomFormLabel>
          <CustomTextField
            fullWidth
            id="foen_Codigo"
            name="foen_Codigo"
            value={formik.values.foen_Codigo}
            onChange={handleCodigoChange} // Usa el manejador de cambio
            onBlur={formik.handleBlur}
            error={formik.touched.foen_Codigo && Boolean(formik.errors.foen_Codigo)}
            helperText={formik.touched.foen_Codigo && formik.errors.foen_Codigo}
            inputProps={{ maxLength: 2 }} // Limita la longitud a 2 caracteres
          />
        </Grid>

        <Grid item xs={12}>
          <CustomFormLabel>Descripción de la Forma de Envío</CustomFormLabel>
          <CustomTextField
            fullWidth
            id="foen_Descripcion"
            name="foen_Descripcion"
            value={formik.values.foen_Descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.foen_Descripcion && Boolean(formik.errors.foen_Descripcion)}
            helperText={formik.touched.foen_Descripcion && formik.errors.foen_Descripcion}
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
  );
};

export default FormasEnvioCreate;
