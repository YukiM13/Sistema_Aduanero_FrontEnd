  import React, { useState, useEffect } from 'react';
  import { Button, Grid, Tabs, Tab, Box, MenuItem } from '@mui/material';
  import CustomTextField from '../../forms/theme-elements/CustomTextField';
  import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
  import PersonaNatural from '../../../models/PersonaNaturalModel';
  import axios from 'axios';

  const PersonaNaturalForm = ({ onGuardar, onCancelar }) => {
    const [formData, setFormData] = useState({ ...PersonaNatural });
    const [activeTab, setActiveTab] = useState(0);
    const [ciudades, setCiudades] = useState([]);
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
    }, []);

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files) {
        setFormData({ ...formData, [name]: files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

    const validateTabFields = (validar = false) => {
      const newErrors = {};
      if (validar || activeTab === 0) {
        if (!formData.pers_Id) newErrors.pers_Id = 'El campo Persona ID es obligatorio.';
        if (!formData.pena_DireccionExacta) newErrors.pena_DireccionExacta = 'El campo Dirección Exacta es obligatorio.';
        if (!formData.ciud_Id) newErrors.ciud_Id = 'El campo Ciudad es obligatorio.';
      }
      if (validar || activeTab === 1) {
        if (!formData.pena_TelefonoCelular) newErrors.pena_TelefonoCelular = 'El campo Teléfono Celular es obligatorio.';
        if (!formData.pena_CorreoElectronico) newErrors.pena_CorreoElectronico = 'El campo Correo Electrónico es obligatorio.';
      }
      if (validar || activeTab === 2) {
        if (!formData.pena_RTN) newErrors.pena_RTN = 'El campo RTN es obligatorio.';
        if (!formData.pena_DNI) newErrors.pena_DNI = 'El campo DNI es obligatorio.';
      }
      if (validar || activeTab === 3) {
        if (!formData.pena_NumeroRecibo) newErrors.pena_NumeroRecibo = 'El campo Número Recibo es obligatorio.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };


    const handleNext = () => {
      if (validateTabFields()) {
        setActiveTab((prev) => Math.min(prev + 1, 3));
      }
    };

    const handleBack = () => {
      setActiveTab((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateTabFields(true)) {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        console.log('Datos del forsssssssssssssssssssssmulario:', formData);
        axios
          .post(`${apiUrl}/api/PersonaNatural/Insertar`, formData, {
            headers: {
              'XApiKey': apiKey,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            console.log('Formulario enviado con éxito:', response.data);
            if (onGuardar) onGuardar(response.data);
          })
          .catch((error) => {
            console.error('Error al enviar el formulario:', error);
          });
      }
    };

    const renderTabContent = () => {
      switch (activeTab) {
        case 0: // datos personales
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
                <CustomFormLabel>Dirección Exacta</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_DireccionExacta"
                  name="pena_DireccionExacta"
                  value={formData.pena_DireccionExacta}
                  onChange={handleChange}
                  error={!!errors.pena_DireccionExacta}
                  helperText={errors.pena_DireccionExacta}
                />
              </Grid>
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
        case 1: // datos de contacto
          return (
            <Grid container spacing={3}>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Teléfono Fijo</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_TelefonoFijo"
                  name="pena_TelefonoFijo"
                  value={formData.pena_TelefonoFijo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Teléfono Celular</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_TelefonoCelular"
                  name="pena_TelefonoCelular"
                  value={formData.pena_TelefonoCelular}
                  onChange={handleChange}
                  error={!!errors.pena_TelefonoCelular}
                  helperText={errors.pena_TelefonoCelular}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Correo Electrónico</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_CorreoElectronico"
                  name="pena_CorreoElectronico"
                  value={formData.pena_CorreoElectronico}
                  onChange={handleChange}
                  error={!!errors.pena_CorreoElectronico}
                  helperText={errors.pena_CorreoElectronico}
                />
                <Grid item>
                            <Button variant="contained" type="submit" startIcon={<check />}>
                              Verificar correo
                            </Button>
                          </Grid>
              </Grid>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Correo Alternativo</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_CorreoAlternativo"
                  name="pena_CorreoAlternativo"
                  value={formData.pena_CorreoAlternativo}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          );
        case 2: // identificacicn y cocumentacion
          return (
            <Grid container spacing={3}>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>RTN</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_RTN"
                  name="pena_RTN"
                  value={formData.pena_RTN}
                  onChange={handleChange}
                  error={!!errors.pena_RTN}
                  helperText={errors.pena_RTN}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Archivo RTN</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="ArchivoRTN" 
                  name="ArchivoRTN"
                  type="file"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>DNI</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_DNI"
                  name="pena_DNI"
                  value={formData.pena_DNI}
                  onChange={handleChange}
                  error={!!errors.pena_DNI}
                  helperText={errors.pena_DNI}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Archivo DNI</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_ArchivoDNI"
                  name="pena_ArchivoDNI"
                  type="text"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          );
        case 3: // informacion de pago
          return (
            <Grid container spacing={3}>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Número Recibo</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_NumeroRecibo"
                  name="pena_NumeroRecibo"
                  value={formData.pena_NumeroRecibo}
                  onChange={handleChange}
                  error={!!errors.pena_NumeroRecibo}
                  helperText={errors.pena_NumeroRecibo}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel>Archivo Número Recibo</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="pena_ArchivoNumeroRecibo"
                  name="pena_ArchivoNumeroRecibo"
                  type="text"
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
