// src/views/FormasPago/FormasPagoCreate.js
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import {
  Button,
  Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StyledButton from 'src/components/shared/StyledButton';

import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import FormaPagoModel from 'src/models/formaspagomodel';

const validationSchema = yup.object({
  fopa_Descripcion: yup
    .string()
    .required('La descripción es requerida'),
});

const FormasPagoCreate = ({ onCancelar, onGuardadoExitoso }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: {
      fopa_Descripcion: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const formaPago = new FormaPagoModel(values.fopa_Descripcion.trim());

      axios.post(`${apiUrl}/api/FormasDePago/Insertar`, formaPago, {
        headers: {
          'XApiKey': apiKey,
        },
      })
        .then(() => {
          if (onGuardadoExitoso) onGuardadoExitoso();
          resetForm();
        })
        .catch((error) => {
          console.error('Error al guardar la forma de pago:', error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <CustomFormLabel>Descripción</CustomFormLabel>
          <CustomTextField
            fullWidth
            id="fopa_Descripcion"
            name="fopa_Descripcion"
            value={formik.values.fopa_Descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fopa_Descripcion && Boolean(formik.errors.fopa_Descripcion)}
            helperText={formik.touched.fopa_Descripcion && formik.errors.fopa_Descripcion}
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

export default FormasPagoCreate;
