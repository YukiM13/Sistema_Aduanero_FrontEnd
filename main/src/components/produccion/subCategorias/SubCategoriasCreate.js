import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  Grid,
  MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import SubCategoriaModel from 'src/models/subcategoriamodel';
import StyledButton from 'src/components/shared/StyledButton';


const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1;

const validationSchema = yup.object({
  subc_Descripcion: yup.string().required('La descripción es requerida'),
  cate_Id: yup.number().required('La categoría es requerida').moreThan(0, 'La categoría es requerida')
});

const SubCategoriasCreate = ({ onCancelar, onGuardadoExitoso }) => {
  const [categorias, setCategorias] = useState([]);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const listarCategorias = () => {
    axios.get(`${apiUrl}/api/Categoria/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setCategorias(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las categorías:', error);
    });
  }

  const formik = useFormik({
    initialValues: SubCategoriaModel,
    validationSchema,
    onSubmit: (values) => {
      values.subc_FechaCreacion = new Date().toISOString();
      values.usua_UsuarioCreacion = user; // ID del usuario actual
      
      axios.post(`${apiUrl}/api/SubCategoria/Insertar`, values, {
        headers: { 'XApiKey': apiKey }
      })
      .then(() => {
        if (onGuardadoExitoso) onGuardadoExitoso();
      })
      .catch(error => {
        console.error('Error al insertar la subcategoría:', error);
      });
    },
  });

  useEffect(() => {
    listarCategorias();
  }, []);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Descripción de la Subcategoría</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="subc_Descripcion"
              name="subc_Descripcion"
              type="text"
              value={formik.values.subc_Descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subc_Descripcion && Boolean(formik.errors.subc_Descripcion)}
              helperText={formik.touched.subc_Descripcion && formik.errors.subc_Descripcion}
            />
          </Grid>

          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Categoría</CustomFormLabel>
            <CustomTextField
              select
              fullWidth
              id="cate_Id"
              name="cate_Id"
              value={formik.values.cate_Id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cate_Id && Boolean(formik.errors.cate_Id)}
              helperText={formik.touched.cate_Id && formik.errors.cate_Id}
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.cate_Id} value={categoria.cate_Id}>
                  {categoria.cate_Descripcion}
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

        
      </form>
    </div>
  );
};

export default SubCategoriasCreate;
