import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button } from '@mui/material';

const UsuarioDetailsComponent = ({ usuario, onCancelar }) => {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                        <Avatar
                            alt={usuario?.usua_Nombre}
                            src={usuario?.usua_Image}
                            sx={{ width: 120, height: 120 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h5" gutterBottom>
                            Detalles del Usuario
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Información básica del usuario.
                        </Typography>
                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Nombre de Usuario:</strong> {usuario?.usua_Nombre}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Empleado:</strong> {usuario?.emplNombreCompleto}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Correo Electrónico:</strong> {usuario?.empl_CorreoElectronico}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Rol:</strong> {usuario?.role_Descripcion}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Es Administrador:</strong> {usuario?.usua_EsAdmin ? 'Sí' : 'No'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <strong>Es de Aduana:</strong> {usuario?.usua_esAduana ? 'Sí' : 'No'}
                                </Typography>
                            </Grid>
                            {usuario?.usua_UsuarioCreacion && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Usuario de Creación ID:</strong> {usuario.usua_UsuarioCreacion}
                                    </Typography>
                                </Grid>
                            )}
                            {usuario?.usua_FechaCreacion && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Fecha de Creación:</strong> {new Date(usuario.usua_FechaCreacion).toLocaleDateString()} {new Date(usuario.usua_FechaCreacion).toLocaleTimeString()}
                                    </Typography>
                                </Grid>
                            )}
                            {usuario?.usua_UsuarioModificacion && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Usuario de Modificación ID:</strong> {usuario.usua_UsuarioModificacion}
                                    </Typography>
                                </Grid>
                            )}
                            {usuario?.usua_FechaModificacion && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Fecha de Modificación:</strong> {new Date(usuario.usua_FechaModificacion).toLocaleDateString()} {new Date(usuario.usua_FechaModificacion).toLocaleTimeString()}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end" mt={3}>
                            <Button variant="contained" color="error" onClick={onCancelar} startIcon={<CancelIcon />}>
                                Cerrar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default UsuarioDetailsComponent;