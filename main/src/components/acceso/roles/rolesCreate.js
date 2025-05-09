import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Button, TextField, Typography, Paper, Snackbar, Alert
} from '@mui/material';
import EnhancedTransferList from '../../material-ui/transfer-list/EnhancedTransferList';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const RolesCreate = ({ onCancelar, onGuardadoExitoso }) => {
  const [roleDescripcion, setRoleDescripcion] = useState('');
  const [pantallas, setPantallas] = useState([]);
  const [selectedPantallas, setSelectedPantallas] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const cargarPantallas = () => {
    axios.get(`${apiUrl}/api/Pantallas/Listar?pant_EsAduana=true`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        setPantallas(response.data.data);
      })
      .catch(error => console.error('Error al obtener las pantallas:', error));
  };

  const handleGuardar = () => {
    if (!roleDescripcion.trim()) {
      mostrarAlerta('error', 'La descripción del rol es requerida.');
      return;
    }

    const pantallasSeleccionadas = selectedPantallas.map((pantalla) => ({
      pant_Id: pantalla.pant_Id,
    }));

    const payload = {
      role_Descripcion: roleDescripcion,
      role_Aduana: true,
      pant_Ids: JSON.stringify({ pantallas: pantallasSeleccionadas }),
      usua_UsuarioCreacion: 1,
      role_FechaCreacion: new Date(),
    };

    axios.post(`${apiUrl}/api/Roles/Insertar`, payload, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        if (onGuardadoExitoso) onGuardadoExitoso();
      })
      .catch(() => mostrarAlerta('error', 'Error al guardar el rol.'));
  };

  const mostrarAlerta = (severity, message) => {
    setAlertConfig({ severity, message });
    setOpenSnackbar(true);
  };

  useEffect(() => {
    cargarPantallas();
  }, []);

  // Filtrar pantallas disponibles eliminando las seleccionadas
  const pantallasDisponibles = pantallas.filter(
    (pantalla) => !selectedPantallas.some((selected) => selected.pant_Id === pantalla.pant_Id)
  );

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Crear Rol
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Descripción del Rol"
            fullWidth
            value={roleDescripcion}
            onChange={(e) => setRoleDescripcion(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <EnhancedTransferList
            left={pantallasDisponibles}
            right={selectedPantallas}
            setRight={setSelectedPantallas}
            leftTitle="Pantallas Disponibles"
            rightTitle="Pantallas Seleccionadas"
            leftKey="pant_Id"
            leftLabel="pant_Nombre"
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="error" onClick={onCancelar} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleGuardar} startIcon={<SaveIcon />} sx={{ ml: 2 }}>
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
    </Paper>
  );
};

export default RolesCreate;