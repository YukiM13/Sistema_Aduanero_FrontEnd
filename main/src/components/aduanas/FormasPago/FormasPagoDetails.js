import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FormasDePagoDetailsComponent = ({ formaPago, onCancelar }) => {
  return (
    <div>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={4} md={12} sm={12}>
          <label>Descripción:</label> <br />
          <label>{formaPago.fopa_Descripcion}</label>
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
              <TableCell align="center">{formaPago.usua_NombreCreacion || 'No disponible'}</TableCell>
              <TableCell align="center">{new Date(formaPago.fopa_FechaCreacion).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Editar</TableCell>
              <TableCell align="center">{formaPago.usua_NombreModificacion || 'No disponible'}</TableCell>
              <TableCell align="center">{new Date(formaPago.fopa_FechaModificacion).toLocaleString()}</TableCell>
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

export default FormasDePagoDetailsComponent;
