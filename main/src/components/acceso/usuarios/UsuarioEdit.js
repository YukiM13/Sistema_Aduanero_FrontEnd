import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert, Grid, Button, MenuItem, Switch, FormControlLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import AddIcon from '@mui/icons-material/Add';

const validationSchema = yup.object({
    usua_Nombre: yup.string().required('El nombre es requerido'),
    empl_Id: yup.number().required('El empleado es requerido').moreThan(0, 'Debe seleccionar un empleado'),
    role_Id: yup.number().required('El rol es requerido').moreThan(0, 'Debe seleccionar un rol'),
    usua_Image: yup.mixed()
        .test('fileFormat', 'Formato de imagen no soportado (jpg, jpeg, png)', (value) => {
            if (value) {
                return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
            }
            return true;
        }),
});

const UsuarioEditComponent = ({ usuario, onCancelar, onGuardadoExitoso }) => {
    const [empleados, setEmpleados] = useState([]);
    const [roles, setRoles] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [previewImage, setPreviewImage] = useState(usuario?.usua_Image || null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    const listarEmpleados = () => {
        Promise.all([
            axios.get(`${apiUrl}/api/Empleados/Listar?empl_EsAduana=true`, {
                headers: { 'XApiKey': apiKey }
            }),
            axios.get(`${apiUrl}/api/Empleados/Listar?empl_EsAduana=false`, {
                headers: { 'XApiKey': apiKey }
            })
        ])
            .then(([responseTrue, responseFalse]) => {
                const empleadosCombinados = [
                    ...responseTrue.data.data,
                    ...responseFalse.data.data
                ];
                setEmpleados(empleadosCombinados.sort((a, b) => {
                    const nombreA = `${a.empl_Nombres} ${a.empl_Apellidos}`.toLowerCase();
                    const nombreB = `${b.empl_Nombres} ${b.empl_Apellidos}`.toLowerCase();
                    return nombreA.localeCompare(nombreB);
                }));
            })
            .catch(error => {
                console.error('Error al obtener los empleados:', error);
            });
    };

    const listarRoles = () => {
        Promise.all([
            axios.get(`${apiUrl}/api/Roles/Listar?role_Aduana=true`, {
                headers: { 'XApiKey': apiKey }
            }),
            axios.get(`${apiUrl}/api/Roles/Listar?role_Aduana=false`, {
                headers: { 'XApiKey': apiKey }
            })
        ])
            .then(([responseTrue, responseFalse]) => {
                const rolesCombinados = [
                    ...responseTrue.data.data,
                    ...responseFalse.data.data
                ];
                setRoles(rolesCombinados.sort((a, b) => {
                    const nombreA = a.role_Descripcion.toLowerCase();
                    const nombreB = b.role_Descripcion.toLowerCase();
                    return nombreA.localeCompare(nombreB);
                }));
            })
            .catch(error => {
                console.error('Error al obtener los roles:', error);
            });
    };

    useEffect(() => {
        listarEmpleados();
        listarRoles();
    }, []);

    const formik = useFormik({
        initialValues: {
            usua_Nombre: usuario?.usua_Nombre || '',
            empl_Id: usuario?.empl_Id || '',
            usua_esAduana: usuario?.usua_esAduana || true,
            usua_Image: null,
            role_Id: usuario?.role_Id || '',
            usua_EsAdmin: usuario?.usua_EsAdmin || false,
            usua_UsuarioModificacion: 1, // O el ID del usuario logueado
            usua_FechaModificacion: new Date(),
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                let imageUrl = previewImage;
                if (values.usua_Image) {
                    const formData = new FormData();
                    formData.append('file', values.usua_Image);
                    formData.append('upload_preset', cloudinaryUploadPreset);
                    
                    const cloudinaryResponse = await axios.post(
                        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
                        formData
                    );
                    imageUrl = cloudinaryResponse.data.secure_url;
                }

                const userData = {
                    usua_Id: usuario.usua_Id,
                    usua_Nombre: values.usua_Nombre,
                    empl_Id: values.empl_Id,
                    usua_esAduana: values.usua_esAduana,
                    usua_Image: imageUrl,
                    role_Id: values.role_Id,
                    usua_EsAdmin: values.usua_EsAdmin,
                    usua_UsuarioModificacion: values.usua_UsuarioModificacion,
                    usua_FechaModificacion: values.usua_FechaModificacion,
                };

                await axios.post(`${apiUrl}/api/Usuarios/Editar`, userData, {
                    headers: { 'XApiKey': apiKey }
                });

                if (onGuardadoExitoso) onGuardadoExitoso();
            
            } catch (error) {
                console.error('Error al editar el usuario:', error);
            }
        },
    });

    const handleImageChange = (event) => {
        formik.setFieldValue("usua_Image", event.currentTarget.files[0]);
        const file = event.currentTarget.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
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
                    <Grid item lg={12} md={12} sm={12} mx={'auto'}>
                        <CustomFormLabel htmlFor="usua_Image">Imagen</CustomFormLabel>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                            {!previewImage ? (
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 0,
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: '30px' }} />
                                    <input
                                        type="file"
                                        id="usua_Image"
                                        name="usua_Image"
                                        onChange={handleImageChange}
                                        onBlur={formik.handleBlur}
                                        hidden
                                    />
                                </Button>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={previewImage}
                                        alt="Vista previa"
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            borderRadius: '50%',
                                            border: '1px solid',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                            formik.setFieldValue('usua_Image', null);
                                            setPreviewImage(null);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            minWidth: '24px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            padding: 0,
                                        }}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            )}
                        </div>
                        {formik.touched.usua_Image && formik.errors.usua_Image && (
                            <div style={{ color: 'red', textAlign: 'center', marginTop: '5px' }}>{formik.errors.usua_Image}</div>
                        )}
                    </Grid>
                    <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel htmlFor="usua_Nombre">Nombre</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="usua_Nombre"
                            name="usua_Nombre"
                            type="text"
                            value={formik.values.usua_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.usua_Nombre && Boolean(formik.errors.usua_Nombre)}
                            helperText={formik.touched.usua_Nombre && formik.errors.usua_Nombre}
                        />
                    </Grid>
                    
                    <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel htmlFor="empl_Id">Empleado</CustomFormLabel>
                        <CustomTextField
                            select
                            fullWidth
                            id="empl_Id"
                            name="empl_Id"
                            value={formik.values.empl_Id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.empl_Id && Boolean(formik.errors.empl_Id)}
                            helperText={formik.touched.empl_Id && formik.errors.empl_Id}
                        >
                            {empleados.map((empleado) => (
                                <MenuItem key={empleado.empl_Id} value={empleado.empl_Id}>
                                    {empleado.empl_Nombres} {empleado.empl_Apellidos}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>

                    <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel htmlFor="role_Id">Rol</CustomFormLabel>
                        <CustomTextField
                            select
                            fullWidth
                            id="role_Id"
                            name="role_Id"
                            value={formik.values.role_Id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.role_Id && Boolean(formik.errors.role_Id)}
                            helperText={formik.touched.role_Id && formik.errors.role_Id}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.role_Id} value={role.role_Id}>
                                    {role.role_Descripcion}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>

                    <Grid item lg={6} md={12} sm={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.usua_EsAdmin}
                                    onChange={(event) => formik.setFieldValue('usua_EsAdmin', event.target.checked)}
                                    color="primary"
                                />
                            }
                            label="¿Es Administrador?"
                        />
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
                    Por favor, complete todos los campos requeridos.
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UsuarioEditComponent;