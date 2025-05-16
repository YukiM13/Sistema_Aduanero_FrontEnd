import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Grid, Button } from '@mui/material';
import { PictureAsPdf, Search } from '@mui/icons-material';

import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';

import html2pdf from 'html2pdf.js';

const SeguimientoDeProcesosPorPO = () => {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState([]);
  const contentRef = useRef();

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const obtenerDatos = async () => {
  if (!codigo) {
    alert('Por favor ingrese un código de orden de compra');
    return;
  }

  try {
    const response = await axios.post(
      `${apiUrl}/api/Reportes/SeguimientodeProcesosporPO`,
      { orco_Codigo: codigo }, // ← Body de la solicitud POST
      {
        headers: {
          'XApiKey': apiKey,
          'Content-Type': 'application/json' // ← Recomendado para POST
        }
      }
    );

    const { data } = response.data;
    setResultado(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
};


  const generarPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: `SeguimientoProcesos_PO_${codigo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
  <Grid container spacing={2} style={{ padding: '20px', fontFamily: 'Arial' }}>
    {/* Controles: se ocultan al imprimir */}
    <Grid item xs={4} className="no-print">
      <h3> Reporte de Seguimiento de Procesos</h3>
  <CustomFormLabel>Código de Orden de Compra</CustomFormLabel>
  <CustomTextField
    fullWidth
    value={codigo}
    onChange={(e) => setCodigo(e.target.value)}
  />
  
  <Grid container spacing={2} style={{ marginTop: '20px' }}>
    <Grid item xs={4}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<Search />}
        onClick={obtenerDatos}
        style={{ backgroundColor: '#003c69', color: 'white' }}
      >
        Buscar
      </Button>
    </Grid>
    <Grid item xs={8}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<PictureAsPdf />}
        onClick={generarPDF}
        style={{ backgroundColor: '#003c69', color: 'white' }}
      >
        Descargar PDF
      </Button>
    </Grid>
  </Grid>
</Grid>

    {/* Contenido a imprimir */}
    <Grid item xs={12} ref={contentRef}>
      <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Seguimiento de Procesos por Orden de Compra</h2>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}
        border="1"
      >
        <thead>
          <tr style={{ backgroundColor: '#003c69' }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Proceso</th>
            <th style={thStyle}>Fecha del Proceso Final</th>
            <th style={thStyle}>Dueño</th>
            <th style={thStyle}>Estado de la Orden</th>
            {/* Agrega más columnas si tu API lo requiere */}
          </tr>
        </thead>
        <tbody>
          {resultado.length === 0 ? (
            <tr>
              <td colSpan="5" style={tdStyle}>
                No hay resultados
              </td>
            </tr>
          ) : (
            resultado.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{item.proc_Actual}</td>
                <td style={tdStyle}>{item.code_FechaProcActual}</td>
                <td style={tdStyle}>{item.clie_Nombre_O_Razon_Social}</td>
                <td style={tdStyle}>{item.orco_EstadoOrdenCompra}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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

export default SeguimientoDeProcesosPorPO;
