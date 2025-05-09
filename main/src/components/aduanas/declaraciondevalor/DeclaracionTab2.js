
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
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';
import { Stack } from '@mui/system';
import Deva from 'src/models/devaModel';

const validationSchema = yup.object({
  declarantesInte_ViewModel: yup.object({
    decl_Nombre_Raso: yup.string().required('El nombre o razón social es requerido'),
    decl_Direccion_Exacta: yup.string().required('La dirección exacta es requerida'),
    ciud_Id: yup.number()
    .required('La ciudad es requerida')
    .moreThan(0, 'Debe seleccionar una ciudad válida'),
    decl_Correo_Electronico: yup.string().required('El correo electrónico es requerido'),
    decl_Telefono: yup.string().required('El teléfono es requerido'),
    decl_Fax: yup.string().required('El fax es requerido'),
    decl_NumeroIdentificacion: yup.string().required('El RTN es requerido'),
    
  }),
  declarantesProv_ViewModel: yup.object({
    decl_Nombre_Raso: yup.string().required('El nombre o razón social es requerida'),
    decl_Direccion_Exacta: yup.string().required('La dirección exacta es requerida'),
    ciud_Id: yup.number()
    .required('La ciudad es requerida')
    .moreThan(0, 'Debe seleccionar una ciudad válida'),
    decl_Telefono: yup.string().required('El teléfono es requerido'),
    decl_Fax: yup.string().required('El fax es requerido'),
    decl_Correo_Electronico: yup.string().required('El correo electrónico es requerido'),
    decl_NumeroIdentificacion: yup.string().required('El RTN del proveedor es requerido'),
  }),
  proveedoresDeclaracionViewModel: yup.object({
    coco_Id: yup.number().required('La condición comercial es requerida'),
    pvde_Condicion_Otra: yup.string().required('La condición es requerida')
    
  }),
  intermediarioViewModel: yup.object({
    inte_Tipo_Otro: yup.string().required('El nivel comercial es requerido'),
    tite_Id: yup.number()
      .required('El nivel comercial es requerido')
      .moreThan(0, 'Debe seleccionar un nivel comercial válido'),
  }),
});

