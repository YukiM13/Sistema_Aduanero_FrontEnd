
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Proveedor from 'src/models/proveedor';
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
  prov_NombreCompania: yup.string().required('El nombre es requerido'),
  prov_NombreContacto: yup.string().required('El contacto es requerido'),
  prov_Telefono: yup.string().required('El teléfono es requerido'),
  prov_CodigoPostal: yup.string().required('El código postal es requerido'),
  prov_Ciudad: yup.number().required('La ciudad es requerida')
  .moreThan(0,'La ciudad es requerida'),
  prov_DireccionExacta: yup.string().required('La dirección es requerida'),
  prov_CorreoElectronico: yup.string().required('El correo es requerido'),
  prov_Fax: yup.string().required('El fax es requerido')
});


   
const ProveedoresCreateComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  
const [ciudades, setCiudades] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

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
        
        initialValues: Proveedor,
        validationSchema,
        onSubmit: (values) => {
          values.prov_FechaCreacion = new Date().toISOString();
          values.usua_UsuarioCreacion = 1;
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/Proveedores/Insertar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar el proveedor:', error);
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
                  
                        <CustomFormLabel>Nombre de la compañía</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="prov_NombreCompania"
                            name="prov_NombreCompania"
                            type="text"
                            value={formik.values.prov_NombreCompania}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prov_NombreCompania && Boolean(formik.errors.prov_NombreCompania)}
                            helperText={formik.touched.prov_NombreCompania && formik.errors.prov_NombreCompania}
                        />
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Nombre de contacto </CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="prov_NombreContacto"
                        name="prov_NombreContacto"
                        type="text"
                        value={formik.values.prov_NombreContacto}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.prov_NombreContacto && Boolean(formik.errors.prov_NombreContacto)}
                        helperText={formik.touched.prov_NombreContacto && formik.errors.prov_NombreContacto}
                    />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Teléfono</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="prov_Telefono"
                        name="prov_Telefono"
                        type="text"
                        value={formik.values.prov_Telefono}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.prov_Telefono && Boolean(formik.errors.prov_Telefono)}
                        helperText={formik.touched.prov_Telefono && formik.errors.prov_Telefono}
                    />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Código postal</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="prov_CodigoPostal"
                        name="prov_CodigoPostal"
                        type="text"
                        value={formik.values.prov_CodigoPostal}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.prov_CodigoPostal && Boolean(formik.errors.prov_CodigoPostal)}
                        helperText={formik.touched.prov_CodigoPostal && formik.errors.prov_CodigoPostal}
                    />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Ciudad</CustomFormLabel>
                    <CustomTextField
                    select
                    fullWidth
                    id="prov_Ciudad"
                    name="prov_Ciudad"
                    value={formik.values.prov_Ciudad}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.prov_Ciudad && Boolean(formik.errors.prov_Ciudad)}
                    helperText={formik.touched.prov_Ciudad && formik.errors.prov_Ciudad}
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
                        id="prov_DireccionExacta"
                        name="prov_DireccionExacta"
                        type="text"
                        value={formik.values.prov_DireccionExacta}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.prov_DireccionExacta && Boolean(formik.errors.prov_DireccionExacta)}
                        helperText={formik.touched.prov_DireccionExacta && formik.errors.prov_DireccionExacta}
                    />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Correo electrónico</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="prov_CorreoElectronico"
                        name="prov_CorreoElectronico"
                        type="text"
                        value={formik.values.prov_CorreoElectronico}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.prov_CorreoElectronico && Boolean(formik.errors.prov_CorreoElectronico)}
                        helperText={formik.touched.prov_CorreoElectronico && formik.errors.prov_CorreoElectronico}
                    />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Fax</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="prov_Fax"
                        name="prov_Fax"
                        type="text"
                        value={formik.values.prov_Fax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.prov_Fax && Boolean(formik.errors.prov_Fax)}
                        helperText={formik.touched.prov_Fax && formik.errors.prov_Fax}
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

export default ProveedoresCreateComponent;