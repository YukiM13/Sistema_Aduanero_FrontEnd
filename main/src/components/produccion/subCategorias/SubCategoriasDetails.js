import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SubCategoriasDetails = ({ subcategoria, onCancelar }) => {
  return (
    <div>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={4} md={12} sm={12}>
          <label>ID:</label> <br />
          <label>{subcategoria.subc_Id}</label>
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <label>Descripción:</label> <br />
          <label>{subcategoria.subc_Descripcion}</label>
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <label>Categoría:</label> <br />
          <label>{subcategoria.cate_Descripcion}</label>
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
              <TableCell align="center">{subcategoria.usuarioCreacionNombre}</TableCell>
              <TableCell align="center">{subcategoria.subc_FechaCreacion}</TableCell>
            </TableRow>
            {subcategoria.usua_UsuarioModificacion > 0 && (
              <TableRow>
                <TableCell align="center">Editar</TableCell>
                <TableCell align="center">{subcategoria.usuarioModificacionNombre}</TableCell>
                <TableCell align="center">{subcategoria.subc_FechaModificacion}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="flex-end" spacing={2} mt={2}>
        <Grid item>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={onCancelar}
            startIcon={<ArrowBackIcon style={{ fontSize: '18px' }} />}
          >
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SubCategoriasDetails;
