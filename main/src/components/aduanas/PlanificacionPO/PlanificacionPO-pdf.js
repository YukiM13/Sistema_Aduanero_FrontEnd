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
import PlanificacionPoModel from 'src/models/planificacionpomodel';
import { values } from 'lodash';



const Devaspendientes = () => {
    const [Devaspendientes, setdevapedientes] = useState([]);
     const formik = useFormik({
        initialValues: {
          ...PlanificacionPoModel, orco_id: 0
        },

    });
    
const buscarplanificacionPO = () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        const orco_id = formik.values.orco_id;
    

   axios.get(`${apiUrl}/api/Reportes/PlanificacionPO/${values}`, {
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
                name="orco_id"
                id="orco_id"
                type="number"
                value={formik.values.orco_id}
                onChange={formik.handleChange}
                error={formik.touched.orco_id && Boolean(formik.errors.orco_id)}
                helperText={formik.touched.orco_id && formik.errors.orco_id}
            />
          </Grid>
           
           <Grid item>
            <Button variant="contained" onClick={buscarplanificacionPO} startIcon={<Search />}>
              Buscar
            </Button>
          </Grid>
</Grid>
        </ParentCard>
    </div>
  );
};

export default Devaspendientes;