
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
  declaraciones_ValorViewModel: yup.object({
    deva_AduanaIngresoId: yup.number().required('La aduana de ingreso es requerida'),
    deva_AduanaDespachoId: yup.number().required('La aduana de despacho es requerida'),
    deva_DeclaracionMercancia: yup.string().required('La declaración de mercancía es necesaria'),
    deva_FechaAceptacion: yup.date().required('La fecha de aceptación es requerida'),
    regi_Id: yup.number().required('El régimen aduanero es requerido'),
  }),
  declarantesImpo_ViewModel: yup.object({
    decl_Nombre_Raso: yup.string().required('El nombre o razón social es requerido'),
    impo_RTN: yup.string().required('El RTN es requerido'),
    impo_NumRegistro: yup.string().required('El número de registro es requerido'),
    ciud_Id: yup.number()
      .required('La ciudad es requerida')
      .moreThan(0, 'Debe seleccionar una ciudad válida')
  }),
  declarantesProv_ViewModel: yup.object({
    decl_Direccion_Exacta: yup.string().required('La dirección exacta es requerida')
  }),
  declarantesInte_ViewModel: yup.object({
    decl_Correo_Electronico: yup.string().required('El correo del declarante es requerido'),
    decl_Telefono: yup.string().required('El teléfono es requerido'),
    decl_Fax: yup.string().required('El fax es requerido'),
    
  }),
  importadoresViewModel: yup.object({
    impo_NivelComercial_Otro: yup.string().required('El nivel comercial es requerido'),
    nico_Id: yup.number()
      .required('El nivel comercial es requerido')
      .moreThan(0, 'Debe seleccionar un nivel comercial válido'),
  }),
});

