import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FormasEnvioDetailsComponent = ({ formaEnvio, onCancelar }) => {
  return (
    <div>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={4} md={6} sm={12}>
          <label><strong>Código:</strong></label> <br />
          <label>{formaEnvio.foen_Codigo}</label>
        </Grid>
        <Grid item lg={4} md={6} sm={12}>
          <label><strong>Descripción:</strong></label> <br />
          <label>{formaEnvio.foen_Descripcion}</label>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
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
              <TableCell align="center">Crear</TableCell>
              <TableCell align="center">{formaEnvio.usuarioCreacionNombre}</TableCell>
              <TableCell align="center">{formaEnvio.foen_fechaCreacion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Editar</TableCell>
              <TableCell align="center">{formaEnvio.usuarioModificacionNombre}</TableCell>
              <TableCell align="center">{formaEnvio.foen_fechaModificacion}</TableCell>
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

export default FormasEnvioDetailsComponent;
