import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
    unme_Descripcion: yup.string().required('La descripción es requerida'),
});

const UnidadMedidaEditComponent = ({ unidadMedida, onCancelar, onGuardadoExitoso }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const formik = useFormik({
        initialValues: unidadMedida || {
            unme_Id: 0,
            unme_Descripcion: '',
            usua_UsuarioModificacion: 1, // Valor quemado según los parámetros
            unme_FechaModificacion: new Date(), // Se asignará al enviar
        },
        validationSchema,
        onSubmit: (values) => {
            axios.post(`${apiUrl}/api/UnidadMedidas/Editar`, values, {
                headers: { 'XApiKey': apiKey }
            })
                .then(() => {
                    if (onGuardadoExitoso) onGuardadoExitoso();
                })
                .catch(error => {
                    console.error('Error al editar la unidad de medida:', error);
                });
        },
    });

    useEffect(() => {
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
            setOpenSnackbar(true);
        }
    }, [formik.errors, formik.submitCount]);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} mb={3}>
                    <Grid item lg={12} md={12} sm={12}>
                        <CustomFormLabel htmlFor="unme_Descripcion">Descripción</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="unme_Descripcion"
                            name="unme_Descripcion"
                            type="text"
                            value={formik.values.unme_Descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.unme_Descripcion && Boolean(formik.errors.unme_Descripcion)}
                            helperText={formik.touched.unme_Descripcion && formik.errors.unme_Descripcion}
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
                    No puede haber campos vacíos.
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UnidadMedidaEditComponent;