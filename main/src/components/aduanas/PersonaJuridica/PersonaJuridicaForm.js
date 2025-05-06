import React, { useState, useEffect } from 'react';
import { Button, Grid, Tabs, Tab, Box, MenuItem } from '@mui/material';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import SaveIcon from '@mui/icons-material/Save';
import PersonaJuridica from '../../../models/PersonaJuridicaModel';
import axios from 'axios';

const PersonaJuridicaForm = ({ onGuardar }) => {
  const [formData, setFormData] = useState({ ...PersonaJuridica });
  const [activeTab, setActiveTab] = useState(0);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios
      .get(`${apiUrl}/api/Ciudades/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setCiudades(response.data.data);
        }
      })
      .catch((error) => console.error(error));

    axios
      .get(`${apiUrl}/api/Colonias/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setColonias(response.data.data);
        }
      })
      .catch((error) => console.error(error));

    axios
      .get(`${apiUrl}/api/Personas/Listar`, { headers: { 'XApiKey': apiKey } }) 
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setPersonas(response.data.data);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateTabFields = (validateAll = false) => {
    const newErrors = {};
    if (validateAll || activeTab === 0) {
      if (!formData.pers_Id) newErrors.pers_Id = 'El campo Persona ID es obligatorio.';
      if (!formData.pers_RTN) newErrors.pers_RTN = 'El campo RTN es obligatorio.';
    }
    if (validateAll || activeTab === 1) {
      if (!formData.ciud_Id) newErrors.ciud_Id = 'El campo Ciudad es obligatorio.';
      if (!formData.colo_Id) newErrors.colo_Id = 'El campo Colonia es obligatorio.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateTabFields()) {
      setActiveTab((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateTabFields(true)) {
      if (onGuardar) onGuardar(formData);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Datos Generales
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Persona ID</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="pers_Id"
                name="pers_Id"
                value={formData.pers_Id}
                onChange={handleChange}
                error={!!errors.pers_Id}
                helperText={errors.pers_Id}
              >
                {personas.map((persona) => (
                  <MenuItem key={persona.pers_Id} value={persona.pers_Id}>
                    {persona.pers_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>RTN</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pers_RTN"
                name="pers_RTN"
                value={formData.pers_RTN}
                onChange={handleChange}
                error={!!errors.pers_RTN}
                helperText={errors.pers_RTN}
              />
            </Grid>
          </Grid>
        );
      case 1: // Ubicación de la Empresa
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Ciudad</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="ciud_Id"
                name="ciud_Id"
                value={formData.ciud_Id}
                onChange={handleChange}
                error={!!errors.ciud_Id}
                helperText={errors.ciud_Id}
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
                value={formData.colo_Id}
                onChange={handleChange}
                error={!!errors.colo_Id}
                helperText={errors.colo_Id}
              >
                {colonias.map((colonia) => (
                  <MenuItem key={colonia.colo_Id} value={colonia.colo_Id}>
                    {colonia.colo_Nombre}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        );
      case 2: // Ubicación del Representante
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Colonia Representante</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_ColoniaRepresentante"
                name="peju_ColoniaRepresentante"
                value={formData.peju_ColoniaRepresentante}
                onChange={handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Ciudad Representante</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_CiudadIdRepresentante"
                name="peju_CiudadIdRepresentante"
                value={formData.peju_CiudadIdRepresentante}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 3: // Contacto
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Empresa</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_TelefonoEmpresa"
                name="peju_TelefonoEmpresa"
                value={formData.peju_TelefonoEmpresa}
                onChange={handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Correo Electrónico</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_CorreoElectronico"
                name="peju_CorreoElectronico"
                value={formData.peju_CorreoElectronico}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 4: // Documentación
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>URL Imagen</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="doco_URLImagen"
                name="doco_URLImagen"
                value={formData.doco_URLImagen}
                onChange={handleChange}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Tipo Documento</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="doco_TipoDocumento"
                name="doco_TipoDocumento"
                value={formData.doco_TipoDocumento}
                onChange={handleChange}
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
      <Tabs value={activeTab} centered>
        <Tab label="Datos Generales" />
        <Tab label="Ubicación de la Empresa" />
        <Tab label="Ubicación del Representante" />
        <Tab label="Contacto" />
        <Tab label="Documentación" />
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
        {activeTab < 4 ? (
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

export default PersonaJuridicaForm;
