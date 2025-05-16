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
      {/* Contenido a imprimir */}
      <Grid item xs={12} ref={contentRef}>
        <h2 style={{ textAlign: 'center' }}>Seguimiento de Procesos por PO</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }} border="1">
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Proceso Actual</th>
              <th style={thStyle}>Fecha del Proceso Actual</th>
              <th style={thStyle}>Dueño</th>
              <th style={thStyle}>Estado de la Orden</th>
              {/* Agrega más columnas si tu API lo requiere */}
            </tr>
          </thead>
          <tbody>
            {resultado.length === 0 ? (
              <tr><td colSpan="5" style={tdStyle}>No hay resultados</td></tr>
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

      {/* Controles: se ocultan al imprimir */}
      <Grid item xs={12} className="no-print">
        <CustomFormLabel>Código de Orden de Compra</CustomFormLabel>
        <CustomTextField
          fullWidth
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <Button variant="outlined" startIcon={<Search />} onClick={obtenerDatos} style={{ marginRight: '10px', marginTop: '10px' }}>
          Buscar
        </Button>
        <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={generarPDF} style={{ marginTop: '10px' }}>
          Descargar PDF
        </Button>
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
  textAlign: 'left',
  backgroundColor: '#e5e7eb'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px'
};

export default SeguimientoDeProcesosPorPO;
