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
import StyledButton from 'src/components/shared/StyledButton';
const validationSchema = yup.object({
    tiem_Descripcion: yup.string().required('La descripción es requerida'),
});

const TipoEmbalajeEditComponent = ({ tipoEmbalaje, onCancelar, onGuardadoExitoso }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const formik = useFormik({
        initialValues: tipoEmbalaje || {
            tiem_Id: 0,
            tiem_Descripcion: '',
            usua_UsuarioModificacion: 1, // Valor quemado según los parámetros
            tiem_FechaModificacion: new Date(), // Se asignará al enviar
        },
        validationSchema,
        onSubmit: (values) => {
            axios.post(`${apiUrl}/api/TipoEmbalaje/Editar`, values, {
                headers: { 'XApiKey': apiKey }
            })
                .then(() => {
                    if (onGuardadoExitoso) onGuardadoExitoso();
                })
                .catch(error => {
                    console.error('Error al editar el tipo de embalaje:', error);
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
                        <CustomFormLabel htmlFor="tiem_Descripcion">Descripción</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="tiem_Descripcion"
                            name="tiem_Descripcion"
                            type="text"
                            value={formik.values.tiem_Descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.tiem_Descripcion && Boolean(formik.errors.tiem_Descripcion)}
                            helperText={formik.touched.tiem_Descripcion && formik.errors.tiem_Descripcion}
                        />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                    <StyledButton  
                      sx={{}} 
                      title="Cancelar"
                      event={onCancelar}
                      variant="cancel"
                      >
                      
                    </StyledButton>
                    
                    <StyledButton  
                      sx={{}} 
                      title="Guardar"
                      type='submit'
                      variant="save"
                      >
                      
                    </StyledButton>
          
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

export default TipoEmbalajeEditComponent;