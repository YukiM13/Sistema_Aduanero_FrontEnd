
import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 


const PersonasDetailsComponent = ({persona, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>
        <Grid container spacing={3} mb={3}> 
            <Grid item lg={4} md={12} sm={12}>
                <label>Rtn:</label> <br/>
                <label>{persona.pers_RTN}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Nombre:</label> <br/>
                    <label>{persona.pers_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Estado Civil:</label> <br/>
                    <label>{persona.escv_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Oficina:</label> <br/>
                    <label>{persona.ofic_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Oficio ó Profesion:</label> <br/>
                    <label>{persona.ofpr_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Estado Civil Representante:</label> <br/>
                    <label>{persona.estadoCivilRepresentante}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Oficio ó Profesion Representante:</label> <br/>
                    <label>{persona.oficioProfecionRepresentante}</label>
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
                            <TableCell align="center">{persona.usuarioCreacion}</TableCell>
                            <TableCell align="center">{persona.pers_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">{persona.usuarioModificacion}</TableCell>
                            <TableCell align="center">{persona.pers_FechaModificacion}</TableCell>
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

export default PersonasDetailsComponent;
