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
import StyledButton from 'src/components/shared/StyledButton';

import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import EstadoCivilModel from 'src/models/estadocivilmodel';
import { string } from 'prop-types';

const validationSchema = yup.object({
  escv_Nombre: yup
    .string()
    .required('El nombre del estado civil es requerido')
    .transform((_, value) => {return value === '' ? undefined : value}),
  });

const EstadosCivilesCreate = ({ onCancelar, onGuardadoExitoso }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: {
      escv_Nombre: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const estadoCivil = new EstadoCivilModel(values.escv_Nombre.trim());
      console.log("Este es el valor de mi campo: ", values.escv_Nombre);
      

      axios.post(`${apiUrl}/api/EstadosCiviles/Insertar`, estadoCivil, {
        headers: {
          'XApiKey': apiKey
        }
      })
        .then(() => {
          if (onGuardadoExitoso && values.escv_Nombre.trim() !== ''){
            onGuardadoExitoso();
          } 
            
          resetForm();
        })
        .catch((error) => {
          console.error('Error al guardar el estado civil:', error);
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
          <CustomFormLabel>Nombre del Estado Civil</CustomFormLabel>
          <CustomTextField
            fullWidth
            id="escv_Nombre"
            name="escv_Nombre"
            value={formik.values.escv_Nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.escv_Nombre && Boolean(formik.errors.escv_Nombre)}
            helperText={formik.touched.escv_Nombre && formik.errors.escv_Nombre}
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

export default EstadosCivilesCreate;
