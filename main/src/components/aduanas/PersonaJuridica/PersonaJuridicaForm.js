import React, { useState, useEffect } from 'react';
import { Button, Grid, Tabs, Tab, Box, MenuItem } from '@mui/material';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import SaveIcon from '@mui/icons-material/Save';
import PersonaJuridica from '../../../models/PersonaJuridicaModel';
import axios from 'axios';
import { Check, CheckCircle } from '@mui/icons-material';

const PersonaJuridicaForm = ({ onGuardar }) => {
  const [formData, setFormData] = useState({ ...PersonaJuridica });
  const [activeTab, setActiveTab] = useState(0);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [aldeas,setaldeas]= useState([]);
  const [oficioProfesion, setOficioProfesion] = useState([]);
  const [EstadoCivil, setEstadoCivil] = useState([]);
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
      .get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, { headers: { 'XApiKey': apiKey } })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setEstadoCivil(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
    axios
      .get(`${apiUrl}/api/Oficinas/Listar`, { headers: { 'XApiKey': apiKey } }) 
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setOficinas(response.data.data);
        }
      })
      .catch((error) => console.error(error));
    axios
      .get(`${apiUrl}/api/Oficio_Profesiones/Listar`, { headers: { 'XApiKey': apiKey } })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setOficioProfesion(response.data.data);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    if (name === "ciud_Id" && value) {
      // Fetch colonias and aldeas for Empresa
      axios
        .get(`${apiUrl}/api/Colonias/FiltrarPorCiudad?ciud_Id=${value}`, {
          headers: { 'XApiKey': apiKey },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            setColonias(response.data.data);
          }
        })
        .catch((error) => console.error(error));

      axios
        .get(`${apiUrl}/api/Aldea/FiltrarPorCiudades?alde_Id=${value}`, {
          headers: { 'XApiKey': apiKey },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            setaldeas(response.data.data);
          }
        })
        .catch((error) => console.error(error));
    }

    if (name === "peju_CiudadIdRepresentante" && value) {
      // Fetch colonias and aldeas for Representante
      axios
        .get(`${apiUrl}/api/Colonias/FiltrarPorCiudad?ciud_Id=${value}`, {
          headers: { 'XApiKey': apiKey },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            setColonias(response.data.data);
          }
        })
        .catch((error) => console.error(error));

      axios
        .get(`${apiUrl}/api/Aldea/FiltrarPorCiudades?alde_Id=${value}`, {
          headers: { 'XApiKey': apiKey },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            setaldeas(response.data.data);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const validateTabFields = (validar = true) => {
    const newErrors = {};

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
              <CustomFormLabel>Nombre Persona</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="pers_Nombre"
                name="pers_Nombre"
                value={formData.pers_Nombre}
                onChange={handleChange}
                error={!!errors.pers_Nombre}
                helperText={errors.pers_Nombre}
              />
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
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Estado Civil</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="escv_Id"
                name="escv_Id"
                value={formData.escv_Id}
                onChange={handleChange}
                error={!!errors.escv_Id}
                helperText={errors.escv_Id}
              >
                {EstadoCivil.map((estadocivil) => (
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
                id="ciud_Id"
                name="ciud_Id"
                value={formData.ofic_Id}
                onChange={handleChange}
                error={!!errors.ofic_Id}
                helperText={errors.ofic_Id}
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
                value={formData.ofpr_Id}
                onChange={handleChange}
                error={!!errors.ofpr_Id}
                helperText={errors.ofpr_Id}
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
      case 1: // ubicación de la Empresa
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
                    {`${ciudad.ciud_Id}-${ciudad.ciud_Nombre}`}
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
                disabled={!formData.ciud_Id}
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
                value={formData.alde_Id}
                onChange={handleChange} 
                error={!!errors.alde_Id}
                helperText={errors.alde_Id}
                disabled={!formData.ciud_Id}
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
                value={formData.peju_PuntoReferencia}
                onChange={handleChange}
                error={!!errors.peju_PuntoReferencia}
                helperText={errors.peju_PuntoReferencia}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Numero telefonico de Referencia</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_NumeroLocalApart"
                name="peju_NumeroLocalApart"   
                value={formData.peju_NumeroLocalApart}
                onChange={handleChange}
                error={!!errors.peju_NumeroLocalApart}
                helperText={errors.peju_NumeroLocalApart}
              />
            </Grid>
          </Grid>
        );
      case 2: // Ubicación del Representante
        return (
          <Grid container spacing={3}>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Numero telefonico del Representante</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_NumeroLocalRepresentante"
                name="peju_NumeroLocalRepresentante"
                value={formData.peju_NumeroLocalRepresentante}
                onChange={handleChange}
                error={!!errors.peju_NumeroLocalRepresentante}
                helperText={errors.peju_NumeroLocalRepresentante}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Ciudad del Representante</CustomFormLabel>
              <CustomTextField
                select
                fullWidth
                id="peju_CiudadIdRepresentante"
                name="peju_CiudadIdRepresentante"
                value={formData.peju_CiudadIdRepresentante}
                onChange={handleChange}
                error={!!errors.peju_CiudadIdRepresentante}
                helperText={errors.peju_CiudadIdRepresentante}
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
                    {`${ciudad.ciud_Id}-${ciudad.ciud_Nombre}`}
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
                value={formData.peju_ColoniaRepresentante}
                onChange={handleChange}
                error={!!errors.peju_ColoniaRepresentante}
                helperText={errors.peju_ColoniaRepresentante}
                disabled={!formData.peju_CiudadIdRepresentante}
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
                value={formData.peju_AldeaIdRepresentante}
                onChange={handleChange} 
                error={!!errors.peju_AldeaIdRepresentante}
                helperText={errors.peju_AldeaIdRepresentante}
                disabled={!formData.peju_CiudadIdRepresentante}
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
                value={formData.peju_PuntoReferenciaRepresentante}
                onChange={handleChange}
                error={!!errors.peju_PuntoReferenciaRepresentante}
                helperText={errors.peju_PuntoReferenciaRepresentante}
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
                error={!!errors.peju_TelefonoEmpresa}
                helperText={errors.peju_TelefonoEmpresa}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Fijo Representante Legal</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_TelefonoFijoRepresentanteLegal"
                name="peju_TelefonoFijoRepresentanteLegal"
                value={formData.peju_TelefonoFijoRepresentanteLegal}
                onChange={handleChange}
                error={!!errors.peju_TelefonoFijoRepresentanteLegal}
                helperText={errors.peju_TelefonoFijoRepresentanteLegal}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Teléfono Representante Legal</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_TelefonoRepresentanteLegal"
                name="peju_TelefonoRepresentanteLegal"
                value={formData.peju_TelefonoRepresentanteLegal}
                onChange={handleChange}
                error={!!errors.peju_TelefonoRepresentanteLegal}
                helperText={errors.peju_TelefonoRepresentanteLegal}
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
                error={!!errors.peju_CorreoElectronico}
                helperText={errors.peju_CorreoElectronico}
              />
              <Button variant="contained" sx={{ mt: 1 }} startIcon={<Check />}>
                Verificar correo
              </Button>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <CustomFormLabel>Correo Electrónico Alternativo</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="peju_CorreoElectronicoAlternativo"
                name="peju_CorreoElectronicoAlternativo"
                value={formData.peju_CorreoElectronicoAlternativo}
                onChange={handleChange}
                error={!!errors.peju_CorreoElectronicoAlternativo}
                helperText={errors.peju_CorreoElectronicoAlternativo}
              />
              <Button variant="contained" sx={{ mt: 1 }} startIcon={<Check />}>
                Verificar correo
              </Button>
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} centered>
        <Tab label="Datos Generales" />
        <Tab label="Ubicación de la Empresa" />
        <Tab label="Ubicación del Representante" />
        <Tab label="Contacto" />
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
