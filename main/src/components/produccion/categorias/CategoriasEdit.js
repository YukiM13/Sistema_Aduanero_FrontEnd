import React from 'react';
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
import StyledButton from 'src/components/shared/StyledButton';
const validationSchema = yup.object({
  cate_Descripcion: yup.string().required('La descripción es requerida')
});

const CategoriasEdit = ({ categoria, onCancelar, onGuardadoExitoso }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: categoria,
    validationSchema,
    onSubmit: (values) => {
      values.cate_FechaModificacion = new Date().toISOString();
      values.usua_UsuarioModificacion = 1; // ID del usuario actual
      
      axios.post(`${apiUrl}/api/Categoria/Editar`, values, {
        headers: { 'XApiKey': apiKey }
      })
      .then(() => {
        if (onGuardadoExitoso) onGuardadoExitoso();
      })
      .catch(error => {
        console.error('Error al actualizar la categoría:', error);
      });
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={12} md={12} sm={12}>
            <CustomFormLabel>Descripción de la Categoría</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="cate_Descripcion"
              name="cate_Descripcion"
              type="text"
              value={formik.values.cate_Descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cate_Descripcion && Boolean(formik.errors.cate_Descripcion)}
              helperText={formik.touched.cate_Descripcion && formik.errors.cate_Descripcion}
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
    </div>
  );
};

export default CategoriasEdit;
