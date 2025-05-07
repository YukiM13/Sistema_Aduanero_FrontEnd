
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Grid,
    Autocomplete,TextField,InputAdornment, IconButton,Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    

  } from '@mui/material';
  import  'src/layouts/config/StylePhone.css';
  import 'react-intl-tel-input/dist/main.css';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import Duca from 'src/models/ducaModel';
import { IconSearch} from '@tabler/icons';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';




const validationSchema = yup.object({
    duca_No_Duca: yup.string().required('El numero de duca es requerido'),
    duca_No_Correlativo_Referencia: yup.string().required('El numero de referencia correlativo es requerido'),
    duca_AduanaRegistro: yup.number().required('El registro de aduana es requerido').moreThan(0,'El registro de aduana es requerido'),
    duca_AduanaDestino: yup.number().required('El destino de aduana es requerido').moreThan(0,'El destino de aduana es requerido'),
    duca_Regimen_Aduanero: yup.number().required('El regimen aduanero es requerido').moreThan(0,'El regimen aduanero es requerido'),
    duca_Modalidad: yup.string().required('La modalidad es requerida'),
    duca_Clase: yup.string().required('La clase es requerida'),
    duca_FechaVencimiento: yup.date().required('La fecha de vencimiento es requerida'),
    duca_Pais_Procedencia: yup.number().required('El pais de procedencia es requerido').moreThan(0,'El pais de procedencia es requerido'),
    duca_Pais_Destino: yup.number().required('El pais de destino es requerido').moreThan(0,'El pais de destino es requerido'),
    duca_Deposito_Aduanero: yup.string().required('El deposito aduanero es requerido'),
    duca_Lugar_Desembarque: yup.string().required('El lugar de desembarque es requerido'),
    duca_Manifiesto: yup.string().required('El manifiesto es requerido'),
    duca_Titulo: yup.string().required('El titulo es requerido'),
    trli_Id: yup.number().required('El tratado de libre comercio es requerido').moreThan(0,'El tratado de libre comercio es requerido'),
    
  
});


   
const DucaTab2Component = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => { //esto es lo que manda para saber cuando cerrar el crear
const [paises, setPaises] = useState([]);
const [aduanas, setAduanas] = useState([]);
const [regimenAduanero, setRegimenAduanero] = useState([]);
const [embarque, setEmbarque] = useState([]);
const [selectedEmbarque, setSelectedEmbarque] = useState(null);
const [openSnackbar, setOpenSnackbar] = useState(false); 
const [selectedPais, setSelectedPais] = useState(null);
const [selectedPaisDestino, setSelectedPaisDestino] = useState(null);
const [selectAduanaRegistro, setSelectedAduanaRegistro] = useState(null);
const [selectAduanaDestino, setSelectedAduanaDestino] = useState(null);
const [selectedRegimenAduanero, setSelectedRegimenAduanero] = useState(null);
const [tratadoLibre, setTratadoLibre] = useState(null);
const [selectedTratadoLibre, setSelectedTratadoLibre] = useState(null);
const [initialValues, setInitialValues] = useState(Duca);
const [open, setOpen] = React.useState(false);
const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
const [codigoEmbarque, setCodigoEmbarque] = useState('');

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

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
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

const listarTratadosLibreComercio = () => {
  axios.get(`${apiUrl}/api/TratadosLibreComercio/Listar`, {
      headers: {
          'XApiKey': apiKey
      }

  })
  .then(response => {
    setTratadoLibre(response.data.data);
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
    
      if (data && typeof data === 'object') {
        const camposUtiles = Object.entries(data).filter(([key, value]) => {
          return key !== 'duca_Id' && value !== null && value !== undefined && value !== '';
        });
    
        const esSoloPreinsert = camposUtiles.length === 0;
    
        if (esSoloPreinsert) {
     
          setInitialValues({...Duca });
        } else {

          Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
              Duca[key] = data[key];
            }
          });
    
          const fechaFormateada = new Date(Duca.duca_FechaVencimiento).toISOString().split('T')[0];
          Duca.duca_FechaVencimiento = fechaFormateada;
    
          
    
          setInitialValues({ ...Duca });
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
          try {
            values.usua_UsuarioCreacion = 1;
          
            console.log("Enviando valores:", values);
            values.duca_Id =  parseInt(localStorage.getItem('ducaId'));
            
            let todosExitosos = true;
            const response = await axios.post(`${apiUrl}/api/Duca/InsertPart1`, values, {
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
        if (paises.length > 0) {
          const paisProcedencia = paises.find(p => p.pais_Id === formik.values.duca_Pais_Procedencia);
          const paisDestino = paises.find(p => p.pais_Id === formik.values.duca_Pais_Destino);
          setSelectedPais(paisProcedencia );
          setSelectedPaisDestino(paisDestino);
        }
        
        if (aduanas.length > 0) {
          const aduanaRegistro = aduanas.find(a => a.adua_Id === formik.values.duca_AduanaRegistro);
          const aduanaDestino = aduanas.find(a => a.adua_Id === formik.values.duca_AduanaDestino);
          setSelectedAduanaRegistro(aduanaRegistro);
          setSelectedAduanaDestino(aduanaDestino);
        }
        if (regimenAduanero.length > 0) {
          const regimen = regimenAduanero.find(r => r.regi_Id === formik.values.duca_Regimen_Aduanero);
          setSelectedRegimenAduanero(regimen);
        }
        if (tratadoLibre?.length > 0) {
          const tratado = tratadoLibre.find(t => t.trli_Id === formik.values.trli_Id);
          setSelectedTratadoLibre(tratado);
        }
      },[paises, formik.values.duca_Pais_Procedencia, formik.values.duca_Pais_Destino, tratadoLibre, formik.values.trli_Id, aduanas, formik.values.duca_AduanaRegistro, formik.values.duca_AduanaDestino, regimenAduanero, formik.values.duca_Regimen_Aduanero]);
        
      useEffect(() => {
        listarpaises();
        listarTratadosLibreComercio();
        listarAduanas();
        listarRegimenAduaneros();
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
        
      }, [formik.errors, formik.submitCount]);
      
      
     
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={4} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Numero de Duca</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="duca_No_Duca"
                            name="duca_No_Duca"
                            type="text"
                            value={formik.values.duca_No_Duca}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.duca_No_Duca && Boolean(formik.errors.duca_No_Duca)}
                            helperText={formik.touched.duca_No_Duca && formik.errors.duca_No_Duca}
                        />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                        <CustomFormLabel>Numero Correlativo Referencial</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="duca_No_Correlativo_Referencia"
                            name="duca_No_Correlativo_Referencia"
                            type="text"
                            value={formik.values.duca_No_Correlativo_Referencia}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.duca_No_Correlativo_Referencia && Boolean(formik.errors.duca_No_Correlativo_Referencia)}
                            helperText={formik.touched.duca_No_Correlativo_Referencia && formik.errors.duca_No_Correlativo_Referencia}
                        />
                  
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Registro Aduana</CustomFormLabel>
                   <Autocomplete
                        options={aduanas}
                        getOptionLabel={(option) => option.adua_Nombre || ''}
                        value={selectAduanaRegistro}
                        onChange={(event, newValue) => {
                            setSelectedAduanaRegistro(newValue);
                            if (newValue) {
                            formik.setFieldValue('duca_AduanaRegistro', newValue.adua_Id);
                            } else {
                            formik.setFieldValue('duca_AduanaRegistro', 0);
                            
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
                   
                   <CustomFormLabel>Destino Aduana</CustomFormLabel>
                   <Autocomplete
                        options={aduanas}
                        getOptionLabel={(option) => option.adua_Nombre || ''}
                        value={selectAduanaDestino}
                        onChange={(event, newValue) => {
                            setSelectedAduanaDestino(newValue);
                            if (newValue) {
                            formik.setFieldValue('duca_AduanaDestino', newValue.adua_Id);
                            } else {
                            formik.setFieldValue('duca_AduanaDestino', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione una aduana"
                            error={formik.touched.duca_AduanaDestino && Boolean(formik.errors.duca_AduanaDestino)}
                            helperText={formik.touched.duca_AduanaDestino && formik.errors.duca_AduanaDestino}
                            />
                        )}
                        noOptionsText="No hay aduanas disponibles"
                        isOptionEqualToValue={(option, value) => option.adua_Id === value?.duca_AduanaDestino}
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
                            formik.setFieldValue('duca_Regimen_Aduanero', newValue.regi_Id);
                            } else {
                            formik.setFieldValue('duca_Regimen_Aduanero', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione una aduana"
                            error={formik.touched.duca_Regimen_Aduanero && Boolean(formik.errors.duca_Regimen_Aduanero)}
                            helperText={formik.touched.duca_Regimen_Aduanero && formik.errors.duca_Regimen_Aduanero}
                            />
                        )}
                        noOptionsText="No hay regimenes disponibles"
                        isOptionEqualToValue={(option, value) => option.regi_Id === value?.duca_Regimen_Aduanero}
                      />
             
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Modalidad</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="duca_Modalidad"
                       name="duca_Modalidad"
                       type="text"
                       value={formik.values.duca_Modalidad}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.duca_Modalidad && Boolean(formik.errors.duca_Modalidad)}
                       helperText={formik.touched.duca_Modalidad && formik.errors.duca_Modalidad}
                   />
             
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                
                   <CustomFormLabel>Clase</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="duca_Clase"
                       name="duca_Clase"
                       type="text"
                       value={formik.values.duca_Clase}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.duca_Clase && Boolean(formik.errors.duca_Clase)}
                       helperText={formik.touched.duca_Clase && formik.errors.duca_Clase}
                   />
                   
             
                </Grid>

                <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Fecha Vencimiento</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="duca_FechaVencimiento"
                    name="duca_FechaVencimiento"
                    type="date"
                    value={formik.values.duca_FechaVencimiento}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.duca_FechaVencimiento && Boolean(formik.errors.duca_FechaVencimiento)}
                    helperText={formik.touched.duca_FechaVencimiento && formik.errors.duca_FechaVencimiento}
                />
                
          
             </Grid>

                <Grid item lg={4} md={12} sm={12}>
                   
                        <CustomFormLabel>Pais Procedencia</CustomFormLabel>
                        <Autocomplete
                        options={paises}
                        getOptionLabel={(option) => option.pais_Nombre || ''}
                        value={selectedPais}
                        onChange={(event, newValue) => {
                            setSelectedPais(newValue);
                            if (newValue) {
                            formik.setFieldValue('duca_Pais_Procedencia', newValue.pais_Id);
                            } else {
                            formik.setFieldValue('duca_Pais_Procedencia', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione un País"
                            error={formik.touched.duca_Pais_Procedencia && Boolean(formik.errors.duca_Pais_Procedencia)}
                            helperText={formik.touched.duca_Pais_Procedencia && formik.errors.duca_Pais_Procedencia}
                            />
                        )}
                        noOptionsText="No hay países disponibles"
                        isOptionEqualToValue={(option, value) => option.pais_Id === value?.duca_Pais_Procedencia}
                      />
                  
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Pais Destino</CustomFormLabel>
                   <Autocomplete
                   options={paises}
                   getOptionLabel={(option) => option.pais_Nombre || ''}
                   value={selectedPaisDestino}
                   onChange={(event, newValue) => {
                       setSelectedPaisDestino(newValue);
                       if (newValue) {
                       formik.setFieldValue('duca_Pais_Destino', newValue.pais_Id);
                       } else {
                       formik.setFieldValue('duca_Pais_Destino', 0);
                       
                       }
                   }}
                   renderInput={(params) => (
                       <TextField 
                       {...params} 
                       variant="outlined" 
                       placeholder="Seleccione un País"
                       error={formik.touched.duca_Pais_Destino && Boolean(formik.errors.duca_Pais_Destino)}
                       helperText={formik.touched.duca_Pais_Destino && formik.errors.duca_Pais_Destino}
                       />
         )}
         noOptionsText="No hay países disponibles"
         isOptionEqualToValue={(option, value) => option.pais_Id === value?.duca_Pais_Destino}
       />
             
           </Grid>
           <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Deposito Aduanero</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="duca_Deposito_Aduanero"
                    name="duca_Deposito_Aduanero"
                    type="text"
                    value={formik.values.duca_Deposito_Aduanero}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.duca_Deposito_Aduanero && Boolean(formik.errors.duca_Deposito_Aduanero)}
                    helperText={formik.touched.duca_Deposito_Aduanero && formik.errors.duca_Deposito_Aduanero}
                />
                
          
             </Grid>

             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Lugar de Desembarque</CustomFormLabel>
               
                <CustomTextField
                fullWidth
                id="duca_Lugar_Desembarque"
                name="duca_Lugar_Desembarque"
                type="text"
                value={formik.values.duca_Lugar_Desembarque}
                disabled
                onBlur={formik.handleBlur}
                error={formik.touched.duca_Lugar_Desembarque && Boolean(formik.errors.duca_Lugar_Desembarque)}
                helperText={formik.touched.duca_Lugar_Desembarque && formik.errors.duca_Lugar_Desembarque}
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
                
                <CustomFormLabel>Manifiesto</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="duca_Manifiesto"
                    name="duca_Manifiesto"
                    type="text"
                    value={formik.values.duca_Manifiesto}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.duca_Manifiesto && Boolean(formik.errors.duca_Manifiesto)}
                    helperText={formik.touched.duca_Manifiesto && formik.errors.duca_Manifiesto}
                />
                
          
             </Grid>

             <Grid item lg={4} md={12} sm={12}>
                
                <CustomFormLabel>Titulo</CustomFormLabel>
                <CustomTextField
                    fullWidth
                    id="duca_Titulo"
                    name="duca_Titulo"
                    type="text"
                    value={formik.values.duca_Titulo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.duca_Titulo && Boolean(formik.errors.duca_Titulo)}
                    helperText={formik.touched.duca_Titulo && formik.errors.duca_Titulo}
                />
                
          
             </Grid>
             <Grid item lg={4} md={12} sm={12}>
                   
                   <CustomFormLabel>Tratado de libre comercio</CustomFormLabel>
                   <Autocomplete
                   options={tratadoLibre}
                   getOptionLabel={(option) => option.trli_NombreTratado || ''}
                   value={selectedTratadoLibre}
                   onChange={(event, newValue) => {
                       setSelectedTratadoLibre(newValue);
                       if (newValue) {
                       formik.setFieldValue('trli_Id', newValue.trli_Id);
                       } else {
                       formik.setFieldValue('trli_Id', 0);
                       
                       }
                   }}
                   renderInput={(params) => (
                       <TextField 
                       {...params} 
                       variant="outlined" 
                       placeholder="Seleccione un Tratado"
                       error={formik.touched.trli_Id && Boolean(formik.errors.trli_Id)}
                       helperText={formik.touched.trli_Id && formik.errors.trli_Id}
                       />
         )}
         noOptionsText="No hay tratados disponibles"
         isOptionEqualToValue={(option, value) => option.trli_Id === value?.trli_Id}
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
                            formik.setFieldValue('duca_Lugar_Desembarque', newValue.emba_Id );
                            } else {
                            formik.setFieldValue('duca_Lugar_Desembarque', 0);
                            
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione un lugar de embarque"
                            error={formik.touched.duca_Lugar_Desembarque && Boolean(formik.errors.duca_Lugar_Desembarque)}
                            helperText={formik.touched.duca_Lugar_Desembarque && formik.errors.duca_Lugar_Desembarque}
                            />
                        )}
                        noOptionsText="No hay lugares de embarque disponibles"
                        isOptionEqualToValue={(option, value) => option.emba_Id === value?.duca_Lugar_Desembarque}
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

export default DucaTab2Component;
