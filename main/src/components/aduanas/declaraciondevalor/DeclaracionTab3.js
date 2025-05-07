
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
    prov_decl_Nombre_Raso: yup.number().required('La aduana de ingreso es requerida'),
    prov_decl_Direccion_Exacta: yup.number().required('El La aduana de despacho es requerida'),
    prov_ciud_Id: yup.string().required('La declaración de mercancia es necesaria'),
    prov_decl_Correo_Electronico: yup.date().required('El destino de aduana es requerido'),
    prov_decl_Telefono: yup.number().required('El regimen aduanero es requerido'),
    prov_decl_Fax: yup.string().required('El nombre o razón social es requerido'),
    prov_RTN: yup.string().required('El RTN es requerido'),
    coco_Id: yup.string().required('El número de registro es requerido'),
    pvde_Condicion_Otra: yup.string().required('La dirección exacta es requerida'),
    ciud_inte_decl_Nombre_Rasod: yup.number().required('El pais de destino es requerido').moreThan(0,'La ciudad es requerida'),
    inte_decl_Direccion_Exacta: yup.string().required('El correo del declarante es requerido'),
    inte_ciud_Id: yup.string().required('El teléfono de desembarque es requerido'),
    inte_decl_Correo_Electronico: yup.string().required('El fax es requerido'),
    inte_decl_Telefono: yup.string().required('El fax es requerido'),
    inte_decl_Fax: yup.string().required('El fax es requerido'),
    inte_RTN: yup.string().required('El fax es requerido'),
    tite_Id: yup.string().required('El fax es requerido'),
    inte_Tipo_Otro: yup.string().required('El fax es requerido')
    
});

