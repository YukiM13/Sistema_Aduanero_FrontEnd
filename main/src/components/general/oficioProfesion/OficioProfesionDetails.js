
import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 


const OficioDetailsComponent = ({oficioProfesion, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>
        <Grid container spacing={3} mb={3}> 
            
            <Grid item lg={4} md={12} sm={12}>
                    <label>Descripción:</label> <br/>
                    <label>{oficioProfesion.ofpr_Nombre}</label>
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
                            <TableCell align="center">{oficioProfesion.usuarioCreacionNombre}</TableCell>
                            <TableCell align="center">{oficioProfesion.ofpr_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">{oficioProfesion.usuarioModificacionNombre}</TableCell>
                            <TableCell align="center">{oficioProfesion.ofpr_FechaModificacion}</TableCell>
                          </TableRow>
                       
                      </TableBody>
                    </Table>
                  </TableContainer>
                    <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={onCancelar}
                            startIcon={<ArrowBackIcon />}>
                                Regresar
                            </Button>
                        </Grid>
                    </Grid>
      
        
     
    </div>
  );
};

export default OficioDetailsComponent;