const Tab1 = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => {
        const [ciudades, setCiudades] = useState([]);
        const [aduanas, setAduanas] = useState([]);
        const [regimenAduanero, setRegimenAduanero] = useState([]);
        const [nivelComercial, setNivelComercial] = useState([]);
        
        const [openSnackbar, setOpenSnackbar] = useState(false); 
        const [selectedCiudad, setSelectedCiudad] = useState(null);
        const [selectAduanaIngreso, setSelectedAduanaIngreso] = useState(null);
        const [selectAduanaDespacho, setSelectedAduanaDespacho] = useState(null);
        const [selectedRegimenAduanero, setSelectedRegimenAduanero] = useState(null);
        
        const [selectedNivelComercial, setSelectedNivelComercial] = useState(null);
        
        const [initialValues, setInitialValues] = useState(Deva);
        
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

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
                console.error('Error al obtener los datos de la deva:', error);
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
                    values.declarantesInte_ViewModel.usua_UsuarioCreacion = 1;
                    values.declarantesImpo_ViewModel.usua_UsuarioCreacion = 1;
                    values.importadoresViewModel.usua_UsuarioCreacion = 1;
                    values.declarantesProv_ViewModel.usua_UsuarioCreacion = 1;
                    values.declaraciones_ValorViewModel.deva_FechaCreacion = new Date().toISOString();
                  
                    console.log("Enviando valores:", values);
                    
                    let todosExitosos = true;
                    if(localStorage.getItem('devaId')){
                      const response = await axios.post(`${apiUrl}/api/Declaracion_Valor/InsertarTab1`, values, {
                        headers: { 'XApiKey': apiKey },
                        'Content-Type': 'application/json'
                      });
                 
                      if (response.data.data.messageStatus == '0') {
                            todosExitosos = false;
                      
                      }
                      if (todosExitosos) {
                        if (onGuardadoExitoso) onGuardadoExitoso();
                        localStorage.setItem('devaId', response.data.data.messageStatus)
                      } else {
                        setOpenSnackbar(true);
                      }
                    }
                    else{
                      
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
                      await formik.submitForm(); // Este ejecuta el console.log que ya tienes
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
                    setOpenSnackbar(true);
                    return false;
                  }
                },
                getValues() {
                  return formik.values;
                }
              }));
              useEffect(() => {
                listarCiudades();
                listarAduanas();
                listarNivelesComerciales();
                listarRegimenAduaneros();
                if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
                  setOpenSnackbar(true);
                }
                
              }, [formik.errors, formik.submitCount]);

              useEffect(() => {
                if (ciudades.length > 0 &&
                  formik.values.declarantesImpo_ViewModel &&
                  formik.values.declarantesImpo_ViewModel.ciud_Id 
                ) {
                  const ciudad = ciudades.find(p => p.ciud_Id === formik.values.declarantesImpo_ViewModel.ciud_Id);
                  setSelectedCiudad(ciudad || null);
                }
                if (aduanas.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.deva_AduanaIngresoId &&
                  formik.values.declaraciones_ValorViewModel.deva_AduanaDespachoId
                ) {
                  const aduanaIngreso = aduanas.find(a => a.adua_Id === formik.values.declaraciones_ValorViewModel.deva_AduanaIngresoId);
                  const aduanaDespacho = aduanas.find(a => a.adua_Id === formik.values.declaraciones_ValorViewModel.deva_AduanaDespachoId);
                  setSelectedAduanaIngreso(aduanaIngreso || null);
                  setSelectedAduanaDespacho(aduanaDespacho || null);
                }
              
                if (regimenAduanero.length > 0 &&
                  formik.values.declaraciones_ValorViewModel &&
                  formik.values.declaraciones_ValorViewModel.regi_Id 
                ) {
                  const regimen = regimenAduanero.find(r => r.regi_Id === formik.values.declaraciones_ValorViewModel.regi_Id);
                  setSelectedRegimenAduanero(regimen || null);
                }
              
                if (nivelComercial.length > 0 &&
                  formik.values.importadoresViewModel &&
                  formik.values.importadoresViewModel.nico_Id
                 ) {
                  const nivel = nivelComercial.find(n => n.nico_Id === formik.values.importadoresViewModel.nico_Id);
                  setSelectedNivelComercial(nivel || null);
                }
              }, [
                ciudades,
                formik.values.declarantesImpo_ViewModel.ciud_Id,
                aduanas,
                formik.values.declaraciones_ValorViewModel.deva_AduanaIngresoId,
                formik.values.declaraciones_ValorViewModel.deva_AduanaDespachoId,
                regimenAduanero,
                formik.values.declaraciones_ValorViewModel.regi_Id,
                nivelComercial,
                formik.values.importadoresViewModel.nico_Id
              ]);
        
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Aduana de ingreso</CustomFormLabel>
                        <Autocomplete
                                options={aduanas}
                                getOptionLabel={(option) => option.adua_Nombre || ''}
                                value={selectAduanaIngreso}
                                onChange={(event, newValue) => {
                                    setSelectedAduanaIngreso(newValue);
                                    if (newValue) {
                                    formik.setFieldValue('declaraciones_ValorViewModel.deva_AduanaIngresoId', newValue.adua_Id);
                                    } else {
                                    formik.setFieldValue('declaraciones_ValorViewModel.deva_AduanaIngresoId', 0);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    placeholder="Seleccione una aduana"
                                    error={formik.touched.declaraciones_ValorViewModel?.deva_AduanaIngresoId && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_AduanaIngresoId)}
                                    helperText={formik.touched.declaraciones_ValorViewModel?.deva_AduanaIngresoId && formik.errors.declaraciones_ValorViewModel?.deva_AduanaIngresoId}
                                    />
                                )}
                                noOptionsText="No hay aduanas disponibles"
                                isOptionEqualToValue={(option, value) => option.adua_Id === value?.declaraciones_ValorViewModel?.deva_AduanaIngresoId}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Aduana de despacho</CustomFormLabel>
                    <Autocomplete
                    options={aduanas}
                    getOptionLabel={(option) => option.adua_Nombre || ''}
                    value={selectAduanaDespacho}
                    onChange={(event, newValue) => {
                      setSelectedAduanaDespacho(newValue);
                      if (newValue) {
                        formik.setFieldValue('declaraciones_ValorViewModel.deva_AduanaDespachoId', newValue.adua_Id);
                      } else {
                        formik.setFieldValue('declaraciones_ValorViewModel.deva_AduanaDespachoId', 0);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        variant="outlined" 
                        placeholder="Seleccione la aduana de despacho"
                        error={
                          formik.touched.declaraciones_ValorViewModel?.deva_AduanaDespachoId &&
                          Boolean(formik.errors.declaraciones_ValorViewModel?.deva_AduanaDespachoId)
                        }
                        helperText={
                          formik.touched.declaraciones_ValorViewModel?.deva_AduanaDespachoId &&
                          formik.errors.declaraciones_ValorViewModel?.deva_AduanaDespachoId
                        }
                      />
                    )}
                    noOptionsText="No hay aduanas disponibles"
                    isOptionEqualToValue={(option, value) =>
                      option.adua_Id === value?.declaraciones_ValorViewModel?.deva_AduanaDespachoId // usa esto si value es el objeto completo
                    }
                  />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                            <CustomFormLabel>Declaración de mercancia</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="declaraciones_ValorViewModel.deva_DeclaracionMercancia"
                                name="declaraciones_ValorViewModel.deva_DeclaracionMercancia"
                                type="text"
                                value={formik.values.declaraciones_ValorViewModel?.deva_DeclaracionMercancia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.declaraciones_ValorViewModel?.deva_DeclaracionMercancia && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_DeclaracionMercancia)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.deva_DeclaracionMercancia && formik.errors.declaraciones_ValorViewModel?.deva_DeclaracionMercancia}
                            />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Fecha de aceptación</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declaraciones_ValorViewModel.deva_FechaAceptacion"
                            name="declaraciones_ValorViewModel.deva_FechaAceptacion"
                            type="date"
                            value={formik.values.declaraciones_ValorViewModel?.deva_FechaAceptacion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declaraciones_ValorViewModel?.deva_FechaAceptacion && Boolean(formik.errors.declaraciones_ValorViewModel?.deva_FechaAceptacion)}
                            helperText={formik.touched.declaraciones_ValorViewModel?.deva_FechaAceptacion && formik.errors.declaraciones_ValorViewModel?.deva_FechaAceptacion}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Regimen Aduanero</CustomFormLabel>
                    <Autocomplete
                            options={regimenAduanero}
                            getOptionLabel={(option) => option.regi_Descripcion || ''}
                            value={selectedRegimenAduanero}
                            onChange={(event, newValue) => {
                                setSelectedRegimenAduanero(newValue);
                                if (newValue) {
                                formik.setFieldValue('declaraciones_ValorViewModel.regi_Id', newValue.regi_Id);
                                } else {
                                formik.setFieldValue('declaraciones_ValorViewModel.regi_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione una aduana"
                                error={formik.touched.declaraciones_ValorViewModel?.regi_Id && Boolean(formik.errors.declaraciones_ValorViewModel?.regi_Id)}
                                helperText={formik.touched.declaraciones_ValorViewModel?.regi_Id && formik.errors.declaraciones_ValorViewModel?.regi_Id}
                                />
                            )}
                            noOptionsText="No hay regimenes disponibles"
                            isOptionEqualToValue={(option, value) => option.regi_Id === value?.declaraciones_ValorViewModel?.regi_Id}
                        />
                
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Nombre o razón social</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declarantesImpo_ViewModel.decl_Nombre_Raso"
                            name="declarantesImpo_ViewModel.decl_Nombre_Raso"
                            type="text"
                            value={formik.values.declarantesImpo_ViewModel?.decl_Nombre_Raso}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesImpo_ViewModel?.decl_Nombre_Raso && Boolean(formik.errors.declarantesImpo_ViewModel?.decl_Nombre_Raso)}
                            helperText={formik.touched.declarantesImpo_ViewModel?.decl_Nombre_Raso && formik.errors.declarantesImpo_ViewModel?.decl_Nombre_Raso}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Registro Tributario (RTN)</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declarantesImpo_ViewModel.impo_RTN"
                            name="declarantesImpo_ViewModel.impo_RTN"
                            type="text"
                            value={formik.values.declarantesImpo_ViewModel?.impo_RTN}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesImpo_ViewModel?.impo_RTN && Boolean(formik.errors.declarantesImpo_ViewModel?.impo_RTN)}
                            helperText={formik.touched.declarantesImpo_ViewModel?.impo_RTN && formik.errors.declarantesImpo_ViewModel?.impo_RTN}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Número de registro</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declarantesImpo_ViewModel.impo_NumRegistro"
                            name="declarantesImpo_ViewModel.impo_NumRegistro"
                            type="text"
                            value={formik.values.declarantesImpo_ViewModel?.impo_NumRegistro}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesImpo_ViewModel?.impo_NumRegistro && Boolean(formik.errors.declarantesImpo_ViewModel?.impo_NumRegistro)}
                            helperText={formik.touched.declarantesImpo_ViewModel?.impo_NumRegistro && formik.errors.declarantesImpo_ViewModel?.impo_NumRegistro}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Dirección exacta</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declarantesProv_ViewModel.decl_Direccion_Exacta"
                            name="declarantesProv_ViewModel.decl_Direccion_Exacta"
                            type="text"
                            value={formik.values.declarantesProv_ViewModel?.decl_Direccion_Exacta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesProv_ViewModel?.decl_Direccion_Exacta && Boolean(formik.errors.declarantesProv_ViewModel?.decl_Direccion_Exacta)}
                            helperText={formik.touched.declarantesProv_ViewModel?.decl_Direccion_Exacta && formik.errors.declarantesProv_ViewModel?.decl_Direccion_Exacta}
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
                                formik.setFieldValue('declarantesImpo_ViewModel.ciud_Id', newValue?.ciud_Id || 0);
                              }}
                              renderOption={(props, option) => (
                                <li {...props} key={option.ciud_Id}>
                                  {option.ciud_Nombre}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Seleccione la ciudad"
                                  error={formik.touched.declarantesImpo_ViewModel?.ciud_Id && Boolean(formik.errors.declarantesImpo_ViewModel?.ciud_Id)}
                                  helperText={formik.touched.declarantesImpo_ViewModel?.ciud_Id && formik.errors.declarantesImpo_ViewModel?.ciud_Id}
                                />
                              )}
                              noOptionsText="No hay ciudades disponibles"
                              isOptionEqualToValue={(option, value) => option.ciud_Id === value?.declarantesImpo_ViewModel?.ciud_Id}
                            />
                    
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Correo electrónico</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="declarantesInte_ViewModel.decl_Correo_Electronico"
                            name="declarantesInte_ViewModel.decl_Correo_Electronico"
                            type="text"
                            value={formik.values.declarantesInte_ViewModel?.decl_Correo_Electronico}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesInte_ViewModel?.decl_Correo_Electronico && Boolean(formik.errors.declarantesInte_ViewModel?.decl_Correo_Electronico)}
                            helperText={formik.touched.declarantesInte_ViewModel?.decl_Correo_Electronico && formik.errors.declarantesInte_ViewModel?.decl_Correo_Electronico}
                        />
                    </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Teléfono</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="declarantesInte_ViewModel.decl_Telefono"
                        name="declarantesInte_ViewModel.decl_Telefono"
                        type="text"
                        value={formik.values.declarantesInte_ViewModel?.decl_Telefono}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.declarantesInte_ViewModel?.decl_Telefono && Boolean(formik.errors.declarantesInte_ViewModel?.decl_Telefono)}
                        helperText={formik.touched.declarantesInte_ViewModel?.decl_Telefono && formik.errors.declarantesInte_ViewModel?.decl_Telefono}
                    />
                    
            
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Fax</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="declarantesInte_ViewModel.decl_Fax"
                        name="declarantesInte_ViewModel.decl_Fax"
                        type="text"
                        value={formik.values.declarantesInte_ViewModel?.decl_Fax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.declarantesInte_ViewModel?.decl_Fax && Boolean(formik.errors.declarantesInte_ViewModel?.decl_Fax)}
                        helperText={formik.touched.declarantesInte_ViewModel?.decl_Fax && formik.errors.declarantesInte_ViewModel?.decl_Fax}
                    />
                    
            
                </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Nivel comercial</CustomFormLabel>
                    <Autocomplete
                    options={nivelComercial}
                    getOptionLabel={(option) => option.nico_Descripcion || ''}
                    value={selectedNivelComercial}
                    onChange={(event, newValue) => {
                        setSelectedNivelComercial(newValue);
                        if (newValue) {
                        formik.setFieldValue('importadoresViewModel.nico_Id', newValue.nico_Id);
                        } else {
                        formik.setFieldValue('importadoresViewModel.nico_Id', 0);
                        
                        }
                    }}
                    renderInput={(params) => (
                        <TextField 
                        {...params} 
                        variant="outlined" 
                        placeholder="Seleccione un nivel comercial"
                        error={formik.touched.importadoresViewModel?.nico_Id && Boolean(formik.errors.importadoresViewModel?.nico_Id)}
                        helperText={formik.touched.importadoresViewModel?.nico_Id && formik.errors.importadoresViewModel?.nico_Id}
                        />
            )}
            noOptionsText="No hay tratados disponibles"
            isOptionEqualToValue={(option, value) => option.nico_Id === value?.importadoresViewModel?.nico_Id}
        />
        </Grid>

        <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Otro nivel comercial</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="importadoresViewModel.impo_NivelComercial_Otro"
                        name="importadoresViewModel.impo_NivelComercial_Otro"
                        type="text"
                        value={formik.values.importadoresViewModel?.impo_NivelComercial_Otro}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.importadoresViewModel?.impo_NivelComercial_Otro && Boolean(formik.errors.importadoresViewModel?.impo_NivelComercial_Otro)}
                        helperText={formik.touched.importadoresViewModel?.impo_NivelComercial_Otro && formik.errors.importadoresViewModel?.impo_NivelComercial_Otro}
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

export default Tab1;