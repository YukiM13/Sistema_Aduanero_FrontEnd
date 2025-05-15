import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import {
    Button,
    Grid,
    MenuItem
  } from '@mui/material';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
// import PedidoOrdenDetalleList from '../pedidoOrdenDetalle/PedidoOrdenDetalleList';

const validationSchema = yup.object({
    peor_Id: yup.number().required('El pedido orden es requerido'),
    mate_Id: yup.number().required('El material es requerido').moreThan(0, 'Debe ser mayor que cero'),
    prod_Cantidad: yup.number().required('La cantidad es requerida').moreThan(0,'La cantidad es requerida'),
    prod_Precio: yup.number().required('El precio es requerido').moreThan(0,'El precio es requerido'),
});


   
const PedidoOrdenDetalleEditComponent = ({pedidosOrdenesDetalles, onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  const { pedidoOrdenID } = useParams();
  const { peor_Id } = useParams();
  const [pedidosOrdenesDetalle, setPedidosOrdenesDetalle] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

 const listarPedidoOrdenDetalles = () => {
  const peor_Id = formik.values.peor_Id;

  if (!peor_Id) {
    console.error("❌ No se encontró el ID de la orden de pedido (peor_Id).");
    return;
  }

  console.log("📌 peor_Id:", peor_Id);

  axios.get(`${apiUrl}/api/PedidosOrdenDetalles/Listar?peor_Id=${peor_Id}`, {
    headers: {
      'XApiKey': apiKey
    }
  })
  .then(response => {
    if (response.data && Array.isArray(response.data.data)) {
      setPedidosOrdenesDetalle(response.data.data);
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
};


  const listarMateriales = () => {
          axios.get(`${apiUrl}/api/Materiales/Listar`, {
            headers: {
              'XApiKey': apiKey
            }
          })
          .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
              // console.log("Materiales cargados:", response.data.data);
              setMateriales(response.data.data);
            }
          })
          .catch(error => {
            console.error("Error al cargar materiales:", error);
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
      initialValues: {
        prod_Id: pedidosOrdenesDetalles.prod_Id,
        peor_Id: peor_Id || '',
        mate_Id: pedidosOrdenesDetalles.mate_Id,
        prod_Cantidad: pedidosOrdenesDetalles.prod_Cantidad,
        prod_Precio: pedidosOrdenesDetalles.prod_Precio,  
      },
      enableReinitialize: true,
      validationSchema,
      onSubmit: async (values, formikHelpers) => {
        const errors = await formikHelpers.validateForm();
    
        if (Object.keys(errors).length > 0) {
          // Marca todos los campos con error como "touched" para que se vean los mensajes
          formikHelpers.setTouched(
            Object.fromEntries(Object.keys(errors).map(key => [key, true]))
          );
          return;
        }
    
        const datosParaEnviar = {
          prod_Id: values.prod_Id, 
          peor_Id: values.peor_Id, 
          mate_Id: values.mate_Id,
          prod_Cantidad: values.prod_Cantidad,
          prod_Precio: values.prod_Precio,
          usua_UsuarioCreacion: 1,
          prod_FechaCreacion: new Date().toISOString()
        };
    
        console.log(peor_Id);
     // console.log("Datos que se enviarán al backend:", datosParaEnviar);

        axios
          .post(`${apiUrl}/api/PedidosOrdenDetalles/Editar`, datosParaEnviar, {
            headers: {
              'XApiKey': apiKey
            }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso();
          })
          .catch((error) => {
            console.error('Error al editar el detalle de orden de pedido:', error);
          });
      }
    });
    

      useEffect(() => {
        listarPedidoOrdenDetalles(); //Aca llamamos
        listarMateriales();
        
  //    console.log("Pedidos órdenes cargados:", pedidosOrdenesDetalle);
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.errors, formik.submitCount]);
      return (
        <>
          {!pedidosOrdenesDetalles ? (
            <p>Cargando datos...</p> // o un Spinner
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                
                  {/* <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Pedido Orden ID</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="peor_Id"
                        name="peor_Id"
                        type="number"
                        value={formik.values.peor_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.peor_Id && Boolean(formik.errors.peor_Id)}
                        helperText={formik.touched.peor_Id && formik.errors.peor_Id}
                        disabled={pedidoOrdenID ? true : false}
                    />                      
                  </Grid> */}
                  
                  <Grid item lg={6} md={12} sm={12}>             
                      <CustomFormLabel>Materiales</CustomFormLabel>
                      <CustomTextField
                          select
                          fullWidth
                          id="mate_Id"
                          name="mate_Id"
                          type="text"
                          value={formik.values.mate_Id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.mate_Id && Boolean(formik.errors.mate_Id)}
                          helperText={formik.touched.mate_Id && formik.errors.mate_Id}
                      >
                      {materiales && materiales.length > 0 ? (
                        materiales.map((material) => (
                          <MenuItem key={material.mate_Id} value={material.mate_Id}>
                            {material.mate_Descripcion}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No hay materiales disponibles</MenuItem>
                      )}
                    </CustomTextField>                        
                  </Grid>

                  <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Cantidad</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="prod_Cantidad"
                            name="prod_Cantidad"
                            type="number"
                            value={formik.values.prod_Cantidad}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prod_Cantidad && Boolean(formik.errors.prod_Cantidad)}
                            helperText={formik.touched.prod_Cantidad && formik.errors.prod_Cantidad}
                        />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Precio</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="prod_Precio"
                        name="prod_Precio"
                        type="number"
                        value={formik.values.prod_Precio}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.prod_Precio && Boolean(formik.errors.prod_Precio)}
                        helperText={formik.touched.prod_Precio && formik.errors.prod_Precio}
                    />                      
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
                      <Button variant="contained" type="submit" onClick={formik.handleSubmit}
                          startIcon={<SaveIcon />}
                      >
                      Guardar
                      </Button>
                  </Grid>
              </Grid>
            </form>
          )}
        </>
      );
};

export default PedidoOrdenDetalleEditComponent;
