
import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 
import StyledButton from 'src/components/shared/StyledButton';

const EmpleadoDetailsComponent = ({empleado, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>
        <Grid container spacing={3} mb={3}> 
            <Grid item lg={4} md={12} sm={12}>
                <label>Rtn:</label> <br/>
                <label>{empleado.empl_DNI}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Nombre:</label> <br/>
                    <label>{empleado.empl_NombreCompleto}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Correo:</label> <br/>
                    <label>{empleado.empl_CorreoElectronico}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Estado Civil:</label> <br/>
                    <label>{empleado.escv_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Sexo:</label> <br/>
                    <label>{empleado.empl_Sexo}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Fecha Nacimiento:</label> <br/>
                    <label>{empleado.empl_FechaNacimiento}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Telefono:</label> <br/>
                    <label>{empleado.empl_Telefono}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Cargo:</label> <br/>
                    <label>{empleado.carg_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Direccion Exacta:</label> <br/>
                    <label>{empleado.empl_DireccionExacta}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Provincia:</label> <br/>
                    <label>{empleado.pvin_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Pais:</label> <br/>
                    <label>{empleado.pais_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Estado:</label> <br/>
                    <label>{empleado.empl_Estado? 'Activo':'Inactivo'}</label>
            </Grid>
        
        </Grid>
        <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Accion</TableCell>
                          <TableCell align="center">Usuario</TableCell>
                          <TableCell align="center">Fecha</TableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                       
                          <TableRow >
                            <TableCell align="center">Crear</TableCell>
                            <TableCell align="center">{empleado.usuarioCreacionNombre}</TableCell>
                            <TableCell align="center">{empleado.empl_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">{empleado.usuarioModificacionNombre}</TableCell>
                            <TableCell align="center">{empleado.empl_FechaModificacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">{empleado.empl_Estado? 'Activacion':'Eliminacion'}</TableCell>
                            <TableCell align="center">{empleado.empl_Estado? empleado.usuarioActivacionNombre: empleado.usuarioEliminacionNombre}</TableCell>
                            <TableCell align="center">{empleado.empl_Estado? empleado.empl_FechaActivacion: empleado.empl_FechaEliminacion}</TableCell>
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

export default EmpleadoDetailsComponent;
