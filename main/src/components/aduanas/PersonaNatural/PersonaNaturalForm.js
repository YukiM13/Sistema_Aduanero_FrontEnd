import React, { useState, useEffect } from 'react';
import { Button, Grid, Tabs, Tab, Box, MenuItem } from '@mui/material';
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
});

const PersonaNaturalForm = ({ onGuardar, onCancelar }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [ciudades, setCiudades] = useState([]);
  const [personas, setPersonas] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;


 
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
  
 const enviarCodigoVerificacion = (pena_CorreoElectronico) => {
      // Generar código aleatorio de 7 dígitos
      console.log("Correo electrónico:", pena_CorreoElectronico);
      const generarCodigoAleatorio = () => {
          return Math.floor(1000000 + Math.random() * 9000000).toString();
      };

      const codigo = generarCodigoAleatorio();
      console.log("Código generado:", codigo);
      // Enviar correo con EmailJS
      emailjs.send('service_5x68ulj', 'template_lwiowkp', {
          email: pena_CorreoElectronico,
          codigo: codigo // Código generado dinámicamente
      }, 'mnyq6v-rJ4eMaYUOb') // Public Key
      .then((response) => {
          console.log('Correo enviado:', response.text);
          alert('Código de verificación enviado correctamente.');
      })
      .catch((error) => {
          console.error('Error al enviar correo:', error);
      });
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
        if (onGuardar) onGuardar(response.data);
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    },
  });

  const validateTabFields = () => {
    let hasErrors = false;
    
    if (activeTab === 0) {
      formik.setFieldTouched('pers_Id'); 
      formik.setFieldTouched('pena_DireccionExacta');
      formik.setFieldTouched('ciud_Id');
      hasErrors = !!(formik.errors.pers_Id || formik.errors.pena_DireccionExacta || formik.errors.ciud_Id);
    } else if (activeTab === 1) {
      formik.setFieldTouched('pena_TelefonoCelular');
      formik.setFieldTouched('pena_CorreoElectronico');
      hasErrors = !!(formik.errors.pena_TelefonoCelular || formik.errors.pena_CorreoElectronico);
    } else if (activeTab === 2) {
      formik.setFieldTouched('pena_RTN');
      formik.setFieldTouched('pena_DNI');
      hasErrors = !!(formik.errors.pena_RTN || formik.errors.pena_DNI);
    } else if (activeTab === 3) {
      formik.setFieldTouched('pena_NumeroRecibo');
      hasErrors = !!formik.errors.pena_NumeroRecibo;
    }
    
    return !hasErrors;
  };

  const handleNext = () => {
    if (validateTabFields()) {
      setActiveTab((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const handleFileChange = (event) => {
    formik.setFieldValue(event.target.name, event.target.files[0]);
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
              />
             <Grid item>
                <Button 
                    variant="contained" 
                    type="button" 
                    startIcon={<CheckCircleRounded />} 
                    onClick={() => enviarCodigoVerificacion(formik.values.pena_CorreoElectronico)}
                >
                    Verificar correo
                </Button>
            </Grid>
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
              />
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
              <CustomFormLabel htmlFor="ArchivoRTN">Archivo RTN</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoRTN" 
                name="ArchivoRTN"
                type="file" 
                onChange={handleFileChange}
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
              <CustomFormLabel htmlFor="ArchivoDNI">Archivo DNI</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoDNI"
                name="ArchivoDNI"
                type="file"
                onChange={handleFileChange}
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
              <CustomFormLabel htmlFor="ArchivoNumeroRecibo">Archivo Número Recibo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoNumeroRecibo"
                name="ArchivoNumeroRecibo"
                type="file"
                onChange={handleFileChange}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Tabs value={activeTab} centered>
        <Tab label="Datos Personales" />
        <Tab label="Datos de Contacto" />
        <Tab label="Identificación y Documentación" />
        <Tab label="Información de Pago" />
      </Tabs>
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
    </form>
  );
};

export default PersonaNaturalForm;
