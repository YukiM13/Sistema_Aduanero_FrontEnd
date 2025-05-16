
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,
    MenuItem,FormControl,FormControlLabel,Box,Autocomplete,TextField,
    FormHelperText

  } from '@mui/material';
import  'src/layouts/config/StylePhone.css';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomRadio from '../../forms/theme-elements/CustomRadio';
import ReactIntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import 'intl-tel-input/build/js/utils.js';
const validationSchema = yup.object({
empl_DNI: yup.string().required('La identidad es requerida'),
  empl_Nombres: yup.string().required('El nombre es requerido'),
  empl_Apellidos: yup.string().required('El apellido es requerido'),
  empl_Sexo: yup.string().required('El Sexo es requerido'),
  empl_Telefono: yup.string().required('El telefono es requerido'),
  empl_DireccionExacta: yup.string().required('El Sexo es requerido'),
  empl_FechaNacimiento: yup.date().required('La fecha de nacimiento es requerida'),
  empl_CorreoElectronico: yup.string().email('Ingrese un correo valido').required('El correo es obligatorio'),
  escv_Id: yup.number().required('El estado civil es requerido').moreThan(0,'El estado civil es requerido'),
  pvin_Id: yup.number().required('La provincia es requerida').moreThan(0,'La provincia es requerida'),
  carg_Id: yup.number().required('El cargo es requerido').moreThan(0,'El cargo es requerido'),
  
});


   
const EmpleadosEditComponent = ({ empleado,onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  const [estadosCiviles, setEstadosCiviles] = useState([]);
const [paises, setPaises] = useState([]);
const [provincia, setProvincia] = useState([]);
const [cargo, setCargo] = useState([]);
const [openSnackbar, setOpenSnackbar] = useState(false); 
const [selectedPais, setSelectedPais] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1;
  const listarEstadoCiviles = () => {
      axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setEstadosCiviles(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener los estados civiles:', error);
      });
  } 
  const listarCargos = () => {
    axios.get(`${apiUrl}/api/Cargos/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setCargo(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener los estados civiles:', error);
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
const listarProvinciasPorPais = (paisId) => {
  axios.get(`${apiUrl}/api/Provincias/ProvinciasFiltradaPorPais`, {
    params: { Pais_Id: paisId },
    headers: {
      'XApiKey': apiKey
    }
  })
  .then(response => {
   
    setProvincia(response.data.data);
   
  })
  .catch(error => {
    console.error('Error al obtener las provinciaes:', error);
  });
}   



    

  const formik = useFormik({
        
        initialValues: empleado,
        validationSchema,
        onSubmit: (values) => {
          values.usua_UsuarioModificacion = user;
          values.empl_FechaModificacion = new Date().toISOString();
      
          console.log("Valores antes de enviar:", values);
          axios.post(`${apiUrl}/api/Empleados/Editar`, values, {
            headers: { 'XApiKey': apiKey }
          })
          .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al insertar la persona:', error);
          });
          
        },
      });
      useEffect(() => {
        listarEstadoCiviles(); //Aca llamamos
        listarpaises();
        listarCargos();
        
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
        
      }, [formik.errors, formik.submitCount]);
      useEffect(() => {
        if (formik.values.pais_Id) {
          listarProvinciasPorPais(formik.values.pais_Id);
        }
      }, [formik.values.pais_Id]);
      useEffect(() => {
        const sexo = formik.values.empl_Sexo;
        if (paises.length > 0 && formik.values.pais_Id) {
           
          const paisSeleccionado = paises.find(pais => pais.pais_Id === formik.values.pais_Id);
          if (paisSeleccionado) {
            setSelectedPais(paisSeleccionado);
          }
        }
        if (sexo === 'Masculino') {
            formik.setFieldValue('empl_Sexo', 'M');
          } else if (sexo === 'Femenino') {
            formik.setFieldValue('empl_Sexo', 'F');
          }
        if (formik.values.empl_FechaNacimiento) {
            const fecha = new Date(formik.values.empl_FechaNacimiento);
            const fechaFormateada = fecha.toISOString().split("T")[0]; // "YYYY-MM-DD"
            formik.setFieldValue("empl_FechaNacimiento", fechaFormateada);
        }
        
      }, [paises, formik.values.pais_Id, formik.values.empl_Sexo, formik.values.empl_FechaNacimiento]);
      
      const [phoneNumber, setPhoneNumber] = useState('');
      const [countryCode, setCountryCode] = useState('hn');
      const [dialCodeMap, setDialCodeMap] = useState({});

      useEffect(() => {
        // usa el método estático que expone intl-tel-input
        const countryData = intlTelInput.getCountryData();
        const map = countryData.reduce((acc, { dialCode, iso2 }) => {
          if (!acc[dialCode]) acc[dialCode] = iso2;
          return acc;
        }, {});
        setDialCodeMap(map);
      }, []);
    
      //  ———————— Parsear valor de edición ————————
      useEffect(() => {
        const full = formik.values.empl_Telefono || '';
        const m = full.match(/^(\+\d{1,4})\s?(.*)$/);
        if (m) {
          const dial = m[1].slice(1); // "504"
          const num = m[2];          // "3333-1234"
          setPhoneNumber(num);
          setCountryCode(dialCodeMap[dial] || 'us');
        }
      }, [formik.values.empl_Telefono, dialCodeMap]);


    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={6} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Identidad</CustomFormLabel>
                        <InputMask
                          mask="9999-9999-99999"
                          maskChar={null}
                          value={formik.values.empl_DNI}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={false}
                        >
                          {(inputProps) => (
                            <CustomTextField
                              {...inputProps}
                              fullWidth
                              id="empl_DNI"
                              name="empl_DNI"
                              error={formik.touched.empl_DNI && Boolean(formik.errors.empl_DNI)}
                              helperText={formik.touched.empl_DNI && formik.errors.empl_DNI}
                            />
                          )}
                        </InputMask>
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Nombres</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="empl_Nombres"
                            name="empl_Nombres"
                            type="text"
                            value={formik.values.empl_Nombres}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.empl_Nombres && Boolean(formik.errors.empl_Nombres)}
                            helperText={formik.touched.empl_Nombres && formik.errors.empl_Nombres}
                        />
                  
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                   <CustomFormLabel>Apellidos</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="empl_Apellidos"
                       name="empl_Apellidos"
                       type="text"
                       value={formik.values.empl_Apellidos}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.empl_Apellidos && Boolean(formik.errors.empl_Apellidos)}
                       helperText={formik.touched.empl_Apellidos && formik.errors.empl_Apellidos}
                   />
             
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                   <CustomFormLabel>Correo</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="empl_CorreoElectronico"
                       name="empl_CorreoElectronico"
                       type="text"
                       value={formik.values.empl_CorreoElectronico}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.empl_CorreoElectronico && Boolean(formik.errors.empl_CorreoElectronico)}
                       helperText={formik.touched.empl_CorreoElectronico && formik.errors.empl_CorreoElectronico}
                   />
             
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                   <CustomFormLabel>Fecha Nacimiento</CustomFormLabel>
                   <CustomTextField
                       fullWidth
                       id="empl_FechaNacimiento"
                       name="empl_FechaNacimiento"
                       type="date"
                       value={formik.values.empl_FechaNacimiento}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.empl_FechaNacimiento && Boolean(formik.errors.empl_FechaNacimiento)}
                       helperText={formik.touched.empl_FechaNacimiento && formik.errors.empl_FechaNacimiento}
                   />
             
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                   <CustomFormLabel>Sexo</CustomFormLabel>
             
                   <FormControl
                sx={{ width: '100%' }}
                error={formik.touched.empl_Sexo && Boolean(formik.errors.empl_Sexo)}
                >
                <Box>
                    <FormControlLabel
                    checked={formik.values.empl_Sexo === 'M'}
                    value="M"
                    label="Masculino"
                    name="empl_Sexo"
                    control={<CustomRadio />}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                    <FormControlLabel
                    checked={formik.values.empl_Sexo === 'F'}
                    value="F"
                    label="Femenino"
                    name="empl_Sexo"
                    control={<CustomRadio />}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                </Box>

                {formik.touched.empl_Sexo && formik.errors.empl_Sexo && (
                    <FormHelperText>{formik.errors.empl_Sexo}</FormHelperText>
                )}
                </FormControl>
             
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                   <CustomFormLabel>Telefono</CustomFormLabel>
                   <ReactIntlTelInput
                    containerClassName="intl-tel-input custom-intl-input"
                    inputClassName="form-control"
                    preferredCountries={['us','hn']}
                    initialCountry={countryCode}
                    value={phoneNumber}
                    onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
                        setPhoneNumber(number);
                        if (!number) {
                        formik.setFieldValue('empl_Telefono', '');
                        } else {
                        formik.setFieldValue(
                            'empl_Telefono',
                            `${number}`
                        );
                        }
                    }}
                    onBlur={() => formik.setFieldTouched('empl_Telefono', true)}
                    error={formik.touched.empl_Telefono && Boolean(formik.errors.empl_Telefono)}
                    helperText={formik.touched.empl_Telefono && formik.errors.empl_Telefono}
                    />
                                
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                <CustomFormLabel>Estado Civil</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="escv_Id"
                  name="escv_Id"
                  value={formik.values.escv_Id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.escv_Id && Boolean(formik.errors.escv_Id)}
                  helperText={formik.touched.escv_Id && formik.errors.escv_Id}
                >
                  {estadosCiviles.map((estado) => (
                    <MenuItem key={estado.escv_Id} value={estado.escv_Id}>
                      {estado.escv_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                <CustomFormLabel>Cargo</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="carg_Id"
                  name="carg_Id"
                  value={formik.values.carg_Id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.carg_Id && Boolean(formik.errors.carg_Id)}
                  helperText={formik.touched.carg_Id && formik.errors.carg_Id}
                >
                  {cargo.map((estado) => (
                    <MenuItem key={estado.carg_Id} value={estado.carg_Id}>
                      {estado.carg_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Pais</CustomFormLabel>
                        <Autocomplete
                        options={paises}
                        getOptionLabel={(option) => option.pais_Nombre || ''}
                        value={selectedPais}
                        onChange={(event, newValue) => {
                            setSelectedPais(newValue);
                            if (newValue) {
                            formik.setFieldValue('pais_Id', newValue.pais_Id);
                            } else {
                            formik.setFieldValue('pais_Id', 0);
                            formik.setFieldValue('pvin_Id', 0);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione un País"
                            error={formik.touched.pais_Id && Boolean(formik.errors.pais_Id)}
                            helperText={formik.touched.pais_Id && formik.errors.pais_Id}
                            />
              )}
              noOptionsText="No hay países disponibles"
              isOptionEqualToValue={(option, value) => option.pais_Id === value?.pais_Id}
            />
                  
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Provincia</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="pvin_Id"
                          name="pvin_Id"
                          value={formik.values.pvin_Id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.pvin_Id && Boolean(formik.errors.pvin_Id)}
                          helperText={formik.touched.pvin_Id && formik.errors.pvin_Id}
                        >
                          {provincia.map((estado) => (
                            <MenuItem key={estado.pvin_Id} value={estado.pvin_Id}>
                              {estado.pvin_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Direccion Exacta</CustomFormLabel>
                        <CustomTextField
                       fullWidth
                       id="empl_DireccionExacta"
                       name="empl_DireccionExacta"
                       type="text"
                       value={formik.values.empl_DireccionExacta}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       error={formik.touched.empl_DireccionExacta && Boolean(formik.errors.empl_DireccionExacta)}
                       helperText={formik.touched.empl_DireccionExacta && formik.errors.empl_DireccionExacta}
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
};

export default EmpleadosEditComponent;
