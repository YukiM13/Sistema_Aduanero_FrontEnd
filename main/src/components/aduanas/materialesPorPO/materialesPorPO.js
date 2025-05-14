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
import materialesporcompra from '../../../models/materialesporpoModel.js'


const Materialesporpo = () => {
    const [Materialesporpo, setmaterialesporpo] = useState([]);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        axios.get(`${apiUrl}/api/OrdenCompra/Listar`, {
            headers: {
                'XApiKey': apiKey
            }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
                setmaterialesporpo(response.data.data);
                
                console.log('Declaraciones de valor:', response.data.data);
            }
        })
        .catch(error => {
            console.error('Error al obtener las declaraciones de valor:', error);
        });
    }, []);
     const formik = useFormik({
        initialValues: {
            ...materialesporcompra

        },

    });
    
const buscarmaterialesporpo = () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        const fechaInicio = formik.values.fechaInicio;
        const fechaFin = formik.values.fechaFin;
        console.log('Fecha Inicio:', fechaInicio);
        console.log('Fecha Fin:', fechaFin);
        

    axios.get(`${apiUrl}/api/OrdenCompra/Listar`, {
            headers: {
                'XApiKey': apiKey
            }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
                setmaterialesporpo(response.data.data);
                
                console.log('Declaraciones de valor:', response.data.data);
            }
        })
        .catch(error => {
            console.error('Error al obtener las declaraciones de valor:', error);
        });
    }
return(
<div>
      <Breadcrumb title="Materiales por Orden de compra" subtitle="Listar" />

        <ParentCard>
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
{Materialesporpo.length > 0 && (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Acciones</TableCell>
        <TableCell>ID</TableCell> 
        <TableCell>Aduana Ingreso</TableCell>
        <TableCell>Aduana Despacho</TableCell>
        <TableCell>Creado</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Materialesporpo.map((item) => (
        <TableRow key={item.deva_Id}>
           <TableCell>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPrinter />}
              onClick={() => {
                console.log('Imprimir reporte para ID:', item.deva_Id);
              }}
            >
              Imprimir
            </Button>
          </TableCell>
          <TableCell>{item.deva_Id}</TableCell>
          <TableCell>{item.adua_IngresoNombre}</TableCell>
          <TableCell>{item.adua_DespachoNombre}</TableCell>
          <TableCell>{new Date(item.deva_FechaCreacion).toLocaleDateString()}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)}

        </ParentCard>
    </div>
    
  );
};


export default Materialesporpo;