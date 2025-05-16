import React, { useState, useEffect } from 'react';
import { Button, Grid, Tabs, Tab, Box, MenuItem, styled, Typography, Snackbar, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { CheckCircleRounded } from '@mui/icons-material';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import PersonaNaturalModel from '../../../models/PersonaNaturalModel';
import axios from 'axios';
import { useFormik } from 'formik';
import emailjs from '@emailjs/browser';

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

const PersonaNaturalEditComponent = ({ persona = PersonaNaturalModel, onCancelar, onGuardadoExitoso }) => {
  const [ciudades, setCiudades] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState('');
  const [severitySnackbar, setSeveritySnackbar] = useState('success');
  const [archivos, setArchivos] = useState({
    ArchivoRTN: null,
    ArchivoDNI: null,
    ArchivoNumeroRecibo: null,
  });
  // Email verification states
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [mostrarInputCodigo, setMostrarInputCodigo] = useState(false);
  const [correoVerificado, setCorreoVerificado] = useState(false);
  const [correoOriginal, setCorreoOriginal] = useState('');
  const [correoAlternativoOriginal, setCorreoAlternativoOriginal] = useState('');
  const [codigoVerificacionAlt, setCodigoVerificacionAlt] = useState('');
  const [codigoIngresadoAlt, setCodigoIngresadoAlt] = useState('');
  const [mostrarInputCodigoAlt, setMostrarInputCodigoAlt] = useState(false);
  const [correoAlternativoVerificado, setCorreoAlternativoVerificado] = useState(false);
  const [verificarCorreoDeshabilitado, setVerificarCorreoDeshabilitado] = useState(false);
  const [showCorreoSnackbar, setShowCorreoSnackbar] = useState(false);
  const [showCorreoAltSnackbar, setShowCorreoAltSnackbar] = useState(false);
  const [correoModificado, setCorreoModificado] = useState(false);
  const [correoAltModificado, setCorreoAltModificado] = useState(false);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    axios.get(`${apiUrl}/api/Ciudades/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setCiudades(res.data.data || []))
      .catch(() => setCiudades([]));
    axios.get(`${apiUrl}/api/Personas/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setPersonas(res.data.data || []))
      .catch(() => setPersonas([]));
  }, [apiUrl, apiKey]);

  // Store original email values and set them as verified initially
  useEffect(() => {
    if (persona.pena_CorreoElectronico) {
      setCorreoOriginal(persona.pena_CorreoElectronico);
      // No auto-verify the email - it needs verification if changed
      setCorreoVerificado(false);
    }
    if (persona.pena_CorreoAlternativo) {
      setCorreoAlternativoOriginal(persona.pena_CorreoAlternativo);
      // No auto-verify the alternate email - it needs verification if changed
      setCorreoAlternativoVerificado(false);
    }
  }, [persona]);

  const handleFinalSubmit = async () => {
    // Check if email verification is required
    if (correoModificado && !correoVerificado && formik.values.pena_CorreoElectronico) {
      setMensajeSnackbar('Debe verificar el correo electrónico primario antes de guardar.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      return;
    }
    
    // Check if alternate email verification is required
    if (correoAltModificado && !correoAlternativoVerificado && formik.values.pena_CorreoAlternativo) {
      setMensajeSnackbar('Debe verificar el correo electrónico alternativo antes de guardar.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      console.log('Submitting from final tab...');
      const formDataToSend = new FormData();
      Object.keys(formik.values).forEach((key) => {
        if (formik.values[key] !== undefined && formik.values[key] !== null) {
          if ((key === 'ArchivoRTN' || key === 'ArchivoDNI' || key === 'ArchivoNumeroRecibo') && archivos[key]) {
            formDataToSend.append(key, archivos[key]);
            if (key === 'ArchivoRTN') {
              formDataToSend.append('pena_NombreArchRTN', archivos[key].name);
            } else if (key === 'ArchivoDNI') {
              formDataToSend.append('pena_NombreArchDNI', archivos[key].name);
            } else if (key === 'ArchivoNumeroRecibo') {
              formDataToSend.append('pena_NombreArchRecibo', archivos[key].name);
            }
          } else {
            formDataToSend.append(key, formik.values[key]);
          }
        }
      });
      formDataToSend.append('pena_FechaModificacion', new Date().toISOString());
      formDataToSend.append('usua_UsuarioModificacion', 1);

      await axios.post(`${apiUrl}/api/PersonaNatural/Editar`, formDataToSend, {
        headers: {    
          'XApiKey': apiKey,
        }
      });

      setMensajeSnackbar('Persona editada con éxito');
      setSeveritySnackbar('success');
      setOpenSnackbar(true);

      setTimeout(() => {
        if (onGuardadoExitoso) {
          onGuardadoExitoso();
        }
      }, 1500);

    } catch (error) {
      setMensajeSnackbar('Error al editar la persona');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
      console.error('Error al llamar endpoint:', error);
    }
  };
  
  const formik = useFormik({
    initialValues: {
      ...persona,
      pers_Id: persona.pers_Id || 0,
      pena_DireccionExacta: persona.pena_DireccionExacta || '',
      ciud_Id: persona.ciud_Id || 0,
      pena_TelefonoFijo: persona.pena_TelefonoFijo || '',
      pena_TelefonoCelular: persona.pena_TelefonoCelular || '',
      pena_CorreoElectronico: persona.pena_CorreoElectronico || '',
      pena_CorreoAlternativo: persona.pena_CorreoAlternativo || '',
      pena_RTN: persona.pena_RTN || '',
      pena_DNI: persona.pena_DNI || '',
      pena_NumeroRecibo: persona.pena_NumeroRecibo || '',
      pena_NombreArchRTN: persona.pena_NombreArchRTN || '',
      pena_NombreArchDNI: persona.pena_NombreArchDNI || '',
      pena_NombreArchRecibo: persona.pena_NombreArchRecibo || '',
    },
    enableReinitialize: true,
 
  });
  const handleNavigation = (e) => {
    e.preventDefault();
    if (activeTab < 3) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      setArchivos(prev => ({ ...prev, [name]: files[0] }));
      formik.setFieldValue(name, files[0]);
    }
  };

  const enviarCodigoVerificacion = (correoElectronico) => {
    setVerificarCorreoDeshabilitado(true);
    console.log("Correo electrónico:", correoElectronico);
    const generarCodigoAleatorio = () => {
      return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    const codigo = generarCodigoAleatorio();
    setCodigoVerificacion(codigo);
    console.log("Código generado:", codigo);
    emailjs.send('service_5x68ulj', 'template_lwiowkp', {
      email: correoElectronico,
      codigo: codigo 
    }, 'mnyq6v-rJ4eMaYUOb')
    .then((response) => {
      console.log('Correo enviado:', response.text);

      if (activeTab === 1) {
        setShowCorreoSnackbar(true);
      }
      setMostrarInputCodigo(true);
    })
    .catch((error) => {
      console.error('Error al enviar correo:', error);
      if (activeTab === 1) {
        setMensajeSnackbar('Error al enviar el código de verificación.');
        setSeveritySnackbar('error');
        setOpenSnackbar(true);
      }
    });
  };
  
  const verificarCodigo = () => {
    if (codigoIngresado === codigoVerificacion) {
      setCorreoVerificado(true);
      setShowCorreoSnackbar(false);
    } else {
      if (activeTab === 1) {
        setMensajeSnackbar('El código de verificación no es válido.');
        setSeveritySnackbar('error');
        setOpenSnackbar(true);
      }
    }
  };

  const handleCodigoChange = (e) => {
    setCodigoIngresado(e.target.value);
  };

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
      if (activeTab === 1) setShowCorreoAltSnackbar(true);
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
      setShowCorreoAltSnackbar(false);
    } else {
      setMensajeSnackbar('El código de verificación no es válido.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
    }
  };

  const handleCodigoChangeAlt = (e) => {
    setCodigoIngresadoAlt(e.target.value);
  };

  // Check the current email and set verification status on component load
  useEffect(() => {
    // If we're editing and already have email, assume it's verified
    if (persona.pena_CorreoElectronico) {
      setCorreoVerificado(true);
    }
    if (persona.pena_CorreoAlternativo) {
      setCorreoAlternativoVerificado(true);
    }
  }, [persona]);

  // Clean up email verification UI when changing tabs
  useEffect(() => {
    if (activeTab !== 1) {
      setShowCorreoSnackbar(false);
      setShowCorreoAltSnackbar(false);
      if (openSnackbar && 
         (mensajeSnackbar.includes('correo') || 
          mensajeSnackbar.includes('código') || 
          mensajeSnackbar.includes('Código'))) {
        setOpenSnackbar(false);
      }
    }
  }, [activeTab]);

  // Track when email is modified
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    formik.handleChange(e);
    
    if (name === 'pena_CorreoElectronico') {
      // Check if email is modified from its original value
      if (value !== correoOriginal) {
        setCorreoModificado(true);
        setCorreoVerificado(false);
      } else {
        setCorreoModificado(false);
        setCorreoVerificado(true); // Auto-verify if it matches original
      }
    }
    
    if (name === 'pena_CorreoAlternativo') {
      // Check if alternate email is modified from its original value
      if (value !== correoAlternativoOriginal) {
        setCorreoAltModificado(true);
        setCorreoAlternativoVerificado(false);
      } else {
        setCorreoAltModificado(false);
        setCorreoAlternativoVerificado(true); // Auto-verify if it matches original
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Persona</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="pers_Id"
                name="pers_Id"
                value={formik.values.pers_Id}
                onChange={formik.handleChange}
              >
                {personas.map((p) => (
                  <MenuItem key={p.pers_Id} value={p.pers_Id}>
                    {p.pers_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Ciudad</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="ciud_Id"
                name="ciud_Id"
                value={formik.values.ciud_Id}
                onChange={formik.handleChange}
              >
                {ciudades.map((c) => (
                  <MenuItem key={c.ciud_Id} value={c.ciud_Id}>
                    {c.ciud_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Dirección Exacta</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_DireccionExacta"
                name="pena_DireccionExacta"
                value={formik.values.pena_DireccionExacta}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        );
      case 1: 
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Fijo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_TelefonoFijo"
                name="pena_TelefonoFijo"
                value={formik.values.pena_TelefonoFijo}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Celular</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_TelefonoCelular"
                name="pena_TelefonoCelular"
                value={formik.values.pena_TelefonoCelular}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Correo Electrónico</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_CorreoElectronico"
                name="pena_CorreoElectronico"
                value={formik.values.pena_CorreoElectronico}
                onChange={handleEmailChange}
                error={correoModificado && !correoVerificado && formik.values.pena_CorreoElectronico !== ''}
                helperText={correoModificado && !correoVerificado && formik.values.pena_CorreoElectronico !== '' ? 'Necesita verificación' : ''}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                <Button 
                  variant="contained" 
                  type="button" 
                  startIcon={<CheckCircleRounded />}
                  onClick={() => enviarCodigoVerificacion(formik.values.pena_CorreoElectronico)}
                  disabled={!correoModificado || verificarCorreoDeshabilitado || correoVerificado || !formik.values.pena_CorreoElectronico}
                >
                  {correoVerificado ? "Correo Verificado" : "Verificar correo"}
                </Button>
                {correoVerificado && (
                  <CheckCircleRounded color="success" />
                )}
              </Box>
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
              <CustomFormLabel>Correo Alternativo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_CorreoAlternativo"
                name="pena_CorreoAlternativo"
                value={formik.values.pena_CorreoAlternativo}
                onChange={handleEmailChange}
                error={correoAltModificado && !correoAlternativoVerificado && formik.values.pena_CorreoAlternativo !== ''}
                helperText={correoAltModificado && !correoAlternativoVerificado && formik.values.pena_CorreoAlternativo !== '' ? 'Necesita verificación' : ''}
              />
              {formik.values.pena_CorreoAlternativo && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    type="button" 
                    startIcon={<CheckCircleRounded />}
                    onClick={() => enviarCodigoVerificacionAlt(formik.values.pena_CorreoAlternativo)}
                    disabled={!correoAltModificado || correoAlternativoVerificado}
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
              <CustomFormLabel>RTN</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_RTN"
                name="pena_RTN"
                value={formik.values.pena_RTN}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Archivo RTN</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoRTN"
                name="ArchivoRTN"
                type="file"
                onChange={handleFileChange}
                inputProps={{
                  accept: '.pdf,.jpg,.jpeg,.png',
                  key: 'rtn-file-input'
                }}
              />
              {persona.pena_NombreArchRTN && !archivos.ArchivoRTN && (
                <>
                  <Typography variant="caption" color="primary">
                    Archivo actual: {persona.pena_NombreArchRTN}
                  </Typography>
                  <br />
                  {persona.pena_ArchivoRTN && (
                    <>
                      {/\.(jpg|jpeg|png|jfif)$/i.test(persona.pena_NombreArchRTN) ? (
                        <img
                          src={persona.pena_ArchivoRTN}
                          alt="Archivo RTN"
                          style={{ maxWidth: 120, maxHeight: 120, display: 'block', marginTop: 4, borderRadius: 4 }}
                        />
                      ) : (
                        <a
                          href={persona.pena_ArchivoRTN}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 13 }}
                        >
                          Ver archivo
                        </a>
                      )}
                    </>
                  )}
                </>
              )}
              {archivos.ArchivoRTN && (
                <Typography variant="caption" color="primary">
                  Nuevo archivo: {archivos.ArchivoRTN.name}
                </Typography>
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>DNI</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_DNI"
                name="pena_DNI"
                value={formik.values.pena_DNI}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Archivo DNI</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoDNI"
                name="ArchivoDNI"
                type="file"
                onChange={handleFileChange}
                inputProps={{
                  accept: '.pdf,.jpg,.jpeg,.png',
                  key: 'dni-file-input'
                }}
              />
              {persona.pena_NombreArchDNI && !archivos.ArchivoDNI && (
                <>
                  <Typography variant="caption" color="primary">
                    Archivo actual: {persona.pena_NombreArchDNI}
                  </Typography>
                  <br />
                  {persona.pena_ArchivoDNI && (
                    <>
                      {/\.(jpg|jpeg|png|jfif)$/i.test(persona.pena_NombreArchDNI) ? (
                        <img
                          src={persona.pena_ArchivoDNI}
                          alt="Archivo DNI"
                          style={{ maxWidth: 120, maxHeight: 120, display: 'block', marginTop: 4, borderRadius: 4 }}
                        />
                      ) : (
                        <a
                          href={persona.pena_ArchivoDNI}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 13 }}
                        >
                          Ver archivo
                        </a>
                      )}
                    </>
                  )}
                </>
              )}
              {archivos.ArchivoDNI && (
                <Typography variant="caption" color="primary">
                  Nuevo archivo: {archivos.ArchivoDNI.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Número Recibo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pena_NumeroRecibo"
                name="pena_NumeroRecibo"
                value={formik.values.pena_NumeroRecibo}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Archivo Número Recibo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="ArchivoNumeroRecibo"
                name="ArchivoNumeroRecibo"
                type="file"
                onChange={handleFileChange}
                inputProps={{
                  accept: '.pdf,.jpg,.jpeg,.png',
                  key: 'recibo-file-input'
                }}
              />
              {persona.pena_NombreArchRecibo && !archivos.ArchivoNumeroRecibo && (
                <>
                  <Typography variant="caption" color="primary">
                    Archivo actual: {persona.pena_NombreArchRecibo}
                  </Typography>
                  <br />
                  {persona.pena_ArchivoNumeroRecibo && (
                    <>
                      {/\.(jpg|jpeg|png|jfif)$/i.test(persona.pena_NombreArchRecibo) ? (
                        <img
                          src={persona.pena_ArchivoNumeroRecibo}
                          alt="Archivo Recibo"
                          style={{ maxWidth: 120, maxHeight: 120, display: 'block', marginTop: 4, borderRadius: 4 }}
                        />
                      ) : (
                        <a
                          href={persona.pena_ArchivoNumeroRecibo}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 13 }}
                        >
                          Ver archivo
                        </a>
                      )}
                    </>
                  )}
                </>
              )}
              {archivos.ArchivoNumeroRecibo && (
                <Typography variant="caption" color="primary">
                  Nuevo archivo: {archivos.ArchivoNumeroRecibo.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    // Form no longer auto-submits
    <form onSubmit={handleNavigation}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          variant="text"
          color="inherit"
          startIcon={<CancelIcon />}
          onClick={onCancelar}
          sx={{ minWidth: 0, p: 1 }}
        >
        </Button>
      </Box>
      <StyledTabs
        value={activeTab}
        centered
        variant="fullWidth"
        sx={{ mb: 3 }}
        onChange={(_, newValue) => setActiveTab(newValue)}
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
            <Button variant="contained" type="button" onClick={() => setActiveTab(activeTab - 1)}>
              Volver
            </Button>
          </Grid>
        )}
        {activeTab < 3 ? (
          <Grid item>
            <Button variant="contained" type="submit">
              Siguiente
            </Button>
          </Grid>
        ) : (
          <Grid item>
            <Button 
              variant="contained" 
              type="button" 
              startIcon={<SaveIcon />}
              onClick={handleFinalSubmit}
            >
              Guardar
            </Button>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={showCorreoSnackbar && activeTab === 1}
        autoHideDuration={6000}
        onClose={() => setShowCorreoSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowCorreoSnackbar(false)} severity="success">
          Código de verificación enviado correctamente.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showCorreoAltSnackbar && activeTab === 1}
        autoHideDuration={6000}
        onClose={() => setShowCorreoAltSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowCorreoAltSnackbar(false)} severity="success">
          Código de verificación enviado correctamente al correo alternativo.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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

export default PersonaNaturalEditComponent;
