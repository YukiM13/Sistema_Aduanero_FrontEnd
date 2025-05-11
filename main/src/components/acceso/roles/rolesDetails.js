import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid, Typography, Paper, List, ListItem, ListItemText, Button
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const RolesDetails = ({ role, onCancelar }) => {
  const [pantallas, setPantallas] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const cargarPantallas = () => {
    axios.get(`${apiUrl}/api/RolesPorPantallas/DibujarMenu?role_Id=${role.role_Id}`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        setPantallas(response.data.data);
      })
      .catch(error => console.error('Error al obtener las pantallas:', error));
  };

  useEffect(() => {
    cargarPantallas();
  }, []);

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Detalles del Rol
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Descripción:</Typography>
          <Typography>{role.role_Descripcion}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Pantallas Asignadas:</Typography>
          <List>
            {pantallas.map((pantalla) => (
              <ListItem key={pantalla.pant_Id}>
                <ListItemText primary={pantalla.pant_Nombre} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="error" onClick={onCancelar} startIcon={<CancelIcon />}>
            Cerrar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RolesDetails;