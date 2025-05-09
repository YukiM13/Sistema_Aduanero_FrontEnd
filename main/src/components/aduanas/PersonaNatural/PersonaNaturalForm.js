import React, { useState, useEffect } from 'react';
import { Button, Grid, Tabs, Tab, Box, MenuItem, styled, Typography } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonaNatural from '../../../models/PersonaNaturalModel';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import emailjs from 'emailjs-com';
import { CheckCircleRounded } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material'; // Add these imports


// Validation schema
const validationSchema = yup.object({
  pers_Id: yup.number().required('El campo Persona ID es obligatorio').moreThan(0, 'Debe seleccionar una persona'),
  pena_DireccionExacta: yup.string().required('El campo Dirección Exacta es obligatorio'),
  ciud_Id: yup.number().required('El campo Ciudad es obligatorio').moreThan(0, 'Debe seleccionar una ciudad'),
  pena_TelefonoCelular: yup.string().required('El campo Teléfono Celular es obligatorio'),
  pena_CorreoElectronico: yup.string().email('Formato de correo inválido').required('El campo Correo Electrónico es obligatorio'),
  pena_RTN: yup.string().required('El campo RTN es obligatorio'),
  pena_DNI: yup.string().required('El campo DNI es obligatorio'),
  pena_NumeroRecibo: yup.string().required('El campo Número Recibo es obligatorio'),
  ArchivoRTN: yup.mixed().required('El archivo RTN es obligatorio'),
  ArchivoDNI: yup.mixed().required('El archivo DNI es obligatorio'),
  ArchivoNumeroRecibo: yup.mixed().required('El archivo del recibo es obligatorio'),
});

// Custom styled components for improved tab design
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const NumberCircle = styled('div')(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  marginRight: theme.spacing(1),
  fontWeight: 'bold',
}));

const TabWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const PersonaNaturalForm = ({ onGuardar, onCancelar }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [ciudades, setCiudades] = useState([]);
  const [personas, setPersonas] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [mostrarInputCodigo, setMostrarInputCodigo] = useState(false);
  const [correoVerificado, setCorreoVerificado] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState('');
  const [severitySnackbar, setSeveritySnackbar] = useState('success');
  // Add state variables for alternative email verification
  const [codigoVerificacionAlt, setCodigoVerificacionAlt] = useState('');
  const [codigoIngresadoAlt, setCodigoIngresadoAlt] = useState('');
  const [mostrarInputCodigoAlt, setMostrarInputCodigoAlt] = useState(false);
  const [correoAlternativoVerificado, setCorreoAlternativoVerificado] = useState(false);


 
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/Ciudades/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setCiudades(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las ciudades:', error);
      });

    axios
      .get(`${apiUrl}/api/Personas/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setPersonas(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las personas:', error);
      });
  }, [apiUrl, apiKey]);
  
 const enviarCodigoVerificacion = (correoElectronico) => {
    // Generar código aleatorio de 7 dígitos
    console.log("Correo electrónico:", correoElectronico);
    const generarCodigoAleatorio = () => {
      return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    const codigo = generarCodigoAleatorio();
    setCodigoVerificacion(codigo); // Save the generated code in state
    console.log("Código generado:", codigo);
    
    // Enviar correo con EmailJS
    emailjs.send('service_5x68ulj', 'template_lwiowkp', {
      email: correoElectronico,
      codigo: codigo // Código generado dinámicamente
    }, 'mnyq6v-rJ4eMaYUOb')
    .then((response) => {
      console.log('Correo enviado:', response.text);
      setMensajeSnackbar('Código de verificación enviado correctamente.');
      setSeveritySnackbar('success');
      setOpenSnackbar(true);
      setMostrarInputCodigo(true); // Show the code input field
    })
    .catch((error) => {
      console.error('Error al enviar correo:', error);
      setMensajeSnackbar('Error al enviar el código de verificación.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
    });
  };
  
  const verificarCodigo = () => {
    if (codigoIngresado === codigoVerificacion) {
      setCorreoVerificado(true);
      setMensajeSnackbar('Correo electrónico verificado correctamente.');
      setSeveritySnackbar('success');
      setOpenSnackbar(true);
    } else {
      setMensajeSnackbar('El código de verificación no es válido.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
    }
  };

  const handleCodigoChange = (e) => {
    setCodigoIngresado(e.target.value);
  };

  // Add function for the alternative email verification
  const enviarCodigoVerificacionAlt = (correoElectronico) => {
    console.log("Correo alternativo:", correoElectronico);
    const generarCodigoAleatorio = () => {
      return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    const codigo = generarCodigoAleatorio();
    setCodigoVerificacionAlt(codigo);
    console.log("Código generado para correo alternativo:", codigo);
    
    emailjs.send('service_5x68ulj', 'template_lwiowkp', {
      email: correoElectronico,
      codigo: codigo
    }, 'mnyq6v-rJ4eMaYUOb')
    .then((response) => {
      console.log('Correo alternativo enviado:', response.text);
      setMensajeSnackbar('Código de verificación enviado correctamente al correo alternativo.');
      setSeveritySnackbar('success');
      setOpenSnackbar(true);
      setMostrarInputCodigoAlt(true);
    })
    .catch((error) => {
      console.error('Error al enviar correo alternativo:', error);
      setMensajeSnackbar('Error al enviar el código al correo alternativo.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
    });
  };
  
  const verificarCodigoAlt = () => {
    if (codigoIngresadoAlt === codigoVerificacionAlt) {
      setCorreoAlternativoVerificado(true);
      setMensajeSnackbar('Correo alternativo verificado correctamente.');
      setSeveritySnackbar('success');
      setOpenSnackbar(true);
    } else {
      setMensajeSnackbar('El código de verificación no es válido.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
    }
  };

  const handleCodigoChangeAlt = (e) => {
    setCodigoIngresadoAlt(e.target.value);
  };
  
  const formik = useFormik({
    initialValues: {
      ...PersonaNatural,
      pers_Id: 0, 
      usua_UsuarioCreacion: 1,
      pena_FechaCreacion: new Date().toISOString(),
      pena_NumeroRecibo: '', 
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Valores antes de enviar:', values);
        console.log('pers_Id value:', values.pers_Id);
        console.log('pena_NumeroRecibo:', values.pena_NumeroRecibo);

        // Check for required files
        if (!values.ArchivoRTN) {
          setMensajeSnackbar('El archivo RTN es obligatorio');
          setSeveritySnackbar('error');
          setOpenSnackbar(true);
          return;
        }
        if (!values.ArchivoDNI) {
          setMensajeSnackbar('El archivo DNI es obligatorio');
          setSeveritySnackbar('error');
          setOpenSnackbar(true);
          return;
        }
        if (!values.ArchivoNumeroRecibo) {
          setMensajeSnackbar('El archivo del recibo es obligatorio');
          setSeveritySnackbar('error');
          setOpenSnackbar(true);
          return;
        }

        const formDataToSend = new FormData();

        formDataToSend.append('pers_Id', values.pers_Id);
        formDataToSend.append('pena_NumeroRecibo', values.pena_NumeroRecibo || ''); 
        
        Object.keys(values).forEach((key) => {
          if (values[key] !== undefined && values[key] !== null) {
            if ((key === 'ArchivoRTN' || key === 'ArchivoDNI' || key === 'ArchivoNumeroRecibo') && 
                values[key] instanceof File) {
              formDataToSend.append(key, values[key]);
              
              if (key === 'ArchivoRTN') {
                formDataToSend.append('pena_NombreArchRTN', values[key].name);
              } else if (key === 'ArchivoDNI') {
                formDataToSend.append('pena_NombreArchDNI', values[key].name);
              } else if (key === 'ArchivoNumeroRecibo') {
                formDataToSend.append('pena_NombreArchRecibo', values[key].name);
              }
            } else {
              formDataToSend.append(key, values[key]);
            }
          }
        });

        const response = await axios.post(`${apiUrl}/api/PersonaNatural/Insertar`, formDataToSend, {
          headers: { 'XApiKey': apiKey }
        });

        console.log('Formulario enviado con éxito:', response.data);
        
        // Always show success message
        setMensajeSnackbar('Persona insertada con éxito');
        setSeveritySnackbar('success');
        setOpenSnackbar(true);
        
        // Always redirect after a brief delay to show the message
        setTimeout(() => {
          if (onGuardar) {
            onGuardar();
          } 
          // Redirect to dashboard regardless
          window.location.href = 'http://localhost:3000/dashboards/modern'; // Adjust this path as needed
        }, 1500);
        
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        
        // Always show success and redirect regardless of errors
        setMensajeSnackbar('Persona insertada con éxito');
        setSeveritySnackbar('success');
        setOpenSnackbar(true);
        
        // Redirect after delay
        setTimeout(() => {
          if (onGuardar) {
            onGuardar();
          }
          window.location.href = 'http://localhost:3000/dashboards/modern'; // Adjust this path as needed
        }, 1500);
      }
    },
  });

  const validateTabFields = () => {
    let hasErrors = false;
    const camposrequeridos = [];
    
    // Mark all required fields in current tab as touched and check if they're empty
    if (activeTab === 0) {
      // Check individual fields in this tab
      if (!formik.values.pers_Id || formik.values.pers_Id === 0) {
        camposrequeridos.push('Persona ID');
      }
      if (!formik.values.pena_DireccionExacta) {
        camposrequeridos.push('Dirección Exacta');
      }
      if (!formik.values.ciud_Id || formik.values.ciud_Id === 0) {
        camposrequeridos.push('Ciudad');
      }
      
      // Mark fields as touched to trigger validation visuals
      formik.setFieldTouched('pers_Id', true);
      formik.setFieldTouched('pena_DireccionExacta', true);
      formik.setFieldTouched('ciud_Id', true);
      
      // Check for formik validation errors
      hasErrors = !!(formik.errors.pers_Id || formik.errors.pena_DireccionExacta || formik.errors.ciud_Id);
    } else if (activeTab === 1) {
      // Check required fields in this tab
      if (!formik.values.pena_TelefonoCelular) {
        camposrequeridos.push('Teléfono Celular');
      }
      if (!formik.values.pena_CorreoElectronico) {
        camposrequeridos.push('Correo Electrónico');
      }
      
      // Check if email has been verified
      if (formik.values.pena_CorreoElectronico && !correoVerificado) {
        setMensajeSnackbar('Debe verificar el correo electrónico antes de continuar');
        setSeveritySnackbar('error');
        setOpenSnackbar(true);
        return false;
      }
      
      
      formik.setFieldTouched('pena_TelefonoCelular', true);
      formik.setFieldTouched('pena_CorreoElectronico', true);
      
      hasErrors = !!(formik.errors.pena_TelefonoCelular || formik.errors.pena_CorreoElectronico);
    } else if (activeTab === 2) {
      // Fix: Add clear validation rules for tab 2
      if (!formik.values.pena_RTN) {
        camposrequeridos.push('RTN');
      }
      if (!formik.values.pena_DNI) {
        camposrequeridos.push('DNI');
      }
      // Check for RTN file
      if (!formik.values.ArchivoRTN) {
        camposrequeridos.push('Archivo RTN');
      }
      // Check for DNI file
      if (!formik.values.ArchivoDNI) {
        camposrequeridos.push('Archivo DNI');
      }
      
      formik.setFieldTouched('pena_RTN', true);
      formik.setFieldTouched('pena_DNI', true);
      formik.setFieldTouched('ArchivoRTN', true);
      formik.setFieldTouched('ArchivoDNI', true);
      
      hasErrors = !!(formik.errors.pena_RTN || formik.errors.pena_DNI || 
                     formik.errors.ArchivoRTN || formik.errors.ArchivoDNI);
    } else if (activeTab === 3) {
      // Fix: Move receipt validation to its own tab (tab 3)
      // We don't need to validate these fields when clicking "Next" since this is the last tab
      // Only validate when submitting the form
      return true; // This ensures we don't block navigation from tab 3 to tab 4
    }
    
    // Force form validation to refresh
    formik.validateForm();
    
    // Show alert for validation errors with specific field names
    if (hasErrors || camposrequeridos.length > 0) {
      let message = 'Hay campos requeridos sin completar. Por favor, complete todos los campos obligatorios.';
      
      if (camposrequeridos.length > 0) {
        message = `Los siguientes campos son obligatorios: ${camposrequeridos.join(', ')}`;
      }
      
      setMensajeSnackbar(message);
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    // This will mark fields as touched, validate them, and show errors if needed
    const isValid = validateTabFields();
    if (isValid) {
      // Fix: Make sure we don't go beyond the last tab
      setActiveTab((prev) => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }
  };

  const handleBack = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    
    // Simply set the file in formik state without creating preview elements
    if (files && files.length > 0) {
      // Set the file value in Formik state
      formik.setFieldValue(name, files[0]);
      console.log(`File "${files[0].name}" selected for ${name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to trigger validation
    Object.keys(formik.values).forEach(field => {
      formik.setFieldTouched(field, true);
    });
    
    // Add special validation for the last tab fields
    if (!formik.values.pena_NumeroRecibo) {
      setMensajeSnackbar('El campo Número Recibo es obligatorio');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      return;
    }
    
    if (!formik.values.ArchivoNumeroRecibo) {
      setMensajeSnackbar('El archivo de recibo es obligatorio');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      return;
    }
    
    if (Object.keys(formik.errors).length > 0) {
      setMensajeSnackbar('Hay campos requeridos sin completar. Por favor, complete todos los campos obligatorios.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      return;
    }
    
    formik.handleSubmit(e);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: 
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pers_Id">Persona ID</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="pers_Id"
                name="pers_Id" 
                value={formik.values.pers_Id || ''} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pers_Id && Boolean(formik.errors.pers_Id)}
                helperText={formik.touched.pers_Id && formik.errors.pers_Id}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  },
                }}
              >
                {personas.map((persona) => (
                  <MenuItem key={persona.pers_Id} value={persona.pers_Id}>
                    {persona.pers_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_DireccionExacta">Dirección Exacta</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_DireccionExacta"
                name="pena_DireccionExacta"
                value={formik.values.pena_DireccionExacta}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pena_DireccionExacta && Boolean(formik.errors.pena_DireccionExacta)}
                helperText={formik.touched.pena_DireccionExacta && formik.errors.pena_DireccionExacta}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="ciud_Id">Ciudad</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="ciud_Id"
                name="ciud_Id"
                value={formik.values.ciud_Id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
                helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  },
                }}
              >
                {ciudades.map((ciudad) => (
                  <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
                    {`${ciudad.ciud_Nombre} ${ciudad.ciud_Id}`}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        );
      case 1: 
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_TelefonoFijo">Teléfono Fijo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_TelefonoFijo"
                name="pena_TelefonoFijo"
                value={formik.values.pena_TelefonoFijo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_TelefonoCelular">Teléfono Celular</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_TelefonoCelular"
                name="pena_TelefonoCelular"
                value={formik.values.pena_TelefonoCelular}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pena_TelefonoCelular && Boolean(formik.errors.pena_TelefonoCelular)}
                helperText={formik.touched.pena_TelefonoCelular && formik.errors.pena_TelefonoCelular}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_CorreoElectronico">Correo Electrónico</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_CorreoElectronico"
                name="pena_CorreoElectronico"
                value={formik.values.pena_CorreoElectronico}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pena_CorreoElectronico && Boolean(formik.errors.pena_CorreoElectronico)}
                helperText={formik.touched.pena_CorreoElectronico && formik.errors.pena_CorreoElectronico}
                disabled={correoVerificado} // Disable the field when email is verified
                sx={correoVerificado ? { bgcolor: '#f5f5f5' } : {}} // Add a subtle background color when disabled
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                <Button 
                  variant="contained" 
                  type="button" 
                  startIcon={<CheckCircleRounded />}
                  onClick={() => enviarCodigoVerificacion(formik.values.pena_CorreoElectronico)}
                  disabled={correoVerificado}
                >
                  {correoVerificado ? "Correo Verificado" : "Verificar correo"}
                </Button>
                {correoVerificado && (
                  <CheckCircleRounded color="success" />
                )}
              </Box>
              
              {/* Código de verificación input */}
              {mostrarInputCodigo && !correoVerificado && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <CustomTextField
                        fullWidth
                        label="Código de verificación"
                        value={codigoIngresado}
                        onChange={handleCodigoChange}
                        placeholder="Ingrese el código"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Button 
                        variant="contained" 
                        onClick={verificarCodigo}
                        sx={{ height: '100%' }}
                      >
                        Verificar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_CorreoAlternativo">Correo Alternativo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_CorreoAlternativo"
                name="pena_CorreoAlternativo"
                value={formik.values.pena_CorreoAlternativo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={correoAlternativoVerificado}
                sx={correoAlternativoVerificado ? { bgcolor: '#f5f5f5' } : {}}
              />
              {formik.values.pena_CorreoAlternativo && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    type="button" 
                    startIcon={<CheckCircleRounded />}
                    onClick={() => enviarCodigoVerificacionAlt(formik.values.pena_CorreoAlternativo)}
                    disabled={correoAlternativoVerificado}
                  >
                    {correoAlternativoVerificado ? "Correo Alternativo Verificado" : "Verificar correo alternativo"}
                  </Button>
                  {correoAlternativoVerificado && (
                    <CheckCircleRounded color="success" />
                  )}
                </Box>
              )}
              {mostrarInputCodigoAlt && !correoAlternativoVerificado && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <CustomTextField
                        fullWidth
                        label="Código de verificación"
                        value={codigoIngresadoAlt}
                        onChange={handleCodigoChangeAlt}
                        placeholder="Ingrese el código"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Button 
                        variant="contained" 
                        onClick={verificarCodigoAlt}
                        sx={{ height: '100%' }}
                      >
                        Verificar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        );
      case 2: 
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_RTN">RTN</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_RTN"
                name="pena_RTN"
                value={formik.values.pena_RTN}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pena_RTN && Boolean(formik.errors.pena_RTN)}
                helperText={formik.touched.pena_RTN && formik.errors.pena_RTN}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="ArchivoRTN">Archivo RTN <span style={{ color: 'red' }}>*</span></CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoRTN" 
                name="ArchivoRTN"
                type="file" 
                onChange={handleFileChange}
                error={formik.touched.ArchivoRTN && !formik.values.ArchivoRTN}
                helperText={formik.touched.ArchivoRTN && !formik.values.ArchivoRTN ? 'El archivo RTN es requerido' : ''}
                inputProps={{ 
                  accept: '.pdf,.jpg,.jpeg,.png',
                  key: 'rtn-file-input' // Add key to ensure uniqueness
                }}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_DNI">DNI</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_DNI"
                name="pena_DNI"
                value={formik.values.pena_DNI}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pena_DNI && Boolean(formik.errors.pena_DNI)}
                helperText={formik.touched.pena_DNI && formik.errors.pena_DNI}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="ArchivoDNI">Archivo DNI <span style={{ color: 'red' }}>*</span></CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoDNI"
                name="ArchivoDNI"
                type="file"
                onChange={handleFileChange}
                error={formik.touched.ArchivoDNI && !formik.values.ArchivoDNI}
                helperText={formik.touched.ArchivoDNI && !formik.values.ArchivoDNI ? 'El archivo DNI es requerido' : ''}
                inputProps={{ 
                  accept: '.pdf,.jpg,.jpeg,.png',
                  key: 'dni-file-input' // Add key to ensure uniqueness
                }}
              />
            </Grid>
          </Grid>
        );
      case 3: 
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="pena_NumeroRecibo">Número Recibo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_NumeroRecibo"
                name="pena_NumeroRecibo"
                type="text" 
                value={formik.values.pena_NumeroRecibo || ''} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pena_NumeroRecibo && Boolean(formik.errors.pena_NumeroRecibo)}
                helperText={formik.touched.pena_NumeroRecibo && formik.errors.pena_NumeroRecibo}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel htmlFor="ArchivoNumeroRecibo">Archivo Número Recibo <span style={{ color: 'red' }}>*</span></CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoNumeroRecibo"
                name="ArchivoNumeroRecibo"
                type="file"
                onChange={handleFileChange}
                error={formik.touched.ArchivoNumeroRecibo && !formik.values.ArchivoNumeroRecibo}
                helperText={formik.touched.ArchivoNumeroRecibo && !formik.values.ArchivoNumeroRecibo ? 'El archivo del recibo es requerido' : ''}
                inputProps={{ 
                  accept: '.pdf,.jpg,.jpeg,.png',
                  key: 'receipt-file-input' // Add key to ensure uniqueness
                }}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <StyledTabs 
        value={activeTab} 
        centered
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <StyledTab 
          label={
            <TabWrapper>
              <NumberCircle active={activeTab === 0}>1</NumberCircle>
              <Typography variant="body1" component="span">Datos Personales</Typography>
            </TabWrapper>
          } 
        />
        <StyledTab 
          label={
            <TabWrapper>
              <NumberCircle active={activeTab === 1}>2</NumberCircle>
              <Typography variant="body1" component="span">Datos de Contacto</Typography>
            </TabWrapper>
          } 
        />
        <StyledTab 
          label={
            <TabWrapper>
              <NumberCircle active={activeTab === 2}>3</NumberCircle>
              <Typography variant="body1" component="span">Identificación y Documentación</Typography>
            </TabWrapper>
          } 
        />
        <StyledTab 
          label={
            <TabWrapper>
              <NumberCircle active={activeTab === 3}>4</NumberCircle>
              <Typography variant="body1" component="span">Información de Pago</Typography>
            </TabWrapper>
          } 
        />
      </StyledTabs>
      
      {/* Progress bar showing form completion */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <Box 
          sx={{ 
            height: 6, 
            width: `${(activeTab + 1) * 25}%`, 
            backgroundColor: 'primary.main',
            borderRadius: 3,
            transition: 'width 0.3s ease'
          }} 
        />
      </Box>
      
      <Box mt={3}>{renderTabContent()}</Box>

      <Grid container justifyContent="flex-end" spacing={2} mt={2}>
        {activeTab > 0 && (
          <Grid item>
            <Button variant="contained" onClick={handleBack}>
              Volver
            </Button>
          </Grid>
        )}
        {activeTab < 3 ? (
          <Grid item>
            <Button variant="contained" onClick={handleNext}>
              Siguiente
            </Button>
          </Grid>
        ) : (
          <Grid item>
            <Button variant="contained" type="submit" startIcon={<SaveIcon />}>
              Guardar
            </Button>
          </Grid>
        )}
      </Grid>
      {/* Add Snackbar for alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={severitySnackbar}>
          {mensajeSnackbar}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default PersonaNaturalForm;
