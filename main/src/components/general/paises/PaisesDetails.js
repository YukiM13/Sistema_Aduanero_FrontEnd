
import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 


const CiudadesDetailsComponent = ({ciudad, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>
        <Grid container spacing={3} mb={3}> 
            <Grid item lg={4} md={12} sm={12}>
                <label>Nombre:</label> <br/>
                <label>{ciudad.ciud_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                <label>Provincia:</label> <br/>
                <label>{ciudad.pvin_Nombre}</label>
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
                            <TableCell align="center">{ciudad.usuarioCreacionNombre}</TableCell>
                            <TableCell align="center">{ciudad.ciud_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">{ciudad.usuarioModificacionNombre}</TableCell>
                            <TableCell align="center">{ciudad.ciud_FechaModificacion}</TableCell>
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

export default CiudadesDetailsComponent;
