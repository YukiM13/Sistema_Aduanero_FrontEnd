import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const RolesDetails = ({ role, onCancelar }) => {
  const [pantallas, setPantallas] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const cargarPantallas = () => {
    axios
      .get(`${apiUrl}/api/RolesPorPantallas/DibujarMenu?role_Id=${role.role_Id}`, {
        headers: { 'XApiKey': apiKey },
      })
      .then((response) => {
        setPantallas(response.data.data);
      })
      .catch((error) => console.error('Error al obtener las pantallas:', error));
  };

  useEffect(() => {
    cargarPantallas();
  }, []);

  return (
    <div>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={4} md={12} sm={12}>
          <label>Descripción del Rol:</label> <br />
          <label>{role.role_Descripcion}</label>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Pantallas Asignadas:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              p: 2,
              borderRadius: 2,
            }}
          >
            {pantallas.map((pantalla) => (
              <Box
                key={pantalla.pant_Id}
                sx={{
                  backgroundColor: '#e3f2fd',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  color: '#0d47a1',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                {pantalla.pant_Nombre}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Acción</TableCell>
              <TableCell align="center">Usuario</TableCell>
              <TableCell align="center">Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">Creación</TableCell>
              <TableCell align="center">{role.usuarioCreacionNombre}</TableCell>
              <TableCell align="center">{role.role_FechaCreacion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Modificación</TableCell>
              <TableCell align="center">{role.usuarioModificadorNombre}</TableCell>
              <TableCell align="center">{role.role_FechaModificacion}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="flex-end" spacing={2} mt={2}>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={onCancelar}
            startIcon={<ArrowBackIcon />}
          >
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default RolesDetails;