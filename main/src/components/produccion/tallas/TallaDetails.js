
import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 
import StyledButton from 'src/components/shared/StyledButton';

const TallaDetailsComponent = ({Talla, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>

        <div className='text-center'>

        <Grid container spacing={3} mb={3}> 

            <Grid item lg={4} md={12} sm={12}>
                <label>ID:</label> <br/>
                <label>{Talla.tall_Id}</label>
            </Grid>

            <Grid item lg={4} md={12} sm={12}>
                    <label>Codigo:</label> <br/>
                    <label>{Talla.tall_Codigo}</label>
            </Grid>

            <Grid item lg={4} md={12} sm={12}>
                    <label>Descripcion:</label> <br/>
                    <label>{Talla.tall_Nombre}</label>
            </Grid>
            
            
        
        </Grid>

        </div>

        <hr/>
        
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
                            <TableCell align="center">{Talla.usarioCreacion}</TableCell>
                            <TableCell align="center">{Talla.tall_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">{Talla.usuarioModificacion}</TableCell>
                            <TableCell align="center">{Talla.tall_FechaModificacion}</TableCell>
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

export default TallaDetailsComponent;
