import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,
    MenuItem,
    FormHelperText,
    Radio,
    FormControlLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import OrdenCompraModel from 'src/models/ordenCompraModel';
import StyledButton from 'src/components/shared/StyledButton';

const validationSchema = yup.object({
  orco_IdCliente: yup.number().required('El cliente es requerido'),
  orco_FechaEmision: yup.date().required('La fecha emisión es requerida'),
  orco_FechaLimite: yup.date().required('La fecha limite es requerida'),
  orco_MetodoPago: yup.number().required('El método de pago es requerido'),
  orco_Materiales: yup.bool().required('El material es requerido'),
  orco_IdEmbalaje: yup.number().required('El embalaje ID es requerido'),
  orco_EstadoOrdenCompra: yup.string().required('El estado orden compra es requerido'),
  orco_DireccionEntrega: yup.string().required('La dirección de entrega es requerida'),
  orco_Codigo: yup.string().required('El código es requerido')
});

   
const OrdenCompraEditComponent = ({ ordenCompra, onCancelar, onGuardadoExitoso }) => {
//   const [ordenCompraDetalles, setOrdenCompraDetalle] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [formasDePago, setFormasDePagos] = useState([]);
  const [embalajes, setEmbalajes] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); 

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().split('T')[0]; // "2025-05-09"
  };

  const listarClientes = () => {
        axios.get(`${apiUrl}/api/Clientes/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
          if (response.data && Array.isArray(response.data.data)) {
            console.log("Clientes cargados:", response.data.data);
            setClientes(response.data.data);
          }
        })
        .catch(error => {
          console.error("Error al cargar clientes:", error);
          if (error.response) {
            console.error("Respuesta con error de la API:", error.response.data);
          } else if (error.request) {
            console.error("No hubo respuesta de la API. Petición enviada:", error.request);
          } else {
            console.error("Error en la configuración de Axios:", error.message);
          }
        });
    }  

    const listarFormasDePago = () => {
      axios.get(`${apiUrl}/api/FormasDePago/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log("Formas de pago cargados:", response.data.data);
          setFormasDePagos(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar formas de pago:", error);
        if (error.response) {
          console.error("Respuesta con error de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API. Petición enviada:", error.request);
        } else {
          console.error("Error en la configuración de Axios:", error.message);
        }
      });
    }

    const listarEmbalajes = () => {
      axios.get(`${apiUrl}/api/TipoEmbalaje/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log("Embalajes cargados:", response.data.data);
          setEmbalajes(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar embalajes:", error);
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
          ...OrdenCompraModel,
          ...ordenCompra,
          orco_FechaEmision: formatearFecha(ordenCompra.orco_FechaEmision),
          orco_FechaLimite: formatearFecha(ordenCompra.orco_FechaLimite),
        },
        validationSchema,
        onSubmit: (values) => {
            console.log("Enviando datos al backend:", values); 

          const datosParaEnviar = {
            orco_Id: ordenCompra.orco_Id,
            orco_IdCliente: values.orco_IdCliente,
            orco_FechaEmision: formatearFecha(values.orco_FechaEmision),
            orco_FechaLimite: formatearFecha(values.orco_FechaLimite),
            orco_MetodoPago: values.orco_MetodoPago,
            orco_Materiales: values.orco_Materiales,
            orco_IdEmbalaje: values.orco_IdEmbalaje,
            orco_EstadoOrdenCompra: values.orco_EstadoOrdenCompra,
            orco_DireccionEntrega: values.orco_DireccionEntrega,
            orco_Codigo: values.orco_Codigo,
            usua_UsuarioCreacion: 1,
            orco_FechaCreacion: new Date()
          };

          console.log("Datos que se enviarán al backend:", datosParaEnviar);
          
          axios.post(`${apiUrl}/api/OrdenCompra/Editar`, datosParaEnviar, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso();
          })
          .catch(error => {
            console.error('Error al editar el detalle de orden de compra:', error);
          });
        },
      });

      useEffect(() => {
        listarClientes();
        listarFormasDePago();
        listarEmbalajes();
    
        console.log("Errores actuales:", formik.errors);
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.submitCount, formik.errors]);

    return (
    <div>
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Cliente</CustomFormLabel>
                    <CustomTextField
                        select
                        fullWidth
                        id="orco_IdCliente"
                        name="orco_IdCliente"
                        type="text"
                        value={formik.values.orco_IdCliente || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orco_IdCliente && Boolean(formik.errors.orco_IdCliente)}
                        helperText={formik.touched.orco_IdCliente && formik.errors.orco_IdCliente}
                        >
                        {clientes && clientes.length > 0 ? (
                            clientes.map((cliente) => (
                                <MenuItem key={cliente.clie_Id} value={cliente.clie_Id}>
                                    {cliente.clie_Nombre_O_Razon_Social}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="">No hay clientes disponibles</MenuItem>
                        )}
                    </CustomTextField>                          
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Fecha Emisión</CustomFormLabel>
                    <CustomTextField
                    fullWidth
                    id="orco_FechaEmision"
                    name="orco_FechaEmision"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.orco_FechaEmision}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.orco_FechaEmision && Boolean(formik.errors.orco_FechaEmision)}
                    helperText={formik.touched.orco_FechaEmision && formik.errors.orco_FechaEmision}
                    />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Fecha Límite</CustomFormLabel>
                    <CustomTextField
                    fullWidth
                    id="orco_FechaLimite"
                    name="orco_FechaLimite"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.orco_FechaLimite}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.orco_FechaLimite && Boolean(formik.errors.orco_FechaLimite)}
                    helperText={formik.touched.orco_FechaLimite && formik.errors.orco_FechaLimite}
                    />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Método de Pago</CustomFormLabel>
                    <CustomTextField
                        select
                        fullWidth
                        id="orco_MetodoPago"
                        name="orco_MetodoPago"
                        type="text"
                        value={formik.values.orco_MetodoPago}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orco_MetodoPago && Boolean(formik.errors.orco_MetodoPago)}
                        helperText={formik.touched.orco_MetodoPago && formik.errors.orco_MetodoPago}
                        >
                        {formasDePago && formasDePago.length > 0 ? (
                          formasDePago.map((formaDePago) => (
                            <MenuItem key={formaDePago.fopa_Id} value={formaDePago.fopa_Id}>
                              {formaDePago.fopa_Descripcion}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">No hay estilos disponibles</MenuItem>
                        )}
                      </CustomTextField>                       
                </Grid>

                <Grid item lg={6} md={12} sm={12}>            
                    <CustomFormLabel>¿Usa Materiales?</CustomFormLabel>
                    <div>
                        <FormControlLabel
                            control={
                                <Radio
                                    checked={formik.values.orco_Materiales === true}
                                    onChange={() => formik.setFieldValue('orco_Materiales', true)}
                                    name="orco_Materiales"
                                    id="orco_Materiales-si"
                                />
                            }
                            label="Sí"
                        />
                        <FormControlLabel
                            control={
                                <Radio
                                    checked={formik.values.orco_Materiales === false}
                                    onChange={() => formik.setFieldValue('orco_Materiales', false)}
                                    name="orco_Materiales"
                                    id="orco_Materiales-no"
                                />
                            }
                            label="No"
                        />
                        {formik.touched.orco_Materiales && formik.errors.orco_Materiales && (
                            <FormHelperText error>{formik.errors.orco_Materiales}</FormHelperText>
                        )}
                    </div>                    
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Embalaje</CustomFormLabel>
                        <CustomTextField
                            select
                            fullWidth
                            id="orco_IdEmbalaje"
                            name="orco_IdEmbalaje"
                            type="text"
                            value={formik.values.orco_IdEmbalaje}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.orco_IdEmbalaje && Boolean(formik.errors.orco_IdEmbalaje)}
                            helperText={formik.touched.orco_IdEmbalaje && formik.errors.orco_IdEmbalaje}
                            >
                            {embalajes && embalajes.length > 0 ? (
                              embalajes.map((embalaje) => (
                                <MenuItem key={embalaje.tiem_Id} value={embalaje.tiem_Id}>
                                  {embalaje.tiem_Descripcion}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="">No hay embalajes disponibles</MenuItem>
                            )}
                          </CustomTextField>      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Estado Orden Compra</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="orco_EstadoOrdenCompra"
                        name="orco_EstadoOrdenCompra"
                        type="text"
                        value={formik.values.orco_EstadoOrdenCompra}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orco_EstadoOrdenCompra && Boolean(formik.errors.orco_EstadoOrdenCompra)}
                        helperText={formik.touched.orco_EstadoOrdenCompra && formik.errors.orco_EstadoOrdenCompra}
                    />                      
                </Grid>
                
                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Dirección Entrega</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="orco_DireccionEntrega"
                        name="orco_DireccionEntrega"
                        type="text"
                        value={formik.values.orco_DireccionEntrega}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orco_DireccionEntrega && Boolean(formik.errors.orco_DireccionEntrega)}
                        helperText={formik.touched.orco_DireccionEntrega && formik.errors.orco_DireccionEntrega}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Código</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="orco_Codigo"
                            name="orco_Codigo"
                            type="text"
                            value={formik.values.orco_Codigo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.orco_Codigo && Boolean(formik.errors.orco_Codigo)}
                            helperText={formik.touched.orco_Codigo && formik.errors.orco_Codigo}
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

export default OrdenCompraEditComponent;