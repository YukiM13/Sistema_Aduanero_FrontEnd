/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,
    TextField,
    Box,
    IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Typography from '@mui/material/Typography';

const validationSchema = yup.object({
    usua_NombreUsuario: yup.string().required('El nombre de usuario es requerido'),
    usua_NombreCompleto: yup.string().required('El nombre completo es requerido'),
    usua_Email: yup.string().email('Ingrese un email válido').required('El email es requerido'),
    usua_ImagenPerfil: yup.string(), // Por ahora manejamos la URL como string
});*/

const UsuarioEditComponent = ({ usuario, onCancelar, onGuardadoExitoso }) => {
    /*
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [imagenPerfil, setImagenPerfil] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const formik = useFormik({
        initialValues: usuario || {
            usua_Id: 0,
            usua_NombreUsuario: '',
            usua_NombreCompleto: '',
            usua_Email: '',
            usua_Contrasena: '', // No mostrar la contraseña para editar por seguridad
            usua_ImagenPerfil: '',
            usua_UsuarioModificacion: 1, // Valor quemado según los parámetros
            usua_FechaModificacion: new Date(), // Se asignará al enviar
        },
        validationSchema,
        onSubmit: (values) => {
            const dataToSend = { ...values };
            if (imagenPerfil) {
                dataToSend.usua_ImagenPerfil = 'La imagen deberia ir aca'; // Por ahora la URL simulada
                // Aquí iría la lógica para subir la imagen al servidor y obtener la URL
            }

            axios.post(`${apiUrl}/api/Usuarios/Editar`, dataToSend, {
                headers: { 'XApiKey': apiKey }
            })
                .then(() => {
                    if (onGuardadoExitoso) onGuardadoExitoso();
                })
                .catch(error => {
                    console.error('Error al editar el usuario:', error);
                });
        },
    });

    const handleImagenChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagenPerfil(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('usua_ImagenPerfil', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
            setOpenSnackbar(true);
        }
    }, [formik.errors, formik.submitCount]);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} sm={6}>
                        <CustomFormLabel htmlFor="usua_NombreUsuario">Nombre de Usuario</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="usua_NombreUsuario"
                            name="usua_NombreUsuario"
                            type="text"
                            value={formik.values.usua_NombreUsuario}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.usua_NombreUsuario && Boolean(formik.errors.usua_NombreUsuario)}
                            helperText={formik.touched.usua_NombreUsuario && formik.errors.usua_NombreUsuario}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomFormLabel htmlFor="usua_NombreCompleto">Nombre Completo</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="usua_NombreCompleto"
                            name="usua_NombreCompleto"
                            type="text"
                            value={formik.values.usua_NombreCompleto}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.usua_NombreCompleto && Boolean(formik.errors.usua_NombreCompleto)}
                            helperText={formik.touched.usua_NombreCompleto && formik.errors.usua_NombreCompleto}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomFormLabel htmlFor="usua_Email">Email</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="usua_Email"
                            name="usua_Email"
                            type="email"
                            value={formik.values.usua_Email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.usua_Email && Boolean(formik.errors.usua_Email)}
                            helperText={formik.touched.usua_Email && formik.errors.usua_Email}
                        />
                    </Grid>
                    {/* No se permite editar la contraseña desde aquí por seguridad *}
                    /*
                    <Grid item xs={12}>
                        <CustomFormLabel htmlFor="usua_ImagenPerfil">Imagen de Perfil</CustomFormLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                id="usua_ImagenPerfil"
                                name="usua_ImagenPerfil"
                                type="text"
                                value={formik.values.usua_ImagenPerfil}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <IconButton color="primary" aria-label="upload picture" component="label">
                                <input hidden accept="image/*" type="file" onChange={handleImagenChange} />
                                <PhotoCamera />
                            </IconButton>
                            {formik.values.usua_ImagenPerfil && (
                                <Box sx={{ ml: 2 }}>
                                    <img src={formik.values.usua_ImagenPerfil} alt="Vista previa" style={{ height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                                </Box>
                            )}
                            {imagenPerfil && (
                                <Box sx={{ ml: 2 }}>
                                    <img src={formik.values.usua_ImagenPerfil} alt="Nueva vista previa" style={{ height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                                </Box>
                            )}
                        </Box>
                        {formik.touched.usua_ImagenPerfil && formik.errors.usua_ImagenPerfil && (
                            <Typography color="error" variant="caption">{formik.errors.usua_ImagenPerfil}</Typography>
                        )}
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                    <Grid item>
                        <Button variant="contained" color="error" onClick={onCancelar} startIcon={<CancelIcon />}>
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" type="submit" startIcon={<SaveIcon />}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                    No puede haber campos vacíos.
                </Alert>
            </Snackbar>
        </div>
    );*/
};

export default UsuarioEditComponent;