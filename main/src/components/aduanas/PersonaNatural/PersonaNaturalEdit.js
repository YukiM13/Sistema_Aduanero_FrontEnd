import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert, Button, Grid, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import PersonaNaturalModel from '../../../models/PersonaNaturalModel';

const validationSchema = yup.object({
  pers_Id: yup.number().required('La persona es requerida').moreThan(0, 'La persona es requerida'),
  pena_DireccionExacta: yup.string().required('La dirección es requerida'),
  ciud_Id: yup.number().required('La ciudad es requerida').moreThan(0, 'La ciudad es requerida'),
  pena_TelefonoCelular: yup.string().required('El teléfono celular es requerido'),
  pena_CorreoElectronico: yup.string().email('Correo inválido').required('El correo es requerido'),
  pena_RTN: yup.string().required('El RTN es requerido'),
  pena_DNI: yup.string().required('El DNI es requerido'),
  pena_NumeroRecibo: yup.string().required('El número de recibo es requerido'),
});

const PersonaNaturalEditComponent = ({ persona = PersonaNaturalModel, onCancelar, onGuardadoExitoso }) => {
  const [ciudades, setCiudades] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    axios.get(`${apiUrl}/api/Ciudades/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setCiudades(res.data.data || []))
      .catch(() => setCiudades([]));
    axios.get(`${apiUrl}/api/Personas/Listar`, { headers: { 'XApiKey': apiKey } })
      .then(res => setPersonas(res.data.data || []))
      .catch(() => setPersonas([]));
  }, [apiUrl, apiKey]);

  const formik = useFormik({
    initialValues: persona,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      values.pena_FechaModificacion = new Date();
      values.usua_UsuarioModificacion = 1;
      axios.put(`${apiUrl}/api/PersonaNatural/Editar`, values, {
        headers: { 'XApiKey': apiKey },
      })
        .then(() => {
          if (onGuardadoExitoso) onGuardadoExitoso();
        })
        .catch(() => setOpenSnackbar(true));
    },
  });

  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      setOpenSnackbar(true);
    }
  }, [formik.errors, formik.submitCount]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Persona</CustomFormLabel>
            <CustomTextField
              select
              fullWidth
              id="pers_Id"
              name="pers_Id"
              value={formik.values.pers_Id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pers_Id && Boolean(formik.errors.pers_Id)}
              helperText={formik.touched.pers_Id && formik.errors.pers_Id}
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
              onBlur={formik.handleBlur}
              error={formik.touched.ciud_Id && Boolean(formik.errors.ciud_Id)}
              helperText={formik.touched.ciud_Id && formik.errors.ciud_Id}
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
              onBlur={formik.handleBlur}
              error={formik.touched.pena_DireccionExacta && Boolean(formik.errors.pena_DireccionExacta)}
              helperText={formik.touched.pena_DireccionExacta && formik.errors.pena_DireccionExacta}
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
              onBlur={formik.handleBlur}
              error={formik.touched.pena_TelefonoCelular && Boolean(formik.errors.pena_TelefonoCelular)}
              helperText={formik.touched.pena_TelefonoCelular && formik.errors.pena_TelefonoCelular}
            />
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Correo Electrónico</CustomFormLabel>
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
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>RTN</CustomFormLabel>
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
            <CustomFormLabel>DNI</CustomFormLabel>
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
            <CustomFormLabel>Número Recibo</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="pena_NumeroRecibo"
              name="pena_NumeroRecibo"
              value={formik.values.pena_NumeroRecibo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pena_NumeroRecibo && Boolean(formik.errors.pena_NumeroRecibo)}
              helperText={formik.touched.pena_NumeroRecibo && formik.errors.pena_NumeroRecibo}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" spacing={2} mt={2}>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={onCancelar}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              type="submit"
              startIcon={<SaveIcon />}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          No puede haber campos vacíos o inválidos.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PersonaNaturalEditComponent;
