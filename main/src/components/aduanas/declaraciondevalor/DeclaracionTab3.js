
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Button,
  MenuItem,
  Typography,
  FormControlLabel,
    Autocomplete,
    TextField,
  Alert,
  Snackbar,
  InputAdornment, IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconSearch} from '@tabler/icons';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';
import { Stack } from '@mui/system';
import Deva from 'src/models/devaModel';

const validationSchema = yup.object({
  declaraciones_ValorViewModel: yup.object({
    deva_LugarEntrega: yup.string().required('El lugar de entrega es requerido'),
    pais_EntregaId: yup.number()
    .required('El pais es requerido')
    .moreThan(0, 'Debe seleccionar una ciudad válida'),
    inco_Id: yup.number()
    .required('El incoterm es requerido')
    .moreThan(0, 'Debe seleccionar un incoterm válida'),
    inco_Version: yup.string().required('La versión de incoterm es requerida'),
    deva_NumeroContrato: yup.string().required('El número de contrato es requerido'),
    deva_FechaContrato: yup.date().required('La fecha de contrato es requerida'),
    foen_Id: yup.number()
    .required('La forma de envio es requerida')
    .moreThan(0, 'Debe seleccionar una forma de envio válida'),
    deva_FormaEnvioOtra: yup.string().required('El otra forma de envio es requerida'),
    fopa_Id: yup.number()
    .required('La forma de envio es requerida')
    .moreThan(0, 'Debe seleccionar una forma de envio válida'),
    deva_FormaPagoOtra: yup.string().required('El otra forma de pago es requerida'),
    emba_Id: yup.number()
    .required('El embarque es requerido')
    .moreThan(0, 'Debe seleccionar una forma de envio válida'),
    pais_ExportacionId: yup.number()
    .required('El pais de exportacion es requerido')
    .moreThan(0, 'Debe seleccionar un pais de exportación válido'),
    deva_FechaExportacion: yup.date().required('La fecha de exportación es requerida'),
    mone_Id: yup.number()
    .required('La moneda es requerida')
    .moreThan(0, 'Debe seleccionar una moneda válida'),
    mone_Otra: yup.string().required('La moneda es requerida'),
    deva_ConversionDolares: yup.number().required('La conversión de dolares es requerida')
  })
});

