import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Fade from '@mui/material/Fade';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useFormik } from 'formik';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import DescriptionIcon from '@mui/icons-material/Description';
import * as yup from 'yup';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { 
  Snackbar, 
  Alert, 
  Tabs, 
  Tab, 
  Box, 
  Grid, 
  MenuItem, 
  Button,
  CircularProgress, 
  FormControl,
  InputLabel,
  Select,
  TextField, // O usa tu CustomTextField si prefieres
  IconButton 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import 'src/layouts/config/StylePhone.css';
import ReactIntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import InputMask from 'react-input-mask';
import emailjs from '@emailjs/browser';


const validationSchema = yup.object({
  pers_RTN: yup.string().required('El RTN es requerido'),
  pers_Nombre: yup.string().required('El nombre es requerido'),
  escv_Id: yup.number().required('El estado civil es requerido').moreThan(0, 'El estado civil es requerido'),
  pers_escvRepresentante: yup.number().required('El estado civil del representante es requerido').moreThan(0, 'Requerido'),
  ofic_Id: yup.number().required('La oficina es requerida').moreThan(0, 'Requerido'),
  ofpr_Id: yup.number().required('El oficio es requerido').moreThan(0, 'Requerido'),
  pers_OfprRepresentante: yup.number().required('El oficio del representante es requerido').moreThan(0, 'Requerido'),
  // Validaciones condicionales para el tab de localización
  pais_Id: yup.number().when('tabIndex', {
    is: 1, // Tab de localización
    then: () => yup.number().required('El país es requerido').moreThan(0, 'Requerido'),
    otherwise: () => yup.number().nullable()
  }),
  pvin_Id: yup.number().when('tabIndex', {
    is: 1,
    then: () => yup.number().required('La provincia es requerida').moreThan(0, 'Requerido'),
    otherwise: () => yup.number().nullable()
  }),
  ciud_Id: yup.number().when('tabIndex', {
    is: 1,
    then: () => yup.number().required('La ciudad es requerida').moreThan(0, 'Requerido'),
    otherwise: () => yup.number().nullable()
  }),
  alde_Id: yup.number().when('tabIndex', {
    is: 1,
    then: () => yup.number().required('La aldea es requerida').moreThan(0, 'Requerido'),
    otherwise: () => yup.number().nullable()
  }),

   coin_CiudadRepresentante: yup.number().required('La ciudad del representante es requerida').moreThan(0, 'Requerido'),
  coin_coloniaIdRepresentante: yup.number().required('La colonia del representante es requerida').moreThan(0, 'Requerido'),
  coin_NumeroLocaDepartRepresentante: yup.string().required('El número de local/departamento es requerido'),
  coin_PuntoReferenciaReprentante: yup.string().required('El punto de referencia es requerido'),
  coin_AldeaRepresentante: yup.number() // Este podría ser opcional según tu código
});

const ComercianteIndividualCreate = ({ onCancelar, onGuardadoExitoso }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [oficioProfesion, setOficioProfesion] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [ciudades, setCiudades] = useState([]);
  const [aldeas, setAldea] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [paises, setPaises] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
const [codigoIngresado, setCodigoIngresado] = useState('');
const [mostrarInputCodigo, setMostrarInputCodigo] = useState(false);
const [correoVerificado, setCorreoVerificado] = useState(false);
const [verificarCorreoDeshabilitado, setVerificarCorreoDeshabilitado] = useState(false);
const [openCancelDialog, setOpenCancelDialog] = useState(false);


const resetearFormulario = () => {
  formik.resetForm();
  formik.setFieldValue('coin_CorreoElectronico', '');

  setTabIndex(0);
  setImageInputs([{
    id: Date.now(),
    file: null,
    preview: null,
    tipoDocumento: '',
    numeroReferencia: ''
  }]);

  setCorreoVerificado(false);
  setMostrarInputCodigo(false);
  setCodigoIngresado('');
  setVerificarCorreoDeshabilitado(false);
};

  

const [snackbarType, setSnackbarType] = useState('success');


const showSuccessMessage = (message) => {
  setSnackbarMessage(message);
  setSnackbarType('success');
  setOpenSnackbar(true);
};

// Función para mostrar mensaje de error
const showErrorMessage = (message) => {
  setSnackbarMessage(message);
  setSnackbarType('error');
  setOpenSnackbar(true);
};
  
 const [imageInputs, setImageInputs] = useState([
  { 
    id: Date.now(), 
    file: null, 
    preview: null, 
    tipoDocumento: '', 
    numeroReferencia: '' 
  }
]);
  

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  // Inicialización de valores
  const initialValues = {
    // Tab 1
    pers_Id: 0,
    coin_Id: 0,
    pers_RTN: '',
    pers_Nombre: '',
    ofic_Id: 0,
    escv_Id: '',
    ofpr_Id: 0,
    pers_FormaRepresentacion: true,
    pers_escvRepresentante: 0,
    pers_OfprRepresentante: 0,
    usua_UsuarioCreacion: 0,
    pers_FechaCreacion: '',
    coin_FechaCreacion: '',
    
    // Tab 2
    ciud_Id: 0,
    alde_Id: 0,
    colo_Id: 0,
    pais_Id: 0,
    pvin_Id: 0,
    coin_NumeroLocalApart: '',
    coin_PuntoReferencia: '',
    usua_UsuarioModificacion: 0,
    coin_FechaModificacion: '',
    
    // Tab 3
    coin_CiudadRepresentante: 0,
    coin_AldeaRepresentante: 0,
    coin_coloniaIdRepresentante: 0,
    coin_NumeroLocaDepartRepresentante: '',
    coin_PuntoReferenciaReprentante: '',
    
    // Tab 4
    coin_TelefonoCelular: '',
    coin_TelefonoFijo: '',
    coin_CorreoElectronico: '',
    coin_CorreoElectronicoAlternativo: '',
    
    // Tab 5
    doco_URLImagen: '',
    doco_FechaCreacion: '',
    
    // Para validación condicional
    tabIndex: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        // Validar si el RTN ya existe
        const response = await axios.get(`${apiUrl}/api/Personas/ExisteRTN?rtn=${values.pers_RTN}`, {
          headers: { 'XApiKey': apiKey },
        });

        if (response.data.existe) {
          setSnackbarMessage('El RTN ya está registrado.');
          setOpenSnackbar(true);
          setLoading(false);
          return;
        }

        values.pers_FechaCreacion = new Date();
        values.pers_FechaModificacion = new Date();
        values.coin_FechaCreacion = new Date();
        values.coin_FechaModificacion = new Date();
        values.usua_UsuarioCreacion = 1;
        values.usua_UsuarioModificacion = 1;
        values.pers_RTN = values.pers_RTN.replace(/\?/g, '');
        values.pers_FormaRepresentacion = Boolean(values.pers_FormaRepresentacion);

        await axios.post(`${apiUrl}/api/Personas/Insertar`, values, {
          headers: { 'XApiKey': apiKey }
        });

        setLoading(false);
        if (onGuardadoExitoso) onGuardadoExitoso();

      } catch (error) {
        console.error('Error al insertar la persona:', error);
        setSnackbarMessage('Ocurrió un error al guardar. Intenta de nuevo.');
        setOpenSnackbar(true);
        setLoading(false);
      }
    }
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [estadosCivilesRes, oficinasRes, oficioProfesionRes, coloniasRes, paisesRes] = await Promise.all([
          axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/Oficinas/Listar`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/Colonias/Listar`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/Paises/Listar`, { headers: { 'XApiKey': apiKey } }),
        ]);
        
        setEstadosCiviles(estadosCivilesRes.data.data || []);
        setOficinas(oficinasRes.data.data || []);
        setOficioProfesion(oficioProfesionRes.data.data || []);
        setColonias(coloniasRes.data.data || []);
        
        
        // Ordenar países alfabéticamente
        const paisesData = paisesRes.data.data || [];
        setPaises(paisesData.sort((a, b) => a.pais_Nombre.localeCompare(b.pais_Nombre)));
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setError('Error al cargar datos iniciales. Por favor, recarga la página.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Actualizar el tabIndex en el formik cuando cambia
  useEffect(() => {
    formik.setFieldValue('tabIndex', tabIndex);
  }, [tabIndex]);


const eliminarSilenciosamente = async () => {
  const { coin_Id, pers_Id } = formik.values;

  if (!coin_Id || !pers_Id) return;

  try {
    await axios.post(
      `${apiUrl}/api/ComercianteIndividual/Eliminar?coin_Id=${coin_Id}&pers_Id=${pers_Id}`,
      null,
      { headers: { 'XApiKey': apiKey } }
    );

    // ✅ Solo quitamos los IDs para evitar errores al volver a guardar
    formik.setFieldValue('coin_Id', 0);
    formik.setFieldValue('pers_Id', 0);
  } catch (error) {
    console.error('Error silencioso al eliminar comerciante:', error);
    // No mostramos mensaje
  }
};




  const handleDocumentFieldChange = (index, field, value) => {
  const updatedInputs = [...imageInputs];
  updatedInputs[index][field] = value;
  setImageInputs(updatedInputs);
};


const enviarCodigoVerificacion = () => {
  const correo = formik.values.coin_CorreoElectronico;
  if (!correo) {
    showErrorMessage('Debe ingresar un correo electrónico antes de verificarlo.');
    return;
  }

  setVerificarCorreoDeshabilitado(true);

  const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
  setCodigoVerificacion(codigo);

  emailjs.send(
    'service_5x68ulj',
    'template_lwiowkp',
    { email: correo, codigo },
    'mnyq6v-rJ4eMaYUOb'
  ).then(() => {
    showSuccessMessage('Código de verificación enviado correctamente.');
    setMostrarInputCodigo(true);
  }).catch(() => {
    showErrorMessage('Error al enviar el código de verificación.');
    setVerificarCorreoDeshabilitado(false);
  });
};

const verificarCodigo = () => {
  if (codigoIngresado === codigoVerificacion) {
    setCorreoVerificado(true);
    showSuccessMessage('Correo electrónico verificado correctamente.');
  } else {
    showErrorMessage('El código ingresado no es válido.');
  }
};



// Guardar en 1er tap
const handleSaveTap1 = async () => {
  try {
    // Validar solamente los campos del primer tab
    const tabErrors = {};
    ['pers_RTN', 'pers_Nombre', 'escv_Id', 'ofic_Id', 'ofpr_Id', 'pers_escvRepresentante', 'pers_OfprRepresentante'].forEach(field => {
      try {
        // Validar cada campo individualmente
        validationSchema.fields[field].validateSync(formik.values[field]);
      } catch (err) {
        tabErrors[field] = err.message;
      }
    });
    
    // Si hay errores, mostrarlos y detener el proceso
    if (Object.keys(tabErrors).length > 0) {
      // Establecer los errores en Formik
      formik.setErrors({...formik.errors, ...tabErrors});
      // Tocar los campos para que se muestren los errores
      Object.keys(tabErrors).forEach(field => formik.setFieldTouched(field, true));
      
      showErrorMessage('Por favor completa todos los campos requeridos');
      return false;
    }

    // Preparar los datos a enviar
    const tap1Data = {
      pers_RTN: formik.values.pers_RTN.replace(/\?/g, ''),
      pers_Nombre: formik.values.pers_Nombre,
      ofic_Id: formik.values.ofic_Id,
      escv_Id: formik.values.escv_Id,
      ofpr_Id: formik.values.ofpr_Id,
      pers_FormaRepresentacion: true,
      pers_escvRepresentante: formik.values.pers_escvRepresentante,
      pers_OfprRepresentante: formik.values.pers_OfprRepresentante,
      usua_UsuarioCreacion: 1,
      coin_FechaCreacion: new Date().toISOString()
    };

    // Enviar datos al API
    const response = await axios.post(`${apiUrl}/api/ComercianteIndividual/Insertar`, tap1Data, {
      headers: { 'XApiKey': apiKey }
    });

    console.log('Respuesta del servidor (Tab 1):', response.data);

    // Verificar si la respuesta tiene la estructura esperada
    if (response.data && response.data.success === true) {
      // Extraer ID del comerciante individual del messageStatus (formato: "29.162")
     let coinId = null;
if (response.data.data && response.data.data.messageStatus) {
  const idParts = response.data.data.messageStatus.split('.');
  if (idParts.length > 1) {
    coinId = parseInt(idParts[0]);
    const persId = parseInt(idParts[1]);
    formik.setFieldValue('coin_Id', coinId);
    formik.setFieldValue('pers_Id', persId);
  }
}


      if (coinId) {
        // Guardar el ID para usarlo en los siguientes tabs
        formik.setFieldValue('coin_Id', coinId);
        showSuccessMessage('Datos personales guardados correctamente');
        return true;
      } else {
        showErrorMessage('No se pudo obtener el ID del comerciante. Por favor, intente nuevamente.');
        return false;
      }
    } else {
      showErrorMessage(response.data?.message || 'Error al guardar los datos: respuesta inválida');
      return false;
    }
  } catch (error) {
    console.error('Error al guardar datos del tab 1:', error);
    
    let errorMessage = 'Error al guardar los datos';
    
    if (error.response) {
      // Error del servidor con respuesta
      errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Error de red (no se recibió respuesta)
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }
    
    showErrorMessage(errorMessage);
    return false;
  }
};

//Guardar en en 2do tap
const handleSaveTap2 = async () => {
  try {
    const errors = await formik.validateForm();

    const tab2Fields = [
      'pais_Id',
      'pvin_Id',
      'ciud_Id',
      'alde_Id',
      'colo_Id',
      'coin_NumeroLocalApart',
      'coin_PuntoReferencia'
    ];

    const tabErrors = Object.entries(errors).filter(([key]) =>
      tab2Fields.includes(key)
    );

    if (tabErrors.length > 0) {
      const newErrors = Object.fromEntries(tabErrors);
      formik.setErrors({ ...formik.errors, ...newErrors });
      tab2Fields.forEach(field => formik.setFieldTouched(field, true));
      showErrorMessage('Por favor completa todos los campos requeridos de localización.');
      return false;
    }

    // Verificar que existe coin_Id (que se guardó en el tab 1)
    if (!formik.values.coin_Id) {
      showErrorMessage('Error: No se encontró el ID del comerciante. Por favor guarde los datos del primer tab.');
      return false;
    }

    // Preparar los datos a enviar
    const tap2Data = {
      coin_Id: formik.values.coin_Id,
      ciud_Id: formik.values.ciud_Id,
      alde_Id: formik.values.alde_Id || 0,
      colo_Id: formik.values.colo_Id,
      coin_NumeroLocalApart: formik.values.coin_NumeroLocalApart,
      coin_PuntoReferencia: formik.values.coin_PuntoReferencia,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: new Date().toISOString()
    };

    console.log('Datos a enviar (Tab 2):', tap2Data);

    const response = await axios.post(
      `${apiUrl}/api/ComercianteIndividual/InsertarTap2`,
      tap2Data,
      { headers: { 'XApiKey': apiKey } }
    );

    console.log('Respuesta del servidor (Tab 2):', response.data);

    if (response.data && response.data.success === true) {
      showSuccessMessage('Dirección guardada correctamente');
      return true;
    } else {
      if (response.data && response.data.message) {
        showErrorMessage(response.data.message);
      } else {
        showErrorMessage('Error al guardar los datos de dirección');
      }
      return false;
    }
  } catch (error) {
    console.error('Error al guardar datos del tab 2:', error);

    let errorMessage = 'Error al guardar los datos de dirección';

    if (error.response) {
      console.error('Respuesta de error del servidor:', error.response.data);
      errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }

    showErrorMessage(errorMessage);
    return false;
  }
};


// Guardar en 3er tap
const handleSaveTap3 = async () => {
  try {
    console.log('Valores actuales del formulario:', formik.values);
    
    // Validar manualmente sin usar el esquema de validación
    const tabErrors = {};
    const camposRequeridos = ['coin_CiudadRepresentante', 'coin_coloniaIdRepresentante', 'coin_NumeroLocaDepartRepresentante', 'coin_PuntoReferenciaReprentante'];
    
    camposRequeridos.forEach(field => {
      const value = formik.values[field];
      if (!value || (typeof value === 'number' && value <= 0) || value === '') {
        tabErrors[field] = 'Este campo es requerido';
      }
    });
    
    console.log('Errores encontrados:', tabErrors);
    
    // Si hay errores, mostrarlos y detener el proceso
    if (Object.keys(tabErrors).length > 0) {
      // Establecer los errores en Formik
      formik.setErrors({...formik.errors, ...tabErrors});
      // Tocar los campos para que se muestren los errores
      Object.keys(tabErrors).forEach(field => formik.setFieldTouched(field, true));
      
      showErrorMessage('Por favor completa todos los campos requeridos');
      return false;
    }

    // Preparar los datos a enviar según el procedimiento almacenado
    const tap3Data = {
      coin_Id: formik.values.coin_Id,
      coin_CiudadRepresentante: parseInt(formik.values.coin_CiudadRepresentante),
      coin_AldeaRepresentante: parseInt(formik.values.coin_AldeaRepresentante) || 0,
      coin_coloniaIdRepresentante: parseInt(formik.values.coin_coloniaIdRepresentante),
      coin_NumeroLocaDepartRepresentante: formik.values.coin_NumeroLocaDepartRepresentante,
      coin_PuntoReferenciaReprentante: formik.values.coin_PuntoReferenciaReprentante,
      usua_UsuarioModificacion: 1, // O el ID del usuario actual
      coin_FechaModificacion: new Date().toISOString()
    };

    // Enviar datos al API
    const response = await axios.post(`${apiUrl}/api/ComercianteIndividual/InsertarTap3`, tap3Data, {
      headers: { 'XApiKey': apiKey }
    });

    console.log('Respuesta del servidor (Tab 3):', response.data);

    // Verificar si la respuesta tiene la estructura esperada
    if (response.data && response.data.success === true) {
      showSuccessMessage('Datos de la dirección del representante guardados correctamente');
      return true;
    } else if (response.data === 1) {
      // Si el SP devuelve directamente 1 como éxito
      showSuccessMessage('Datos de la dirección del representante guardados correctamente');
      return true;
    } else {
      showErrorMessage(response.data?.message || 'Error al guardar los datos: respuesta inválida');
      return false;
    }
  } catch (error) {
    console.error('Error al guardar datos del tab 3:', error);
    
    let errorMessage = 'Error al guardar los datos';
    
    if (error.response) {
      // Error del servidor con respuesta
      errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Error de red (no se recibió respuesta)
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }
    
    showErrorMessage(errorMessage);
    return false;
  }
};

// Guardar en 4to tap
const handleSaveTap4 = async () => {
  try {
    console.log('Valores actuales del formulario (Tap 4):', formik.values);
    
    // Validar manualmente sin usar el esquema de validación
    const tabErrors = {};
    const camposRequeridos = ['coin_TelefonoCelular', 'coin_TelefonoFijo', 'coin_CorreoElectronico'];
    
    camposRequeridos.forEach(field => {
      const value = formik.values[field];
      if (!value || value === '') {
        tabErrors[field] = 'Este campo es requerido';
      }
    });
    
    // Validación específica para correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formik.values.coin_CorreoElectronico && !emailRegex.test(formik.values.coin_CorreoElectronico)) {
      tabErrors.coin_CorreoElectronico = 'Formato de correo electrónico inválido';
    }
    if (formik.values.coin_CorreoElectronicoAlternativo && !emailRegex.test(formik.values.coin_CorreoElectronicoAlternativo)) {
      tabErrors.coin_CorreoElectronicoAlternativo = 'Formato de correo electrónico alternativo inválido';
    }
    
    console.log('Errores encontrados (Tap 4):', tabErrors);
    
    // Si hay errores, mostrarlos y detener el proceso
    if (Object.keys(tabErrors).length > 0) {
      // Establecer los errores en Formik
      formik.setErrors({...formik.errors, ...tabErrors});
      // Tocar los campos para que se muestren los errores
      Object.keys(tabErrors).forEach(field => formik.setFieldTouched(field, true));
      
      showErrorMessage('Por favor completa todos los campos requeridos correctamente');
      return false;
    }

    // Preparar los datos a enviar según el procedimiento almacenado
    const tap4Data = {
      coin_Id: formik.values.coin_Id,
      coin_TelefonoCelular: formik.values.coin_TelefonoCelular,
      coin_TelefonoFijo: formik.values.coin_TelefonoFijo,
      coin_CorreoElectronico: formik.values.coin_CorreoElectronico,
      coin_CorreoElectronicoAlternativo: formik.values.coin_CorreoElectronicoAlternativo || '',
      usua_UsuarioModificacion: 1, // O el ID del usuario actual que tengan almacenado
      coin_FechaModificacion: new Date().toISOString()
    };

    // Enviar datos al API
    const response = await axios.post(`${apiUrl}/api/ComercianteIndividual/InsertarTap4`, tap4Data, {
      headers: { 'XApiKey': apiKey }
    });

    console.log('Respuesta del servidor (Tab 4):', response.data);

    // Verificar si la respuesta tiene la estructura esperada
    if (response.data && response.data.success === true) {
      showSuccessMessage('Datos de contacto guardados correctamente');
      return true;
    } else if (response.data === 1) {
      // Si el SP devuelve directamente 1 como éxito
      showSuccessMessage('Datos de contacto guardados correctamente');
      return true;
    } else {
      showErrorMessage(response.data?.message || 'Error al guardar los datos: respuesta inválida');
      return false;
    }
  } catch (error) {
    console.error('Error al guardar datos del tab 4:', error);
    
    let errorMessage = 'Error al guardar los datos';
    
    if (error.response) {
      // Error del servidor con respuesta
      errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Error de red (no se recibió respuesta)
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }
    
    showErrorMessage(errorMessage);
    return false;
  }
};

const eliminarComerciante = async () => {
  const { coin_Id, pers_Id } = formik.values;

  if (!coin_Id || !pers_Id) {
    showErrorMessage('No se encontró el ID del comerciante o de la persona.');
    return;
  }

  try {
    const response = await axios.post(
      `${apiUrl}/api/ComercianteIndividual/Eliminar?coin_Id=${coin_Id}&pers_Id=${pers_Id}`,
      null,
      { headers: { 'XApiKey': apiKey } }
    );

    console.log('Respuesta del servidor al eliminar:', response.data);

    const success = response.data?.success === true && response.data?.data?.messageStatus === "1";
if (success) {
  showSuccessMessage('Registro Cancelado.');
  resetearFormulario();
}
 else {
      const mensaje = response.data?.message || 'Respuesta inesperada del servidor.';
      showErrorMessage('Error al eliminar: ' + mensaje);
    }
  } catch (error) {
    console.error('Error en la eliminación:', error);
    showErrorMessage('Error inesperado al eliminar comerciante.');
  }
};


  const handleImageChange = (index, event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedInputs = [...imageInputs];
      updatedInputs[index].file = file;
      updatedInputs[index].preview = reader.result;
      setImageInputs(updatedInputs);
    };
    reader.readAsDataURL(file);
  }
};

 const addImageInput = () => {
  setImageInputs(prev => [
    ...prev,
    { 
      id: Date.now(), 
      file: null, 
      preview: null, 
      tipoDocumento: '', 
      numeroReferencia: '' 
    }
  ]);
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }
    
    const data = await response.json();
    return data.imageUrl; // Asume que el servidor devuelve la URL de la imagen
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Función para guardar todos los documentos
const handleSaveDocuments = async () => {
  try {
    if (!formik.values.coin_Id) {
      showErrorMessage('No se ha encontrado el ID del comerciante. Por favor, complete los pasos anteriores.');
      return false;
    }

    const validDocuments = imageInputs.filter(input =>
      input.file && input.tipoDocumento && input.numeroReferencia
    );

    if (validDocuments.length === 0) {
      showErrorMessage('Debe agregar al menos un documento con todos los campos completos');
      return false;
    }

    setIsLoading(true);

    const documentPromises = validDocuments.map(async (input) => {
      try {
        const formData = new FormData();
        formData.append('file', input.file);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        const imageUrl = cloudinaryResponse.data.secure_url;

        return {
          doco_TipoDocumento: input.tipoDocumento,
          doco_Numero_O_Referencia: input.numeroReferencia,
          doco_URLImagen: imageUrl
        };
      } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        throw new Error('Error al subir imagen a Cloudinary');
      }
    });

    const documentosData = await Promise.all(documentPromises);

    const jsonData = {
      documentos: documentosData
    };

    const response = await axios.post(
      `${apiUrl}/api/DocumentosContratos/InsertarDocuComerciante`,
      {
        coin_Id: formik.values.coin_Id,
        doco_URLImagen: JSON.stringify(jsonData),
        usua_UsuarioCreacion: 1,
        doco_FechaCreacion: new Date().toISOString()
      },
      {
        headers: { 'XApiKey': apiKey }
      }
    );

    // Manejo robusto de la respuesta
   if (response.data === 1) {
  showSuccessMessage('¡Comerciante registrado con éxito! Puede agregar otro o salir.');
} else if (typeof response.data === 'object' && response.data?.MessageStatus) {
  if (response.data.MessageStatus === '1') {
    showSuccessMessage('¡Comerciante registrado con éxito! Puede agregar otro o salir.');
  } else {
    showSuccessMessage('Documentos guardados (algunos con advertencias del servidor)');
  }
} else if (typeof response.data === 'object' && response.data?.Resultado) {
  showSuccessMessage('Documentos guardados (con advertencias SQL)');
}

    // ✅ Reiniciar formulario y volver al tab 0
    formik.resetForm();
    setTabIndex(0);
    setImageInputs([
      {
        id: Date.now(),
        file: null,
        preview: null,
        tipoDocumento: '',
        numeroReferencia: ''
      }
    ]);

   setOpenDialog(true);
return true;

  } catch (error) {
    console.error('Error en handleSaveDocuments:', error);
    showErrorMessage(`Error al guardar documentos: ${error.message || 'Error desconocido'}`);
    return false;
  } finally {
    setIsLoading(false);
  }
};



// Actualiza tu componente para agregar el estado de isLoading si no existe:
const [isLoading, setIsLoading] = useState(false);

  const removeImageInput = (indexToRemove) => {
    setImageInputs((prev) => {
      const newInputs = prev.filter((_, index) => index !== indexToRemove);

      // Si eliminamos la última imagen, y no queda ninguna, agregamos un nuevo input vacío
      if (newInputs.length === 0) {
        return [{ id: Date.now(), file: null, preview: null }];
      }

      return newInputs;
    });
  };

  const handleInputChange = (index, field, value) => {
  const updatedInputs = [...imageInputs];
  updatedInputs[index][field] = value;
  setImageInputs(updatedInputs);
};
  
  // Filtrar Provincias por país
  const handlePaisChange = async (e) => {
    try {
      setLoading(true);
      const selectedPaisId = e.target.value;
      
      // Actualizar el valor en formik
      formik.setFieldValue('pais_Id', selectedPaisId);
      
      // Resetear valores dependientes
      formik.setFieldValue('pvin_Id', '');
      formik.setFieldValue('ciud_Id', '');
      formik.setFieldValue('alde_Id', '');
      
      // Limpiar los arrays dependientes
      setProvincias([]);
      setCiudades([]);
      setAldea([]);

      if (!selectedPaisId) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${apiUrl}/api/Provincias/ProvinciasFiltradaPorPais`, {
        headers: { 'XApiKey': apiKey },
        params: { pais_Id: selectedPaisId }
      });

      const provinciasFiltradas = response.data?.data ?? [];

      if (!Array.isArray(provinciasFiltradas)) {
        console.error("La respuesta no es un array:", provinciasFiltradas);
        setProvincias([]);
      } else {
        setProvincias(provinciasFiltradas);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar las provincias:', error);
      setError('Error al cargar las provincias. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  // Filtrar Ciudades por Provincia
  const handleProvinciaChange = async (e) => {
    try {
      setLoading(true);
      const selectedProvinciaId = e.target.value;

      // Actualizar el valor en formik
      formik.setFieldValue('pvin_Id', selectedProvinciaId);
      
      // Resetear valores dependientes
      formik.setFieldValue('ciud_Id', '');
      formik.setFieldValue('alde_Id', '');
      
      // Limpiar los arrays dependientes
      setCiudades([]);
      setAldea([]);

      if (!selectedProvinciaId) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${apiUrl}/api/Ciudades/CiudadesFiltradaPorProvincias`, {
        headers: { 'XApiKey': apiKey },
        params: { pvin_Id: selectedProvinciaId }
      });

      const ciudadesFiltradas = response.data?.data ?? [];

      if (!Array.isArray(ciudadesFiltradas)) {
        console.error("La respuesta no es un array:", ciudadesFiltradas);
        setCiudades([]);
      } else {
        setCiudades(ciudadesFiltradas);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar las ciudades:', error);
      setError('Error al cargar las ciudades. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  // Filtrar Aldeas por Ciudad
  const handleCiudadChange = async (e) => {
    try {
      setLoading(true);
      const selectedCiudadId = e.target.value;

      // Actualizar el valor en formik
      formik.setFieldValue('ciud_Id', selectedCiudadId);
      
      // Resetear valores dependientes
      formik.setFieldValue('alde_Id', '');
      
      // Limpiar el array de aldeas
      setAldea([]);

      if (!selectedCiudadId) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${apiUrl}/api/Aldea/FiltrarPorCiudades`, {
        headers: { 'XApiKey': apiKey },
        params: { ciud_Id: selectedCiudadId }
      });

      const aldeasFiltradas = response.data?.data ?? [];

      if (!Array.isArray(aldeasFiltradas)) {
        console.error("La respuesta no es un array:", aldeasFiltradas);
        setAldea([]);
      } else {
        setAldea(aldeasFiltradas);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar aldeas:', error);
      setError('Error al cargar las aldeas. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  
  
  

  const handleNombreChange = (e) => {
    const upper = e.target.value.toUpperCase();
    formik.setFieldValue('pers_Nombre', upper);
  };

  

  return (
    <div>
     <Tabs
  value={tabIndex}
  onChange={(e, newValue) => {
    // Solo permitir clic en el mismo tab (puedes mejorar esto según el progreso del formulario)
    if (newValue === tabIndex) return;
  }}
  variant="scrollable"
  scrollButtons="auto"
  sx={{
    mb: 2,
    borderRadius: 2,
    backgroundColor: '#f9f9f9',
    padding: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    '& .MuiTab-root': {
      fontWeight: 600,
      textTransform: 'none',
      borderRadius: 2,
      mx: 1,
      px: 2,
      py: 1,
    },
  '& .Mui-selected': {
  backgroundColor: 'white',
  color: '#1976d2',
  fontWeight: 'bold',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #1976d2',
},



    '& .MuiTabs-indicator': {
      height: 4,
      borderRadius: 2,
      backgroundColor: '#1976d2',
    },
  }}
>
  <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Datos Personales" />
  <Tab icon={<LocationOnIcon />} iconPosition="start" label="Localización" />
  <Tab icon={<PersonIcon />} iconPosition="start" label="Representante" />
  <Tab icon={<ContactPhoneIcon />} iconPosition="start" label="Contacto" />
  <Tab 
    icon={<DescriptionIcon />} 
    iconPosition="start" 
    label="Documentos" 
  />
</Tabs>



      <form onSubmit={formik.handleSubmit}>
        <Box mt={2}>
          {/* Datos Personales */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              
              <Grid item lg={6}>
                <CustomFormLabel>RTN</CustomFormLabel>
                <InputMask
                  mask="9999-9999-999999"
                  value={formik.values.pers_RTN}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {(inputProps) => (
                    <CustomTextField
                      {...inputProps}
                      fullWidth
                      id="pers_RTN"
                      name="pers_RTN"
                      error={formik.touched.pers_RTN && Boolean(formik.errors.pers_RTN)}
                      helperText={formik.touched.pers_RTN && formik.errors.pers_RTN}
                    />
                  )}
                </InputMask>
              </Grid>

              <Grid item lg={6}>
                <CustomFormLabel>Nombre</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pers_Nombre"
                  name="pers_Nombre"
                  value={formik.values.pers_Nombre}
                  onChange={handleNombreChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pers_Nombre && Boolean(formik.errors.pers_Nombre)}
                  helperText={formik.touched.pers_Nombre && formik.errors.pers_Nombre}
                />
              </Grid>

              <Grid item lg={6}>
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

              <Grid item lg={6}>
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


        {/* Select de Oficio o Profesión */}
        <Grid item lg={6}>
      <CustomFormLabel>Oficio o Profesión</CustomFormLabel>
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
        {oficioProfesion.map((oficio) => (
          <MenuItem key={oficio.ofpr_Id} value={oficio.ofpr_Id}>
            {oficio.ofpr_Nombre}
          </MenuItem>
        ))}
      </CustomTextField>
    </Grid>

    <Grid item lg={6}>
                <CustomFormLabel>Estado Civil Representante</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="pers_escvRepresentante"
                  name="pers_escvRepresentante"
                  value={formik.values.pers_escvRepresentante}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pers_escvRepresentante && Boolean(formik.errors.pers_escvRepresentante)}
                  helperText={formik.touched.pers_escvRepresentante && formik.errors.pers_escvRepresentante}
                >
                  {estadosCiviles.map((estado) => (
                    <MenuItem key={estado.escv_Id} value={estado.escv_Id}>
                      {estado.escv_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid item lg={6}>
                <CustomFormLabel>Oficio o Profesión Representante</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="pers_OfprRepresentante"
                  name="pers_OfprRepresentante"
                  value={formik.values.pers_OfprRepresentante}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pers_OfprRepresentante && Boolean(formik.errors.pers_OfprRepresentante)}
                  helperText={formik.touched.pers_OfprRepresentante && formik.errors.pers_OfprRepresentante}
                >
                  {oficioProfesion.map((oficio) => (
                    <MenuItem key={oficio.ofpr_Id} value={oficio.ofpr_Id}>
                      {oficio.ofpr_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
         </Grid>
          )}
{/* Fin Datos Personales */}




{/* Inicio Localización */}
{tabIndex === 1 && (
  <Grid container spacing={3}>

<Grid item lg={6}>
          <CustomFormLabel>País</CustomFormLabel>
          <CustomTextField
            select
            fullWidth
            id="pais_Id"
            name="pais_Id"
            value={formik.values.pais_Id || ''}
            onChange={handlePaisChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pais_Id && Boolean(formik.errors.pais_Id)}
            helperText={formik.touched.pais_Id && formik.errors.pais_Id}
            disabled={loading}
          >
            <MenuItem value="">Seleccione un país</MenuItem>
            {Array.isArray(paises) && paises.map((pais) => (
              <MenuItem key={pais.pais_Id} value={pais.pais_Id}>
                {pais.pais_Nombre}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid item lg={6}>
          <CustomFormLabel>Provincia</CustomFormLabel>
          <CustomTextField
            select
            fullWidth
            id="pvin_Id"
            name="pvin_Id"
            value={formik.values.pvin_Id || ''}
            onChange={handleProvinciaChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pvin_Id && Boolean(formik.errors.pvin_Id)}
            helperText={formik.touched.pvin_Id && formik.errors.pvin_Id}
            disabled={!formik.values.pais_Id || loading}
          >
            <MenuItem value="">Seleccione una provincia</MenuItem>
            {formik.values.pais_Id && provincias.length === 0 && !loading && (
              <MenuItem disabled value="">
                No hay provincias disponibles para este país
              </MenuItem>
            )}
            {Array.isArray(provincias) && provincias.map((provincia) => (
              <MenuItem key={provincia.pvin_Id} value={provincia.pvin_Id}>
                {provincia.pvin_Nombre}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>


        <Grid item lg={6}>
          <CustomFormLabel>Ciudad</CustomFormLabel>
          <CustomTextField
            select
            fullWidth
            id="ciud_Id"
            name="ciud_Id"
            value={formik.values.ciud_Id || ''}
            onChange={handleCiudadChange}
            onBlur={formik.handleBlur}
            error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
            helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
            disabled={!formik.values.pvin_Id || loading}
          >
            <MenuItem value="">Seleccione una ciudad</MenuItem>
            {formik.values.pvin_Id && ciudades.length === 0 && !loading && (
              <MenuItem disabled value="">
                No hay ciudades disponibles para esta provincia
              </MenuItem>
            )}
            {Array.isArray(ciudades) && ciudades
              .filter(ciudad => ciudad && ciudad.ciud_Id && ciudad.ciud_Nombre)
              .map((ciudad) => (
                <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
                  {ciudad.ciud_Nombre}
                </MenuItem>
              ))}
          </CustomTextField>
        </Grid>

        <Grid item lg={6}>
          <CustomFormLabel>Aldea</CustomFormLabel>
          <CustomTextField
            select
            fullWidth
            id="alde_Id"
            name="alde_Id"
            value={formik.values.alde_Id || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.alde_Id && Boolean(formik.errors.alde_Id)}
            helperText={formik.touched.alde_Id && formik.errors.alde_Id}
            disabled={!formik.values.ciud_Id || loading}
          >
            <MenuItem value="">Seleccione una aldea</MenuItem>
            {formik.values.ciud_Id && aldeas.length === 0 && !loading && (
              <MenuItem disabled value="">
                No hay aldeas disponibles para esta ciudad
              </MenuItem>
            )}
            {Array.isArray(aldeas) && aldeas.map((aldea) => (
              <MenuItem key={aldea.alde_Id} value={aldea.alde_Id}>
                {aldea.alde_Nombre}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>


        <Grid item lg={6}>
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
  >
    {colonias.map((colonia) => (
          <MenuItem key={colonia.colo_Id} value={colonia.colo_Id}>
            {colonia.colo_Nombre}
          </MenuItem>
        ))}
  </CustomTextField>
          </Grid>

         
<Grid item lg={6}>
  <CustomFormLabel>Numero de Local o Apartamento Representante</CustomFormLabel>
  <CustomTextField
    fullWidth
    id="coin_NumeroLocalApart"
    name="coin_NumeroLocalApart"
    value={formik.values.coin_NumeroLocalApart}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.coin_NumeroLocalApart && Boolean(formik.errors.coin_NumeroLocalApart)}
    helperText={formik.touched.coin_NumeroLocalApart && formik.errors.coin_NumeroLocalApart}
  />
</Grid>

              <Grid item lg={6}>
  <CustomFormLabel>Punto de Referencia</CustomFormLabel>
  <CustomTextField
    fullWidth
    id="coin_PuntoReferencia"
    name="coin_PuntoReferencia"
    value={formik.values.coin_PuntoReferencia}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.coin_PuntoReferencia && Boolean(formik.errors.coin_PuntoReferencia)}
    helperText={formik.touched.coin_PuntoReferencia && formik.errors.coin_PuntoReferencia}
  />
</Grid>

  </Grid>
)}
{/* Fin Localización */}


          {/* Inicio Representante */}
          {tabIndex === 2 && (
            <Grid container spacing={3}>
            <Grid item lg={6}>
      <CustomFormLabel>Ciudad Representante</CustomFormLabel>
      <CustomTextField
        select
        fullWidth
        id="coin_CiudadRepresentante" // Esto es lo que se va a enviar
        name="coin_CiudadRepresentante"
        value={formik.values.coin_CiudadRepresentante}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.coin_CiudadRepresentante && Boolean(formik.errors.coin_CiudadRepresentante)}
        helperText={formik.touched.coin_CiudadRepresentante && formik.errors.coin_CiudadRepresentante}
      >
        {ciudades.map((ciudad) => (
          <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
            {ciudad.ciud_Nombre} {/* Mostrar el nombre, pero enviar el ID */}
          </MenuItem>
        ))}
      </CustomTextField>
    </Grid>

    <Grid item lg={6}>
  <CustomFormLabel>Aldea Representante</CustomFormLabel>
  <CustomTextField
select
fullWidth
id="coin_AldeaRepresentante"
name="coin_AldeaRepresentante"
value={formik.values.coin_AldeaRepresentante}
onChange={formik.handleChange}
onBlur={formik.handleBlur}
error={formik.touched.coin_AldeaRepresentante && Boolean(formik.errors.coin_AldeaRepresentante)}
helperText={formik.touched.coin_AldeaRepresentante && formik.errors.coin_AldeaRepresentante}
  >
 {aldeas.map((aldea) => (
          <MenuItem key={aldea.alde_Id} value={aldea.alde_Id}>
            {aldea.alde_Nombre}
          </MenuItem>
        ))}

  </CustomTextField>
</Grid>

<Grid item lg={6}>
        <CustomFormLabel>Colonia Representante</CustomFormLabel>
  <CustomTextField
select
fullWidth
id="coin_coloniaIdRepresentante"
name="coin_coloniaIdRepresentante"
value={formik.values.coin_coloniaIdRepresentante}
onChange={formik.handleChange}
onBlur={formik.handleBlur}
error={formik.touched.coin_coloniaIdRepresentante && Boolean(formik.errors.coin_coloniaIdRepresentante)}
helperText={formik.touched.coin_coloniaIdRepresentante && formik.errors.coin_coloniaIdRepresentante}
  >
    {colonias.map((colonia) => (
          <MenuItem key={colonia.colo_Id} value={colonia.colo_Id}>
            {colonia.colo_Nombre}
          </MenuItem>
        ))}
  </CustomTextField>
          </Grid>

          
<Grid item lg={6}>
  <CustomFormLabel>Numero de Local o Apartamento Representante</CustomFormLabel>
  <CustomTextField
    fullWidth
    id="coin_NumeroLocaDepartRepresentante"
    name="coin_NumeroLocaDepartRepresentante"
    value={formik.values.coin_NumeroLocaDepartRepresentante}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.coin_NumeroLocaDepartRepresentante && Boolean(formik.errors.coin_NumeroLocaDepartRepresentante)}
    helperText={formik.touched.coin_NumeroLocaDepartRepresentante && formik.errors.coin_NumeroLocaDepartRepresentante}
  />
</Grid>

             <Grid item lg={6}>
  <Box display="flex" alignItems="center">
    <CustomFormLabel>Punto de Referencia Representante</CustomFormLabel>
    <Box component="span" color="red" ml={0.5}>
      *
    </Box>
  </Box>
  <CustomTextField
    fullWidth
    id="coin_PuntoReferenciaReprentante"
    name="coin_PuntoReferenciaReprentante"
    value={formik.values.coin_PuntoReferenciaReprentante}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.coin_PuntoReferenciaReprentante && Boolean(formik.errors.coin_PuntoReferenciaReprentante)}
    helperText={formik.touched.coin_PuntoReferenciaReprentante && formik.errors.coin_PuntoReferenciaReprentante}
  />
</Grid>


            </Grid>
          )}


{/* Contacto */}
          {tabIndex === 3 && (
           <Grid container spacing={3}>
       <Grid item lg={6}>
  <Box display="flex" alignItems="center">
    <CustomFormLabel>Teléfono Celular</CustomFormLabel>
    <Box component="span" color="red" ml={0.5}>
      *
    </Box>
  </Box>

  <ReactIntlTelInput
    style={{width: '100%'}}
    containerClassName="intl-tel-input custom-intl-input"
    inputClassName="form-control"
    preferredCountries={['us', 'hn']}
    initialCountry={'hn'}
    value={formik.values.coin_TelefonoCelular}
    onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
      if (!number) {
        formik.setFieldValue('coin_TelefonoCelular', '');
      } else {
        formik.setFieldValue('coin_TelefonoCelular', number);
      }
    }}
    onBlur={() => formik.setFieldTouched('coin_TelefonoCelular', true)}
    error={
      formik.touched.coin_TelefonoCelular &&
      Boolean(formik.errors.coin_TelefonoCelular)
    }
    helperText={
      formik.touched.coin_TelefonoCelular &&
      formik.errors.coin_TelefonoCelular
    }
  />
</Grid>

<Grid item lg={6}>
  <Box display="flex" alignItems="center">
    <CustomFormLabel>Teléfono Fijo</CustomFormLabel>
    <Box component="span" color="red" ml={0.5}>
      *
    </Box>
  </Box>

  <ReactIntlTelInput
   style={{width: '100%'}}
    containerClassName="intl-tel-input custom-intl-input"
    inputClassName="form-control"
    preferredCountries={['us', 'hn']}
    initialCountry={'hn'}
    value={formik.values.coin_TelefonoFijo}
    onPhoneNumberChange={(isValid, fullValue, countryData, number) => {
      if (!number) {
        formik.setFieldValue('coin_TelefonoFijo', '');
      } else {
        formik.setFieldValue('coin_TelefonoFijo', number);
      }
    }}
    onBlur={() => formik.setFieldTouched('coin_TelefonoFijo', true)}
    error={
      formik.touched.coin_TelefonoFijo &&
      Boolean(formik.errors.coin_TelefonoFijo)
    }
    helperText={
      formik.touched.coin_TelefonoFijo &&
      formik.errors.coin_TelefonoFijo
    }
  />
</Grid>
<Grid item lg={6} md={12} sm={12}>
  <CustomFormLabel>Correo Electrónico <Box component="span" color="red">*</Box></CustomFormLabel>
  <Box display="flex" gap={1} alignItems="center" mb={1}>
    <CustomTextField
      fullWidth
      id="coin_CorreoElectronico"
      name="coin_CorreoElectronico"
      placeholder="ejemplo@correo.com"
      value={formik.values.coin_CorreoElectronico}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.coin_CorreoElectronico && Boolean(formik.errors.coin_CorreoElectronico)}
      helperText={formik.touched.coin_CorreoElectronico && formik.errors.coin_CorreoElectronico}
      disabled={correoVerificado}
      sx={{ flex: 1 }}
    />
    <Button
  variant="contained"
  type="button"
  onClick={enviarCodigoVerificacion}
  disabled={correoVerificado || verificarCorreoDeshabilitado}
  color={correoVerificado ? "success" : "primary"}
  startIcon={correoVerificado ? <CheckCircleIcon /> : null}
>
  {correoVerificado ? "Verificado" : "Verificar"}
</Button>
  </Box>

  {mostrarInputCodigo && !correoVerificado && (
    <Box mt={1}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={8}>
          <CustomTextField
            fullWidth
            label="Código de verificación"
            value={codigoIngresado}
            onChange={(e) => setCodigoIngresado(e.target.value)}
            placeholder="Ingrese el código"
          />
        </Grid>
        <Grid item xs={4}>
          <Button 
            fullWidth
            variant="outlined"
            onClick={verificarCodigo}
          >
            Verificar Código
          </Button>
        </Grid>
      </Grid>
    </Box>
  )}
</Grid>


              <Grid item lg={6}>
  <CustomFormLabel>Correo Electrónico Alternativo</CustomFormLabel>
  <CustomTextField
    fullWidth
    id="coin_CorreoElectronicoAlternativo"
    placeholder="ejemploCorreo@ejemplo.com"
    name="coin_CorreoElectronicoAlternativo"
    value={formik.values.coin_CorreoElectronicoAlternativo}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.coin_CorreoElectronicoAlternativo && Boolean(formik.errors.coin_CorreoElectronicoAlternativo)}
    helperText={formik.touched.coin_CorreoElectronicoAlternativo && formik.errors.coin_CorreoElectronicoAlternativo}
  />
</Grid>
      </Grid>
          )}

{/* Inicio Documentos */}
{tabIndex === 4 && (
  <Grid container spacing={2}>
    {imageInputs.map((input, index) => {
      const isLast = index === imageInputs.length - 1;

      return (
        <Grid item xs={6} sm={4} md={3} key={input.id}>
          <Box
            border="1px solid #ccc"
            borderRadius="8px"
            padding="12px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            position="relative"
          >
            {/* Tipo de documento */}
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id={`tipo-doc-${index}`}>Tipo Documento</InputLabel>
              <Select
  labelId={`tipo-doc-${index}`}
  value={input.tipoDocumento || ''}
  onChange={(e) => handleInputChange(index, 'tipoDocumento', e.target.value)}
  label="Tipo Documento"
  size="small"
>
  <MenuItem value="">Seleccionar</MenuItem>
  <MenuItem value="DNI-CI">DNI CI Comerciante Individual</MenuItem>
  <MenuItem value="RTN-CI">RTN CI Comerciante Individual</MenuItem>
  <MenuItem value="DNI-CI">Declaración CI</MenuItem>

</Select>

            </FormControl>

            {/* Número de referencia */}
            <TextField
              fullWidth
              margin="dense"
              size="small"
              label="Número o Referencia"
              value={input.numeroReferencia || ''}
              onChange={(e) => handleInputChange(index, 'numeroReferencia', e.target.value)}
            />

            {/* Selector de imagen (esto ya lo tienes) */}
            <label style={{ cursor: 'pointer', marginBottom: '8px', marginTop: '8px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e)}
                style={{ display: 'none' }}
              />
              <Button variant="outlined" component="span" size="small">
                Seleccionar imagen
              </Button>
            </label>

            {input.preview && (
              <img
                src={input.preview}
                alt={`Preview ${index + 1}`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
            )}

            {isLast && (
              <Button
                variant="contained"
                color="primary"
                onClick={addImageInput}
                size="small"
                style={{ fontWeight: 'bold', marginTop: '4px' }}
              >
                +
              </Button>
            )}

            <IconButton
              size="small"
              onClick={() => removeImageInput(index)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'error.main',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>
      );
    })}
  </Grid>
)}
        </Box>
       
      <Box
  mt={4}
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  flexWrap="wrap"
  gap={2}
>
  {tabIndex > 0 && (
  <Button
  variant="outlined"
  color="primary"
  size="medium"
  onClick={async () => {
    if (tabIndex === 1 && formik.values.coin_Id && formik.values.pers_Id) {
      await eliminarSilenciosamente();
    }
    setTabIndex(tabIndex - 1);
  }}
  sx={{ borderRadius: 2, fontWeight: 500 }}
>
  ← Anterior
</Button>

)}


  <Box display="flex" gap={2}>
    {tabIndex < 4 && (
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={async () => {
          let success = false;

          if (tabIndex === 0) success = await handleSaveTap1();
          else if (tabIndex === 1) success = await handleSaveTap2();
          else if (tabIndex === 2) success = await handleSaveTap3();
          else if (tabIndex === 3) {
            success = await handleSaveTap4();
            if (success && !correoVerificado) {
              showErrorMessage('Debe verificar su correo electrónico antes de continuar.');
              return;
            }
          }

          if (success) setTabIndex(tabIndex + 1);
        }}
        sx={{ borderRadius: 2, fontWeight: 600 }}
      >
        Siguiente →
      </Button>
    )}

    {tabIndex === 4 && (
      <>
        <Button
          type="button"
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={handleSaveDocuments}
          disabled={isLoading}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenCancelDialog(true)}
          startIcon={<CancelIcon />}
          sx={{ borderRadius: 2, fontWeight: 500 }}
        >
          Cancelar
        </Button>
      </>
    )}
  </Box>
</Box>


<Snackbar 
  open={openSnackbar} 
  autoHideDuration={6000} 
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  sx={{ 
    marginTop: '20px',  // Para evitar que quede muy pegado al borde superior
    marginRight: '20px', // Añadir un margen para evitar que se pegue al borde
    zIndex: 9999 // Asegurar que esté sobre el sidebar
  }}
>
  <Alert 
    onClose={() => setOpenSnackbar(false)} 
    severity={snackbarType} // Usa "success" o "error" según corresponda
    variant="filled"
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
      </form>

      
<Dialog
  open={openDialog}
  onClose={(event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      setOpenDialog(false);
    }
  }}
>
  <DialogTitle>¿Deseas agregar otro comerciante?</DialogTitle>
  <DialogActions>
   <Button
  onClick={() => {
    resetearFormulario();
    setOpenDialog(false);
  }}
  color="primary"
  variant="contained"
>
  Sí
</Button>

   <Button
  onClick={() => {
    setOpenDialog(false);
    navigate('/dashboards/modern');
  }}
  color="secondary"
  variant="outlined"
>
  No
</Button>

  </DialogActions>
</Dialog>


<Dialog
  open={openCancelDialog}
  onClose={(event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      setOpenCancelDialog(false);
    }
  }}
>
  <DialogTitle>¿Estás seguro que deseas cancelar este registro?</DialogTitle>
  <DialogActions>
    <Button
      onClick={async () => {
        setOpenCancelDialog(false);
        await eliminarComerciante();
      }}
      color="error"
      variant="contained"
    >
      Sí, cancelar
    </Button>
    <Button
      onClick={() => setOpenCancelDialog(false)}
      color="primary"
      variant="outlined"
    >
      No, continuar
    </Button>
  </DialogActions>
</Dialog>




    </div>
  );
};
export default ComercianteIndividualCreate;