import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AldeasDetailsComponent = ({ aldea, onCancelar }) => {
  return (
    <div>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={6} md={12} sm={12}>
          <label>ID:</label> <br />
          <label>{aldea.alde_Id}</label>
        </Grid>
        <Grid item lg={6} md={12} sm={12}>
          <label>Nombre:</label> <br />
          <label>{aldea.alde_Nombre}</label>
        </Grid>
        <Grid item lg={6} md={12} sm={12}>
          <label>Ciudad:</label> <br />
          <label>{aldea.ciud_Nombre}</label>
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
              <TableCell align="center">{aldea.usuarioCreacionNombre}</TableCell>
              <TableCell align="center">{aldea.alde_FechaCreacion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Editar</TableCell>
              <TableCell align="center">{aldea.usuarioModificadorNombre}</TableCell>
              <TableCell align="center">{aldea.alde_FechaModificacion}</TableCell>
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

export default AldeasDetailsComponent;
