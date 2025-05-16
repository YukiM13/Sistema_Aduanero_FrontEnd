
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Grid,
    Autocomplete,TextField,
    

  } from '@mui/material';
  import  'src/layouts/config/StylePhone.css';
  import 'react-intl-tel-input/dist/main.css';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import DocumentoDeSoporte from 'src/models/documentoDeSoporteModel';
import { filter } from 'lodash';



const validationSchema = yup.object({
    tido_Id: yup.number().required('El tipo de documento es requerido').moreThan(0,'El tipo de documento es requerido'),
    doso_NumeroDocumento: yup.string().required('El numero de documento es requerido es requerido'),
    doso_FechaEmision: yup.date().required('La fecha de emision es requerida'),
    doso_FechaVencimiento: yup.date().required('La fecha de vencimiento es requerida'),
    doso_PaisEmision: yup.number().required('El pais de emision es requerido').moreThan(0,'El pais de emision es requerido'),
    doso_LineaAplica: yup.string().required('La linea de aplica es requerida'),
    doso_EntidadEmitioDocumento: yup.string().required('La entidad que emitio el documento es requerida'),
    doso_Monto: yup.string().required('El monto es requerido'),
});


   
const DucaTab4Component = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => { //esto es lo que manda para saber cuando cerrar el crear
const [paises, setPaises] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
const [selectedPais, setSelectedPais] = useState(null);
const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(null);
const [tiposDocumentos, setTiposDocumentos] = useState([]);
const [initialValues, setInitialValues] = useState(DocumentoDeSoporte);
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

const listarTiposDocumentos = () => {
    axios.get(`${apiUrl}/api/TipoDocumento/Listar`, {
        headers: {
            'XApiKey': apiKey
        }
    })
    .then(response => {
        setTiposDocumentos(response.data.data);
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
    axios.get(`${apiUrl}/api/DocumentosDeSoporte/Listar` , {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      const rawData = response.data.data;
      console.log('data como llego desde api',rawData);
      console.log(ducaId);
      const dataFiltrada = rawData.find(p => p.duca_Id === parseInt(ducaId));
        
      console.log('dataConFiltro', dataFiltrada);
      if (dataFiltrada && typeof dataFiltrada === 'object') {
        
        
        const esSoloPreinsert = dataFiltrada.length >0? true: false;
      
    
        if (esSoloPreinsert) {
          console.log('entro al insert')
          setInitialValues({...DocumentoDeSoporte });
        } else {
          console.log('entro al edit')
          console.log('data filtrada',dataFiltrada)
          Object.keys(dataFiltrada).forEach(key => {
            if (dataFiltrada[key] !== null && dataFiltrada[key] !== undefined && dataFiltrada[key] !== '') {
              DocumentoDeSoporte[key] = dataFiltrada[key];
            }
          });
    
          const fechaFormateada = new Date(DocumentoDeSoporte.doso_FechaVencimiento).toISOString().split('T')[0];
          DocumentoDeSoporte.doso_FechaVencimiento = fechaFormateada;
          const fechaFormateada2 = new Date(DocumentoDeSoporte.doso_FechaEmision).toISOString().split('T')[0];
          DocumentoDeSoporte.doso_FechaEmision = fechaFormateada2;
          
    
         
          setInitialValues({ ...DocumentoDeSoporte });
          localStorage.setItem('edit', 'true');
        }
    
        console.log("DUCA RELLENA O VACÍA:", DocumentoDeSoporte);
      }
    })
    .catch(error => {
      console.log("DUCA RELLENA O VACÍA:", DocumentoDeSoporte);
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
            values.usua_UsuarioCreacion = 1;
            console.log("Enviando valores:", values);
          
            
            values.duca_Id =  parseInt(localStorage.getItem('ducaId'));
            const edit = localStorage.getItem('edit');
           console.log(edit);
            if(edit === 'true') {
              console.log('entro al edit');
              values.usua_UsuarioModificacion = 1;
              values.doso_FechaModificacion = new Date().toISOString();

                const response = await axios.post(`${apiUrl}/api/Duca/EditarPart3`, values, {
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
            const response = await axios.post(`${apiUrl}/api/Duca/InsertPart3`, values, {
              headers: { 'XApiKey': apiKey },
              'Content-Type': 'application/json'
            });
       
              if (response.status !== 200 || response.data.data.messageStatus !== '1') {
                    todosExitosos = false;
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
      useEffect(()=> {
        if (paises.length > 0) {
          const paisProcedencia = paises.find(p => p.pais_Id === formik.values.doso_PaisEmision);
       
          setSelectedPais(paisProcedencia );
       
        }
        if(tiposDocumentos.length > 0){
          const tipoDocumentoSeleccionado = tiposDocumentos.find(p => p.tido_Id === formik.values.tido_Id);
          setSelectedTipoDocumento(tipoDocumentoSeleccionado);
        }
      },[formik.values.tido_Id, formik.values.doso_PaisEmision, paises, tiposDocumentos])
      useEffect(() => {
        listarpaises();
        listarTiposDocumentos();
       
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
        
      }, [formik.errors, formik.submitCount]);
      
      
     
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Tipo de Documento</CustomFormLabel>
                        <Autocomplete
                        options={tiposDocumentos}
                        getOptionLabel={(option) => option.tido_Descripcion || ''}
                        value={selectedTipoDocumento}
                        onChange={(event, newValue) => {
                            setSelectedTipoDocumento(newValue);
                            if (newValue) {

                            formik.setFieldValue('tido_Id', newValue.tido_Id);
                            } else {
                            formik.setFieldValue('tido_Id', 0);
                            
                            }
                            }}
                            renderInput={(params) => (
                              <TextField 
                                {...params} 
                                variant="outlined" 
                                placeholder="Seleccione un tipo de documento"
                                error={formik.touched.tido_Id && Boolean(formik.errors.tido_Id)}
                                helperText={formik.touched.tido_Id && formik.errors.tido_Id}
                              />
                          )}
                          noOptionsText="No hay países disponibles"
                          isOptionEqualToValue={(option, value) => option.tido_Id === value?.tido_Id}
                        />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                        <CustomFormLabel>Numero de documento</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="doso_NumeroDocumento"
                            name="doso_NumeroDocumento"
                            type="text"
                            value={formik.values.doso_NumeroDocumento}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.doso_NumeroDocumento && Boolean(formik.errors.doso_NumeroDocumento)}
                            helperText={formik.touched.doso_NumeroDocumento && formik.errors.doso_NumeroDocumento}
                        />
                  
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Fecha de emision</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="doso_FechaEmision"
                       name="doso_FechaEmision"
                       type="date"
                       value={formik.values.doso_FechaEmision}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.doso_FechaEmision && Boolean(formik.errors.doso_FechaEmision)}
                       helperText={formik.touched.doso_FechaEmision && formik.errors.doso_FechaEmision}
                   />
             
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                <CustomFormLabel>Fecha de vencimiento</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="doso_FechaVencimiento"
                       name="doso_FechaVencimiento"
                       type="date"
                       value={formik.values.doso_FechaVencimiento}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.doso_FechaVencimiento && Boolean(formik.errors.doso_FechaVencimiento)}
                       helperText={formik.touched.doso_FechaVencimiento && formik.errors.doso_FechaVencimiento}
                   />
             
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                        <CustomFormLabel>Pais Emision</CustomFormLabel>
                        <Autocomplete
                        options={paises}
                        getOptionLabel={(option) => option.pais_Nombre || ''}
                        value={selectedPais}
                        onChange={(event, newValue) => {
                            setSelectedPais(newValue);
                            if (newValue) {
                            formik.setFieldValue('doso_PaisEmision', newValue.pais_Id);
                            } else {
                            formik.setFieldValue('doso_PaisEmision', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione un País"
                            error={formik.touched.doso_PaisEmision && Boolean(formik.errors.doso_PaisEmision)}
                            helperText={formik.touched.doso_PaisEmision && formik.errors.doso_PaisEmision}
                            />
                        )}
                        noOptionsText="No hay países disponibles"
                        isOptionEqualToValue={(option, value) => option.pais_Id === value?.doso_PaisEmision}
                      />
                  
                </Grid>
                
           <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Linea Aplica</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="doso_LineaAplica"
                    name="doso_LineaAplica"
                    type="text"
                    value={formik.values.doso_LineaAplica}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.doso_LineaAplica && Boolean(formik.errors.doso_LineaAplica)}
                    helperText={formik.touched.doso_LineaAplica && formik.errors.doso_LineaAplica}
                />
                
          
             </Grid>

             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Entidad Emitida del Documento</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="doso_EntidadEmitioDocumento"
                    name="doso_EntidadEmitioDocumento"
                    type="text"
                    value={formik.values.doso_EntidadEmitioDocumento}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.doso_EntidadEmitioDocumento && Boolean(formik.errors.doso_EntidadEmitioDocumento)}
                    helperText={formik.touched.doso_EntidadEmitioDocumento && formik.errors.doso_EntidadEmitioDocumento}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Monto</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="doso_Monto"
                    name="doso_Monto"
                    type="text"
                    value={formik.values.doso_Monto}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.doso_Monto && Boolean(formik.errors.doso_Monto)}
                    helperText={formik.touched.doso_Monto && formik.errors.doso_Monto}
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

export default DucaTab4Component;
