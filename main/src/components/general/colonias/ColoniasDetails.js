import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StyledButton from 'src/components/shared/StyledButton';

const ColoniasDetailsComponent = ({ colonia, onCancelar }) => {
  return (
    <div>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={6} md={12} sm={12}>
          <label>ID:</label> <br />
          <label>{colonia.colo_Id}</label>
        </Grid>
        <Grid item lg={6} md={12} sm={12}>
          <label>Nombre:</label> <br />
          <label>{colonia.colo_Nombre}</label>
        </Grid>
        <Grid item lg={6} md={12} sm={12}>
          <label>Ciudad:</label> <br />
          <label>{colonia.ciud_Nombre}</label>
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
              <TableCell align="center">{colonia.usuarioCreacionNombre}</TableCell>
              <TableCell align="center">{colonia.colo_FechaCreacion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Editar</TableCell>
              <TableCell align="center">{colonia.usuarioModificacionNombre}</TableCell>
              <TableCell align="center">{colonia.colo_FechaModificacion}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justifyContent="flex-end" spacing={2} mt={2}>
        <Grid item>
        <StyledButton           
                  sx={{}} 
                  title='Regresar' 
                  event={onCancelar}
                  variant='back'
                  >
                  
                </StyledButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default ColoniasDetailsComponent;
