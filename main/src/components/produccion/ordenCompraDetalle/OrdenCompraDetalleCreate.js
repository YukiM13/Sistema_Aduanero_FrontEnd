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

const validationSchema = yup.object({
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
  code_EspecificacionEmbalaje: yup.string().required('La especificación de embalaje es requerida'),
  code_FechaProcActual: yup.date().required('La fecha del proceso actual es requerida'),
});

   
const OrdenCompraDetallesCreateComponent = ({ onCancelar, onGuardadoExitoso, ordenCompraId  }) => {
  const [ordenCompraDetalles, setOrdenCompraDetalle] = useState([]);
  const [procesosActuales, setProcesosActuales] = useState([]);
  const [estilos, setEstilos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const listarEstilos = () => {
        axios.get(`${apiUrl}/api/Estilos/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
          if (response.data && Array.isArray(response.data.data)) {
            console.log("Estilos cargados:", response.data.data);
            setEstilos(response.data.data);
          }
        })
        .catch(error => {
          console.error("Error al cargar estilos:", error);
          if (error.response) {
            console.error("Respuesta con error de la API:", error.response.data);
          } else if (error.request) {
            console.error("No hubo respuesta de la API. Petición enviada:", error.request);
          } else {
            console.error("Error en la configuración de Axios:", error.message);
          }
        });
    }  

    const listarColores = () => {
      axios.get(`${apiUrl}/api/Colores/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log("Colores cargados:", response.data.data);
          setColores(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar colores:", error);
        if (error.response) {
          console.error("Respuesta con error de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API. Petición enviada:", error.request);
        } else {
          console.error("Error en la configuración de Axios:", error.message);
        }
      });
    }

    const listarTallas = () => {
      axios.get(`${apiUrl}/api/Tallas/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log("Tallas cargadas:", response.data.data);
          setTallas(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar tallas:", error);
        if (error.response) {
          console.error("Respuesta con error de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API. Petición enviada:", error.request);
        } else {
          console.error("Error en la configuración de Axios:", error.message);
        }
      });
    }

  const listarProcesos = () => {
      axios.get(`${apiUrl}/api/Procesos/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log("Procesos cargados:", response.data.data);
          setProcesosActuales(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar procesos:", error);
      });
  }

  const formik = useFormik({
        initialValues: {
          ...OrdenCompraModel,
        },
        validationSchema,
        onSubmit: (values) => {

          if (!ordenCompraId || ordenCompraId === 0) {
            console.error("Error: ordenCompraId no válido.");
            return;
          }
          
          console.log("Enviando datos al backend:", values); 

          const datosParaEnviar = {
            orco_Id: ordenCompraId,
            code_CantidadPrenda: values.code_CantidadPrenda,
            esti_Id: values.esti_Id,
            tall_Id: values.tall_Id,
            code_Sexo: values.code_Sexo,
            colr_Id: values.colr_Id,
            proc_IdComienza: values.proc_IdComienza,
            proc_IdActual: values.proc_IdActual || values.proc_IdComienza,
            code_Unidad: values.code_Unidad,
            code_Valor: values.code_Valor,
            code_Impuesto: values.code_Impuesto,
            code_EspecificacionEmbalaje: values.code_EspecificacionEmbalaje,
            code_FechaProcActual: values.code_FechaProcActual,
            usua_UsuarioCreacion: 1,
            code_FechaCreacion: new Date()
          };

          console.log("Datos que se enviarán al backend:", datosParaEnviar);
          console.log("ordenCompraId actual:", ordenCompraId);
          console.log("Formik values:", values);

          axios.post(`${apiUrl}/api/OrdenCompraDetalles/Insertar`, datosParaEnviar, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso();
          })
          .catch(error => {
            console.error('Error al insertar el detalle de orden de compra:', error);
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
        listarEstilos();
        listarColores();
        listarTallas();
        listarProcesos();

        if (ordenCompraId) {
          formik.setFieldValue('orco_Id', ordenCompraId);
        }
      }, [ordenCompraId]);

    return (
    <div>
      
        <form onSubmit={formik.handleSubmit}>
          <CustomFormLabel>Nuevo detalle de orden de compra</CustomFormLabel>

            <Grid container spacing={3} mb={3}>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Cantidad de prendas</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="code_CantidadPrenda"
                        name="code_CantidadPrenda"
                        type="text"
                        value={formik.values.code_CantidadPrenda}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.code_CantidadPrenda && Boolean(formik.errors.code_CantidadPrenda)}
                        helperText={formik.touched.code_CantidadPrenda && formik.errors.code_CantidadPrenda}
                    />                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Estilo</CustomFormLabel>
                    <CustomTextField
                        select
                        fullWidth
                        id="esti_Id"
                        name="esti_Id"
                        value={formik.values.esti_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.esti_Id && Boolean(formik.errors.esti_Id)}
                        helperText={formik.touched.esti_Id && formik.errors.esti_Id}
                    >
                      {estilos && estilos.length > 0 ? (
                        estilos.map((estilo) => (
                          <MenuItem key={estilo.esti_Id} value={estilo.esti_Id}>
                            {estilo.esti_Descripcion}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No hay estilos disponibles</MenuItem>
                      )}
                    </CustomTextField>                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Tallas</CustomFormLabel>
                    <CustomTextField
                        select
                        fullWidth
                        id="tall_Id"
                        name="tall_Id"
                        type="text"
                        value={formik.values.tall_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.tall_Id && Boolean(formik.errors.tall_Id)}
                        helperText={formik.touched.tall_Id && formik.errors.tall_Id}
                        >
                        {tallas && tallas.length > 0 ? (
                          tallas.map((talla) => (
                            <MenuItem key={talla.tall_Id} value={talla.tall_Id}>
                              {talla.tall_Nombre}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">No hay estilos disponibles</MenuItem>
                        )}
                      </CustomTextField>                       
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Sexo</CustomFormLabel>
                    <Grid container>
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={formik.values.code_Sexo === 'M'}
                                        onChange={() => formik.setFieldValue('code_Sexo', 'M')}
                                        value="M"
                                        name="code_Sexo"
                                        id="code_Sexo-M"
                                    />
                                }
                                label="Masculino (M)"
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={formik.values.code_Sexo === 'F'}
                                        onChange={() => formik.setFieldValue('code_Sexo', 'F')}
                                        value="F"
                                        name="code_Sexo"
                                        id="code_Sexo-F"
                                    />
                                }
                                label="Femenino (F)"
                            />
                        </Grid>
                    </Grid>
                    {formik.touched.code_Sexo && formik.errors.code_Sexo && (
                        <FormHelperText error>{formik.errors.code_Sexo}</FormHelperText>
                    )}                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Color</CustomFormLabel>
                    <CustomTextField
                        select
                        fullWidth
                        id="colr_Id"
                        name="colr_Id"
                        value={formik.values.colr_Id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.colr_Id && Boolean(formik.errors.colr_Id)}
                        helperText={formik.touched.colr_Id && formik.errors.colr_Id}
                    >
                      {colores && colores.length > 0 ? (
                        colores.map((color) => (
                          <MenuItem key={color.colr_Id} value={color.colr_Id}>
                            {color.colr_Nombre}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No hay colores disponibles</MenuItem>
                      )}
                    </CustomTextField>                      
                </Grid>

                <Grid item lg={6} md={12} sm={12}>             
                    <CustomFormLabel>Proceso Comienzo</CustomFormLabel>
                    <CustomTextField
                        select
                        fullWidth
                        id="proc_IdComienza"
                        name="proc_IdComienza"
                        value={formik.values.proc_IdComienza}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.proc_IdComienza && Boolean(formik.errors.proc_IdComienza)}
                        helperText={formik.touched.proc_IdComienza && formik.errors.proc_IdComienza}
                    >
                      {procesosActuales && procesosActuales.length > 0 ? (
                        procesosActuales.map((proceso) => (
                          <MenuItem key={proceso.proc_Id} value={proceso.proc_Id}>
                            {proceso.proc_Descripcion}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No hay procesos disponibles</MenuItem>
                      )}
                    </CustomTextField>                 
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                <CustomFormLabel>Proceso Actual</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="proc_IdActual"
                  name="proc_IdActual"
                  value={formik.values.proc_IdActual}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.proc_IdActual && Boolean(formik.errors.proc_IdActual)}
                  helperText={formik.touched.proc_IdActual && formik.errors.proc_IdActual}
                >
                  {procesosActuales && procesosActuales.length > 0 ? (
                    procesosActuales.map((proceso) => (
                      <MenuItem key={proceso.proc_Id} value={proceso.proc_Id}>
                        {proceso.proc_Descripcion}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No hay procesos disponibles</MenuItem>
                  )}
                </CustomTextField>
                  
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
                        onBlur={formik.handleBlur}
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
                    <CustomFormLabel>Fecha del Proceso Actual</CustomFormLabel>
                    <CustomTextField
                    fullWidth
                    id="code_FechaProcActual"
                    name="code_FechaProcActual"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.code_FechaProcActual}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.code_FechaProcActual && Boolean(formik.errors.code_FechaProcActual)}
                    helperText={formik.touched.code_FechaProcActual && formik.errors.code_FechaProcActual}
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

export default OrdenCompraDetallesCreateComponent;