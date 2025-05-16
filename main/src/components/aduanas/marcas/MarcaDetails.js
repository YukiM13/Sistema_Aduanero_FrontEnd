
import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 

import StyledButton from 'src/components/shared/StyledButton';

const MarcaDetailsComponent = ({marca, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>

        <div className='text-center'>

        <Grid container spacing={3} mb={3}> 

            <Grid item lg={4} md={12} sm={12}>
                <label>ID:</label> <br/>
                <label>{marca.marc_Id}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Descripcion:</label> <br/>
                    <label>{marca.marc_Descripcion}</label>
            </Grid>
            
            
        
        </Grid>

        </div>
        
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
                            <TableCell align="center">{marca.usuarioCreacionNombre}</TableCell>
                            <TableCell align="center">{marca.marc_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">{marca.usuarioModificacionNombre}</TableCell>
                            <TableCell align="center">{marca.marc_FechaModificacion}</TableCell>
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

export default MarcaDetailsComponent;
