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
    tite_Codigo: yup.string().required('El código es requerido'),
    tite_Descripcion: yup.string().required('La descripción es requerida'),
});

const TipoIntermediarioEditComponent = ({ tipoIntermediario, onCancelar, onGuardadoExitoso }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const formik = useFormik({
        initialValues: tipoIntermediario || {
            tite_Id: 0,
            tite_Codigo: '',
            tite_Descripcion: '',
            usua_UsuarioModificacion: 1,
            tite_FechaModificacion: new Date(),
        },
        validationSchema,
        onSubmit: (values) => {
            axios.post(`${apiUrl}/api/TipoIntermediario/Editar`, values, {
                headers: { 'XApiKey': apiKey }
            })
                .then(() => {
                    if (onGuardadoExitoso) onGuardadoExitoso();
                })
                .catch(error => {
                    console.error('Error al editar el tipo de intermediario:', error);
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
                    <Grid item lg={6} md={6} sm={12}>
                        <CustomFormLabel htmlFor="tite_Codigo">Código</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="tite_Codigo"
                            name="tite_Codigo"
                            type="text"
                            value={formik.values.tite_Codigo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.tite_Codigo && Boolean(formik.errors.tite_Codigo)}
                            helperText={formik.touched.tite_Codigo && formik.errors.tite_Codigo}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12}>
                        <CustomFormLabel htmlFor="tite_Descripcion">Descripción</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="tite_Descripcion"
                            name="tite_Descripcion"
                            type="text"
                            value={formik.values.tite_Descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.tite_Descripcion && Boolean(formik.errors.tite_Descripcion)}
                            helperText={formik.touched.tite_Descripcion && formik.errors.tite_Descripcion}
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

export default TipoIntermediarioEditComponent;