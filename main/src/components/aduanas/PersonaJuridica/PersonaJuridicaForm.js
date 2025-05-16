import React, { useState, useEffect } from 'react';
import { Button, Grid, Tabs, Tab, Box, MenuItem, styled, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import emailjs from '@emailjs/browser';
import ReactIntTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import CloseIcon from '@mui/icons-material/Close';

import { Snackbar, Alert } from '@mui/material';

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

const validationSchemas = [
  yup.object({
    pers_Nombre: yup.string().required('El nombre es requerido'),
    pers_RTN: yup.string().required('El RTN es requerido'),
    escv_Id: yup.number().required('El estado civil es requerido').moreThan(0, 'Debe seleccionar un estado civil'),
    ofic_Id: yup.number().required('La oficina es requerida').moreThan(0, 'Debe seleccionar una oficina'),
    ofpr_Id: yup.number().required('El oficio o profesión es requerido').moreThan(0, 'Debe seleccionar un oficio o profesión'),
  }),
  yup.object({
    ciud_Id: yup.number().required('La ciudad es requerida').moreThan(0, 'Debe seleccionar una ciudad'),
    colo_Id: yup.number().required('La colonia es requerida').moreThan(0, 'Debe seleccionar una colonia'),
    alde_Id: yup.number().required('La aldea es requerida').moreThan(0, 'Debe seleccionar una aldea'),
    peju_PuntoReferencia: yup.string().required('El punto de referencia es requerido'),
    peju_NumeroLocalApart: yup.string().required('El número telefónico es requerido'),
  }),
  yup.object({
    peju_CiudadIdRepresentante: yup.number().required('La ciudad del representante es requerida').moreThan(0, 'Debe seleccionar una ciudad'),
    peju_ColoniaRepresentante: yup.number().required('La colonia del representante es requerida').moreThan(0, 'Debe seleccionar una colonia'),
    peju_AldeaIdRepresentante: yup.number().required('La aldea del representante es requerida').moreThan(0, 'Debe seleccionar una aldea'),
    peju_NumeroLocalRepresentante: yup.string().required('El número telefónico del representante es requerido'),
    peju_PuntoReferenciaRepresentante: yup.string().required('El punto de referencia del representante es requerido'),
  }),
  yup.object({
    peju_TelefonoEmpresa: yup.string().required('El teléfono de la empresa es requerido'),
    peju_TelefonoFijoRepresentanteLegal: yup.string().required('El teléfono fijo del representante legal es requerido'),
    peju_TelefonoRepresentanteLegal: yup.string().required('El teléfono del representante legal es requerido'),
    peju_CorreoElectronico: yup.string().email('Formato de correo inválido').required('El correo electrónico es requerido'),
    peju_CorreoElectronicoAlternativo: yup.string().email('Formato de correo inválido'),
  }),
];

const camposPorTab = [
  ['pers_Nombre', 'pers_RTN', 'escv_Id', 'ofic_Id', 'ofpr_Id'],
  ['ciud_Id', 'colo_Id', 'alde_Id', 'peju_PuntoReferencia', 'peju_NumeroLocalApart'],
  ['peju_CiudadIdRepresentante', 'peju_ColoniaRepresentante', 'peju_AldeaIdRepresentante', 'peju_NumeroLocalRepresentante', 'peju_PuntoReferenciaRepresentante'],
  ['peju_TelefonoEmpresa', 'peju_TelefonoFijoRepresentanteLegal', 'peju_TelefonoRepresentanteLegal', 'peju_CorreoElectronico', 'peju_CorreoElectronicoAlternativo'],
];

const PersonaJuridicaForm = ({ onGuardar, onCancelar }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [aldeas, setAldeas] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [oficioProfesion, setOficioProfesion] = useState([]);
  const [estadoCivil, setEstadoCivil] = useState([]);
  const [personaJuridicaId, setPersonaJuridicaId] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [mostrarInputCodigo, setMostrarInputCodigo] = useState(false);
  const [correoVerificado, setCorreoVerificado] = useState(false);
  const [codigoVerificacionAlt, setCodigoVerificacionAlt] = useState('');
  const [codigoIngresadoAlt, setCodigoIngresadoAlt] = useState('');
  const [mostrarInputCodigoAlt, setMostrarInputCodigoAlt] = useState(false);
  const [correoAlternativoVerificado, setCorreoAlternativoVerificado] = useState(false);
  const [verificarCorreoDeshabilitado, setVerificarCorreoDeshabilitado] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState('');
  const [severitySnackbar, setSeveritySnackbar] = useState('success');

  const enviarCodigoVerificacion = (correoElectronico) => {
    setVerificarCorreoDeshabilitado(true);
    const generarCodigoAleatorio = () => {
      return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    const codigo = generarCodigoAleatorio();
    setCodigoVerificacion(codigo);
    emailjs.send('service_5x68ulj', 'template_lwiowkp', {
      email: correoElectronico,
      codigo: codigo 
    }, 'mnyq6v-rJ4eMaYUOb')
    .then(() => {
      setMensajeSnackbar('Código de verificación enviado correctamente.');
      setSeveritySnackbar('success');
      setOpenSnackbar(true);
      setMostrarInputCodigo(true);
    })
    .catch(() => {
      setMensajeSnackbar('Error al enviar el código de verificación.');
      setSeveritySnackbar('error');
      setOpenSnackbar(true);
    });
  };
  const handlenumeros = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    formik.setFieldValue(name, numericValue);
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

  const enviarCodigoVerificacionAlt = (correoElectronico) => {
    const generarCodigoAleatorio = () => {
      return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    const codigo = generarCodigoAleatorio();
    setCodigoVerificacionAlt(codigo);

    emailjs.send('service_5x68ulj', 'template_lwiowkp', {
      email: correoElectronico,
      codigo: codigo
    }, 'mnyq6v-rJ4eMaYUOb')
    .then(() => {
      setMensajeSnackbar('Código de verificación enviado correctamente al correo alternativo.');
      setSeveritySnackbar('success');
      setOpenSnackbar(true);
      setMostrarInputCodigoAlt(true);
    })
    .catch(() => {
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
      pers_Nombre: '',
      pers_RTN: '',
      escv_Id: 0,
      ofic_Id: 0,
      ofpr_Id: 0,
      ciud_Id: 0,
      colo_Id: 0,
      alde_Id: 0,
      peju_PuntoReferencia: '',
      peju_NumeroLocalApart: '',
      peju_CiudadIdRepresentante: 0,
      peju_ColoniaRepresentante: 0,
      peju_AldeaIdRepresentante: 0,
      peju_NumeroLocalRepresentante: '',
      peju_PuntoReferenciaRepresentante: '',
      peju_TelefonoEmpresa: '',
      peju_TelefonoFijoRepresentanteLegal: '',
      peju_TelefonoRepresentanteLegal: '',
      peju_CorreoElectronico: '',
      peju_CorreoElectronicoAlternativo: '',
      usua_UsuarioCreacion: 0,
      peju_FechaCreacion: '',
    },
    validationSchema: validationSchemas[activeTab],
    onSubmit: async (values) => {
      try {
        if (activeTab === 0) {
          values.usua_UsuarioCreacion = 1;
          values.peju_FechaCreacion = new Date().toISOString();
          const response = await axios.post(`${apiUrl}/api/PersonaJuridica/Insertar`, values, {
            headers: { 'XApiKey': apiKey },
          });
          const returnedId = response.data;
          setPersonaJuridicaId(returnedId);
          setActiveTab((prev) => prev + 1);
        } else if (activeTab === 1) {
          const data = {
            peju_Id: personaJuridicaId,
            ciud_Id: values.ciud_Id,
            colo_Id: values.colo_Id,
            alde_Id: values.alde_Id,
            peju_PuntoReferencia: values.peju_PuntoReferencia,
            peju_NumeroLocalApart: values.peju_NumeroLocalApart,
            usua_UsuarioCreacion: 1,
            peju_FechaCreacion: new Date().toISOString(),
          };
          await axios.post(`${apiUrl}/api/PersonaJuridica/InsertarTap2`, data, {
            headers: { 'XApiKey': apiKey },
          });
          setActiveTab((prev) => prev + 1);
        } else if (activeTab === 2) {
          const data = {
            peju_Id: personaJuridicaId,
            peju_CiudadIdRepresentante: values.peju_CiudadIdRepresentante,
            peju_ColoniaRepresentante: values.peju_ColoniaRepresentante,
            peju_AldeaIdRepresentante: values.peju_AldeaIdRepresentante,
            peju_NumeroLocalRepresentante: values.peju_NumeroLocalRepresentante,
            peju_PuntoReferenciaRepresentante: values.peju_PuntoReferenciaRepresentante,
            usua_UsuarioCreacion: 1,
            peju_FechaCreacion: new Date().toISOString(),
          };
          await axios.post(`${apiUrl}/api/PersonaJuridica/InsertarTap3`, data, {
            headers: { 'XApiKey': apiKey },
          });
          setActiveTab((prev) => prev + 1);
        } else if (activeTab === 3) {
          const data = {
            peju_Id: personaJuridicaId,
            peju_TelefonoEmpresa: values.peju_TelefonoEmpresa,
            peju_TelefonoFijoRepresentanteLegal: values.peju_TelefonoFijoRepresentanteLegal,
            peju_TelefonoRepresentanteLegal: values.peju_TelefonoRepresentanteLegal,
            peju_CorreoElectronico: values.peju_CorreoElectronico,
            peju_CorreoElectronicoAlternativo: values.peju_CorreoElectronicoAlternativo,
            usua_UsuarioCreacion: 1,
            peju_FechaCreacion: new Date().toISOString(),
          };
          await axios.post(`${apiUrl}/api/PersonaJuridica/InsertarTap4`, data, {
            headers: { 'XApiKey': apiKey },
          });
          setMensajeSnackbar('Persona Jurídica insertada con éxito');
          setSeveritySnackbar('success');
          setOpenSnackbar(true);
          setTimeout(() => {
            if (onGuardar) onGuardar();
            window.location.href = 'http://localhost:3000/dashboards/modern';
          }, 1500);
        }
      } catch (error) {
        setMensajeSnackbar('Persona Jurídica insertada con éxito');
        setSeveritySnackbar('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          if (onGuardar) onGuardar();
          window.location.href = 'http://localhost:3000/dashboards/modern';
        }, 1500);
      }
    },
  });

  useEffect(() => {
    axios.get(`${apiUrl}/api/Ciudades/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => setCiudades(response.data.data || []))
      .catch(() => {});
    axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, { headers: { 'XApiKey': apiKey } })
      .then((response) => setEstadoCivil(response.data.data || []))
      .catch(() => {});
    axios.get(`${apiUrl}/api/Oficinas/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => setOficinas(response.data.data || []))
      .catch(() => {});
    axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => setOficioProfesion(response.data.data || []))
      .catch(() => {});
  }, [apiUrl, apiKey]);

  const handleCityChange = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);

    if (name === 'ciud_Id' || name === 'peju_CiudadIdRepresentante') {
      axios.get(`${apiUrl}/api/Colonias/FiltrarPorCiudad?ciud_Id=${value}`, { headers: { 'XApiKey': apiKey } })
        .then((response) => setColonias(response.data.data || []))
        .catch(() => {});
      axios.get(`${apiUrl}/api/Aldea/FiltrarPorCiudades?ciud_Id=${value}`, { headers: { 'XApiKey': apiKey } })
        .then((response) => setAldeas(response.data.data || []))
        .catch(() => {});
    }
  };

  const handleNext = () => {
    const tocados = {};
    camposPorTab[activeTab].forEach(campo => {
      tocados[campo] = true;
    });
    formik.setTouched(tocados, true);

    formik.validateForm().then(errores => {
      const hayErrores = Object.keys(errores).length > 0;
      if (hayErrores) {
        setMensajeSnackbar('Hay campos requeridos sin completar. Por favor, complete todos los campos obligatorios.');
        setSeveritySnackbar('error');
        setOpenSnackbar(true);
        return;
      }
      formik.handleSubmit();
    });
  };

  const handleSubmitFinal = (e) => {
    e.preventDefault();
    const tocados = {};
    camposPorTab[activeTab].forEach(campo => {
      tocados[campo] = true;
    });
    formik.setTouched(tocados, true);

    formik.validateForm().then(errores => {
      const hayErrores = Object.keys(errores).length > 0;
      if (hayErrores) {
        setMensajeSnackbar('Hay campos requeridos sin completar. Por favor, complete todos los campos obligatorios.');
        setSeveritySnackbar('error');
        setOpenSnackbar(true);
        return;
      }
      if (!correoVerificado) {
        setMensajeSnackbar('Debe verificar el correo electrónico antes de guardar.');
        setSeveritySnackbar('error');
        setOpenSnackbar(true);
        return;
      }
      formik.handleSubmit();
    });
  };

  const handleBack = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Nombre Persona</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pers_Nombre"
                name="pers_Nombre"
                value={formik.values.pers_Nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pers_Nombre && Boolean(formik.errors.pers_Nombre)}
                helperText={formik.touched.pers_Nombre && formik.errors.pers_Nombre}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>RTN</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pers_RTN"
                name="pers_RTN"
                value={formik.values.pers_RTN}
                onChange={handlenumeros}
                onBlur={formik.handleBlur}
                error={formik.touched.pers_RTN && Boolean(formik.errors.pers_RTN)}
                helperText={formik.touched.pers_RTN && formik.errors.pers_RTN}
                inputProps={{ inputMode: 'text', pattern: '[0-9]*' }}
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
                {estadoCivil.map((estadocivil) => (
                  <MenuItem key={estadocivil.escv_Id} value={estadocivil.escv_Id}>
                    {estadocivil.escv_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Oficina</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="ofic_Id"
                name="ofic_Id"
                value={formik.values.ofic_Id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ofic_Id && Boolean(formik.errors.ofic_Id)}
                helperText={formik.touched.ofic_Id && formik.errors.ofic_Id}
              >
                {oficinas.map((oficina) => (
                  <MenuItem key={oficina.ofic_Id} value={oficina.ofic_Id}>
                    {oficina.ofic_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Oficio o Profesion</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="ofpr_Id"
                name="ofpr_Id"
                value={formik.values.ofpr_Id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ofpr_Id && Boolean(formik.errors.ofpr_Id)}
                helperText={formik.touched.ofpr_Id && formik.errors.ofpr_Id}
              >
                {oficioProfesion.map((oficina) => (
                  <MenuItem key={oficina.ofpr_Id} value={oficina.ofpr_Id}>
                    {oficina.ofpr_Nombre}
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
              <CustomFormLabel>Ciudad</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="ciud_Id"
                name="ciud_Id"
                value={formik.values.ciud_Id}
                onChange={handleCityChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
                helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
              >
                {ciudades.map((ciudad) => (
                  <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
                    {ciudad.ciud_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Colonia</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="colo_Id"
                name="colo_Id"
                value={formik.values.colo_Id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.colo_Id && Boolean(formik.errors.colo_Id)}
                helperText={formik.touched.colo_Id && formik.errors.colo_Id}
                disabled={!formik.values.ciud_Id}
              >
                {colonias.map((colonia) => (
                  <MenuItem key={colonia.colo_Id} value={colonia.colo_Id}>
                    {colonia.colo_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Aldea</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="alde_Id"
                name="alde_Id"
                value={formik.values.alde_Id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alde_Id && Boolean(formik.errors.alde_Id)}
                helperText={formik.touched.alde_Id && formik.errors.alde_Id}
                disabled={!formik.values.ciud_Id}
              >
                {aldeas.map((aldea) => (
                  <MenuItem key={aldea.alde_Id} value={aldea.alde_Id}>
                    {aldea.alde_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Punto de Referencia</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_PuntoReferencia"
                name="peju_PuntoReferencia"
                value={formik.values.peju_PuntoReferencia}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.peju_PuntoReferencia && Boolean(formik.errors.peju_PuntoReferencia)}
                helperText={formik.touched.peju_PuntoReferencia && formik.errors.peju_PuntoReferencia}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
             <CustomFormLabel>Numero telefonico de Referencia</CustomFormLabel>
            <ReactIntTelInput
              style={{ width: '100%' }}
              containerClassName="intl-tel-input custom-intl-input"
              inputClassName="form-control"
              preferredCountries={['us', 'hn']}
              initialCountry={'hn'}
              value={formik.values.peju_NumeroLocalApart}
              onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
                if (!number || number.length > 17) {
                  formik.setFieldValue('peju_NumeroLocalApart', number.slice(0, 17));
                } else {
                  formik.setFieldValue('peju_NumeroLocalApart', number);
                }
              }}
              onBlur={() => formik.setFieldTouched('peju_NumeroLocalApart', true)}
            />
            {formik.touched.peju_NumeroLocalApart && formik.errors.peju_NumeroLocalApart && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {formik.errors.peju_NumeroLocalApart}
              </div>
            )}
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Numero telefonico del Representante</CustomFormLabel>
              <ReactIntTelInput
                style={{ width: '100%' }}
                containerClassName="intl-tel-input custom-intl-input"
                inputClassName="form-control"
                preferredCountries={['us', 'hn']}
                initialCountry={'hn'}
                value={formik.values.peju_NumeroLocalRepresentante}
                onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
                  if (!number || number.length > 17) {
                    formik.setFieldValue('peju_NumeroLocalRepresentante', number.slice(0, 17));
                  } else {
                    formik.setFieldValue('peju_NumeroLocalRepresentante', number);
                  }
                }}
                onBlur={() => formik.setFieldTouched('peju_NumeroLocalRepresentante', true)}
              />
              {formik.touched.peju_NumeroLocalRepresentante && formik.errors.peju_NumeroLocalRepresentante && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {formik.errors.peju_NumeroLocalRepresentante}
                </div>
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Ciudad del Representante</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="peju_CiudadIdRepresentante"
                name="peju_CiudadIdRepresentante"
                value={formik.values.peju_CiudadIdRepresentante}
                onChange={handleCityChange}
                onBlur={formik.handleBlur}
                error={formik.touched.peju_CiudadIdRepresentante && Boolean(formik.errors.peju_CiudadIdRepresentante)}
                helperText={formik.touched.peju_CiudadIdRepresentante && formik.errors.peju_CiudadIdRepresentante}
              >
                {ciudades.map((ciudad) => (
                  <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
                    {ciudad.ciud_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Colonia del Representante</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="peju_ColoniaRepresentante"
                name="peju_ColoniaRepresentante"
                value={formik.values.peju_ColoniaRepresentante}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.peju_ColoniaRepresentante && Boolean(formik.errors.peju_ColoniaRepresentante)}
                helperText={formik.touched.peju_ColoniaRepresentante && formik.errors.peju_ColoniaRepresentante}
                disabled={!formik.values.peju_CiudadIdRepresentante}
              >
                {colonias.map((colonia) => (
                  <MenuItem key={colonia.colo_Id} value={colonia.colo_Id}>
                    {colonia.colo_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Aldea del representante</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="peju_AldeaIdRepresentante"
                name="peju_AldeaIdRepresentante"
                value={formik.values.peju_AldeaIdRepresentante}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.peju_AldeaIdRepresentante && Boolean(formik.errors.peju_AldeaIdRepresentante)}
                helperText={formik.touched.peju_AldeaIdRepresentante && formik.errors.peju_AldeaIdRepresentante}
                disabled={!formik.values.peju_CiudadIdRepresentante}
              >
                {aldeas.map((aldea) => (
                  <MenuItem key={aldea.alde_Id} value={aldea.alde_Id}>
                    {aldea.alde_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Punto de Referencia</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_PuntoReferenciaRepresentante"
                name="peju_PuntoReferenciaRepresentante"
                value={formik.values.peju_PuntoReferenciaRepresentante}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.peju_PuntoReferenciaRepresentante && Boolean(formik.errors.peju_PuntoReferenciaRepresentante)}
                helperText={formik.touched.peju_PuntoReferenciaRepresentante && formik.errors.peju_PuntoReferenciaRepresentante}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Empresa</CustomFormLabel>
              <ReactIntTelInput
                style={{ width: '100%' }}
                containerClassName="intl-tel-input custom-intl-input"
                inputClassName="form-control"
                preferredCountries={['us', 'hn']}
                initialCountry={'hn'}
                value={formik.values.peju_TelefonoEmpresa}
                onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
                  if (!number || number.length > 17) {
                    formik.setFieldValue('peju_TelefonoEmpresa', number.slice(0, 17)); // Limit to 17 characters
                  } else {
                    formik.setFieldValue('peju_TelefonoEmpresa', number);
                  }
                }}
                onBlur={() => formik.setFieldTouched('peju_TelefonoEmpresa', true)}
              />
              {formik.touched.peju_TelefonoEmpresa && formik.errors.peju_TelefonoEmpresa && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {formik.errors.peju_TelefonoEmpresa}
                </div>
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Fijo Representante Legal</CustomFormLabel>
              <ReactIntTelInput
                style={{ width: '100%' }}
                containerClassName="intl-tel-input custom-intl-input"
                inputClassName="form-control"
                preferredCountries={['us', 'hn']}
                initialCountry={'hn'}
                value={formik.values.peju_TelefonoFijoRepresentanteLegal}
                onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
                  if (!number || number.length > 17) {
                    formik.setFieldValue('peju_TelefonoFijoRepresentanteLegal', number.slice(0, 17)); // Limit to 17 characters
                  } else {
                    formik.setFieldValue('peju_TelefonoFijoRepresentanteLegal', number);
                  }
                }}
                onBlur={() => formik.setFieldTouched('peju_TelefonoFijoRepresentanteLegal', true)}
              />
              {formik.touched.peju_TelefonoFijoRepresentanteLegal && formik.errors.peju_TelefonoFijoRepresentanteLegal && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {formik.errors.peju_TelefonoFijoRepresentanteLegal}
                </div>
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Representante Legal</CustomFormLabel>
              <ReactIntTelInput
                style={{ width: '100%' }}
                containerClassName="intl-tel-input custom-intl-input"
                inputClassName="form-control"
                preferredCountries={['us', 'hn']}
                initialCountry={'hn'}
                value={formik.values.peju_TelefonoRepresentanteLegal}
                onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
                  if (!number || number.length > 17) {
                    formik.setFieldValue('peju_TelefonoRepresentanteLegal', number.slice(0, 17));
                  } else {
                    formik.setFieldValue('peju_TelefonoRepresentanteLegal', number);
                  }
                }}
                onBlur={() => formik.setFieldTouched('peju_TelefonoRepresentanteLegal', true)}
              />
              {formik.touched.peju_TelefonoRepresentanteLegal && formik.errors.peju_TelefonoRepresentanteLegal && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {formik.errors.peju_TelefonoRepresentanteLegal}
                </div>
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Correo Electrónico</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_CorreoElectronico"
                name="peju_CorreoElectronico"
                value={formik.values.peju_CorreoElectronico}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.peju_CorreoElectronico && Boolean(formik.errors.peju_CorreoElectronico)}
                helperText={formik.touched.peju_CorreoElectronico && formik.errors.peju_CorreoElectronico}
                disabled={correoVerificado}
                sx={correoVerificado ? { bgcolor: '#f5f5f5' } : {}}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                <Button 
                  variant="contained" 
                  type="button" 
                  startIcon={<CheckCircleRounded />}
                  onClick={() => enviarCodigoVerificacion(formik.values.peju_CorreoElectronico)}
                  disabled={correoVerificado || verificarCorreoDeshabilitado}
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
              <CustomFormLabel>Correo Electrónico Alternativo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_CorreoElectronicoAlternativo"
                name="peju_CorreoElectronicoAlternativo"
                value={formik.values.peju_CorreoElectronicoAlternativo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.peju_CorreoElectronicoAlternativo && Boolean(formik.errors.peju_CorreoElectronicoAlternativo)}
                helperText={formik.touched.peju_CorreoElectronicoAlternativo && formik.errors.peju_CorreoElectronicoAlternativo}
                disabled={correoAlternativoVerificado}
                sx={correoAlternativoVerificado ? { bgcolor: '#f5f5f5' } : {}}
              />
              {formik.values.peju_CorreoElectronicoAlternativo && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    type="button" 
                    startIcon={<CheckCircleRounded />}
                    onClick={() => enviarCodigoVerificacionAlt(formik.values.peju_CorreoElectronicoAlternativo)}
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
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmitFinal}>
        <Box display="flex" alignItems="center" mb={2}>
          <Button
            variant="text"
            color="inherit"
            onClick={onCancelar}
            sx={{ minWidth: 0, p: 1 }}
          >
            <CloseIcon />
          </Button>
        </Box>
        <StyledTabs value={activeTab} centered variant="fullWidth" sx={{ mb: 3 }}>
          <StyledTab label={<TabWrapper><NumberCircle active={activeTab === 0}>1</NumberCircle><Typography>Datos Generales</Typography></TabWrapper>} />
          <StyledTab label={<TabWrapper><NumberCircle active={activeTab === 1}>2</NumberCircle><Typography>Ubicación de la Empresa</Typography></TabWrapper>} />
          <StyledTab label={<TabWrapper><NumberCircle active={activeTab === 2}>3</NumberCircle><Typography>Ubicación del Representante</Typography></TabWrapper>} />
          <StyledTab label={<TabWrapper><NumberCircle active={activeTab === 3}>4</NumberCircle><Typography>Contacto</Typography></TabWrapper>} />
        </StyledTabs>
        <Box sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ height: 6, width: `${(activeTab + 1) * 25}%`, backgroundColor: 'primary.main', borderRadius: 3, transition: 'width 0.3s ease' }} />
        </Box>
        <Box mt={3}>{renderTabContent()}</Box>
        <Grid container justifyContent="flex-end" spacing={2} mt={2}>
          {activeTab > 0 && (
            <Grid item>
              <Button variant="contained" onClick={handleBack}>Volver</Button>
            </Grid>
          )}
          {activeTab < 3 ? (
            <Grid item>
              <Button variant="contained" onClick={handleNext}>Siguiente</Button>
            </Grid>
          ) : (
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={!correoVerificado}
              >
                Guardar
              </Button>
            </Grid>
          )}
        </Grid>
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

export default PersonaJuridicaForm;