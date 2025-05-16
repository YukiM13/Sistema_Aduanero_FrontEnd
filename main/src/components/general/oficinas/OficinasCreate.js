import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import OficinaModel from 'src/models/oficinamodel';

const validationSchema = yup.object({
  ofic_Nombre: yup.string().required('El nombre es requerido')
});

const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1;

const OficinasCreate = ({ onCancelar, onGuardadoExitoso }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: OficinaModel,
    validationSchema,
    onSubmit: (values) => {
      values.ofic_FechaCreacion = new Date().toISOString();
      values.usua_UsuarioCreacion = user; // ID del usuario actual
      
      axios.post(`${apiUrl}/api/Oficinas/Insertar`, values, {
        headers: { 'XApiKey': apiKey }
      })
      .then(() => {
        if (onGuardadoExitoso) onGuardadoExitoso();
      })
      .catch(error => {
        console.error('Error al insertar la oficina:', error);
      });
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={12} md={12} sm={12}>
            <CustomFormLabel>Nombre de la Oficina</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="ofic_Nombre"
              name="ofic_Nombre"
              type="text"
              value={formik.values.ofic_Nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ofic_Nombre && Boolean(formik.errors.ofic_Nombre)}
              helperText={formik.touched.ofic_Nombre && formik.errors.ofic_Nombre}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SaveIcon style={{ fontSize: '18px' }} />}
            >
              Guardar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCancelar}
              startIcon={<CancelIcon style={{ fontSize: '18px' }} />}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default OficinasCreate;
