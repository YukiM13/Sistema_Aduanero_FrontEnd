
import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 
import StyledButton from 'src/components/shared/StyledButton';

const ProvinciasDetailsComponent = ({provincia, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>
        <Grid container spacing={3} mb={3}> 
        <Grid item lg={4} md={12} sm={12}>
                    <label>Código:</label> <br/>
                    <label>{provincia.pvin_Codigo}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Nombre:</label> <br/>
                    <label>{provincia.pvin_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>País:</label> <br/>
                    <label>{provincia.pais_Nombre}</label>
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
                            <TableCell align="center">Creación</TableCell>
                            <TableCell align="center">{provincia.usuarioCreacionNombre}</TableCell>
                            <TableCell align="center">{provincia.pvin_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Modificación</TableCell>
                            <TableCell align="center">{provincia.usuarioModificacionNombre}</TableCell>
                            <TableCell align="center">{provincia.pvin_FechaModificacion}</TableCell>
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

export default ProvinciasDetailsComponent;
