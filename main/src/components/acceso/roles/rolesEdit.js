import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import EnhancedTransferList from '../../material-ui/transfer-list/EnhancedTransferList';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const RolesEdit = ({ role, onCancelar, onGuardadoExitoso }) => {
  const [roleDescripcion, setRoleDescripcion] = useState(role.role_Descripcion || '');
  const [pantallas, setPantallas] = useState([]);
  const [selectedPantallas, setSelectedPantallas] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });
  const [errors, setErrors] = useState({ roleDescripcion: '', pantallas: '' });
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const cargarPantallas = () => {
    axios
      .get(`${apiUrl}/api/Pantallas/Listar?pant_EsAduana=true`, {
        headers: { 'XApiKey': apiKey },
      })
      .then((response) => {
        setPantallas(response.data.data);
      })
      .catch((error) => console.error('Error al obtener las pantallas:', error));
  };

  const cargarPantallasSeleccionadas = () => {
    axios
      .get(`${apiUrl}/api/RolesPorPantallas/DibujarMenu?role_Id=${role.role_Id}`, {
        headers: { 'XApiKey': apiKey },
      })
      .then((response) => {
        setSelectedPantallas(response.data.data);
      })
      .catch((error) => console.error('Error al obtener las pantallas seleccionadas:', error));
  };

  const handleGuardar = () => {
    let hasErrors = false;
    const newErrors = { roleDescripcion: '', pantallas: '' };

    if (!roleDescripcion.trim()) {
      newErrors.roleDescripcion = 'La descripción del rol es requerida.';
      hasErrors = true;
    }

    if (selectedPantallas.length === 0) {
      newErrors.pantallas = 'Debe seleccionar al menos una pantalla.';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) return;

    const pantallasSeleccionadas = selectedPantallas.map((pantalla) => ({
      pant_Id: pantalla.pant_Id,
    }));

    const payload = {
      role_Id: role.role_Id,
      role_Descripcion: roleDescripcion,
      pant_Ids: JSON.stringify({ pantallas: pantallasSeleccionadas }),
      usua_UsuarioModificacion: 1,
      role_FechaModificacion: new Date(),
    };

    axios
      .post(`${apiUrl}/api/Roles/Editar`, payload, {
        headers: { 'XApiKey': apiKey },
      })
      .then(() => {
        if (onGuardadoExitoso) onGuardadoExitoso();
      })
      .catch(() => mostrarAlerta('error', 'Error al actualizar el rol.'));
  };

  const mostrarAlerta = (severity, message) => {
    setAlertConfig({ severity, message });
    setOpenSnackbar(true);
  };

  useEffect(() => {
    cargarPantallas();
    cargarPantallasSeleccionadas();
  }, []);

  // Filtrar pantallas disponibles eliminando las seleccionadas
  const pantallasDisponibles = pantallas.filter(
    (pantalla) => !selectedPantallas.some((selected) => selected.pant_Id === pantalla.pant_Id)
  );

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="roleDescripcion">Descripción del Rol</CustomFormLabel>
          <CustomTextField
            id="roleDescripcion"
            name="roleDescripcion"
            fullWidth
            value={roleDescripcion}
            onChange={(e) => setRoleDescripcion(e.target.value)}
            error={Boolean(errors.roleDescripcion)}
            helperText={errors.roleDescripcion}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomFormLabel>Pantallas Asignadas</CustomFormLabel>
          <EnhancedTransferList
            left={pantallasDisponibles}
            right={selectedPantallas}
            setRight={setSelectedPantallas}
            leftTitle="Pantallas Disponibles"
            rightTitle="Pantallas Seleccionadas"
            leftKey="pant_Id"
            leftLabel="pant_Nombre"
          />
          {errors.pantallas && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.pantallas}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="error" onClick={onCancelar} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGuardar}
            startIcon={<SaveIcon />}
            sx={{ ml: 2 }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RolesEdit;