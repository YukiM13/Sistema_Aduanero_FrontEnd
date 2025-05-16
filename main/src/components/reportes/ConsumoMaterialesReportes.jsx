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

    const [datos, setDatos] = useState({fecha_inicio: new Date(), fecha_fin: new Date()}) ;
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());
    

    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const [consumos, setConsumos] = useState([]);

    const CargarConsumos =()=>{

      //setDatos({fecha_inicio: fechaInicio, fecha_fin: fechaFin});
      // datos.fecha_inicio = fechaInicio;
      //   datos.fecha_fin = fechaInicio;
      const parametros = {fecha_inicio: fechaInicio, fecha_fin: fechaFin};
      console.log("datosdatos", parametros);

        axios.post(`${apiUrl}/api/Reportes/Consumo_Materiales`, parametros,{
      headers: { 'XApiKey': apiKey }
    })
    .then(Response =>{ setConsumos(Response.data.data);

        console.log("cargados?", Response.data);
        // alert("??");

    })
    .catch(error => console.error('Error al obtener consumos:', error));

    }

    useEffect(() => {
        
    
    }, []);

    return(


        <div>
              <Breadcrumb title="Consumo de Materiales" subtitle="Reporte" />
        
                <ParentCard>
                    <Grid container spacing={3} mb={3}>

                  <Grid item lg={4} md={4} sm={4}>
                    <CustomFormLabel>Fecha Inicio</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        name="fechaInicio"
                        id="fechaInicio"
                        type="date"
                        value={fechaInicio}
                        onChange={e => setFechaInicio(e.target.value)}
                        //onChange={formik.handleChange}
                        //error={formik.touched.fechaInicio && Boolean(formik.errors.fechaInicio)}
                        //helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
                    />
                  </Grid>

                     <Grid item lg={4} md={4} sm={4}>
                    <CustomFormLabel>Fecha Fin</CustomFormLabel>
                    <CustomTextField
                        fullWidth
                        name="fechaFin"
                        id="fechaFin"
                        type="date"
                        value={fechaFin}
                        onChange={e => setFechaFin(e.target.value)}
                        // onChange={formik.handleChange}
                        // error={formik.touched.fechaFin && Boolean(formik.errors.fechaFin)}
                        // helperText={formik.touched.fechaFin && formik.errors.fechaFin}
                    />
                  </Grid>

                   <Grid item lg={4} md={4} sm={4}>
                    <CustomFormLabel><br/></CustomFormLabel>
                    <Button style={{width: "100%", height: "43%"}} variant="contained" onClick={CargarConsumos} startIcon={<Search />}>
                      Buscar
                    </Button>
                  </Grid>
        </Grid>

        <hr />
        <h4 className='text-center'>Vista Previa</h4>
        <hr />
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
                <TableCell>{item.mate_Descripcion}</TableCell>
                <TableCell>{item.totalMaterial}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
                </ParentCard>
            </div>
    );

}

export default ConsumoMaterialesReporte;

