import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StyledButton from 'src/components/shared/StyledButton';

const UsuarioDetailsComponent = ({ usuario, onCancelar }) => {
  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" spacing={3} mb={3}>
        <Grid item>
          <Avatar
            alt={usuario?.usua_Nombre}
            src={usuario?.usua_Image}
            sx={{ width: 120, height: 120, border: '2px solid rgb(209, 209, 209)' }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={4} md={12} sm={12}>
          <label>Nombre de Usuario:</label> <br />
          <label>{usuario?.usua_Nombre}</label>
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <label>Empleado:</label> <br />
          <label>{usuario?.emplNombreCompleto}</label>
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <label>Correo Electrónico:</label> <br />
          <label>{usuario?.empl_CorreoElectronico}</label>
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <label>Rol:</label> <br />
          <label>{usuario?.role_Descripcion}</label>
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <label>Es Administrador:</label> <br />
          <label>{usuario?.usua_EsAdmin ? 'Sí' : 'No'}</label>
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
              <TableCell align="center">Creación</TableCell>
              <TableCell align="center">{usuario.usuarioCreacionNombre}</TableCell>
              <TableCell align="center">{usuario.usua_FechaCreacion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Modificación</TableCell>
              <TableCell align="center">{usuario.usuarioModificacionNombre}</TableCell>
              <TableCell align="center">{usuario.usua_FechaModificacion}</TableCell>
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

export default UsuarioDetailsComponent;