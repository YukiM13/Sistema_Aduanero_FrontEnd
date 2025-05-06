/*import React from 'react';
import {
    Grid,
    Button,
    Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';*/

const UsuarioDetailsComponent = ({ usuario, onCancelar }) => {
    return (/*
        <div>
            <Grid container spacing={3} mb={3}>
                <Grid item lg={12} md={12} sm={12}>
                    <Typography variant="h6" gutterBottom>
                        Detalles del Usuario
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Avatar
                        alt={usuario?.usua_NombreCompleto}
                        src={usuario?.usua_ImagenPerfil}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    <Typography variant="subtitle1">
                        <strong>ID:</strong> {usuario?.usua_Id}
                    </Typography>
                    <Typography variant="subtitle1">
                        <strong>Nombre de Usuario:</strong> {usuario?.usua_NombreUsuario}
                    </Typography>
                    <Typography variant="subtitle1">
                        <strong>Nombre Completo:</strong> {usuario?.usua_NombreCompleto}
                    </Typography>
                    <Typography variant="subtitle1">
                        <strong>Email:</strong> {usuario?.usua_Email}
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Usuario Creación:</strong> {usuario?.usua_UsuarioCreacion}
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Fecha Creación:</strong> {usuario?.usua_FechaCreacion}
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Usuario Modificación:</strong> {usuario?.usua_UsuarioModificacion}
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Fecha Modificación:</strong> {usuario?.usua_FechaModificacion}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={onCancelar} startIcon={<ArrowBackIcon />}>
                        Regresar
                    </Button>
                </Grid>
            </Grid>
        </div>*/
        <p>ola</p>
    );
};

export default UsuarioDetailsComponent;