const Tab3 = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => {
        const [initialValues, setInitialValues] = useState(Deva);
        const [open, setOpen] = React.useState(false);
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

        //Ciudades
        const [ciudades, setCiudades] = useState([]);
        const [selectedCiudad, setSelectedCiudad] = useState(null);

        //Aduanas
        const [aduanas, setAduanas] = useState([]);
        
        //Regimen Aduanero
        const [regimenAduanero, setRegimenAduanero] = useState([]);
        const [selectedRegimenAduanero, setSelectedRegimenAduanero] = useState(null);

        //Niveles Comerciales
        const [nivelComercial, setNivelComercial] = useState(null);
        const [selectedNivelComercial, setSelectedNivelComercial] = useState(null);

        //Paises
        const [paises, setPaises] = useState(false);
        const [selectedPaisEntrega, setSelectedPaisEntrega] = useState(null);
        const [selectedPaisExportacion, setSelectedPaisExportacion] = useState(null);

        const [openSnackbar, setOpenSnackbar] = useState(false); 

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

        //Endpoint para obtener las ciudades
        const listarCiudades = () => {
        axios.get(`${apiUrl}/api/Ciudades/Listar`, {
            headers: {
                'XApiKey': apiKey
            }
        })
        .then(response => {
            setCiudades(response.data.data);
            console.log("Ciudades encontradas con éxito", response.data.data)
        })
        .catch(error => {
            console.error('Error al obtener los datos de las ciudades:', error);
        });
        } 


        //Endpoint para obtener las aduanas
        const listarAduanas = () => {
          axios.get(`${apiUrl}/api/Aduanas/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
        
          })
          .then(response => {
            setAduanas(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos del país:', error);
          });
        } 

        //Endpoint para obtener los regimenes aduaneros
        const listarRegimenAduaneros = () => {
        axios.get(`${apiUrl}/api/RegimenAduanero/Listar`, {
            headers: {
                'XApiKey': apiKey
            }
          })
          .then(response => {
            setRegimenAduanero(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos del país:', error);
          });
        } 

        //Endpoint para obtener los niveles comerciales
        const listarNivelesComerciales = () => {
          axios.get(`${apiUrl}/api/NivelesComerciales/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
            setNivelComercial(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos de los niveles comerciales:', error);
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
            const devaIdString = localStorage.getItem('deva_Id');
            if (devaIdString !== null) {
              const deva_Id = parseInt(devaIdString);
              axios.post(`${apiUrl}/api/Declaracion_Valor/Listar_ByDevaId?id=${deva_Id}`, null , {
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
              
                    const fechaFormateada = new Date(Deva.deva_FechaAceptacion).toISOString().split('T')[0];
                    Deva.deva_FechaAceptacion = fechaFormateada;
              
                    
              
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
                    values.usua_UsuarioCreacion = 1;
                  
                    console.log("Enviando valores:", values);
                    values.deva_Id =  parseInt(localStorage.getItem('deva_Id'));
                    
                    let todosExitosos = true;
                    const response = await axios.post(`${apiUrl}/api/Declaracion_Valor/InsertarTab1`, values, {
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
                listarCiudades();
                listarPaises();
                listarAduanas();
                listarNivelesComerciales();
                listarRegimenAduaneros();
                listarIncoterms();
                listarFormasEnvio();
                listarFormasPago();
                listarMonedas();
                if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
                  setOpenSnackbar(true);
                }
                
              }, [formik.errors, formik.submitCount]);

              useEffect(() => {
                if (ciudades.length > 0) {
                  const ciudad = ciudades.find(p => p.ciud_Id === formik.values.ciud_Id);
                  setSelectedCiudad(ciudad );
                }
                if (regimenAduanero.length > 0) {
                  const regimen = regimenAduanero.find(r => r.regi_Id === formik.values.regi_Id);
                  setSelectedRegimenAduanero(regimen);
                }
              },[ciudades, formik.values.ciud_Id, nivelComercial, formik.values.nico_Id], aduanas, formik.values.deva_AduanaIngresoId, formik.values.deva_AduanaDespachoId, regimenAduanero, formik.values.regi_Id);
        
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
                            id="deva_LugarEntrega"
                            name="deva_LugarEntrega"
                            type="text"
                            value={formik.values.deva_LugarEntrega}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_LugarEntrega && Boolean(formik.errors.deva_LugarEntrega)}
                            helperText={formik.touched.deva_LugarEntrega && formik.errors.deva_LugarEntrega}
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
                                formik.setFieldValue('deva_AduanaDespachoId', newValue.deva_AduanaDespachoId);
                                } else {
                                formik.setFieldValue('deva_AduanaDespachoId', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione la aduana de despacho"
                                error={formik.touched.pais_EntregaId	 && Boolean(formik.errors.pais_EntregaId	)}
                                helperText={formik.touched.pais_EntregaId	 && formik.errors.pais_EntregaId	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.pais_Id === value?.pais_EntregaId	}
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
                                formik.setFieldValue('inco_Id', newValue.inco_Id);
                                } else {
                                formik.setFieldValue('inco_Id', 0);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione un incoterm"
                                error={formik.touched.inco_Id	 && Boolean(formik.errors.inco_Id	)}
                                helperText={formik.touched.inco_Id	 && formik.errors.inco_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.inco_Id === value?.inco_Id	}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Versión</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="inco_Version"
                            name="inco_Version"
                            type="text"
                            value={formik.values.inco_Version}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.inco_Version && Boolean(formik.errors.inco_Version)}
                            helperText={formik.touched.inco_Version && formik.errors.inco_Version}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Numero de Contrato</CustomFormLabel>
                    <CustomTextField
                            fullWidth
                            id="deva_NumeroContrato"
                            name="deva_NumeroContrato"
                            type="text"
                            value={formik.values.deva_NumeroContrato}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_NumeroContrato && Boolean(formik.errors.deva_NumeroContrato)}
                            helperText={formik.touched.deva_NumeroContrato && formik.errors.deva_NumeroContrato}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Fecha de contrato</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="deva_FechaContrato"
                            name="deva_FechaContrato"
                            type="date"
                            value={formik.values.deva_FechaContrato}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_FechaContrato && Boolean(formik.errors.deva_FechaContrato)}
                            helperText={formik.touched.deva_FechaContrato && formik.errors.deva_FechaContrato}
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
                                formik.setFieldValue('foen_Id', newValue.foen_Id);
                                } else {
                                formik.setFieldValue('foen_Id', 0);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione una forma de envio"
                                error={formik.touched.foen_Id	 && Boolean(formik.errors.foen_Id	)}
                                helperText={formik.touched.foen_Id	 && formik.errors.foen_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.foen_Id === value?.foen_Id	}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Otra forma de envio (Especifique)</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="deva_FormaEnvioOtra"
                            name="deva_FormaEnvioOtra"
                            type="text"
                            value={formik.values.deva_FormaEnvioOtra}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_FormaEnvioOtra && Boolean(formik.errors.deva_FormaEnvioOtra)}
                            helperText={formik.touched.deva_FormaEnvioOtra && formik.errors.deva_FormaEnvioOtra}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Pago efectuado</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="deva_PagoEfectuado"
                            name="deva_PagoEfectuado"
                            type="text"
                            value={formik.values.deva_PagoEfectuado}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_PagoEfectuado && Boolean(formik.errors.deva_PagoEfectuado)}
                            helperText={formik.touched.deva_PagoEfectuado && formik.errors.deva_PagoEfectuado}
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
                                formik.setFieldValue('fopa_Id', newValue.fopa_Id);
                                } else {
                                formik.setFieldValue('fopa_Id', 0);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione una forma de pago"
                                error={formik.touched.fopa_Id	 && Boolean(formik.errors.fopa_Id	)}
                                helperText={formik.touched.fopa_Id	 && formik.errors.fopa_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.foen_Id === value?.foen_Id	}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                    
                            <CustomFormLabel>Otra forma de pago (Especifique)</CustomFormLabel>
                            <CustomTextField
                            fullWidth
                            id="deva_FormaPagoOtra"
                            name="deva_FormaPagoOtra"
                            type="text"
                            value={formik.values.deva_FormaPagoOtra}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_FormaPagoOtra && Boolean(formik.errors.deva_FormaPagoOtra)}
                            helperText={formik.touched.deva_FormaPagoOtra && formik.errors.deva_FormaPagoOtra}
                        />
                    
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                                    
                                    <CustomFormLabel>Lugar de Embarque</CustomFormLabel>
                                   
                                    <CustomTextField
                                    fullWidth
                                    id="emba_Id"
                                    name="emba_Id"
                                    type="text"
                                    value={formik.values.emba_Id}
                                    disabled
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.emba_Id && Boolean(formik.errors.emba_Id)}
                                    helperText={formik.touched.emba_Id && formik.errors.emba_Id}
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
                                formik.setFieldValue('pais_ExportacionId', newValue.pais_ExportacionId);
                                } else {
                                formik.setFieldValue('pais_ExportacionId', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione el pais de exportacion"
                                error={formik.touched.pais_ExportacionId	 && Boolean(formik.errors.pais_ExportacionId	)}
                                helperText={formik.touched.pais_ExportacionId	 && formik.errors.pais_ExportacionId	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.pais_Id === value?.pais_ExportacionId	}
                        />
                    </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Fecha de exportación</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="deva_FechaExportacion"
                        name="deva_FechaExportacion"
                        type="date"
                        value={formik.values.deva_FechaExportacion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.deva_FechaExportacion && Boolean(formik.errors.deva_FechaExportacion)}
                        helperText={formik.touched.deva_FechaExportacion && formik.errors.deva_FechaExportacion}
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
                                formik.setFieldValue('mone_Id', newValue.mone_Id);
                                } else {
                                formik.setFieldValue('mone_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione la moneda"
                                error={formik.touched.mone_Id	 && Boolean(formik.errors.mone_Id	)}
                                helperText={formik.touched.mone_Id	 && formik.errors.mone_Id	}
                                />
                            )}
                            noOptionsText="No hay paises disponibles"
                            isOptionEqualToValue={(option, value) => option.mone_Id === value?.mone_Id	}
                        />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Otra moneda (Especifique)</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="mone_Otra"
                        name="mone_Otra"
                        type="text"
                        value={formik.values.mone_Otra}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.mone_Otra && Boolean(formik.errors.mone_Otra)}
                        helperText={formik.touched.mone_Otra && formik.errors.mone_Otra}
                    />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Tipo de cambio de moneda extranjera a dólares USD</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="deva_ConversionDolares"
                        name="deva_ConversionDolares"
                        type="text"
                        value={formik.values.deva_ConversionDolares}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.deva_ConversionDolares && Boolean(formik.errors.deva_ConversionDolares)}
                        helperText={formik.touched.deva_ConversionDolares && formik.errors.deva_ConversionDolares}
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
                                    formik.setFieldValue('emba_Id', newValue.emba_Id );
                                    } else {
                                    formik.setFieldValue('emba_Id', 0);
                                    
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    placeholder="Seleccione un lugar de embarque"
                                    error={formik.touched.emba_Id && Boolean(formik.errors.emba_Id)}
                                    helperText={formik.touched.emba_Id && formik.errors.emba_Id}
                                    />
                                )}
                                noOptionsText="No hay lugares de embarque disponibles"
                                isOptionEqualToValue={(option, value) => option.emba_Id === value?.emba_Id}
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