
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Provincia from 'src/models/provinciaModel';
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
import OrdenCompraModel from 'src/models/ordenCompraModel';

const validationSchema = yup.object({
  orco_Id: yup.string().required('El orden de compra es requerido'),
  code_CantidadPrenda: yup.string().required('La cantidad de prenda es requerida'),
  esti_Id: yup.number().required('El estilo es requerido').moreThan(0,'El estilo es requerido'),
  tall_Id: yup.number().required('La talla es requerida').moreThan(0,'La talla es requerida'),
  code_Sexo: yup.string().required('El sexo es requerida'),
  colr_Id: yup.number().required('El color es requerido').moreThan(0,'El color es requerido'),
  proc_IdComienza: yup.number().required('El proceso ID es requerido').moreThan(0,'El proceso ID es requerido'),
  proc_IdActual: yup.number().required('El proceso ID es requerido').moreThan(0,'El proceso ID es requerido'),
  code_Unidad: yup.number().required('La unidad es requerida'),
  code_Valor: yup.number().required('El valor es requerido'),
  code_Impuesto: yup.number().required('La unidad es requerida'),
  code_EspecificacionEmbalaje: yup.number().required('La especificación de embalaje es requerida'),
  code_FechaProActual: yup.number().required('La fecha del proceso actual es requerida'),
});


   
const OrdenCompraDetallesCreateComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  const [ordenCompraDetalles, setOrdenCompraDetalle] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const listarOrdenCompraDetalles = () => {
      axios.get(`${apiUrl}/api/OrdenCompraDetalles/Listar?pais_EsAduana=true`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
            setOrdenCompraDetalle(response.data.data);
        }
      })
      .catch(error => {
        if (error.response) {
          console.error("Respuesta con error de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API. Petición enviada:", error.request);
        } else {
          console.error("Error en la configuración de Axios:", error.message);
        }
      });
      
  }  


  const formik = useFormik({
        
        initialValues: OrdenCompraModel,
        validationSchema,
        onSubmit: (values) => {

            console.log("Enviando datos al backend:", values); 

            if (Object.keys(formik.errors).length > 0) {
                setOpenSnackbar(true);
                return; // 👈 detiene el envío si hay errores
              }

        //   values.ciud_FechaCreacion = new Date();
        //   values.ciud_FechaModificacion = new Date();
        //   values.usua_UsuarioCreacion = 1;

        //   console.log("Valores antes de enviar:", values);
        //   axios.post(`${apiUrl}/api/OrdenCompraDetalles/Insertar`, values, {
        //     headers: { 'XApiKey': apiKey }
        //   })
        const datosParaEnviar = {
            orco_Id: values.orco_Id,
            code_CantidadPrenda: values.code_CantidadPrenda,
            esti_Id: values.esti_Id,
            tall_Id: values.tall_Id,
            code_Sexo: values.code_Sexo,
            colr_Id: values.colr_Id,
            proc_IdComienza: values.proc_Id,
            proc_IdActual: values.proc_Id,
            code_Unidad: values.code_Unidad,
            code_Valor: values.code_Valor,
            code_Impuesto: values.code_Impuesto,
            code_EspecificacionEmbalaje: values.code_EspecificacionEmbalaje,
            code_FechaProcActual: values.code_FechaProcActual,
            usua_UsuarioCreacion: 1,
            code_FechaCreacion: new Date()
          };

          console.log("Datos que se enviarán al backend:", datosParaEnviar);
          
          axios.post(`${apiUrl}/api/OrdenCompraDetalles/Insertar`, datosParaEnviar, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar el detalle de orden de compra:', error);
          });
          
        },
      });
      useEffect(() => {
        listarOrdenCompraDetalles(); //Aca llamamos
    
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.errors, formik.submitCount]);
    return (
    <div>
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                
                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Orden de compra ID</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="orco_Id"
                        name="orco_Id"
                        type="text"
                        value={formik.values.orco_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orco_Id && Boolean(formik.errors.orco_Id)}
                        helperText={formik.touched.orco_Id && formik.errors.orco_Id}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Cantidad de prendas</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="code_CantidadPrenda"
                        name="code_CantidadPrenda"
                        type="text"
                        value={formik.values.code_CantidadPrenda}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}l
                        error={formik.touched.code_CantidadPrenda && Boolean(formik.errors.code_CantidadPrenda)}
                        helperText={formik.touched.code_CantidadPrenda && formik.errors.code_CantidadPrenda}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Estilo</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="esti_Id"
                        name="esti_Id"
                        type="text"
                        value={formik.values.esti_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}l
                        error={formik.touched.esti_Id && Boolean(formik.errors.esti_Id)}
                        helperText={formik.touched.esti_Id && formik.errors.esti_Id}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Tallas</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="tall_Id"
                        name="tall_Id"
                        type="text"
                        value={formik.values.tall_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}l
                        error={formik.touched.tall_Id && Boolean(formik.errors.tall_Id)}
                        helperText={formik.touched.tall_Id && formik.errors.tall_Id}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Sexo</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="code_Sexo"
                        name="code_Sexo"
                        type="text"
                        value={formik.values.code_Sexo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.code_Sexo && Boolean(formik.errors.code_Sexo)}
                        helperText={formik.touched.code_Sexo && formik.errors.code_Sexo}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Color</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="colr_Id"
                        name="colr_Id"
                        type="text"
                        value={formik.values.colr_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}l
                        error={formik.touched.colr_Id && Boolean(formik.errors.colr_Id)}
                        helperText={formik.touched.colr_Id && formik.errors.colr_Id}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Proceso ID Comienzo</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="proc_Id"
                        name="proc_Id"
                        type="text"
                        value={formik.values.proc_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}l
                        error={formik.touched.proc_Id && Boolean(formik.errors.proc_Id)}
                        helperText={formik.touched.proc_Id && formik.errors.proc_Id}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Proceso ID Actual</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="proc_Id"
                        name="proc_Id"
                        type="text"
                        value={formik.values.proc_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.proc_Id && Boolean(formik.errors.proc_Id)}
                        helperText={formik.touched.proc_Id && formik.errors.proc_Id}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Unidades</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="code_Unidad"
                            name="code_Unidad"
                            type="text"
                            value={formik.values.code_Unidad}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.code_Unidad && Boolean(formik.errors.code_Unidad)}
                            helperText={formik.touched.code_Unidad && formik.errors.code_Unidad}
                        />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Valor</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="code_Valor"
                        name="code_Valor"
                        type="text"
                        value={formik.values.code_Valor}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}l
                        error={formik.touched.code_Valor && Boolean(formik.errors.code_Valor)}
                        helperText={formik.touched.code_Valor && formik.errors.code_Valor}
                    />                      
                </Grid>
                
                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Impuesto</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="code_Impuesto"
                        name="code_Impuesto"
                        type="text"
                        value={formik.values.code_Impuesto}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.code_Impuesto && Boolean(formik.errors.code_Impuesto)}
                        helperText={formik.touched.code_Impuesto && formik.errors.code_Impuesto}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Especificación de Embalaje</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="code_EspecificacionEmbalaje"
                            name="code_EspecificacionEmbalaje"
                            type="text"
                            value={formik.values.code_EspecificacionEmbalaje}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.code_EspecificacionEmbalaje && Boolean(formik.errors.code_EspecificacionEmbalaje)}
                            helperText={formik.touched.code_EspecificacionEmbalaje && formik.errors.code_EspecificacionEmbalaje}
                        />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel> Fecha del Proceso Actual</CustomFormLabel>
                    <CustomTextField
                    select
                    fullWidth
                    id="code_FechaProcActual"
                    name="code_FechaProcActual"
                    value={formik.values.code_FechaProcActual}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.code_FechaProcActual && Boolean(formik.errors.code_FechaProcActual)}
                    helperText={formik.touched.code_FechaProcActual && formik.errors.code_FechaProcActual}
                    >
                    {ordenCompraDetalles.map((pais) => (
                        <MenuItem key={pais.pais_Id} value={pais.pais_Id}>
                        {pais.pais_Nombre}
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

export default OrdenCompraDetallesCreateComponent;