const Tab3 = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => {
        const [initialValues, setInitialValues] = useState(Deva);
        const [open, setOpen] = React.useState(false);
        const [openSnackbar, setOpenSnackbar] = useState(false); 
        const theme = useTheme();
        const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
        const [codigoEmbarque, setCodigoEmbarque] = useState('');

        //Lugar de embarque
        const [embarque, setEmbarque] = useState([]);
        const [selectedEmbarque, setSelectedEmbarque] = useState(null);

        const handleInputChange = (e) => {
          setCodigoEmbarque(e.target.value);
        };
        const handleBuscarClick = () => {
          buscarEmbarque(codigoEmbarque); // Esta función la llamas al hacer clic
        };

        const handleClickOpen = () => {
          setOpen(true);
      };
      
      const handleClose = () => {
          setOpen(false);
      };

      const buscarEmbarque = (searchTerm) => {
        axios.get(`${apiUrl}/api/LugaresEmbarque/Listar?codigo=${searchTerm}`, {
          headers: {
            'XApiKey': apiKey
          } 
      })
      .then(response => {
        setEmbarque(response.data.data);
        console.log("React E10", response.data.data)
        })
        .catch(error => {
            console.error('Error al obtener los datos del país:', error);
        });
    }

        //Moneda
        const [monedas, setMoneda] = useState([]);
        const [selectedMoneda, setSelectedMoneda] = useState(null);

        //Formas de pago
        const [formaPago, setFormaPago] = useState([]);
        const [selectedFormaPago, setSelectedFormaPago] = useState(null);
        
        //Incoterms
        const [incoterms, setIncoterms] = useState([]);
        const [selectedIncoterms, setSelectedIncoterms] = useState(null);
        
        //Formas de envío
        const [formasEnvio, setFormasEnvio] = useState([]);
        const [selectedFormaEnvio, setSelectedFormaEnvio] = useState(null);

        //Paises
        const [paises, setPaises] = useState([]);
        const [selectedPaisEntrega, setSelectedPaisEntrega] = useState(null);
        const [selectedPaisExportacion, setSelectedPaisExportacion] = useState(null);

        

        // Variables de entorno
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        //Endpoint para obtener las formas de pago
        const listarMonedas = () => {
          axios.get(`${apiUrl}/api/Moneda/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
              setMoneda(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos de las formas de pago:', error);
          });
        } 


        //Endpoint para obtener las formas de pago
        const listarFormasPago = () => {
          axios.get(`${apiUrl}/api/FormasDePago/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
              setFormaPago(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos de las formas de pago:', error);
          });
        } 

        //Endpoint para obtener las formas de envio
        const listarFormasEnvio = () => {
          axios.get(`${apiUrl}/api/FormasEnvio/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
              setFormasEnvio(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos de las formas de envío:', error);
          });
        } 

        //Endpoint para obtener los paises
        const listarPaises = () => {
          axios.get(`${apiUrl}/api/Paises/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
              setPaises(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos del país:', error);
          });
      } 


        //Endpoint para obtener los incoterms
        const listarIncoterms = () => {
          axios.get(`${apiUrl}/api/Incoterm/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
            setIncoterms(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos de los incoterm:', error);
          });
        } 

      
        useEffect(() => {
            const devaIdString = localStorage.getItem('devaId');
            if (devaIdString !== null) {
              const deva_Id = parseInt(devaIdString);
              axios.get(`${apiUrl}/api/Declaracion_Valor/Listar_ByDevaId?id=${deva_Id}`, {
                headers: {
                  'XApiKey': apiKey
                }
              })
              .then(response => {
                const rawData = response.data.data;
          
                const data = Array.isArray(rawData)
                  ? rawData[0]
                  : rawData[0] !== undefined
                  ? rawData[0]
                  : rawData;
              
                if (data && typeof data === 'object') {
                  const camposUtiles = Object.entries(data).filter(([key, value]) => {
                    return key !== 'deva_Id' && value !== null && value !== undefined && value !== '';
                  });
              
                  const esSoloPreinsert = camposUtiles.length === 0;
              
                  if (esSoloPreinsert) {
               
                    setInitialValues({...Deva });
                  } else {
          
                    Object.keys(data).forEach(key => {
                      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                        Deva[key] = data[key];
                      }
                    });
              
                    setInitialValues({ ...Deva });
                  }
              
                  console.log("DEVA RELLENA O VACÍA:", Deva);
                }
              })
              .catch(error => {
                console.error('Error al obtener los datos del país:', error);
              });
            }
          }, []); 
        

        const formik = useFormik({
                enableReinitialize: true,
                initialValues: initialValues,
                validationSchema,
                onSubmit: async(values) => {
                  try {
                    values.declaraciones_ValorViewModel.usua_UsuarioCreacion = 1;
                    values.declaraciones_ValorViewModel.usua_UsuarioModificacion = 1;
                    values.declaraciones_ValorViewModel.deva_FechaCreacion = new Date().toISOString();
                  
                    console.log("Enviando valores:", values);
                    values.declaraciones_ValorViewModel.deva_Id =  parseInt(localStorage.getItem('devaId'));
                    
                    let todosExitosos = true;
                    console.log("Valores finales que se están enviando:", values);
                    const response = await axios.post(`${apiUrl}/api/Declaracion_Valor/InsertarTab3`, values, {
                      headers: { 'XApiKey': apiKey },
                      'Content-Type': 'application/json'
                    });
               
                  if (response.data.data.messageStatus !== '1') {
                        todosExitosos = false;
                  
                  }
                  if (todosExitosos) {
                    if (onGuardadoExitoso) onGuardadoExitoso();
                  } else {
                    setOpenSnackbar(true);
                  }
             
                  
                  } catch (error) {
                    console.error('Error al insertar:', error);
                  }
                },
              });
            
              // Expone el método 'submit' al padre
              useImperativeHandle(ref, () => ({
                async submit() {
                  const errors = await formik.validateForm();
                  if (Object.keys(errors).length === 0) {
                    try {
                      await formik.submitForm(); // Espera a que termine el submit real
                      return true;
                    } catch (e) {
                      return false;
                    }
                  } else {
                    formik.setTouched(
                      Object.keys(errors).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                      }, {}),
                      true
                    );
                    setOpenSnackbar(true); // Esto es tu alerta
                    return false;
                  }
                },
              }));
              useEffect(() => {
                listarPaises();
                listarIncoterms();
                listarFormasEnvio();
                listarFormasPago();
                listarMonedas();
                if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
                  setOpenSnackbar(true);
                }
                
              }, [formik.errors, formik.submitCount]);

              useEffect(() => {
                if (paises.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.pais_EntregaId &&
                  formik.values.declaraciones_ValorViewModel.pais_ExportacionId) {
                  const paisEntrega = paises.find(p => p.pais_Id === formik.values.declaraciones_ValorViewModel.pais_EntregaId);
                  const paisExportacion = paises.find(p => p.pais_Id === formik.values.declaraciones_ValorViewModel.pais_ExportacionId);
                  setSelectedPaisEntrega(paisEntrega || null );
                  setSelectedPaisExportacion(paisExportacion || null);
                }
                if (incoterms.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.inco_Id) {
                  const incoterm = incoterms.find(r => r.inco_Id === formik.values.declaraciones_ValorViewModel.inco_Id);
                  setSelectedIncoterms(incoterm);
                }
                if (formasEnvio.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.foen_Id) {
                  const formasDeEnvio = formasEnvio.find(r => r.foen_Id === formik.values.declaraciones_ValorViewModel.foen_Id);
                  setSelectedFormaEnvio(formasDeEnvio);
                }
                if (formaPago.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.fopa_Id) {
                  const formaDePago = formaPago.find(r => r.fopa_Id === formik.values.declaraciones_ValorViewModel.fopa_Id);
                  setSelectedFormaPago(formaDePago);
                }
                if (embarque.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.emba_Id) {
                  const embarq = embarque.find(r => r.emba_Id === formik.values.declaraciones_ValorViewModel.emba_Id);
                  setSelectedEmbarque(embarq);
                }
                if (monedas.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.mone_Id) {
                  const mone = monedas.find(r => r.mone_Id === formik.values.declaraciones_ValorViewModel.mone_Id);
                  setSelectedMoneda(mone);
                }
              },[
                paises,
                incoterms,
                formasEnvio,
                formaPago,
                embarque,
                monedas,
                formik.values.declaraciones_ValorViewModel.pais_EntregaId,
                formik.values.declaraciones_ValorViewModel.pais_ExportacionId,
                formik.values.declaraciones_ValorViewModel.inco_Id,
                formik.values.declaraciones_ValorViewModel.foen_Id,
                formik.values.declaraciones_ValorViewModel.fopa_Id,
                formik.values.declaraciones_ValorViewModel.emba_Id,
                formik.values.declaraciones_ValorViewModel.mone_Id,
              ]);
        
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                    <Grid item xs={12}>
                        <Typography mt={4} variant={'h6'}>
                            Información general del proveedor
                        </Typography>
                        <hr style={{border:'1px solid #003859'}}/>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} mt={0}>
                        <CustomFormLabel>Lugar entrega</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.deva_LugarEntrega"
                            name="declaraciones_ValorViewModel.deva_LugarEntrega"
                            type="text"
                            value={formik.values.declaraciones_ValorViewModel?.deva_LugarEntrega}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.deva_LugarEntrega && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_LugarEntrega)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.deva_LugarEntrega && formik.errors.declaraciones_ValorViewModel?.deva_LugarEntrega}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Pais de entrega</CustomFormLabel>
                    <Autocomplete
                            options={paises}
                            getOptionLabel={(option) => option.pais_Nombre || ''}
                            value={selectedPaisEntrega}
                            onChange={(event, newValue) => {
                                setSelectedPaisEntrega(newValue);
                                if (newValue) {
                                formik.setFieldValue('declaraciones_ValorViewModel.pais_EntregaId', newValue.pais_EntregaId);
                                } else {
                                formik.setFieldValue('declaraciones_ValorViewModel.pais_EntregaId', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione el pais de entrega"
                                error={formik.touched.declaraciones_ValorViewModel?.pais_EntregaId	 && Boolean(formik.errors.declaraciones_ValorViewModel?.pais_EntregaId)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.pais_EntregaId	 && formik.errors.declaraciones_ValorViewModel?.pais_EntregaId	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.pais_Id === value?.declaraciones_ValorViewModel?.pais_EntregaId	}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                            <CustomFormLabel>Incoterm</CustomFormLabel>
                            <Autocomplete
                            options={incoterms}
                            getOptionLabel={(option) => option.inco_Descripcion || ''}
                            value={selectedIncoterms}
                            onChange={(event, newValue) => {
                                setSelectedIncoterms(newValue);
                                if (newValue) {
                                formik.setFieldValue('declaraciones_ValorViewModel.inco_Id', newValue.inco_Id);
                                } else {
                                formik.setFieldValue('declaraciones_ValorViewModel.inco_Id', 0);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione un incoterm"
                                error={formik.touched.declaraciones_ValorViewModel?.inco_Id	 && Boolean(formik.errors.declaraciones_ValorViewModel?.inco_Id	)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.inco_Id	 && formik.errors.declaraciones_ValorViewModel?.inco_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.inco_Id === value?.declaraciones_ValorViewModel?.inco_Id	}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Versión</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.inco_Version"
                            name="declaraciones_ValorViewModel.inco_Version"
                            type="text"
                            value={formik.values.declaraciones_ValorViewModel?.inco_Version}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.inco_Version && Boolean(formik.errors.declaraciones_ValorViewModel?.inco_Version)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.inco_Version && formik.errors.declaraciones_ValorViewModel?.inco_Version}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Numero de Contrato</CustomFormLabel>
                    <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.deva_NumeroContrato"
                            name="declaraciones_ValorViewModel.deva_NumeroContrato"
                            type="text"
                            value={formik.values.declaraciones_ValorViewModel?.deva_NumeroContrato}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.deva_NumeroContrato && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_NumeroContrato)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.deva_NumeroContrato && formik.errors.declaraciones_ValorViewModel?.deva_NumeroContrato}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Fecha de contrato</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.deva_FechaContrato"
                            name="declaraciones_ValorViewModel.deva_FechaContrato"
                            type="date"
                            value={formik.values.declaraciones_ValorViewModel?.deva_FechaContrato}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.deva_FechaContrato && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_FechaContrato)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.deva_FechaContrato && formik.errors.declaraciones_ValorViewModel?.deva_FechaContrato}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Forma de envío</CustomFormLabel>
                        <Autocomplete
                            options={formasEnvio}
                            getOptionLabel={(option) => option.foen_Descripcion || ''}
                            value={selectedFormaEnvio}
                            onChange={(event, newValue) => {
                                setSelectedFormaEnvio(newValue);
                                if (newValue) {
                                formik.setFieldValue('declaraciones_ValorViewModel.foen_Id', newValue.foen_Id);
                                } else {
                                formik.setFieldValue('declaraciones_ValorViewModel.foen_Id', 0);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione una forma de envio"
                                error={formik.touched.declaraciones_ValorViewModel?.foen_Id	 && Boolean(formik.errors.declaraciones_ValorViewModel?.foen_Id	)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.foen_Id	 && formik.errors.declaraciones_ValorViewModel?.foen_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.foen_Id === value?.declaraciones_ValorViewModel?.foen_Id	}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Otra forma de envio (Especifique)</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.deva_FormaEnvioOtra"
                            name="declaraciones_ValorViewModel.deva_FormaEnvioOtra"
                            type="text"
                            value={formik.values.declaraciones_ValorViewModel?.deva_FormaEnvioOtra}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.deva_FormaEnvioOtra && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_FormaEnvioOtra)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.deva_FormaEnvioOtra && formik.errors.declaraciones_ValorViewModel?.deva_FormaEnvioOtra}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Pago efectuado</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.deva_PagoEfectuado"
                            name="declaraciones_ValorViewModel.deva_PagoEfectuado"
                            type="text"
                            value={formik.values.declaraciones_ValorViewModel?.deva_PagoEfectuado}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.deva_PagoEfectuado && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_PagoEfectuado)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.deva_PagoEfectuado && formik.errors.declaraciones_ValorViewModel?.deva_PagoEfectuado}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Forma de pago</CustomFormLabel>
                        <Autocomplete
                            options={formaPago}
                            getOptionLabel={(option) => option.fopa_Descripcion || ''}
                            value={selectedFormaPago}
                            onChange={(event, newValue) => {
                                setSelectedFormaPago(newValue);
                                if (newValue) {
                                formik.setFieldValue('declaraciones_ValorViewModel.fopa_Id', newValue.fopa_Id);
                                } else {
                                formik.setFieldValue('declaraciones_ValorViewModel.fopa_Id', 0);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione una forma de pago"
                                error={formik.touched.declaraciones_ValorViewModel?.fopa_Id	 && Boolean(formik.errors.declaraciones_ValorViewModel?.fopa_Id	)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.fopa_Id	 && formik.errors.declaraciones_ValorViewModel?.fopa_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.foen_Id === value?.declaraciones_ValorViewModel?.fopa_Id	}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                    
                            <CustomFormLabel>Otra forma de pago (Especifique)</CustomFormLabel>
                            <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.deva_FormaPagoOtra"
                            name="declaraciones_ValorViewModel.deva_FormaPagoOtra"
                            type="text"
                            value={formik.values.declaraciones_ValorViewModel?.deva_FormaPagoOtra}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.deva_FormaPagoOtra && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_FormaPagoOtra)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.deva_FormaPagoOtra && formik.errors.declaraciones_ValorViewModel?.deva_FormaPagoOtra}
                        />
                    
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                                    
                                    <CustomFormLabel>Lugar de Embarque</CustomFormLabel>
                                   
                                    <CustomTextField
                                    fullWidth
                                    id="declaraciones_ValorViewModel.emba_Id"
                                    name="declaraciones_ValorViewModel.emba_Id"
                                    type="text"
                                    value={formik.values.declaraciones_ValorViewModel?.emba_Id}
                                    disabled
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.declaraciones_ValorViewModel?.emba_Id && Boolean(formik.errors.declaraciones_ValorViewModel?.emba_Id)}
                                    helperText={formik.touched.declaraciones_ValorViewModel?.emba_Id && formik.errors.declaraciones_ValorViewModel?.emba_Id}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton onClick={handleClickOpen}>
                                            <IconSearch />
                                          </IconButton>
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                 </Grid>
                    
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Pais de exportacion</CustomFormLabel>
                        <Autocomplete
                            options={paises}
                            getOptionLabel={(option) => option.pais_Nombre || ''}
                            value={selectedPaisExportacion}
                            onChange={(event, newValue) => {
                                setSelectedPaisExportacion(newValue);
                                if (newValue) {
                                formik.setFieldValue('declaraciones_ValorViewModel.pais_ExportacionId', newValue.pais_ExportacionId);
                                } else {
                                formik.setFieldValue('declaraciones_ValorViewModel.pais_ExportacionId', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione el pais de exportacion"
                                error={formik.touched.declaraciones_ValorViewModel?.pais_ExportacionId	 && Boolean(formik.errors.declaraciones_ValorViewModel?.pais_ExportacionId	)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.pais_ExportacionId && formik.errors.declaraciones_ValorViewModel?.pais_ExportacionId	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.pais_Id === value?.declaraciones_ValorViewModel?.pais_ExportacionId	}
                        />
                    </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Fecha de exportación</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="declaraciones_ValorViewModel.deva_FechaExportacion"
                        name="declaraciones_ValorViewModel.deva_FechaExportacion"
                        type="date"
                        value={formik.values.declaraciones_ValorViewModel?.deva_FechaExportacion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.declaraciones_ValorViewModel?.deva_FechaExportacion && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_FechaExportacion)}
                        helperText={formik.touched.declaraciones_ValorViewModel?.deva_FechaExportacion && formik.errors.declaraciones_ValorViewModel?.deva_FechaExportacion}
                    />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Moneda en que se realizó la transacción</CustomFormLabel>
                    <Autocomplete
                            options={monedas}
                            getOptionLabel={(option) => option.mone_Codigo +' - ' +option.mone_Descripcion || ''}
                            value={selectedMoneda}
                            onChange={(event, newValue) => {
                                setSelectedMoneda(newValue);
                                if (newValue) {
                                formik.setFieldValue('declaraciones_ValorViewModel.mone_Id', newValue.mone_Id);
                                } else {
                                formik.setFieldValue('declaraciones_ValorViewModel.mone_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione la moneda"
                                error={formik.touched.declaraciones_ValorViewModel?.mone_Id	 && Boolean(formik.errors.declaraciones_ValorViewModel?.mone_Id	)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.mone_Id	 && formik.errors.declaraciones_ValorViewModel?.mone_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.mone_Id === value?.declaraciones_ValorViewModel?.mone_Id	}
                        />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Otra moneda (Especifique)</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="declaraciones_ValorViewModel.mone_Otra"
                        name="declaraciones_ValorViewModel.mone_Otra"
                        type="text"
                        value={formik.values.declaraciones_ValorViewModel?.mone_Otra}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.declaraciones_ValorViewModel?.mone_Otra && Boolean(formik.errors.declaraciones_ValorViewModel?.mone_Otra)}
                        helperText={formik.touched.declaraciones_ValorViewModel?.mone_Otra && formik.errors.declaraciones_ValorViewModel?.mone_Otra}
                    />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Tipo de cambio de moneda extranjera a dólares USD</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="declaraciones_ValorViewModel.deva_ConversionDolares"
                        name="declaraciones_ValorViewModel.deva_ConversionDolares"
                        type="text"
                        value={formik.values.declaraciones_ValorViewModel?.deva_ConversionDolares}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.declaraciones_ValorViewModel?.deva_ConversionDolares && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_ConversionDolares)}
                        helperText={formik.touched.declaraciones_ValorViewModel?.deva_ConversionDolares && formik.errors.declaraciones_ValorViewModel?.deva_ConversionDolares}
                    />
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

        <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">{"Buscar lugar de Embarque"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                  <CustomFormLabel>Codigo Embarque</CustomFormLabel>
                  <Grid container spacing={3} mb={3}>  
                    <Grid item lg={8} md={12} sm={12}>
                        <CustomTextField
                            fullWidth
                            id="CodigoEmbarque"
                            name="CodigoEmbarque"
                            type="text"
                            inputProps={{ maxLength: 2 }}
                            placeholder="HN"
                            value={codigoEmbarque}
                            onChange={handleInputChange}
                           
                        />
                     </Grid>
                      <Grid item lg={4} md={12} sm={12}> 
                      <Button sx={{color:'secundary'}} onClick={handleBuscarClick}> <IconSearch /> </Button>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12}>
                        <CustomFormLabel>Seleccionar Embarque</CustomFormLabel>
                        <Autocomplete
                                options={embarque}
                                getOptionLabel={(option) =>  option.emba_Codigo && option.emba_Descripcion
                                  ? `${option.emba_Codigo} - ${option.emba_Descripcion}`
                                  : ''}
                                value={selectedEmbarque}
                                onChange={(event, newValue) => {
                                    setSelectedEmbarque(newValue);
                                    if (newValue) {
                                    formik.setFieldValue('declaraciones_ValorViewModel.emba_Id', newValue.emba_Id );
                                    } else {
                                    formik.setFieldValue('declaraciones_ValorViewModel.emba_Id', 0);
                                    
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    placeholder="Seleccione un lugar de embarque"
                                    error={formik.touched.declaraciones_ValorViewModel?.emba_Id && Boolean(formik.errors.declaraciones_ValorViewModel?.emba_Id)}
                                    helperText={formik.touched.declaraciones_ValorViewModel?.emba_Id && formik.errors.declaraciones_ValorViewModel?.emba_Id}
                                    />
                                )}
                                noOptionsText="No hay lugares de embarque disponibles"
                                isOptionEqualToValue={(option, value) => option.emba_Id === value?.declaraciones_ValorViewModel?.emba_Id}
                              />
                      </Grid>
                  </Grid>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="error" autoFocus  onClick={handleClose}>
                    Cerrar
                  </Button>
                  <Button onClick={handleClose} autoFocus>
                    Guardar
                  </Button>
                </DialogActions>
              </Dialog>            

     
        </div>
    );
});

export default Tab3;