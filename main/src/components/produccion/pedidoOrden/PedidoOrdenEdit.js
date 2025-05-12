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
  peor_Codigo: yup.string().required('El código es requerido'),
  prov_Id: yup.number().required('El proveedor es requerido').moreThan(0, 'El proveedor es requerido'),
  duca_No_Duca: yup.string().required('La DUCA es requerida'),
  ciud_Id: yup.number().required('La ciudad es requerida').moreThan(0, 'La ciudad es requerida'),
  peor_DireccionExacta: yup.string().required('La dirección es requerida'),
  peor_FechaEntrada: yup
  .date()
  .required('La fecha de entrada es requerida'),
  peor_Obsevaciones: yup.string().required('Al menos una observación es requerida'),
  peor_Impuestos: yup.string().required('El impuesto es requerido'),
});


   
const PedidoOrdenEditComponent = ({ pedidoOrden, onCancelar, onGuardadoExitoso }) => {
//   const [ordenCompraDetalles, setOrdenCompraDetalle] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ducas, setDucas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); 

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().split('T')[0]; // "2025-05-09"
  };

  const listarProveedores = () => {
        axios.get(`${apiUrl}/api/Proveedores/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
          if (response.data && Array.isArray(response.data.data)) {
            console.log("Proveedores cargados:", response.data.data);
            setProveedores(response.data.data);
          }
        })
        .catch(error => {
          console.error("Error al cargar proveedores:", error);
          if (error.response) {
            console.error("Respuesta con error de la API:", error.response.data);
          } else if (error.request) {
            console.error("No hubo respuesta de la API. Petición enviada:", error.request);
          } else {
            console.error("Error en la configuración de Axios:", error.message);
          }
        });
    }  

    const listarDucas = () => {
      axios.get(`${apiUrl}/api/Duca/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log("No. DUCAS cargados:", response.data.data);
          setDucas(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar No. de DUCAS:", error);
        if (error.response) {
          console.error("Respuesta con error de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API. Petición enviada:", error.request);
        } else {
          console.error("Error en la configuración de Axios:", error.message);
        }
      });
    }

    const listarCiudades = () => {
      axios.get(`${apiUrl}/api/Ciudades/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log("Ciudades cargadas:", response.data.data);
          setCiudades(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar ciudades:", error);
        if (error.response) {
          console.error("Respuesta con error de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API. Petición enviada:", error.request);
        } else {
          console.error("Error en la configuración de Axios:", error.message);
        }
      });
    }

  console.log(pedidoOrden)
  const formik = useFormik({
        initialValues: {
          ...pedidoOrden,
          duca_Id: pedidoOrden.duca_Id,
         
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log("Enviando datos al backend:", values); 

         values.peor_FechaEntrada = new Date(values.peor_FechaEntrada).toISOString();
          values.peor_FechaCreacion = new Date(values.peor_FechaCreacion).toISOString();
            values.peor_FechaModificacion = new Date().toISOString();
            values.usua_UsuarioModificacion = 1;
            

          console.log("Datos que se enviarán al backend:", values);
          
          axios.post(`${apiUrl}/api/PedidosOrden/Editar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(response => {
            console.log("Respuesta del backend:", response.data.data);
            if (onGuardadoExitoso) onGuardadoExitoso();
          })
          .catch(error => {
            console.error('Error al editar el detalle de pedido de orden:', error);
          });
        },
      });

      useEffect(() => {
        listarProveedores();
        listarDucas();
        listarCiudades();
    
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
                    <CustomFormLabel>Código</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="peor_Codigo"
                        name="peor_Codigo"
                        type="text"
                        value={formik.values.peor_Codigo || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.peor_Codigo && Boolean(formik.errors.peor_Codigo)}
                        helperText={formik.touched.peor_Codigo && formik.errors.peor_Codigo}
                        >
                    </CustomTextField>                          
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Proveedores</CustomFormLabel>
                    <CustomTextField
                    select
                    fullWidth
                    id="prov_Id"
                    name="prov_Id"
                    type="text"
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    value={formik.values.prov_Id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.prov_Id && Boolean(formik.errors.prov_Id)}
                    helperText={formik.touched.prov_Id && formik.errors.prov_Id}
                    >
                        {proveedores && proveedores.length > 0 ? (
                          proveedores.map((proveedor) => (
                            <MenuItem key={proveedor.prov_Id} value={proveedor.prov_Id}>
                              {proveedor.prov_NombreCompania}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">No hay proveedores disponibles</MenuItem>
                        )}
                      </CustomTextField>
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>DUCA</CustomFormLabel>
                    <CustomTextField
                    select
                    fullWidth
                    id="duca_No_Duca"
                    name="duca_No_Duca"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.duca_No_Duca}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.duca_No_Duca && Boolean(formik.errors.duca_No_Duca)}
                    helperText={formik.touched.duca_No_Duca && formik.errors.duca_No_Duca}
                    >
                    {ducas && ducas.length > 0 ? (
                        ducas.map((duca) => (
                        <MenuItem key={duca.duca_Id} value={duca.duca_No_Duca}>
                            {duca.duca_No_Duca}
                        </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="">No hay DUCAS disponibles</MenuItem>
                    )}
                    </CustomTextField>
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Ciudad</CustomFormLabel>
                    <CustomTextField
                        select
                        fullWidth
                        id="ciud_Id"
                        name="ciud_Id"
                        type="text"
                        value={formik.values.ciud_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
                        helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
                        >
                        {ciudades && ciudades.length > 0 ? (
                          ciudades.map((ciudad) => (
                            <MenuItem key={ciudad.ciu_Id} value={ciudad.ciud_Id}>
                              {ciudad.ciud_Nombre}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">No hay ciudades disponibles</MenuItem>
                        )}
                      </CustomTextField>                       
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Dirección Exacta</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="peor_DireccionExacta"
                            name="peor_DireccionExacta"
                            type="text"
                            value={formik.values.peor_DireccionExacta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.peor_DireccionExacta && Boolean(formik.errors.peor_DireccionExacta)}
                            helperText={formik.touched.peor_DireccionExacta && formik.errors.peor_DireccionExacta}
                            >
                          </CustomTextField>      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Fecha Entrada</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="peor_FechaEntrada"
                        name="peor_FechaEntrada"
                        type="date"
                        value={formik.values.peor_FechaEntrada}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.peor_FechaEntrada && Boolean(formik.errors.peor_FechaEntrada)}
                        helperText={formik.touched.peor_FechaEntrada && formik.errors.peor_FechaEntrada}
                    />                      
                </Grid>
                
                <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Observaciones</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="peor_Obsevaciones"
                            name="peor_Obsevaciones"
                            type="text"
                            value={formik.values.peor_Obsevaciones}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.peor_Obsevaciones && Boolean(formik.errors.peor_Obsevaciones)}
                            helperText={formik.touched.peor_Obsevaciones && formik.errors.peor_Obsevaciones}
                        />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel>Impuestos</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="peor_Impuestos"
                            name="peor_Impuestos"
                            type="text"
                            value={formik.values.peor_Impuestos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.peor_Impuestos && Boolean(formik.errors.peor_Impuestos)}
                            helperText={formik.touched.peor_Impuestos && formik.errors.peor_Impuestos}
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

export default PedidoOrdenEditComponent;