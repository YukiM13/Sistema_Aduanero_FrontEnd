

import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
    Button,
    Grid,

  } from '@mui/material';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
    emailInstant: yup.string().email('Enter a valid email').required('Email is required'),
    passwordInstant: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required')
});


   
const PersonasCreateComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
    const formik = useFormik({
        initialValues: {
          emailInstant: '',
          passwordInstant: ''
        },
        validationSchema,
        onSubmit: (values) => {
          // Simula petición
          setTimeout(() => {
            console.log('Datos guardados:', values);
            if (onGuardadoExitoso) onGuardadoExitoso(); // Vuelve a listar
          }, 1000);
        }
      });
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={6} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>Email Address</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="emailInstant"
                            name="emailInstant"
                            value={formik.values.emailInstant}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.emailInstant && Boolean(formik.errors.emailInstant)}
                            helperText={formik.touched.emailInstant && formik.errors.emailInstant}
                        />
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Password</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="passwordInstant"
                            name="passwordInstant"
                            type="password"
                            value={formik.values.passwordInstant}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.passwordInstant && Boolean(formik.errors.passwordInstant)}
                            helperText={formik.touched.passwordInstant && formik.errors.passwordInstant}
                        />
                  
                </Grid>

            </Grid>
            <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                <Grid item>
                    <Button variant="contained" color="error" onClick={onCancelar}
                         startIcon={<CancelIcon />}
                    >
                    Cancelar
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" type="submit"
                         startIcon={<SaveIcon />}
                    >
                    Guardar
                    </Button>
                </Grid>
            </Grid>
           
        </form >


     
    </div>
  );
};

export default PersonasCreateComponent;
