import React, {useEffect, useState} from 'react';
import axios from 'axios';

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AlignHorizontalRight, Margin, PrintSharp } from "@mui/icons-material";
import Box from "@mui/material/Box";

import html2pdf from "html2pdf.js";

import { storage } from '../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';

import { duration } from "@mui/material";
import { any } from 'prop-types';


import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import SaveIcon from '@mui/icons-material/Save';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../components/shared/ParentCard';
import { IconPrinter } from '@tabler/icons';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import { Search } from '@mui/icons-material';
import declaracionvalor from '../../models/devaspendientesModel.js'


const ConsumoMaterialesReporte = ()=>{

    var datos = {fecha_inicio: new Date(), fecha_fin: new Date()};
    var fechaInicio ;
    var fechaFin ;

    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const [consumos, setConsumos] = useState([]);

    const CargarConsumos = ()=>{

        datos.fecha_inicio = fechaInicio;
        datos.fecha_fin = fechaInicio;

        axios.get(`${apiUrl}/api/Reportes/Consumo_Materiales`, datos,{
      headers: { 'XApiKey': apiKey }
    })
    .then(data =>{ setConsumos(data);

        console.log("cargados?", data);
        alert();

    })
    .catch(error => console.error('Error al obtener las Ducas:', error));

    }

    useEffect(() => {
        
    
    }, []);

    return(


        <div>
              <Breadcrumb title="Consumo de Materiales" subtitle="Reporte" />
        
                <ParentCard>
                    <Grid container spacing={3} mb={3}>

                  <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Fecha Inicio</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        name="fechaInicio"
                        id="fechaInicio"
                        type="date"
                        value={fechaInicio}
                        //onChange={formik.handleChange}
                        //error={formik.touched.fechaInicio && Boolean(formik.errors.fechaInicio)}
                        //helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
                    />
                  </Grid>

                     <Grid item lg={6} md={12} sm={12}>
                    <CustomFormLabel>Fecha Fin</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        name="fechaFin"
                        id="fechaFin"
                        type="date"
                        value={fechaFin}
                        // onChange={formik.handleChange}
                        // error={formik.touched.fechaFin && Boolean(formik.errors.fechaFin)}
                        // helperText={formik.touched.fechaFin && formik.errors.fechaFin}
                    />
                  </Grid>

                   <Grid item>
                    <Button variant="contained" onClick={CargarConsumos()} startIcon={<Search />}>
                      Buscar
                    </Button>
                  </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Material</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumos.map((item) => (
              <TableRow key={item.mate_Descripcion}>
                <TableCell>{item.TotalMaterial}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
                </ParentCard>
            </div>
    );

}

export default ConsumoMaterialesReporte;