const Tab2 = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => {
        const [ciudades, setCiudades] = useState([]);
        const [ciudadIntermediario, setCiudadIntermediario] = useState([]);
        const [paises, setPaises] = useState([]);
        const [aduanas, setAduanas] = useState([]);
        const [regimenAduanero, setRegimenAduanero] = useState([]);
        const [nivelComercial, setNivelComercial] = useState(null);
        const [condicionComercial, setCondicionComercial] = useState(null);
        const [tipoIntermediario, setTipoIntermediario] = useState(false);
        
        const [openSnackbar, setOpenSnackbar] = useState(false); 
        const [selectedCiudad, setSelectedCiudad] = useState(null);
        const [selectedCiudadIntermediario, setSelectedCiudadIntermediario] = useState(null);
        const [selectedTipoIntermediario, setSelectedTipoIntermediario] = useState(null);
        const [selectAduanaIngreso, setSelectedAduanaIngreso] = useState(null);
        const [selectAduanaDespacho, setSelectedAduanaDespacho] = useState(null);
        const [selectedRegimenAduanero, setSelectedRegimenAduanero] = useState(null);
        const [selectedPais, setSelectedPais] = useState(null);
        const [selectedCondicionComercial, setSelectedCondicionComercial] = useState(null);
        
        const [selectedNivelComercial, setSelectedNivelComercial] = useState(null);
        const [initialValues, setInitialValues] = useState(Deva);
        
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        //Endpoint para obtener los datos de las condiciones comerciales
        const listarCondicionesComerciales = () => {
          axios.get(`${apiUrl}/api/CondicionesComerciales/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
              setCondicionComercial(response.data.data);
              console.log("Condiciones comerciales encontradas con éxito", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos de las condiciones comerciales:', error);
          });
        }

        //Endpoint para obtener los datos de las ciudades
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

        //Endpoint para obtener los datos de las aduanas
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

        //Endpoint para obtener los datos de las aduanas
        const listarTiposIntermediario = () => {
          axios.get(`${apiUrl}/api/TipoIntermediario/Listar`, {
              headers: {
                  'XApiKey': apiKey
              }
          })
          .then(response => {
            setTipoIntermediario(response.data.data);
              console.log("React E10", response.data.data)
          })
          .catch(error => {
              console.error('Error al obtener los datos de los tipos de intermediario:', error);
          });
        } 

        //Endpoint para obtener los datos de los regimenes aduaneros
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

        //Endpoint para obtener los datos de los niveles comerciales
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
                listarAduanas();
                listarNivelesComerciales();
                listarCondicionesComerciales();
                listarRegimenAduaneros();
                listarTiposIntermediario();
                if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
                  setOpenSnackbar(true);
                }
                
              }, [formik.errors, formik.submitCount]);

              useEffect(() => {
                if (ciudades.length > 0) {
                  const ciudad = ciudades.find(p => p.ciud_Id === formik.values.ciud_Id);
                  setSelectedCiudad(ciudad );
                }
                if (aduanas.length > 0) {
                  const aduanaIngreso = aduanas.find(a => a.adua_Id === formik.values.deva_AduanaIngresoId);
                  const aduanaDespacho = aduanas.find(a => a.adua_Id === formik.values.deva_AduanaDespachoId);
                  setSelectedAduanaIngreso(aduanaIngreso);
                  setSelectedAduanaDespacho(aduanaDespacho);
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
                        <CustomFormLabel>Nombre o razón social</CustomFormLabel>
                        <CustomTextField
                                fullWidth
                                id="prov_decl_Nombre_Raso"
                                name="prov_decl_Nombre_Raso"
                                type="text"
                                value={formik.values.prov_decl_Nombre_Raso}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.prov_decl_Nombre_Raso && Boolean(formik.errors.prov_decl_Nombre_Raso)}
                                helperText={formik.touched.prov_decl_Nombre_Raso && formik.errors.prov_decl_Nombre_Raso}
                            />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Dirección</CustomFormLabel>
                      <CustomTextField
                                  fullWidth
                                  id="prov_decl_Direccion_Exacta"
                                  name="prov_decl_Direccion_Exacta"
                                  type="text"
                                  value={formik.values.prov_decl_Direccion_Exacta}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.prov_decl_Direccion_Exacta && Boolean(formik.errors.prov_decl_Direccion_Exacta)}
                                  helperText={formik.touched.prov_decl_Direccion_Exacta && formik.errors.prov_decl_Direccion_Exacta}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                        <CustomFormLabel>Ciudad</CustomFormLabel>
                        <Autocomplete
                            options={ciudades}
                            getOptionLabel={(option) => option.ciud_Nombre || ''}
                            value={selectedCiudad}
                            onChange={(event, newValue) => {
                                setSelectedCiudad(newValue);
                                if (newValue) {
                                formik.setFieldValue('ciud_Id', newValue.ciud_Id);
                                } else {
                                formik.setFieldValue('ciud_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione la ciudad"
                                error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
                                helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
                                />
                            )}
                            noOptionsText="No hay ciudades disponibles"
                            isOptionEqualToValue={(option, value) => option.ciud_Id === value?.ciud_Id}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                      <CustomFormLabel>Correo electrónico</CustomFormLabel>
                      <CustomTextField
                                  fullWidth
                                  id="prov_decl_Correo_Electronico"
                                  name="prov_decl_Correo_Electronico"
                                  type="text"
                                  value={formik.values.prov_decl_Correo_Electronico}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.prov_decl_Correo_Electronico && Boolean(formik.errors.prov_decl_Correo_Electronico)}
                                  helperText={formik.touched.prov_decl_Correo_Electronico && formik.errors.prov_decl_Correo_Electronico}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Teléfono</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="prov_decl_Telefono"
                            name="prov_decl_Telefono"
                            type="text"
                            value={formik.values.prov_decl_Telefono}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prov_decl_Telefono && Boolean(formik.errors.prov_decl_Telefono)}
                            helperText={formik.touched.prov_decl_Telefono && formik.errors.prov_decl_Telefono}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Fax</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="impo_RTN"
                            name="impo_RTN"
                            type="text"
                            value={formik.values.impo_RTN}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.impo_RTN && Boolean(formik.errors.impo_RTN)}
                            helperText={formik.touched.impo_RTN && formik.errors.impo_RTN}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Condición comercial</CustomFormLabel>
                        <Autocomplete
                            options={condicionComercial}
                            getOptionLabel={(option) => option.coco_Descripcion || ''}
                            value={selectedCondicionComercial}
                            onChange={(event, newValue) => {
                                setSelectedCondicionComercial(newValue);
                                if (newValue) {
                                formik.setFieldValue('coco_Id', newValue.coco_Id);
                                } else {
                                formik.setFieldValue('coco_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione la condición comercial"
                                error={formik.touched.coco_Id && Boolean(formik.errors.coco_Id)}
                                helperText={formik.touched.coco_Id && formik.errors.coco_Id}
                                />
                            )}
                            noOptionsText="No hay ciudades disponibles"
                            isOptionEqualToValue={(option, value) => option.coco_Id === value?.coco_Id}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Otra Condición</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="pvde_Condicion_Otra"
                            name="pvde_Condicion_Otra"
                            type="text"
                            value={formik.values.pvde_Condicion_Otra}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.pvde_Condicion_Otra && Boolean(formik.errors.pvde_Condicion_Otra)}
                            helperText={formik.touched.pvde_Condicion_Otra && formik.errors.pvde_Condicion_Otra}
                        />
                    </Grid>



                    <Grid item xs={12}>
                        <Typography mt={4} variant={'h6'}>
                            Información general del intermediario
                        </Typography>
                        <hr style={{border:'1px solid #003859'}}/>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                    
                        <CustomFormLabel>Nombre o razón social</CustomFormLabel>
                        <CustomTextField
                        fullWidth
                        id="inte_decl_Nombre_Raso"
                        name="inte_decl_Nombre_Raso"
                        type="text"
                        value={formik.values.inte_decl_Nombre_Raso}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.inte_decl_Nombre_Raso && Boolean(formik.errors.inte_decl_Nombre_Raso)}
                        helperText={formik.touched.inte_decl_Nombre_Raso && formik.errors.inte_decl_Nombre_Raso}
                        />
                    
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Dirección</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="inte_decl_Direccion_Exacta"
                            name="inte_decl_Direccion_Exacta"
                            type="text"
                            value={formik.values.inte_decl_Direccion_Exacta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.inte_decl_Direccion_Exacta && Boolean(formik.errors.inte_decl_Direccion_Exacta)}
                            helperText={formik.touched.inte_decl_Direccion_Exacta && formik.errors.inte_decl_Direccion_Exacta}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Ciudad</CustomFormLabel>
                        <Autocomplete
                            options={ciudades}
                            getOptionLabel={(option) => option.ciud_Nombre || ''}
                            value={selectedCiudad}
                            onChange={(event, newValue) => {
                                setSelectedCiudad(newValue);
                                if (newValue) {
                                formik.setFieldValue('ciud_Id', newValue.ciud_Id);
                                } else {
                                formik.setFieldValue('ciud_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione la ciudad"
                                error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
                                helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
                                />
                            )}
                            noOptionsText="No hay ciudades disponibles"
                            isOptionEqualToValue={(option, value) => option.ciud_Id === value?.ciud_Id}
                        />
                    </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Correo electrónico</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="decl_Telefono"
                        name="decl_Telefono"
                        type="text"
                        value={formik.values.decl_Telefono}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.decl_Telefono && Boolean(formik.errors.decl_Telefono)}
                        helperText={formik.touched.decl_Telefono && formik.errors.decl_Telefono}
                    />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Teléfono</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="decl_Telefono"
                        name="decl_Telefono"
                        type="text"
                        value={formik.values.decl_Telefono}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.decl_Telefono && Boolean(formik.errors.decl_Telefono)}
                        helperText={formik.touched.decl_Telefono && formik.errors.decl_Telefono}
                    />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Fax</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="decl_Telefono"
                        name="decl_Telefono"
                        type="text"
                        value={formik.values.decl_Telefono}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.decl_Telefono && Boolean(formik.errors.decl_Telefono)}
                        helperText={formik.touched.decl_Telefono && formik.errors.decl_Telefono}
                    />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Tipo intermediario</CustomFormLabel>
                    <Autocomplete
                            options={tipoIntermediario}
                            getOptionLabel={(option) => option.tite_Descripcion || ''}
                            value={selectedTipoIntermediario}
                            onChange={(event, newValue) => {
                                setSelectedTipoIntermediario(newValue);
                                if (newValue) {
                                formik.setFieldValue('tite_Id', newValue.tite_Id);
                                } else {
                                formik.setFieldValue('tite_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione un tipo de intermediario"
                                error={formik.touched.tite_Id && Boolean(formik.errors.tite_Id)}
                                helperText={formik.touched.tite_Id && formik.errors.tite_Id}
                                />
                            )}
                            noOptionsText="No hay tipos de intermediario disponibles"
                            isOptionEqualToValue={(option, value) => option.tite_Id === value?.tite_Id}
                        />
                    
            
                </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Otro tipo de intermediario</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="inte_Tipo_Otro"
                        name="inte_Tipo_Otro"
                        type="text"
                        value={formik.values.inte_Tipo_Otro}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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

     
        </div>
    );
});

export default Tab2;