
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

const Tab2 = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => {
        const [ciudades, setCiudades] = useState([]);
        const [aduanas, setAduanas] = useState([]);
        const [regimenAduanero, setRegimenAduanero] = useState([]);
        const [nivelComercial, setNivelComercial] = useState(null);
        
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
                listarRegimenAduaneros();
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
                        <Autocomplete
                                options={aduanas}
                                getOptionLabel={(option) => option.adua_Nombre || ''}
                                value={selectAduanaIngreso}
                                onChange={(event, newValue) => {
                                    setSelectedAduanaIngreso(newValue);
                                    if (newValue) {
                                    formik.setFieldValue('deva_AduanaIngresoId', newValue.deva_AduanaIngresoId);
                                    } else {
                                    formik.setFieldValue('deva_AduanaIngresoId', 0);
                                    
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    placeholder="Seleccione una aduana"
                                    error={formik.touched.duca_AduanaRegistro && Boolean(formik.errors.duca_AduanaRegistro)}
                                    helperText={formik.touched.duca_AduanaRegistro && formik.errors.duca_AduanaRegistro}
                                    />
                                )}
                                noOptionsText="No hay aduanas disponibles"
                                isOptionEqualToValue={(option, value) => option.adua_Id === value?.duca_AduanaRegistro}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Dirección</CustomFormLabel>
                    <Autocomplete
                            options={aduanas}
                            getOptionLabel={(option) => option.adua_Nombre || ''}
                            value={selectAduanaDespacho}
                            onChange={(event, newValue) => {
                                setSelectedAduanaDespacho(newValue);
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
                                error={formik.touched.deva_AduanaDespachoId && Boolean(formik.errors.deva_AduanaDespachoId)}
                                helperText={formik.touched.deva_AduanaDespachoId && formik.errors.deva_AduanaDespachoId}
                                />
                            )}
                            noOptionsText="No hay aduanas disponibles"
                            isOptionEqualToValue={(option, value) => option.adua_Id === value?.deva_AduanaDespachoId}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                            <CustomFormLabel>Ciudad</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="deva_DeclaracionMercancia"
                                name="deva_DeclaracionMercancia"
                                type="text"
                                value={formik.values.deva_DeclaracionMercancia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.deva_DeclaracionMercancia && Boolean(formik.errors.deva_DeclaracionMercancia)}
                                helperText={formik.touched.deva_DeclaracionMercancia && formik.errors.deva_DeclaracionMercancia}
                            />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Pais</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="deva_FechaAceptacion"
                            name="deva_FechaAceptacion"
                            type="date"
                            value={formik.values.deva_FechaAceptacion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_FechaAceptacion && Boolean(formik.errors.deva_FechaAceptacion)}
                            helperText={formik.touched.deva_FechaAceptacion && formik.errors.deva_FechaAceptacion}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Correo electrónico</CustomFormLabel>
                    <Autocomplete
                            options={regimenAduanero}
                            getOptionLabel={(option) => option.regi_Descripcion || ''}
                            value={selectedRegimenAduanero}
                            onChange={(event, newValue) => {
                                setSelectedRegimenAduanero(newValue);
                                if (newValue) {
                                formik.setFieldValue('regi_Id', newValue.regi_Id);
                                } else {
                                formik.setFieldValue('regi_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione una aduana"
                                error={formik.touched.regi_Id && Boolean(formik.errors.regi_Id)}
                                helperText={formik.touched.regi_Id && formik.errors.regi_Id}
                                />
                            )}
                            noOptionsText="No hay regimenes disponibles"
                            isOptionEqualToValue={(option, value) => option.regi_Id === value?.regi_Id}
                        />
                
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Teléfono</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="decl_Nombre_Raso"
                            name="decl_Nombre_Raso"
                            type="text"
                            value={formik.values.decl_Nombre_Raso}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.decl_Nombre_Raso && Boolean(formik.errors.decl_Nombre_Raso)}
                            helperText={formik.touched.decl_Nombre_Raso && formik.errors.decl_Nombre_Raso}
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
                        <CustomTextField
                            fullWidth
                            id="impo_NumRegistro"
                            name="impo_NumRegistro"
                            type="text"
                            value={formik.values.impo_NumRegistro}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.impo_NumRegistro && Boolean(formik.errors.impo_NumRegistro)}
                            helperText={formik.touched.impo_NumRegistro && formik.errors.impo_NumRegistro}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Otra Condición</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="decl_Direccion_Exacta"
                            name="decl_Direccion_Exacta"
                            type="text"
                            value={formik.values.decl_Direccion_Exacta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.decl_Direccion_Exacta && Boolean(formik.errors.decl_Direccion_Exacta)}
                            helperText={formik.touched.decl_Direccion_Exacta && formik.errors.decl_Direccion_Exacta}
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
                        <CustomFormLabel>Dirección</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="decl_Correo_Electronico"
                            name="decl_Correo_Electronico"
                            type="text"
                            value={formik.values.decl_Correo_Electronico}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.decl_Correo_Electronico && Boolean(formik.errors.decl_Correo_Electronico)}
                            helperText={formik.touched.decl_Correo_Electronico && formik.errors.decl_Correo_Electronico}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Ciudad</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="decl_Correo_Electronico"
                            name="decl_Correo_Electronico"
                            type="text"
                            value={formik.values.decl_Correo_Electronico}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.decl_Correo_Electronico && Boolean(formik.errors.decl_Correo_Electronico)}
                            helperText={formik.touched.decl_Correo_Electronico && formik.errors.decl_Correo_Electronico}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Pais</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="deva_FechaAceptacion"
                            name="deva_FechaAceptacion"
                            type="date"
                            value={formik.values.deva_FechaAceptacion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deva_FechaAceptacion && Boolean(formik.errors.deva_FechaAceptacion)}
                            helperText={formik.touched.deva_FechaAceptacion && formik.errors.deva_FechaAceptacion}
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
                    <CustomTextField
                        fullWidth
                        id="decl_Fax"
                        name="decl_Fax"
                        type="text"
                        value={formik.values.decl_Fax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.decl_Fax && Boolean(formik.errors.decl_Fax)}
                        helperText={formik.touched.decl_Fax && formik.errors.decl_Fax}
                    />
                    
            
                </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Otro tipo de intermediario</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        id="impo_NivelComercial_Otro"
                        name="impo_NivelComercial_Otro"
                        type="text"
                        value={formik.values.impo_NivelComercial_Otro}
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