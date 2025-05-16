import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
  } from '@mui/material';
  import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 


const ProveedoresDetailsComponent = ({proveedor, onCancelar }) => { //esto es lo que manda para saber cuando cerrar el crear
 
  

    return (
    <div>
        <Grid container spacing={3} mb={3}> 
            <Grid item lg={4} md={12} sm={12}>
                <label>Nombre de la compañía:</label> <br/>
                <label>{proveedor.prov_NombreCompania}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Contacto:</label> <br/>
                    <label>{proveedor.prov_NombreContacto}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Teléfono:</label> <br/>
                    <label>{proveedor.prov_Telefono}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Ciudad:</label> <br/>
                    <label>{proveedor.ciud_Nombre}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Contacto:</label> <br/>
                    <label>{proveedor.prov_DireccionExacta}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Correo electrónico:</label> <br/>
                    <label>{proveedor.prov_CorreoElectronico}</label>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                    <label>Fax:</label> <br/>
                    <label>{proveedor.prov_Fax}</label>
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
                       
                          <TableRow >
                            <TableCell align="center">Crear</TableCell>
                            <TableCell align="center">{proveedor.usuarioCreacion}</TableCell>
                            <TableCell align="center">{proveedor.prov_FechaCreacion}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">{proveedor.usuarioModificacion}</TableCell>
                            <TableCell align="center">{proveedor.prov_FechaModificacion}</TableCell>
                          </TableRow>
                       
                      </TableBody>
                    </Table>
                  </TableContainer>
                    <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={onCancelar}
                            startIcon={<ArrowBackIcon />}>
                                Regresar
                            </Button>
                        </Grid>
                    </Grid>
      
        
     
    </div>
  );
};

export default ProveedoresDetailsComponent;
