import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Box
} from '@mui/material';
import { useFormik } from 'formik';
import SaveIcon from '@mui/icons-material/Save';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { IconPrinter } from '@tabler/icons';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import { Search } from '@mui/icons-material';
import declaracionvalor from '../../../models/devaspendientesModel.js'


const Devaspendientes = () => {
    const [Devaspendientes, setdevapedientes] = useState([]);
     const formik = useFormik({
        initialValues: {
            ...declaracionvalor,
            fechaInicio: '',
            fechaFin: ''
        },

    });
    
const buscardeva = () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        const fechaInicio = formik.values.fechaInicio;
        const fechaFin = formik.values.fechaFin;
        console.log('Fecha Inicio:', fechaInicio);
        console.log('Fecha Fin:', fechaFin);
        

    axios.get(`${apiUrl}/api/Reportes/DevasPendientes?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`, {
            headers: {
                'XApiKey': apiKey
            }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
                setdevapedientes(response.data.data);
                
                console.log('Declaraciones de valor:', response.data.data);
            }
        })
        .catch(error => {
            console.error('Error al obtener las declaraciones de valor:', error);
        });
    }
return(
<div>
      <Breadcrumb title="Devas Pendientes" subtitle="Listar" />

        <ParentCard>
            <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Fecha Inicio</CustomFormLabel>
            <CustomTextField
                fullWidth
                name="fechaInicio"
                id="fechaInicio"
                type="date"
                value={formik.values.fechaInicio}
                onChange={formik.handleChange}
                error={formik.touched.fechaInicio && Boolean(formik.errors.fechaInicio)}
                helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
            />
          </Grid>
             <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Fecha Fin</CustomFormLabel>
            <CustomTextField
                fullWidth
                name="fechaFin"
                id="fechaFin"
                type="date"
                value={formik.values.fechaFin}
                onChange={formik.handleChange}
                error={formik.touched.fechaFin && Boolean(formik.errors.fechaFin)}
                helperText={formik.touched.fechaFin && formik.errors.fechaFin}
            />
          </Grid>
           <Grid item>
            <Button variant="contained" onClick={buscardeva} startIcon={<Search />}>
              Buscar
            </Button>
          </Grid>
</Grid>
<Table>
  <TableHead>
    <TableRow>
      <TableCell>ID</TableCell> 
      <TableCell>Aduana Ingreso</TableCell>
      <TableCell>Aduana Despacho</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {Devaspendientes.map((item) => (
      <TableRow key={item.deva_Id}>
        <TableCell>{item.deva_Id}</TableCell>
        <TableCell>{item.adua_IngresoNombre}</TableCell>
        <TableCell>{item.adua_DespachoNombre}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
        </ParentCard>
    </div>
    
  );
};

export default Devaspendientes;
