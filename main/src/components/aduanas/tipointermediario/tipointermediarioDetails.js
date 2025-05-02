import React from 'react';
import {
    Grid,  Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TipoIntermediarioDetailsComponent = ({ tipoIntermediario, onCancelar }) => {
    return (
        <div>
            <Grid container spacing={3} mb={3}>
                <Grid item lg={4} md={12} sm={12}>
                    <strong>Código:</strong> <br/>
                    <label>{tipoIntermediario?.tite_Codigo}</label>
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <strong>Descripción:</strong> <br/>
                    <label>{tipoIntermediario?.tite_Descripcion}</label>
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
                            <TableCell align="center">{tipoIntermediario?.usarioCreacion}</TableCell>
                            <TableCell align="center">{tipoIntermediario?.tite_FechaCreacion}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">Modificación</TableCell>
                            <TableCell align="center">{tipoIntermediario?.usuarioModificacion}</TableCell>
                            <TableCell align="center">{tipoIntermediario?.tite_FechaModificacion}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={onCancelar} startIcon={<ArrowBackIcon />}>
                        Regresar
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default TipoIntermediarioDetailsComponent;