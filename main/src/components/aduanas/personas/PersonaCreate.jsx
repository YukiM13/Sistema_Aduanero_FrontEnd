
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import Persona from 'src/models/persona';
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
  pers_RTN: yup.string().required('El RTN es requerido'),
  pers_Nombre: yup.string().required('El nombre es requerido'),
  escv_Id: yup.number().required('El estado civil es requerido')
  .moreThan(0,'El estado civil es requerido'),
  pers_escvRepresentante: yup.number().required('El estado civil del representante es requerido').moreThan(0,'El estado civil del representante es requerido'),
  ofic_Id: yup.number().required('La oficina es requerida').moreThan(0,'La oficina es requerida'),
  ofpr_Id: yup.number().required('El oficio es requerido').moreThan(0,'El oficio es requerido'),
  pers_OfprRepresentante: yup.number().required('El oficio del representante es requerido').moreThan(0,'El oficio del representante es requerido'),

});


   
const PersonasCreateComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  const [estadosCiviles, setEstadosCiviles] = useState([]);
const [oficinas, setOficinas] = useState([]);
const [oficioProfesion, setOficioProfesion] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const listarEstadoCiviles = () => {
      axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setEstadosCiviles(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener los estados civiles:', error);
      });
  }  
  const listarOficinas = () => {
    axios.get(`${apiUrl}/api/Oficinas/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setOficinas(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las Oficinas:', error);
    });
} 
const listarOficioProfesion = () => {
  axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, {
    headers: {
      'XApiKey': apiKey
    }
  })
  .then(response => {
   
    setOficioProfesion(response.data.data);
   
  })
  .catch(error => {
    console.error('Error al obtener las oficioProfesiones:', error);
  });
}   

 
    

  const formik = useFormik({
        
        initialValues: Persona,
        validationSchema,
        onSubmit: (values) => {
          values.pers_FechaCreacion = new Date();
          values.pers_FechaModificacion = new Date();
          values.usua_UsuarioCreacion = 1;
          values.pers_RTN.replace(/\?/g, '');
          values.pers_FormaRepresentacion = Boolean(values.pers_FormaRepresentacion);
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/Personas/Insertar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar la persona:', error);
          });
          
        },
      });
      useEffect(() => {
        listarEstadoCiviles(); //Aca llamamos
        listarOficinas();
        listarOficioProfesion();
    
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.errors, formik.submitCount]);
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={6} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>RTN</CustomFormLabel>
                        <InputMask
                          mask="9999-9999-999999"
                          maskChar={null}
                          value={formik.values.pers_RTN}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={false}
                        >
                          {(inputProps) => (
                            <CustomTextField
                              {...inputProps}
                              fullWidth
                              id="pers_RTN"
                              name="pers_RTN"
                              error={formik.touched.pers_RTN && Boolean(formik.errors.pers_RTN)}
                              helperText={formik.touched.pers_RTN && formik.errors.pers_RTN}
                            />
                          )}
                        </InputMask>
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Nombres</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="pers_Nombre"
                            name="pers_Nombre"
                            type="text"
                            value={formik.values.pers_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.pers_Nombre && Boolean(formik.errors.pers_Nombre)}
                            helperText={formik.touched.pers_Nombre && formik.errors.pers_Nombre}
                        />
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                <CustomFormLabel>Estado Civil</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="escv_Id"
                  name="escv_Id"
                  value={formik.values.escv_Id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.escv_Id && Boolean(formik.errors.escv_Id)}
                  helperText={formik.touched.escv_Id && formik.errors.escv_Id}
                >
                  {estadosCiviles.map((estado) => (
                    <MenuItem key={estado.escv_Id} value={estado.escv_Id}>
                      {estado.escv_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Oficina</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="ofic_Id"
                          name="ofic_Id"
                          value={formik.values.ofic_Id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.ofic_Id && Boolean(formik.errors.ofic_Id)}
                          helperText={formik.touched.ofic_Id && formik.errors.ofic_Id}
                        >
                          {oficinas.map((estado) => (
                            <MenuItem key={estado.ofic_Id} value={estado.ofic_Id}>
                              {estado.ofic_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Oficio ó Profesion</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="ofpr_Id"
                          name="ofpr_Id"
                          value={formik.values.ofpr_Id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.ofpr_Id && Boolean(formik.errors.ofpr_Id)}
                          helperText={formik.touched.ofpr_Id && formik.errors.ofpr_Id}
                        >
                          {oficioProfesion.map((estado) => (
                            <MenuItem key={estado.ofpr_Id} value={estado.ofpr_Id}>
                              {estado.ofpr_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Estado Civil Representante</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="pers_escvRepresentante"
                          name="pers_escvRepresentante"
                          value={formik.values.pers_escvRepresentante}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.pers_escvRepresentante && Boolean(formik.errors.pers_escvRepresentante)}
                          helperText={formik.touched.pers_escvRepresentante && formik.errors.pers_escvRepresentante}
                        >
                          {estadosCiviles.map((estado) => (
                            <MenuItem key={estado.escv_Id} value={estado.escv_Id}>
                              {estado.escv_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Oficio ó Profesion Representante</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="pers_OfprRepresentante"
                          name="pers_OfprRepresentante"
                          value={formik.values.pers_OfprRepresentante}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.pers_OfprRepresentante && Boolean(formik.errors.pers_OfprRepresentante)}
                          helperText={formik.touched.pers_OfprRepresentante && formik.errors.pers_OfprRepresentante}
                        >
                          {oficioProfesion.map((estado) => (
                            <MenuItem key={estado.ofpr_Id} value={estado.ofpr_Id}>
                              {estado.ofpr_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
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

export default PersonasCreateComponent;
