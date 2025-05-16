import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import {
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import FormaEnvioModel from 'src/models/formasenviomodel'; // Asegúrate de que la ruta del modelo sea correcta
import StyledButton from 'src/components/shared/StyledButton';
// Esquema de validación
const validationSchema = yup.object({
  foen_Codigo: yup
    .string()
    .required('El código es requerido')
    .min(2, 'El código debe tener al menos 2 caracteres')
    .uppercase('El código debe estar en mayúsculas'),
  foen_Descripcion: yup
    .string()
    .required('La descripción es requerida'),
});

const FormasEnvioEdit = ({ formaId, onCancelar, onGuardadoExitoso }) => {
    const [formaInicial, setFormaInicial] = useState(null); // Estado para los datos cargados
    const [loading, setLoading] = useState(true); // Estado de carga
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
  
    // Cargar datos al montar el componente
    useEffect(() => {
      axios.get(`${apiUrl}/api/FormasEnvio/${formaId}`, {
        headers: { 'XApiKey': apiKey },
      })
        .then((response) => {
          setFormaInicial(response.data); // Guardar los datos en el estado
        })
        .catch((error) => {
          console.error('Error al cargar los datos de la forma de envío:', error);
        })
        .finally(() => {
          setLoading(false); // Terminar la carga
        });
    }, [formaId]);
  
    // Always call useFormik, even if loading is true
    const formik = useFormik({
      initialValues: {
        foen_Id: formaInicial?.foen_Id || '',
        foen_Codigo: formaInicial?.foen_Codigo || '',
        foen_Descripcion: formaInicial?.foen_Descripcion || '',
      },
      enableReinitialize: true,
      validationSchema,
      onSubmit: (values, { setSubmitting }) => {
        const modelo = new FormaEnvioModel(
          values.foen_Descripcion.trim(),
          values.foen_Codigo.trim()
        );
  
        modelo.foen_Id = values.foen_Id;
        modelo.usua_usuarioModificacion = 1; // Reemplazar con el usuario real
        modelo.foen_fechaModificacion = new Date().toISOString();
  
        axios.post(`${apiUrl}/api/FormasEnvio/Editar`, modelo, {
          headers: { 'XApiKey': apiKey }
        })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso();
          })
          .catch((error) => {
            console.error('Error al editar la forma de envío:', error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      },
    });
  
    // Conditional rendering for loading state
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      );
    }
  
    return (
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <CustomFormLabel>Código</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="foen_Codigo"
              name="foen_Codigo"
              value={formik.values.foen_Codigo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.foen_Codigo && Boolean(formik.errors.foen_Codigo)}
              helperText={formik.touched.foen_Codigo && formik.errors.foen_Codigo}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel>Descripción</CustomFormLabel>
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
  
  export default FormasEnvioEdit;
