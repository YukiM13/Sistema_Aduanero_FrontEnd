import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
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
import PedidoOrdenModel from 'src/models/pedidoOrdenModel';

const validationSchema = yup.object({
  mate_Id: yup.number().required('El material es requerido').moreThan(0,'El material es requerido'),
  prod_Cantidad: yup.number().required('La cantidad es requerida').moreThan(0,'El material es requerido'),
  prod_Precio: yup.number().required('El precio es requerido').moreThan(0,'El material es requerido'),
});

   
const PedidoOrdenDetallesCreateComponent = ({ onCancelar, onGuardadoExitoso, pedidoOrdenId  }) => {
  const [ordenCompraDetalles, setOrdenCompraDetalle] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const listarMateriales = () => {
        axios.get(`${apiUrl}/api/Materiales/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
          if (response.data && Array.isArray(response.data.data)) {
            console.log("Materiales cargados:", response.data.data);
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
          ...PedidoOrdenModel,
        },
        validationSchema,
        onSubmit: (values) => {

          if (!pedidoOrdenId || pedidoOrdenId === 0) {
            console.error("Error: pedidoOrdenId no válido.");
            return;
          }
          
          console.log("Enviando datos al backend:", values); 

          const datosParaEnviar = {
            peor_Id: pedidoOrdenId,
            mate_Id: values.mate_Id,
            prod_Cantidad: values.prod_Cantidad,
            prod_Precio: values.prod_Precio,
            usua_UsuarioCreacion: 1
          };

          console.log("Datos que se enviarán al backend:", datosParaEnviar);
          console.log("pedidoOrdenId actual:", pedidoOrdenId);
          console.log("Formik values:", values);

          axios.post(`${apiUrl}/api/PedidosOrdenDetalles/Insertar`, datosParaEnviar, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso();
          })
          .catch(error => {
            console.error('Error al insertar el detalle de pedido orden:', error);
          });
        },
  });


      // useEffect(() => {
      //   listarEstilos();
      //   listarColores();
      //   listarTallas();
      //   listarProcesos();
    
      //   console.log("Errores actuales:", formik.errors);
      //   if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      //     setOpenSnackbar(true);
      //   }
      // }, [formik.submitCount, formik.errors]);

      useEffect(() => {
        listarMateriales();


        if (pedidoOrdenId) {
          formik.setFieldValue('peor_Id', pedidoOrdenId);
        }
      }, [pedidoOrdenId]);

    return (
    <div>
      
        <form onSubmit={formik.handleSubmit}>
          <CustomFormLabel>Nuevo detalle de pedido</CustomFormLabel>

            <Grid container spacing={3} mb={3}>

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
                    <Button variant="contained" type="submit"
                         startIcon={<SaveIcon />}
                    >
                    Guardar
                    </Button>
                </Grid>
            </Grid>
           
            <CustomFormLabel></CustomFormLabel>
        </form >
        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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

export default PedidoOrdenDetallesCreateComponent;