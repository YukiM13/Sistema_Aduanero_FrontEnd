import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Divider,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const ComercianteIndividualEdit = ({ comercianteData, onSaveSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    coin_Id: 0,
    pers_Id: 0,
    pers_RTN: '',
    pers_Nombre: '',
    ofpr_Id: 0,
    ofic_Id: 0,
    escv_Id: 0,
    pers_escvRepresentante: 0,
    pers_OfprRepresentante: 0,
    pers_FormaRepresentacion: false
  });

  const [oficiosProfesiones, setOficiosProfesiones] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  // Cargar catálogos
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [oficiosProfesionesRes, oficinasRes, estadosCivilesRes] = await Promise.all([
          axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/Oficinas/Listar`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/EstadosCiviles/Listar`, { headers: { 'XApiKey': apiKey } })
        ]);

        setOficiosProfesiones(oficiosProfesionesRes.data.data || []);
        setOficinas(oficinasRes.data.data || []);
        setEstadosCiviles(estadosCivilesRes.data.data || []);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      }
    };

    cargarCatalogos();
  }, [apiUrl, apiKey]);

  // Cargar datos del comerciante a editar
  useEffect(() => {
    if (comercianteData) {
      setFormData({
        coin_Id: comercianteData.coin_Id || 0,
        pers_Id: comercianteData.pers_Id || 0,
        pers_RTN: comercianteData.pers_RTN || '',
        pers_Nombre: comercianteData.pers_Nombre || '',
        ofpr_Id: comercianteData.ofpr_Id || 0,
        ofic_Id: comercianteData.ofic_Id || 0,
        escv_Id: comercianteData.escv_Id || 0,
        pers_escvRepresentante: comercianteData.pers_escvRepresentante || 0,
        pers_OfprRepresentante: comercianteData.pers_OfprRepresentante || 0,
        pers_FormaRepresentacion: comercianteData.pers_FormaRepresentacion || false
      });
      setLoadingData(false);
    }
  }, [comercianteData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Limpiar errores al modificar un campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }

    setFormData({ ...formData, [name]: newValue });

    // Si se cambia la forma de representación a false, resetear los campos de representante
    if (name === 'pers_FormaRepresentacion' && !newValue) {
      setFormData(prevState => ({
        ...prevState,
        pers_escvRepresentante: 0,
        pers_OfprRepresentante: 0,
        [name]: newValue
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pers_Nombre.trim()) {
      newErrors.pers_Nombre = 'El nombre es requerido';
    }

    if (!formData.pers_RTN.trim()) {
      newErrors.pers_RTN = 'El RTN es requerido';
    } else if (!/^\d{4}-\d{4}-\d{6}$/.test(formData.pers_RTN)) {
      newErrors.pers_RTN = 'Formato de RTN inválido (XXXX-XXXX-XXXXXX)';
    }

    if (formData.ofpr_Id === 0) {
      newErrors.ofpr_Id = 'Seleccione una profesión';
    }

    if (formData.ofic_Id === 0) {
      newErrors.ofic_Id = 'Seleccione una oficina';
    }

    if (formData.escv_Id === 0) {
      newErrors.escv_Id = 'Seleccione un estado civil';
    }

    // Validar campos de representante solo si pers_FormaRepresentacion es true
    if (formData.pers_FormaRepresentacion) {
      if (formData.pers_escvRepresentante === 0) {
        newErrors.pers_escvRepresentante = 'Seleccione un estado civil para el representante';
      }
      if (formData.pers_OfprRepresentante === 0) {
        newErrors.pers_OfprRepresentante = 'Seleccione una profesión para el representante';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar el objeto de envío
      const dataToSubmit = {
        ...formData,
        usua_UsuarioModificacion: 1, // Idealmente este valor debería venir de un contexto de autenticación
        coin_FechaModificacion: new Date().toISOString()
      };

      const response = await axios.post(
        `${apiUrl}/api/ComercianteIndividual/Editar`,
        dataToSubmit,
        { headers: { 'XApiKey': apiKey } }
      );

      if (response.data && response.data === 1) {
        onSaveSuccess();
      } else {
        setErrors({ submit: 'Hubo un error al guardar los cambios' });
      }
    } catch (error) {
      console.error("Error al editar comerciante:", error);
      setErrors({ 
        submit: error.response?.data || 'Error al intentar actualizar el registro' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom color="primary">
          Editar Comerciante Individual
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* ID de Comerciante - Solo lectura */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID"
                name="coin_Id"
                value={formData.coin_Id}
                disabled
              />
            </Grid>

            {/* RTN */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="RTN"
                name="pers_RTN"
                value={formData.pers_RTN}
                onChange={handleChange}
                error={!!errors.pers_RTN}
                helperText={errors.pers_RTN}
                placeholder="XXXX-XXXX-XXXXXX"
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="pers_Nombre"
                value={formData.pers_Nombre}
                onChange={handleChange}
                error={!!errors.pers_Nombre}
                helperText={errors.pers_Nombre}
              />
            </Grid>

            {/* Profesión/Oficio */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.ofpr_Id}>
                <InputLabel>Profesión/Oficio</InputLabel>
                <Select
                  name="ofpr_Id"
                  value={formData.ofpr_Id}
                  onChange={handleChange}
                  label="Profesión/Oficio"
                >
                  <MenuItem value={0}>Seleccione</MenuItem>
                  {oficiosProfesiones.map(item => (
                    <MenuItem key={item.ofpr_Id} value={item.ofpr_Id}>
                      {item.ofpr_Descripcion}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ofpr_Id && <FormHelperText>{errors.ofpr_Id}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Oficina */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.ofic_Id}>
                <InputLabel>Oficina</InputLabel>
                <Select
                  name="ofic_Id"
                  value={formData.ofic_Id}
                  onChange={handleChange}
                  label="Oficina"
                >
                  <MenuItem value={0}>Seleccione</MenuItem>
                  {oficinas.map(item => (
                    <MenuItem key={item.ofic_Id} value={item.ofic_Id}>
                      {item.ofic_Nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ofic_Id && <FormHelperText>{errors.ofic_Id}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Estado Civil */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.escv_Id}>
                <InputLabel>Estado Civil</InputLabel>
                <Select
                  name="escv_Id"
                  value={formData.escv_Id}
                  onChange={handleChange}
                  label="Estado Civil"
                >
                  <MenuItem value={0}>Seleccione</MenuItem>
                  {estadosCiviles.map(item => (
                    <MenuItem key={item.escv_Id} value={item.escv_Id}>
                      {item.escv_Descripcion}
                    </MenuItem>
                  ))}
                </Select>
                {errors.escv_Id && <FormHelperText>{errors.escv_Id}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Forma de Representación */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.pers_FormaRepresentacion}
                    onChange={handleChange}
                    name="pers_FormaRepresentacion"
                    color="primary"
                  />
                }
                label="¿Tiene Representante?"
              />
            </Grid>

            {/* Campos adicionales que aparecen solo si hay representante */}
            {formData.pers_FormaRepresentacion && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información del Representante
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                {/* Estado Civil del Representante */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.pers_escvRepresentante}>
                    <InputLabel>Estado Civil del Representante</InputLabel>
                    <Select
                      name="pers_escvRepresentante"
                      value={formData.pers_escvRepresentante}
                      onChange={handleChange}
                      label="Estado Civil del Representante"
                    >
                      <MenuItem value={0}>Seleccione</MenuItem>
                      {estadosCiviles.map(item => (
                        <MenuItem key={item.escv_Id} value={item.escv_Id}>
                          {item.escv_Descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.pers_escvRepresentante && (
                      <FormHelperText>{errors.pers_escvRepresentante}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Profesión/Oficio del Representante */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.pers_OfprRepresentante}>
                    <InputLabel>Profesión/Oficio del Representante</InputLabel>
                    <Select
                      name="pers_OfprRepresentante"
                      value={formData.pers_OfprRepresentante}
                      onChange={handleChange}
                      label="Profesión/Oficio del Representante"
                    >
                      <MenuItem value={0}>Seleccione</MenuItem>
                      {oficiosProfesiones.map(item => (
                        <MenuItem key={item.ofpr_Id} value={item.ofpr_Id}>
                          {item.ofpr_Descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.pers_OfprRepresentante && (
                      <FormHelperText>{errors.pers_OfprRepresentante}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Botones de Acción */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComercianteIndividualEdit;