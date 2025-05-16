import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StyledButton from 'src/components/shared/StyledButton';

const TipoEmbalajeDetailsComponent = ({ tipoEmbalaje, onCancelar }) => {
    return (
        <div>
            <Grid container spacing={3} mb={3}>
                <Grid item lg={4} md={12} sm={12}>
                    <strong>Descripción:</strong> <br/>
                    <label>{tipoEmbalaje.tiem_Descripcion}</label>
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
                            <TableCell align="center">{tipoEmbalaje?.usarioCreacion}</TableCell>
                            <TableCell align="center">{tipoEmbalaje?.tiem_FechaCreacion}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">Modificación</TableCell>
                            <TableCell align="center">{tipoEmbalaje?.usuarioModificacion}</TableCell>
                            <TableCell align="center">{tipoEmbalaje?.tiem_FechaModificacion}</TableCell>
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

export default TipoEmbalajeDetailsComponent;