
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Grid,
    Autocomplete,TextField, Typography
    

  } from '@mui/material';
  import  'src/layouts/config/StylePhone.css';
  import 'react-intl-tel-input/dist/main.css';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import Duca from 'src/models/ducaModel';



const validationSchema = yup.object({
    duca_Codigo_Declarante: yup.string().required('El codigo de declarante es requerido'),
    duca_Numero_Id_Declarante: yup.string().required('El numero del declarante es requerido es requerido'),
    duca_NombreSocial_Declarante: yup.string().required('El nombre social del declarante es requerido'),
    duca_DomicilioFiscal_Declarante: yup.string().required('El domicilio fiscal del declarnte es requerido'),
    duca_Codigo_Transportista: yup.string().required('El codigo de transportista es requerido'),
    duca_Transportista_Nombre: yup.string().required('El nombre del transportista es requerido'),
    motr_Id: yup.number().required('El modo de transporte es requerido').moreThan(0,'El modo de transporte es requerido'),
    cont_NoIdentificacion: yup.string().required('El numero de identificacion del conductor es requerido'),
    cont_Nombre: yup.string().required('El nombre del conductor es requerido'),
    cont_Apellido: yup.string().required('El apellido del conductor es requerido'),
    cont_Licencia: yup.string().required('La licencia del conductor es requerida'),
    pais_IdExpedicion: yup.number().required('El pais de expedicion es requerido').moreThan(0,'El pais de expedicion es requerido'),
    id_pais_transporte: yup.number().required('El pais de transporte es requerido').moreThan(0,'El pais de transporte es requerido'),
    transporte_marca_Id: yup.number().required('La marca del transporte es requerida').moreThan(0,'La marca del transporte es requerida'),
   tran_IdUnidadTransporte: yup.string().required('El id de la unidad de transporte es requerido'),
   tran_Chasis: yup.string().required('El chasis es requerido'),
   tran_Remolque: yup.string().required('El remolque es requerido'),
    tran_CantCarga: yup.number().required('La cantidad de carga es requerida').moreThan(0,'La cantidad de carga es requerida'),
    tran_NumDispositivoSeguridad: yup.number().required('El numero de dispositivo de seguridad es requerido').moreThan(0,'El numero de dispositivo de seguridad es requerido'),
    tran_Equipamiento: yup.string().required('El equipamiento es requerido'),
    tran_TipoCarga: yup.string().required('El tipo de carga es requerido'),
    tran_IdContenedor: yup.string().required('El id del contenedor es requerido'),
  
});


   
const DucaTab3Component = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => { //esto es lo que manda para saber cuando cerrar el crear
const [paises, setPaises] = useState([]);
const [modoTransporte, setModoTransporte] = useState([]);
const [marcas, setMarcas] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
const [selectedPais, setSelectedPais] = useState(null);
const [selectedMarca, setSelectedMarca] = useState(null);
const [selectedModoTransporte, setSelectedModoTransporte] = useState(null);
const [selectedPaisDestino, setSelectedPaisDestino] = useState(null);
const [initialValues, setInitialValues] = useState(Duca);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  
  const listarpaises = () => {
    axios.get(`${apiUrl}/api/Paises/Listar?pais_EsAduana=true`, {
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


const listarModoTransporte = () => {
  axios.get(`${apiUrl}/api/ModoTransporte/Listar`, {
      headers: {
          'XApiKey': apiKey
      }

  })
  .then(response => {
    setModoTransporte(response.data.data);
      console.log("React E10", response.data.data)
  })
  .catch(error => {
      console.error('Error al obtener los datos del país:', error);
  });
} 

const listarMarcas = () => {
  axios.get(`${apiUrl}/api/Marcas/Listar`, {
      headers: {
          'XApiKey': apiKey
      }

  })
  .then(response => {
    setMarcas(response.data.data);
      console.log("React E10", response.data.data)
  })
  .catch(error => {
      console.error('Error al obtener los datos del país:', error);
  });
} 



useEffect(() => {
  const ducaIdString = localStorage.getItem('ducaId');
  if (ducaIdString !== null) {
    const ducaId = parseInt(ducaIdString);
    axios.post(`${apiUrl}/api/Duca/Listar_ById?id=${ducaId}`, null , {
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
      

        const camposRequeridos = [
          'duca_Codigo_Declarante',
          'duca_Numero_Id_Declarante',
          'duca_NombreSocial_Declarante',
          'duca_DomicilioFiscal_Declarante',
          'duca_Codigo_Transportista',
          'duca_Transportista_Nombre',
          'motr_Id',
          'cont_NoIdentificacion',
          'cont_Nombre',
          'cont_Apellido',
          'cont_Licencia',
          'pais_IdExpedicion',
          'id_pais_transporte',
          'transporte_marca_Id',
          'tran_IdUnidadTransporte',
          'tran_Chasis',
          'tran_Remolque',
          'tran_CantCarga',
          'tran_NumDispositivoSeguridad',
          'tran_Equipamiento',
          'tran_TipoCarga',
          'tran_IdContenedor'
        ];
        
      
        function todosCamposVacios(data) {
          return camposRequeridos.every(key => {
            const valor = data[key];
            return valor === null || valor === '' || valor === undefined || valor === 0;
          });
        }
      if (data && typeof data === 'object') {
        
    
        const esSoloPreinsert = todosCamposVacios(data);
        
        if (esSoloPreinsert) {
          console.log('entro al if');
          setInitialValues({...Duca });
          localStorage.removeItem('edit');
        } else {
          console.log('entro al else');
          Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
              Duca[key] = data[key];
            }
          });
    
          const fechaFormateada = new Date(Duca.duca_FechaVencimiento).toISOString().split('T')[0];
          Duca.duca_FechaVencimiento = fechaFormateada;
    
          if (paises.length > 0) {
            const paisProcedencia = paises.find(p => p.pais_Id === Duca.pais_IdExpedicion);
            const paisDestino = paises.find(p => p.pais_Id === Duca.id_pais_transporte);
            setSelectedPais(paisProcedencia );
            setSelectedPaisDestino(paisDestino);
          }
    
         
          setInitialValues({ ...Duca });
          localStorage.setItem('edit', 'true');
        }
    
        console.log("DUCA RELLENA O VACÍA:", Duca);
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
          let todosExitosos = true;
          try {
           
      
            console.log("Enviando valores:", values);
            values.duca_Id =  parseInt(localStorage.getItem('ducaId'));
            
         
           const edit = localStorage.getItem('edit');
           console.log('localstorage de edit', edit);
            if(edit === 'true') {
              console.log('entro al edit');
              values.usua_UsuarioModificacion = 1;
              values.duca_FechaModificacion = new Date().toISOString();

                const response = await axios.post(`${apiUrl}/api/Duca/EditarPart2`, values, {
                  headers: { 'XApiKey': apiKey },
                  'Content-Type': 'application/json'
                });
                if (response.status !== 200 || response.data.data.messageStatus !== '1') {
                  todosExitosos = false;
                  console.log(response.data.data);
                  setOpenSnackbar(true);
                  throw new Error('Error');
                  
                
                }
                if (todosExitosos) {
                  localStorage.removeItem('insert');
                  if (onGuardadoExitoso) onGuardadoExitoso();
                } else {
                  console.log(response.data.data);
                  setOpenSnackbar(true);
                  throw new Error('Error');
                }
           
            }
            else{
              console.log('entro al insert');
              values.usua_UsuarioCreacion = 1;
              const response = await axios.post(`${apiUrl}/api/Duca/InsertPart2`, values, {
                headers: { 'XApiKey': apiKey },
                'Content-Type': 'application/json'
              });
              if (response.status !== 200 || response.data.data.messageStatus === '0') {
                todosExitosos = false;
                setOpenSnackbar(true);
                throw new Error('Error');
                
          
              }
              if (todosExitosos) {
                if (onGuardadoExitoso) onGuardadoExitoso();
              } else {
                setOpenSnackbar(true);
                throw new Error('Error');
              }
     
          
            } 
           
   
        
          } catch (error) {
            todosExitosos = false;
            setOpenSnackbar(true);
            console.error('Error al insertar:', error);
            throw new Error('Error al insertar:');
            
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
        listarpaises();
        listarModoTransporte();
        listarMarcas();
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
        
      }, [formik.errors, formik.submitCount]);

      useEffect(() => {
        if (modoTransporte.length > 0) {
          const modoTransporteSelecionado = modoTransporte.find(p => p.motr_Id === formik.values.motr_Id);
          setSelectedModoTransporte(modoTransporteSelecionado);

        }
        if (paises.length > 0) {
          const paisProcedencia = paises.find(p => p.pais_Id === formik.values.pais_IdExpedicion);
          const paisDestino = paises.find(p => p.pais_Id === formik.values.id_pais_transporte);
          setSelectedPais(paisProcedencia );
          setSelectedPaisDestino(paisDestino);
        }
        if (marcas.length > 0 && formik.values.marca_Id > 0) {
          console.log('marca id',formik.values.marca_Id);
          const marcaSelecionada = marcas.find(p => p.marc_Id === formik.values.transporte_marca_Id);
          console.log('marcaSelecionada', marcaSelecionada);
          setSelectedMarca(marcaSelecionada);
        }
       
        
      
      },[paises,marcas,modoTransporte,formik.values.pais_IdExpedicion, formik.values.motr_Id, formik.values.id_pais_transporte, formik.values.transporte_marca_Id]);
      
      
      
     
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
            <Grid item xs={12}>
                <Typography variant="h6" sx={{color: '#003859'}} mt={2}>
                  Declarante
                </Typography>
              </Grid>
                <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Codigo del Declarante</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="duca_Codigo_Declarante"
                            name="duca_Codigo_Declarante"
                            type="text"
                            value={formik.values.duca_Codigo_Declarante}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.duca_Codigo_Declarante && Boolean(formik.errors.duca_Codigo_Declarante)}
                            helperText={formik.touched.duca_Codigo_Declarante && formik.errors.duca_Codigo_Declarante}
                        />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                        <CustomFormLabel>Numero del Declarante</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="duca_Numero_Id_Declarante"
                            name="duca_Numero_Id_Declarante"
                            type="text"
                            value={formik.values.duca_Numero_Id_Declarante}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.duca_Numero_Id_Declarante && Boolean(formik.errors.duca_Numero_Id_Declarante)}
                            helperText={formik.touched.duca_Numero_Id_Declarante && formik.errors.duca_Numero_Id_Declarante}
                        />
                  
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Nombre Social del Declarante</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="duca_NombreSocial_Declarante"
                       name="duca_NombreSocial_Declarante"
                       type="text"
                       value={formik.values.duca_NombreSocial_Declarante}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.duca_NombreSocial_Declarante && Boolean(formik.errors.duca_NombreSocial_Declarante)}
                       helperText={formik.touched.duca_NombreSocial_Declarante && formik.errors.duca_NombreSocial_Declarante}
                   />
             
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Domicilio Fiscal del Declarante</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="duca_DomicilioFiscal_Declarante"
                       name="duca_DomicilioFiscal_Declarante"
                       type="text"
                       value={formik.values.duca_DomicilioFiscal_Declarante}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.duca_DomicilioFiscal_Declarante && Boolean(formik.errors.duca_DomicilioFiscal_Declarante)}
                       helperText={formik.touched.duca_DomicilioFiscal_Declarante && formik.errors.duca_DomicilioFiscal_Declarante}
                   />
             
                </Grid>
                <Grid item xs={12}>
                <hr></hr>
                <Typography variant="h6" sx={{color: '#003859'}} mt={2}>
                  Conductor
                </Typography>
              </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Codigo Transportista</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="duca_Codigo_Transportista"
                       name="duca_Codigo_Transportista"
                       type="text"
                       value={formik.values.duca_Codigo_Transportista}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.duca_Codigo_Transportista && Boolean(formik.errors.duca_Codigo_Transportista)}
                       helperText={formik.touched.duca_Codigo_Transportista && formik.errors.duca_Codigo_Transportista}
                   />
             
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Nombre Transportista</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="duca_Transportista_Nombre"
                       name="duca_Transportista_Nombre"
                       type="text"
                       value={formik.values.duca_Transportista_Nombre}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.duca_Transportista_Nombre && Boolean(formik.errors.duca_Transportista_Nombre)}
                       helperText={formik.touched.duca_Transportista_Nombre && formik.errors.duca_Transportista_Nombre}
                   />
             
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                
                   <CustomFormLabel>Modo de transporte</CustomFormLabel>
                   
                   <Autocomplete
                        options={modoTransporte}
                        getOptionLabel={(option) => option.motr_Descripcion || ''}
                        value={selectedModoTransporte}
                        onChange={(event, newValue) => {
                            setSelectedModoTransporte(newValue);
                            if (newValue) {
                            formik.setFieldValue('motr_Id', newValue.motr_Id);
                            } else {
                            formik.setFieldValue('motr_Id', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione un Modo de transporte"
                            error={formik.touched.motr_Id && Boolean(formik.errors.motr_Id)}
                            helperText={formik.touched.motr_Id && formik.errors.motr_Id}
                            />
                        )}
                        noOptionsText="No hay modos de transporte disponibles"
                        isOptionEqualToValue={(option, value) => option.motr_Id === value?.motr_Id}
                      />
                   
             
                </Grid>

                <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Conductor Numero de Identificacón</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="cont_NoIdentificacion"
                    name="cont_NoIdentificacion"
                    type="text"
                    value={formik.values.cont_NoIdentificacion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cont_NoIdentificacion && Boolean(formik.errors.cont_NoIdentificacion)}
                    helperText={formik.touched.cont_NoIdentificacion && formik.errors.cont_NoIdentificacion}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Nombre del Conductor</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="cont_Nombre"
                    name="cont_Nombre"
                    type="text"
                    value={formik.values.cont_Nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cont_Nombre && Boolean(formik.errors.cont_Nombre)}
                    helperText={formik.touched.cont_Nombre && formik.errors.cont_Nombre}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Apellido del Conductor</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="cont_Apellido"
                    name="cont_Apellido"
                    type="text"
                    value={formik.values.cont_Apellido}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cont_Apellido && Boolean(formik.errors.cont_Apellido)}
                    helperText={formik.touched.cont_Apellido && formik.errors.cont_Apellido}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Conductor Licencia</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="cont_Licencia"
                    name="cont_Licencia"
                    type="text"
                    value={formik.values.cont_Licencia}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cont_Licencia && Boolean(formik.errors.cont_Licencia)}
                    helperText={formik.touched.cont_Licencia && formik.errors.cont_Licencia}
                />
                
          
             </Grid>

                <Grid item lg={4} md={12} sm={12}>
                   
                        <CustomFormLabel>Pais Expedicion</CustomFormLabel>
                        <Autocomplete
                        options={paises}
                        getOptionLabel={(option) => option.pais_Nombre || ''}
                        value={selectedPais}
                        onChange={(event, newValue) => {
                            setSelectedPais(newValue);
                            if (newValue) {
                            formik.setFieldValue('pais_IdExpedicion', newValue.pais_Id);
                            } else {
                            formik.setFieldValue('pais_IdExpedicion', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione un País"
                            error={formik.touched. pais_IdExpedicion && Boolean(formik.errors. pais_IdExpedicion)}
                            helperText={formik.touched. pais_IdExpedicion && formik.errors. pais_IdExpedicion}
                            />
                        )}
                        noOptionsText="No hay países disponibles"
                        isOptionEqualToValue={(option, value) => option.pais_Id === value?. pais_IdExpedicion}
                      />
                  
                </Grid>
                <Grid item xs={12}>
                <hr></hr>
                <Typography variant="h6" sx={{color: '#003859'}} mt={2}>
                  Transporte
                </Typography>
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Pais Transporte</CustomFormLabel>
                   <Autocomplete
                   options={paises}
                   getOptionLabel={(option) => option.pais_Nombre || ''}
                   value={selectedPaisDestino}
                   onChange={(event, newValue) => {
                       setSelectedPaisDestino(newValue);
                       if (newValue) {
                       formik.setFieldValue('id_pais_transporte', newValue.pais_Id);
                       } else {
                       formik.setFieldValue('id_pais_transporte', 0);
                       
                       }
                   }}
                   renderInput={(params) => (
                       <TextField 
                       {...params} 
                       variant="outlined" 
                       placeholder="Seleccione un País"
                       error={formik.touched.id_pais_transporte && Boolean(formik.errors.id_pais_transporte)}
                       helperText={formik.touched.id_pais_transporte && formik.errors.id_pais_transporte}
                       />
         )}
         noOptionsText="No hay países disponibles"
         isOptionEqualToValue={(option, value) => option.pais_Id === value?.id_pais_transporte}
       />
             
           </Grid>
           <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Marca de Transporte</CustomFormLabel>
               
                 <Autocomplete
                        options={marcas}
                        getOptionLabel={(option) => option.marc_Descripcion || ''}
                        value={selectedMarca}
                        onChange={(event, newValue) => {
                            setSelectedMarca(newValue);
                            if (newValue) {
                            formik.setFieldValue('transporte_marca_Id', newValue.marc_Id);
                            } else {
                            formik.setFieldValue('transporte_marca_Id', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione una Marca"
                            error={formik.touched.transporte_marca_Id && Boolean(formik.errors.transporte_marca_Id)}
                            helperText={formik.touched.transporte_marca_Id && formik.errors.transporte_marca_Id}
                            />
                        )}
                        noOptionsText="No hay marcas disponibles"
                        isOptionEqualToValue={(option, value) => option.marc_Id === value?.transporte_marca_Id}
                      />
                   
                
          
             </Grid>

             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Unidad de transporte</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_IdUnidadTransporte"
                    name="tran_IdUnidadTransporte"
                    type="text"
                    value={formik.values.tran_IdUnidadTransporte}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_IdUnidadTransporte && Boolean(formik.errors.tran_IdUnidadTransporte)}
                    helperText={formik.touched.tran_IdUnidadTransporte && formik.errors.tran_IdUnidadTransporte}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Chasis</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_Chasis"
                    name="tran_Chasis"
                    type="text"
                    value={formik.values.tran_Chasis}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_Chasis && Boolean(formik.errors.tran_Chasis)}
                    helperText={formik.touched.tran_Chasis && formik.errors.tran_Chasis}
                />
                
          
             </Grid>

             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Remolque</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_Remolque"
                    name="tran_Remolque"
                    type="text"
                    value={formik.values.tran_Remolque}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_Remolque && Boolean(formik.errors.tran_Remolque)}
                    helperText={formik.touched.tran_Remolque && formik.errors.tran_Remolque}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Cantidad de Carga</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_CantCarga"
                    name="tran_CantCarga"
                    type="text"
                    value={formik.values.tran_CantCarga}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_CantCarga && Boolean(formik.errors.tran_CantCarga)}
                    helperText={formik.touched.tran_CantCarga && formik.errors.tran_CantCarga}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Numero de Seguridad</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_NumDispositivoSeguridad"
                    name="tran_NumDispositivoSeguridad"
                    type="text"
                    value={formik.values.tran_NumDispositivoSeguridad}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_NumDispositivoSeguridad && Boolean(formik.errors.tran_NumDispositivoSeguridad)}
                    helperText={formik.touched.tran_NumDispositivoSeguridad && formik.errors.tran_NumDispositivoSeguridad}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Equipamiento</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_Equipamiento"
                    name="tran_Equipamiento"
                    type="text"
                    value={formik.values.tran_Equipamiento}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_Equipamiento && Boolean(formik.errors.tran_Equipamiento)}
                    helperText={formik.touched.tran_Equipamiento && formik.errors.tran_Equipamiento}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Tipo de Carga</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_TipoCarga"
                    name="tran_TipoCarga"
                    type="text"
                    value={formik.values.tran_TipoCarga}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_TipoCarga && Boolean(formik.errors.tran_TipoCarga)}
                    helperText={formik.touched.tran_TipoCarga && formik.errors.tran_TipoCarga}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Contenedor</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="tran_IdContenedor"
                    name="tran_IdContenedor"
                    type="text"
                    value={formik.values.tran_IdContenedor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tran_IdContenedor && Boolean(formik.errors.tran_IdContenedor)}
                    helperText={formik.touched.tran_IdContenedor && formik.errors.tran_IdContenedor}
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

export default DucaTab3Component;
