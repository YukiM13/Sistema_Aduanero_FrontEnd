
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
        const [condicionComercial, setCondicionComercial] = useState([]);
        const [tipoIntermediario, setTipoIntermediario] = useState([]);
        
        const [openSnackbar, setOpenSnackbar] = useState(false); 
        const [selectedCiudad, setSelectedCiudad] = useState(null);
        const [selectedCiudadIntermediario, setSelectedCiudadIntermediario] = useState(null);
        const [selectedTipoIntermediario, setSelectedTipoIntermediario] = useState(null);
        const [selectedCondicionComercial, setSelectedCondicionComercial] = useState(null);
        
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
                    const response = await axios.post(`${apiUrl}/api/Declaracion_Valor/InsertarTab2`, values, {
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
                listarCondicionesComerciales();
                listarTiposIntermediario();
                if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
                  setOpenSnackbar(true);
                }
                
              }, [formik.errors, formik.submitCount]);

              useEffect(() => {
                if (ciudades.length > 0) {
                  const ciudad = ciudades.find(p => p.ciud_Id === formik.values.declarantesProv_ViewModel?.ciud_Id);
                  const ciudadIntermediario = ciudades.find(p => p.ciud_Id === formik.values.declarantesInte_ViewModel?.ciud_Id);
                  setSelectedCiudad(ciudad );
                  setSelectedCiudadIntermediario(ciudadIntermediario);
                }
                if (tipoIntermediario.length > 0) {
                  const tipoInt = tipoIntermediario.find(a => a.tite_Id === formik.values.intermediarioViewModel?.tite_Id);
                  setSelectedTipoIntermediario(tipoInt);
                }
                if(condicionComercial.length > 0) {
                  const condicion = condicionComercial.find(a => a.coco_Id === formik.values.proveedoresDeclaracionViewModel?.coco_Id);
                  setSelectedCondicionComercial(condicion);
                }
              },
              [
                ciudades,
                tipoIntermediario,
                condicionComercial,
                formik.values.declarantesProv_ViewModel?.ciud_Id,
                formik.values.declarantesInte_ViewModel?.ciud_Id,
                formik.values.proveedoresDeclaracionViewModel?.coco_Id,
                formik.values.intermediarioViewModel?.tite_Id
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
                        <CustomFormLabel>Nombre o razón social</CustomFormLabel>
                        <CustomTextField
                                fullWidth
                                variant="outlined"
                                sx={{
                                  backgroundColor: '#fafafa',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#aaa',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#000',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#1976d2',
                                    },
                                  },
                                }}
                                id="declarantesProv_ViewModel.decl_Nombre_Raso"
                                name="declarantesProv_ViewModel.decl_Nombre_Raso"
                                type="text"
                                value={formik.values.declarantesProv_ViewModel?.decl_Nombre_Raso}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.declarantesProv_ViewModel?.decl_Nombre_Raso && Boolean(formik.errors.declarantesProv_ViewModel?.decl_Nombre_Raso)}
                                helperText={formik.touched.declarantesProv_ViewModel?.decl_Nombre_Raso && formik.errors.declarantesProv_ViewModel?.decl_Nombre_Raso}
                            />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Dirección</CustomFormLabel>
                      <CustomTextField
                                  fullWidth
                                  variant="outlined"
                                  sx={{
                                    backgroundColor: '#fafafa',
                                    '& .MuiOutlinedInput-root': {
                                      '& fieldset': {
                                        borderColor: '#aaa',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#000',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                      },
                                    },
                                  }}
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

                    <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                        <CustomFormLabel>Ciudad</CustomFormLabel>
                        <Autocomplete
                          fullWidth
                          variant="outlined"
                          sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#aaa',
                              },
                              '&:hover fieldset': {
                                borderColor: '#000',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1976d2',
                              },
                            },
                          }}
                          options={ciudades}
                          getOptionLabel={(option) => option.ciud_Nombre || ''}
                          value={selectedCiudad}
                          onChange={(event, newValue) => {
                            setSelectedCiudad(newValue);
                            formik.setFieldValue('declarantesProv_ViewModel.ciud_Id', newValue?.ciud_Id || 0);
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
                              error={formik.touched.declarantesProv_ViewModel?.ciud_Id && Boolean(formik.errors.declarantesProv_ViewModel?.ciud_Id)}
                              helperText={formik.touched.declarantesProv_ViewModel?.ciud_Id && formik.errors.declarantesProv_ViewModel?.ciud_Id}
                            />
                          )}
                          noOptionsText="No hay ciudades disponibles"
                          isOptionEqualToValue={(option, value) => option.ciud_Id === value?.declarantesProv_ViewModel?.ciud_Id}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                      <CustomFormLabel>Correo electrónico</CustomFormLabel>
                      <CustomTextField
                                  fullWidth
                                  variant="outlined"
                                  sx={{
                                    backgroundColor: '#fafafa',
                                    '& .MuiOutlinedInput-root': {
                                      '& fieldset': {
                                        borderColor: '#aaa',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#000',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                      },
                                    },
                                  }}
                                  id="declarantesProv_ViewModel.decl_Correo_Electronico"
                                  name="declarantesProv_ViewModel.decl_Correo_Electronico"
                                  type="text"
                                  value={formik.values.declarantesProv_ViewModel?.decl_Correo_Electronico}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.declarantesProv_ViewModel?.decl_Correo_Electronico && Boolean(formik.errors.declarantesProv_ViewModel?.decl_Correo_Electronico)}
                                  helperText={formik.touched.declarantesProv_ViewModel?.decl_Correo_Electronico && formik.errors.declarantesProv_ViewModel?.decl_Correo_Electronico}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Teléfono</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                            id="declarantesProv_ViewModel.decl_Telefono"
                            name="declarantesProv_ViewModel.decl_Telefono"
                            type="text"
                            value={formik.values.declarantesProv_ViewModel?.decl_Telefono}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesProv_ViewModel?.decl_Telefono && Boolean(formik.errors.declarantesProv_ViewModel?.decl_Telefono)}
                            helperText={formik.touched.declarantesProv_ViewModel?.decl_Telefono && formik.errors.declarantesProv_ViewModel?.decl_Telefono}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Fax</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                            id="declarantesProv_ViewModel.decl_Fax"
                            name="declarantesProv_ViewModel.decl_Fax"
                            type="text"
                            value={formik.values.declarantesProv_ViewModel?.decl_Fax}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesProv_ViewModel?.decl_Fax && Boolean(formik.errors.declarantesProv_ViewModel?.decl_Fax)}
                            helperText={formik.touched.declarantesProv_ViewModel?.decl_Fax && formik.errors.declarantesProv_ViewModel?.decl_Fax}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>RTN</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                            id="declarantesProv_ViewModel.decl_NumeroIdentificacion"
                            name="declarantesProv_ViewModel.decl_NumeroIdentificacion"
                            type="text"
                            value={formik.values.declarantesProv_ViewModel?.decl_NumeroIdentificacio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesProv_ViewModel?.decl_NumeroIdentificacion && Boolean(formik.errors.declarantesProv_ViewModel?.decl_NumeroIdentificacion)}
                            helperText={formik.touched.declarantesProv_ViewModel?.decl_NumeroIdentificacion && formik.errors.declarantesProv_ViewModel?.decl_NumeroIdentificacion}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Condición comercial</CustomFormLabel>
                        <Autocomplete
                            fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                            options={condicionComercial}
                            getOptionLabel={(option) => option.coco_Descripcion || ''}
                            value={selectedCondicionComercial}
                            onChange={(event, newValue) => {
                                setSelectedCondicionComercial(newValue);
                                if (newValue) {
                                formik.setFieldValue('proveedoresDeclaracionViewModel.coco_Id', newValue.coco_Id);
                                } else {
                                formik.setFieldValue('proveedoresDeclaracionViewModel.coco_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione la condición comercial"
                                error={formik.touched.proveedoresDeclaracionViewModel?.coco_Id && Boolean(formik.errors.proveedoresDeclaracionViewModel?.coco_Id)}
                                helperText={formik.touched.proveedoresDeclaracionViewModel?.coco_Id && formik.errors.proveedoresDeclaracionViewModel?.coco_Id}
                                />
                            )}
                            noOptionsText="No hay ciudades disponibles"
                            isOptionEqualToValue={(option, value) => option.coco_Id === value?.proveedoresDeclaracionViewModel?.coco_Id}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Otra Condición</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                            id="proveedoresDeclaracionViewModel.pvde_Condicion_Otra"
                            name="proveedoresDeclaracionViewModel.pvde_Condicion_Otra"
                            type="text"
                            value={formik.values.proveedoresDeclaracionViewModel?.pvde_Condicion_Otra}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.proveedoresDeclaracionViewModel?.pvde_Condicion_Otra && Boolean(formik.errors.proveedoresDeclaracionViewModel?.pvde_Condicion_Otra)}
                            helperText={formik.touched.proveedoresDeclaracionViewModel?.pvde_Condicion_Otra && formik.errors.proveedoresDeclaracionViewModel?.pvde_Condicion_Otra}
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
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                        id="declarantesInte_ViewModel.decl_Nombre_Raso"
                        name="declarantesInte_ViewModel.decl_Nombre_Raso"
                        type="text"
                        value={formik.values.declarantesInte_ViewModel?.decl_Nombre_Raso}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.declarantesInte_ViewModel?.decl_Nombre_Raso && Boolean(formik.errors.declarantesInte_ViewModel?.decl_Nombre_Raso)}
                        helperText={formik.touched.declarantesInte_ViewModel?.decl_Nombre_Raso && formik.errors.declarantesInte_ViewModel?.decl_Nombre_Raso}
                        />
                    
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Dirección</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                            id="declarantesInte_ViewModel.decl_Direccion_Exacta"
                            name="declarantesInte_ViewModel.decl_Direccion_Exacta"
                            type="text"
                            value={formik.values.declarantesInte_ViewModel?.decl_Direccion_Exacta}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.declarantesInte_ViewModel?.decl_Direccion_Exacta && Boolean(formik.errors.declarantesInte_ViewModel?.decl_Direccion_Exacta)}
                            helperText={formik.touched.declarantesInte_ViewModel?.decl_Direccion_Exacta && formik.errors.declarantesInte_ViewModel?.decl_Direccion_Exacta}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CustomFormLabel>Ciudad</CustomFormLabel>
                        <Autocomplete
                        fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                          options={ciudades}
                          getOptionLabel={(option) => option.ciud_Nombre || ''}
                          value={selectedCiudadIntermediario}
                          onChange={(event, newValue) => {
                            setSelectedCiudadIntermediario(newValue);
                            formik.setFieldValue('declarantesInte_ViewModel.ciud_Id', newValue?.ciud_Id || 0);
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
                              error={formik.touched.declarantesInte_ViewModel?.ciud_Id && Boolean(formik.errors.declarantesInte_ViewModel?.ciud_Id)}
                              helperText={formik.touched.declarantesInte_ViewModel?.ciud_Id && formik.errors.declarantesInte_ViewModel?.ciud_Id}
                            />
                          )}
                          noOptionsText="No hay ciudades disponibles"
                          isOptionEqualToValue={(option, value) => option.ciud_Id === value?.declarantesInte_ViewModel?.ciud_Id}
                        />
                    </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    <CustomFormLabel>Correo electrónico</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
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
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
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
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
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
                    <CustomFormLabel>RTN del intermediario</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                        id="declarantesInte_ViewModel.decl_NumeroIdentificacion"
                        name="declarantesInte_ViewModel.decl_NumeroIdentificacion"
                        type="text"
                        value={formik.values.declarantesInte_ViewModel?.decl_NumeroIdentificacion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.declarantesInte_ViewModel?.decl_NumeroIdentificacion && Boolean(formik.errors.declarantesInte_ViewModel?.decl_NumeroIdentificacion)}
                        helperText={formik.touched.declarantesInte_ViewModel?.decl_NumeroIdentificacion && formik.errors.declarantesInte_ViewModel?.decl_NumeroIdentificacion}
                    />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Tipo intermediario</CustomFormLabel>
                    <Autocomplete
                            fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                            options={tipoIntermediario}
                            getOptionLabel={(option) => option.tite_Descripcion || ''}
                            value={selectedTipoIntermediario}
                            onChange={(event, newValue) => {
                                setSelectedTipoIntermediario(newValue);
                                if (newValue) {
                                formik.setFieldValue('intermediarioViewModel.tite_Id', newValue.tite_Id);
                                } else {
                                formik.setFieldValue('intermediarioViewModel.tite_Id', 0);
                                
                                }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione un tipo de intermediario"
                                error={formik.touched.intermediarioViewModel?.tite_Id && Boolean(formik.errors.intermediarioViewModel?.tite_Id)}
                                helperText={formik.touched.intermediarioViewModel?.tite_Id && formik.errors.intermediarioViewModel?.tite_Id}
                                />
                            )}
                            noOptionsText="No hay tipos de intermediario disponibles"
                            isOptionEqualToValue={(option, value) => option.tite_Id === value?.intermediarioViewModel?.tite_Id}
                        />
                    
            
                </Grid>

                <Grid item lg={4} md={12} sm={12}>
                    
                    <CustomFormLabel>Otro tipo de intermediario</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fafafa',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#aaa',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                        id="intermediarioViewModel.inte_Tipo_Otro"
                        name="intermediarioViewModel.inte_Tipo_Otro"
                        type="text"
                        value={formik.values.intermediarioViewModel?.inte_Tipo_Otro}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.intermediarioViewModel?.inte_Tipo_Otro && Boolean(formik.errors.intermediarioViewModel?.inte_Tipo_Otro)}
                        helperText={formik.touched.intermediarioViewModel?.inte_Tipo_Otro && formik.errors.intermediarioViewModel?.inte_Tipo_Otro}
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