import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const ComercianteIndividualEdit = ({ comercianteData, onSaveSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    coin_Id: 0,
    pers_Id: 0,
    pers_RTN: '',
    pers_Nombre: '',
    ofpr_Id: '',
    ofic_Id: '',
    escv_Id: '',
    pers_escvRepresentante: 0,
    pers_OfprRepresentante: 0,
    pers_FormaRepresentacion: false
  });

  const [oficinas, setOficinas] = useState([]);
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [oficioProfesiones, setOficioProfesiones] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (comercianteData) {
      setFormData({
        coin_Id: comercianteData.coin_Id || 0,
        pers_Id: comercianteData.pers_Id || 0,
        pers_RTN: comercianteData.pers_RTN || '',
        pers_Nombre: comercianteData.pers_Nombre || '',
        ofpr_Id: comercianteData.ofpr_Id || '',
        ofic_Id: comercianteData.ofic_Id || '',
        escv_Id: comercianteData.escv_Id || '',
        pers_escvRepresentante: comercianteData.pers_escvRepresentante || 0,
        pers_OfprRepresentante: comercianteData.pers_OfprRepresentante || 0,
        pers_FormaRepresentacion: comercianteData.pers_FormaRepresentacion || false
      });
      setLoading(false);
    }
  }, [comercianteData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oficinasRes, estadosRes, oficiosRes] = await Promise.all([
          axios.get(`${apiUrl}/api/Oficinas/Listar`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/EstadosCiviles/Listar`, { headers: { 'XApiKey': apiKey } }),
          axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, { headers: { 'XApiKey': apiKey } })
        ]);

        setOficinas(oficinasRes.data.data || []);
        setEstadosCiviles(estadosRes.data.data || []);
        setOficioProfesiones(oficiosRes.data.data || []);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
      }
    };
    fetchData();
  }, [apiUrl, apiKey]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
      const usuarioId = usuario.usuarioId || 1;
      const payload = {
        ...formData,
        usua_UsuarioModificacion: usuarioId,
        coin_FechaModificacion: new Date().toISOString()
      };
      const response = await axios.put(`${apiUrl}/api/ComercianteIndividual/Editar`, payload, {
        headers: { 'XApiKey': apiKey }
      });
      if (response.data === 1 || response.data?.message === 'Operación completada con éxito') {
        onSaveSuccess();
      } else {
        console.error('Respuesta inesperada:', response.data);
      }
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
    }
  };

  if (loading) return <Typography>Cargando datos...</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom>Editar Comerciante Individual</Typography>
      <Divider sx={{ mb: 2 }} />

      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Datos Generales" />
        <Tab label="Representante" disabled={!formData.pers_FormaRepresentacion} />
      </Tabs>

      <form onSubmit={handleSubmit}>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre" name="pers_Nombre" value={formData.pers_Nombre} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="RTN" name="pers_RTN" value={formData.pers_RTN} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Oficina</InputLabel>
                <Select name="ofic_Id" value={formData.ofic_Id} onChange={handleChange}>
                  {oficinas.map((item) => (
                    <MenuItem key={item.ofic_Id} value={item.ofic_Id}>{item.ofic_Nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado Civil</InputLabel>
                <Select name="escv_Id" value={formData.escv_Id} onChange={handleChange}>
                  {estadosCiviles.map((item) => (
                    <MenuItem key={item.escv_Id} value={item.escv_Id}>{item.escv_Nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Oficio</InputLabel>
                <Select name="ofpr_Id" value={formData.ofpr_Id} onChange={handleChange}>
                  {oficioProfesiones.map((item) => (
                    <MenuItem key={item.ofpr_Id} value={item.ofpr_Id}>{item.ofpr_Nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={formData.pers_FormaRepresentacion} onChange={handleChange} name="pers_FormaRepresentacion" />}
                label="¿Tiene Representante?"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado Civil Representante</InputLabel>
                <Select name="pers_escvRepresentante" value={formData.pers_escvRepresentante} onChange={handleChange}>
                  {estadosCiviles.map((item) => (
                    <MenuItem key={item.escv_Id} value={item.escv_Id}>{item.escv_Nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Oficio Representante</InputLabel>
                <Select name="pers_OfprRepresentante" value={formData.pers_OfprRepresentante} onChange={handleChange}>
                  {oficioProfesiones.map((item) => (
                    <MenuItem key={item.ofpr_Id} value={item.ofpr_Id}>{item.ofpr_Nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="secondary" onClick={onCancel} startIcon={<CancelIcon />}>Cancelar</Button>
          <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>Guardar Cambios</Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ComercianteIndividualEdit;
