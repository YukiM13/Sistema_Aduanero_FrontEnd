import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import Persona from 'src/models/persona';
import { Snackbar, Alert, Tabs, Tab, Box, Grid, MenuItem, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
  pers_RTN: yup.string().required('El RTN es requerido'),
  pers_Nombre: yup.string().required('El nombre es requerido'),
  escv_Id: yup.number().required('El estado civil es requerido').moreThan(0, 'El estado civil es requerido'),
  pers_escvRepresentante: yup.number().required('El estado civil del representante es requerido').moreThan(0, 'Requerido'),
  ofic_Id: yup.number().required('La oficina es requerida').moreThan(0, 'Requerido'),
  ofpr_Id: yup.number().required('El oficio es requerido').moreThan(0, 'Requerido'),
  pers_OfprRepresentante: yup.number().required('El oficio del representante es requerido').moreThan(0, 'Requerido'),
  ciud_Id: yup.number().required('La ciudad es requerida').moreThan(0, 'Requerido'),
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

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: Persona,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Validar si el RTN ya existe
        const response = await axios.get(`${apiUrl}/api/Personas/ExisteRTN?rtn=${values.pers_RTN}`, {
          headers: { 'XApiKey': apiKey },
        });

        if (response.data.existe) {
          setSnackbarMessage('El RTN ya está registrado.');
          setOpenSnackbar(true);
          return;
        }

        values.pers_FechaCreacion = new Date();
        values.pers_FechaModificacion = new Date();
        values.usua_UsuarioCreacion = 1;
        values.pers_RTN = values.pers_RTN.replace(/\?/g, '');
        values.pers_FormaRepresentacion = Boolean(values.pers_FormaRepresentacion);

        await axios.post(`${apiUrl}/api/Personas/Insertar`, values, {
          headers: { 'XApiKey': apiKey }
        });

        if (onGuardadoExitoso) onGuardadoExitoso();

      } catch (error) {
        console.error('Error al insertar la persona:', error);
        setSnackbarMessage('Ocurrió un error al guardar. Intenta de nuevo.');
        setOpenSnackbar(true);
      }
    }
  });

  useEffect(() => {
    axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, { headers: { 'XApiKey': apiKey } })
      .then(res => setEstadosCiviles(res.data.data || []));
    axios.get(`${apiUrl}/api/Oficinas/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setOficinas(res.data.data || []));
    axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setOficioProfesion(res.data.data || []));
    axios.get(`${apiUrl}/api/Ciudades/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setCiudades(res.data.data || []));
    axios.get(`${apiUrl}/api/Aldea/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setAldea(res.data.data || []));
    axios.get(`${apiUrl}/api/Colonias/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setColonias(res.data.data || []));
  }, []);




  const handleNombreChange = (e) => {
    const upper = e.target.value.toUpperCase();
    formik.setFieldValue('pers_Nombre', upper);
  };

  return (
    <div>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} textColor="primary" indicatorColor="primary">
        <Tab label="Datos Personales" />
        <Tab label="Localización" />
        <Tab label="Representante" />
        <Tab label="Contacto" />
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
      <CustomFormLabel>Ciudad</CustomFormLabel>
      <CustomTextField
        select
        fullWidth
        id="ciud_Id" // Esto es lo que se va a enviar
        name="ciud_Id"
        value={formik.values.ciud_Id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
        helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
      >
        {ciudades.map((ciudad) => (
          <MenuItem key={ciudad.ciud_Id} value={ciudad.ciud_Id}>
            {ciudad.ciud_Nombre} {/* Mostrar el nombre, pero enviar el ID */}
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
value={formik.values.alde_Id}
onChange={formik.handleChange}
onBlur={formik.handleBlur}
error={formik.touched.alde_Id && Boolean(formik.errors.alde_Id)}
helperText={formik.touched.alde_Id && formik.errors.alde_Id}
  >
 {aldeas.map((aldea) => (
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
                <CustomFormLabel>Numero de Local o Apartamento</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="coin_NumeroLocalApart"
                  name="coin_NumeroLocalApart"
                  value={formik.values.coin_NumeroLocalApart}
                  onChange={handleNombreChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.coin_NumeroLocalApart && Boolean(formik.errors.coin_NumeroLocalApart)}
                  helperText={formik.touched.coin_NumeroLocalApart && formik.errors.coin_NumeroLocalApart}
                />
              </Grid>

  </Grid>
)}
{/* Fin Localización */}

          {tabIndex === 2 && (
            <Grid container spacing={3}>
            
            </Grid>
          )}

          {tabIndex === 3 && (
            <Grid container spacing={3}>
              </Grid>
          )}

        </Box>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
            Guardar
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancelar} startIcon={<CancelIcon />} style={{ marginLeft: '10px' }}>
            Cancelar
          </Button>
        </Box>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ComercianteIndividualCreate;
