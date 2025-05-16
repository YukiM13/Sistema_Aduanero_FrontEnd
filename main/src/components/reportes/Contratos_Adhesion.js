import React, {useEffect, useState, useRef} from 'react';
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


import { MenuItem,
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
import { Search, PictureAsPdf } from '@mui/icons-material';
import declaracionvalor from '../../models/devaspendientesModel.js'


const ReporteContratosAdhesion = () => {
  const [resultado, setResultado] = useState([]);
  const tablaRef = useRef();

  const [filtro, setFiltro] = useState({
    tipoContrato: '',
    fechaInicio: '',
    fechaFin: ''
  });

const contentRef = useRef();
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const tiposContrato = [
    { label: 'Persona Natural', value: 'PN' },
    { label: 'Persona Jurídica', value: 'PJ' },
    { label: 'Comerciante Individual', value: 'CI' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro({ ...filtro, [name]: value });
  };


  // Obtener datos
  const obtenerDatos = async () => {

    if (!filtro.tipoContrato || !filtro.fechaInicio || !filtro.fechaFin) {
        alert('Por favor, complete todos los filtros');
        return;
    }

  try {
    const {data:{data}} = await axios.get(
      `${apiUrl}/api/Reportes/Contratos_Adhesion`, // este endpoint debería devolver los datos en JSON
      {
        params: {
          fechaInicio: filtro.fechaInicio,
          fechaFin: filtro.fechaFin,
          contrato: filtro.tipoContrato
        },
        headers: {
          'XApiKey': apiKey
        }
      }
    );

    console.log('Datos recibidos:', data);

    setResultado(Array.isArray(data) ? data : []);
    console.log('Resultado:', resultado);
  } catch (error) {
    console.error('Error al obtener los datos para previsualización:', error);
  }
};

const generarPDF = () => {
    const element = contentRef.current;

    const opt = {
      margin:       0.5,
      filename:     'Reporte_ContratosAdhesion.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const descargarPDF = async () => {
    try {
      const {data:{data}}  = await axios.get(
        `${apiUrl}/api/Reportes/Contratos_Adhesion`,
        {
          params: {
            fechaInicio: filtro.fechaInicio,
            fechaFin: filtro.fechaFin,
            contrato: filtro.tipoContrato
          },
          headers: {
            'XApiKey': apiKey // aquí va el header correcto
          },
          responseType: 'blob' // clave para archivos PDF
        }
      );

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ReporteContratosAdhesion.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };

   return (
  <Grid container spacing={2} alignItems="center" style={{ padding: '20px', fontFamily: 'Arial' }}>
    <Grid item xs={12}>
      <h2>Reporte de Tipos de Contratos</h2>
    </Grid>

    {/* Filtro: Tipo de Contrato */}
    <Grid item xs={4} className="no-print">
      <CustomFormLabel>Tipo de Contrato</CustomFormLabel>
      <CustomTextField
        fullWidth
        select
        name="tipoContrato"
        value={filtro.tipoContrato}
        onChange={handleChange}
      >
        <MenuItem value="">-- Seleccione --</MenuItem>
        {tiposContrato.map((tipo) => (
          <MenuItem key={tipo.value} value={tipo.value}>
            {tipo.label}
          </MenuItem>
        ))}
      </CustomTextField>
    </Grid>

    {/* Filtro: Fecha Inicio */}
    <Grid item xs={4} className="no-print">
      <CustomFormLabel>Fecha Inicio</CustomFormLabel>
      <CustomTextField
        fullWidth
        type="date"
        name="fechaInicio"
        value={filtro.fechaInicio}
        onChange={handleChange}
      />
    </Grid>

    {/* Filtro: Fecha Fin */}
    <Grid item xs={4} className="no-print">
      <CustomFormLabel>Fecha Fin</CustomFormLabel>
      <CustomTextField
        fullWidth
        type="date"
        name="fechaFin"
        value={filtro.fechaFin}
        onChange={handleChange}
      />
    </Grid>

    {/* Botones */}
    <Grid item xs={12}>
      <Grid item style={{ marginTop: '2.5%' }} spacing={4} className="no-print">
        <Button
          variant="outlined"
          startIcon={<Search />}
          onClick={obtenerDatos}
          style={{ marginRight: '10px', backgroundColor: '#003c69', color: 'white' }}
        >
          Buscar
        </Button>
      
        <Button
          variant="outlined"
          startIcon={<PictureAsPdf />}
          onClick={generarPDF}
          style={{ backgroundColor: '#003c69', color: 'white' }}
        >
          Descargar PDF
        </Button>
      </Grid>
    </Grid>

    {/* Resultados */}
    {/* <Grid item xs={12} ref={tablaRef} style={{
        border: '1px solid #333',
        padding: '20px',
        backgroundColor: '#fff'
      }}> 
      <h3 style={{ textAlign: 'center', backgroundColor: '#0ea5e9', color: 'white', padding: '10px' }}>Resultados:</h3>
      {resultado.length === 0 ? (
        <p>No hay resultados</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{
            marginTop: "20px",
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Ciudad</th>
              <th style={thStyle}>Dirección</th>
              <th style={thStyle}>Teléfono Celular</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>DNI</th>
            </tr>
          </thead>
          <tbody>
            {resultado.map((item, index) => (
              <tr key={item.pena_Id}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{item.pers_Nombre}</td>
                <td style={tdStyle}>{item.ciud_Nombre}</td>
                <td style={tdStyle}>{item.pena_DireccionExacta}</td>
                <td style={tdStyle}>{item.pena_TelefonoCelular}</td>
                <td style={tdStyle}>{item.pena_CorreoElectronico}</td>
                <td style={tdStyle}>{item.pena_DNI}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Grid> */}
    {/* Resultados */}
<Grid item xs={12} ref={contentRef}  style={{
  padding: '20px',
  backgroundColor: '#fff'
}}> 
  <h3 style={tableTitle}> Datos: </h3>

  {resultado.length === 0 ? (
    <p>No hay resultados</p>
  ) : (
    <table
      border="1"
      cellPadding="8"
      style={{
        marginTop: "20px",
        width: "100%",
        borderCollapse: "collapse"
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#003c69' }}>
          <th style={thStyle}>#</th>
          <th style={thStyle}>Nombre</th>

          {filtro.tipoContrato === "PN" && (
            <>
              <th style={thStyle}>Ciudad</th>
              <th style={thStyle}>Dirección</th>
              <th style={thStyle}>Teléfono Celular</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>DNI</th>
            </>
          )}

          {filtro.tipoContrato === "CI" && (
            <>
              <th style={thStyle}>Ciudad</th>
              <th style={thStyle}>Colonia</th>
              <th style={thStyle}>Teléfono Celular</th>
              <th style={thStyle}>Correo</th>
            </>
          )}

          {filtro.tipoContrato === "PJ" && (
            <>
              <th style={thStyle}>Empresa</th>
              <th style={thStyle}>Teléfono Empresa</th>
              <th style={thStyle}>Correo Empresa</th>
              <th style={thStyle}>Ciudad Empresa</th>
              <th style={thStyle}>Dirección</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {resultado.map((item, index) => (
          <tr key={index}>
            <td style={tdStyle}>{index + 1}</td>
            <td style={tdStyle}>{item.pers_Nombre}</td>

            {filtro.tipoContrato === "PN" && (
              <>
                <td style={tdStyle}>{item.ciud_Nombre}</td>
                <td style={tdStyle}>{item.pena_DireccionExacta}</td>
                <td style={tdStyle}>{item.pena_TelefonoCelular}</td>
                <td style={tdStyle}>{item.pena_CorreoElectronico}</td>
                <td style={tdStyle}>{item.pena_DNI}</td>
              </>
            )}

            {filtro.tipoContrato === "CI" && (
              <>
                <td style={tdStyle}>{item.ciud_Nombre}</td>
                <td style={tdStyle}>{item.colo_Nombre}</td>
                <td style={tdStyle}>{item.coin_TelefonoCelular}</td>
                <td style={tdStyle}>{item.coin_CorreoElectronico}</td>
              </>
            )}

            {filtro.tipoContrato === "PJ" && (
              <>
                <td style={tdStyle}>{item.pers_Nombre}</td> {/* Nombre empresa */}
                <td style={tdStyle}>{item.peju_TelefonoEmpresa}</td>
                <td style={tdStyle}>{item.peju_CorreoElectronico}</td>
                <td style={tdStyle}>{item.ciud_Nombre}</td>
                <td style={tdStyle}>{item.peju_PuntoReferencia}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )}
</Grid>


        {/* Estilos para ocultar al imprimir */}
    <style>{`
      @media print {
        .no-print {
          display: none !important;
        }
      }
    `}</style>
  </Grid>
);


};

const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center',
  backgroundColor: '#003c69',
  color: 'white'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center'
};

const tableTitle = {
  textAlign: 'center', 
  color: 'black', 
  padding: '10px', 
  marginTop: '20px'
};
export default ReporteContratosAdhesion;
