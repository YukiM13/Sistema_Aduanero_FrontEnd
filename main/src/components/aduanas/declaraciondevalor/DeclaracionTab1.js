
import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Button,
  MenuItem,
  Typography,
  FormControlLabel,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';
import { Stack } from '@mui/system';


const Tab1 = () => {
    return (
        <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                <Grid item lg={6} md={12} sm={12}> {/* Esto es como el div con class col-md-6 */}
                  
                        <CustomFormLabel>RTN</CustomFormLabel>
                        <InputMask
                          mask="9999-9999-999999"
                          maskChar={null}
                          value={formik.values.pers_RTN}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={false}
                        >
                          {(inputProps) => (
                            <CustomTextField
                              {...inputProps}
                              fullWidth
                              id="pers_RTN"
                              name="pers_RTN"
                              error={formik.touched.pers_RTN && Boolean(formik.errors.pers_RTN)}
                              helperText={formik.touched.pers_RTN && formik.errors.pers_RTN}
                            />
                          )}
                        </InputMask>
                 
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Nombres</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="pers_Nombre"
                            name="pers_Nombre"
                            type="text"
                            value={formik.values.pers_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.pers_Nombre && Boolean(formik.errors.pers_Nombre)}
                            helperText={formik.touched.pers_Nombre && formik.errors.pers_Nombre}
                        />
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                <CustomFormLabel>Estado Civil</CustomFormLabel>
                <CustomTextField
                  select
                  fullWidth
                  id="escv_Id"
                  name="escv_Id"
                  value={formik.values.escv_Id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.escv_Id && Boolean(formik.errors.escv_Id)}
                  helperText={formik.touched.escv_Id && formik.errors.escv_Id}
                >
                  {estadosCiviles.map((estado) => (
                    <MenuItem key={estado.escv_Id} value={estado.escv_Id}>
                      {estado.escv_Nombre}
                    </MenuItem>
                  ))}
                </CustomTextField>
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Oficina</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="ofic_Id"
                          name="ofic_Id"
                          value={formik.values.ofic_Id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.ofic_Id && Boolean(formik.errors.ofic_Id)}
                          helperText={formik.touched.ofic_Id && formik.errors.ofic_Id}
                        >
                          {oficinas.map((estado) => (
                            <MenuItem key={estado.ofic_Id} value={estado.ofic_Id}>
                              {estado.ofic_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Oficio ó Profesion</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="ofpr_Id"
                          name="ofpr_Id"
                          value={formik.values.ofpr_Id}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.ofpr_Id && Boolean(formik.errors.ofpr_Id)}
                          helperText={formik.touched.ofpr_Id && formik.errors.ofpr_Id}
                        >
                          {oficioProfesion.map((estado) => (
                            <MenuItem key={estado.ofpr_Id} value={estado.ofpr_Id}>
                              {estado.ofpr_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Estado Civil Representante</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="pers_escvRepresentante"
                          name="pers_escvRepresentante"
                          value={formik.values.pers_escvRepresentante}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.pers_escvRepresentante && Boolean(formik.errors.pers_escvRepresentante)}
                          helperText={formik.touched.pers_escvRepresentante && formik.errors.pers_escvRepresentante}
                        >
                          {estadosCiviles.map((estado) => (
                            <MenuItem key={estado.escv_Id} value={estado.escv_Id}>
                              {estado.escv_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Oficio ó Profesion Representante</CustomFormLabel>
                        <CustomTextField
                          select
                          fullWidth
                          id="pers_OfprRepresentante"
                          name="pers_OfprRepresentante"
                          value={formik.values.pers_OfprRepresentante}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.pers_OfprRepresentante && Boolean(formik.errors.pers_OfprRepresentante)}
                          helperText={formik.touched.pers_OfprRepresentante && formik.errors.pers_OfprRepresentante}
                        >
                          {oficioProfesion.map((estado) => (
                            <MenuItem key={estado.ofpr_Id} value={estado.ofpr_Id}>
                              {estado.ofpr_Nombre}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                  
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
    );
}

export default Tab1;