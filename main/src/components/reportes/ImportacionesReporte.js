import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Grid, Button, CircularProgress, Box, Stack
} from '@mui/material';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { useFormik } from 'formik';
import { Search } from '@mui/icons-material';
import { IconDownload, IconArrowBack } from '@tabler/icons';
import ParentCard from '../shared/ParentCard';
import html2pdf from 'html2pdf.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import { storage } from '../../layouts/config/firebaseConfig';

const ImportacionesReporte = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const contenidoRef = useRef();

  const formik = useFormik({
    initialValues: {
      fechaInicio: '',
      fechaFin: ''
    },
  });

  const buscarReporte = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const { fechaInicio, fechaFin } = formik.values;
    if (!fechaInicio || !fechaFin) return;

    setLoading(true);
    axios.get(`${apiUrl}/api/Reportes/Importaciones`, {
      params: {
        fechaInicio,
        fechaFin
      },
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      setDatos(response.data.data || []);
      setShowTable(true);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error al obtener el reporte:', error);
      setLoading(false);
    });
  };

  const exportarPDF = async () => {
    const opt = {
      margin: 3,
      filename: `reporte-importaciones-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1.5, 
        useCORS: true, 
        letterRendering: true 
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait', 
        compress: true 
      }
    };

    const pdfBlob = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');
    const archivoRef = ref(storage, `documentos/importaciones-${Date.now()}.pdf`);
    await uploadBytes(archivoRef, pdfBlob);
    const urlDescarga = await getDownloadURL(archivoRef);
    window.open(urlDescarga, '_blank')?.print();
  };

  return (
    <div>
      <Breadcrumb title="Importaciones" subtitle="Reporte por Rango de Fechas" />
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
            <Button variant="contained" onClick={buscarReporte} startIcon={<Search />}>
              Buscar
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <CircularProgress />
          </Box>
        )}

        {showTable && datos.length > 0 && (
          <>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<IconArrowBack style={{ fontSize: '18px' }} />}
                onClick={() => window.history.back()}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                startIcon={<IconDownload style={{ fontSize: '18px' }} />}
                onClick={exportarPDF}
              >
                Descargar PDF
              </Button>
            </Stack>
            <ParentCard>
              <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización Reporte de Importaciones </h5>
              <div ref={contenidoRef} style={{ position: 'relative' }}>
                <p style={{ fontSize: '8pt', margin: '2px 0' }}>Fecha y hora de impresión: {new Date().toLocaleString()} </p>
                <br />
               <table
  style={{
    width: '100%',
    tableLayout: 'fixed',
    wordWrap: 'break-word',
    fontSize: '7pt'
  }}
  border="3"
  cellPadding="2"
  cellSpacing="0"
>
  <thead>
    <tr bgcolor="#eeeeee">
      <th
        colSpan="4"
        style={{
          background: '#1797be',
          color: 'white',
          textAlign: 'center',
          fontSize: '14px',
          border: "1px solid black"
        }}
      >
        REPORTE DE IMPORTACIONES <br />
        <span style={{ fontSize: '12px' }}>-- IMPRESO --</span>
      </th>
      <th
        rowSpan="2"
        style={{
          height: '100px',
          width: '100px',
          textAlign: 'center',
          backgroundColor: 'rgb(180 237 255)',
          border: "1px solid black",
          color: 'rgb(23, 151, 190)'
        }}
      >
        <LogoAzul style={{ width: '80%', height: '80%' }} />
      </th>
    </tr>
    <tr>
      <th bgcolor="#f8f8f8">Fecha Inicio:</th>
      <td colSpan="1">
        {formik.values.fechaInicio
          ? new Date(formik.values.fechaInicio).toLocaleDateString()
          : ''}
      </td>
      <th bgcolor="#f8f8f8">Fecha Fin:</th>
      <td colSpan="1">
        {formik.values.fechaFin
          ? new Date(formik.values.fechaFin).toLocaleDateString()
          : ''}
      </td>
    </tr>
    <tr bgcolor="#eeeeee">
      <th
        colSpan="5"
        style={{
          border: "1px solid black",
          color: '#1797be',
          textAlign: 'center',
          fontSize: '14px'
        }}
      >
        LISTADO DE IMPORTACIONES
      </th>
    </tr>
  </thead>
</table>


                {datos.map((item, idx) => {
                  const detalles = JSON.parse(item.detalles || '[]');
                  const valoresTotales = JSON.parse(item.ValoresTotales || '[]')[0] || {};
                  return (
                    <div key={idx} style={{ marginTop: '15px' }}>
                      <table style={{ width: '100%', fontSize: '8pt', marginTop: '15px' }} border="1" cellPadding="3" cellSpacing="0">
                        <tbody>
                          <tr style={{ background: '#1797be', color: 'white' }}>
                            <th colSpan="4" style={{ border: "1px solid black", textAlign: 'center' }}>DUCA ID: {item.duca_Id}</th>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid black" }}><strong>Fecha:</strong> {new Date(item.duca_fechaCreacion).toLocaleDateString()}</td>
                            <td style={{ border: "1px solid black" }}><strong>Valor Aduana:</strong> ${valoresTotales.item_ValorAduana || 0}</td>
                            <td style={{ border: "1px solid black" }}><strong>Peso Neto:</strong> {valoresTotales.item_PesoNeto || 0} kg</td>
                            <td style={{ border: "1px solid black" }}><strong>Impuestos:</strong> ${item.Impuestos || 0}</td>
                          </tr>
                        </tbody>
                      </table>

                      {detalles.length > 0 && (
                        <table style={{ width: '100%', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                          <thead>
                            <tr style={{ background: '#eeeeee' }}>
                              {Object.keys(detalles[0]).map((key, i) => (
                                <th key={i} style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {detalles.map((det, i) => (
                              <tr key={i}>
                                {Object.values(det).map((val, j) => (
                                  <td key={j} style={{ border: "1px solid black" }}>{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  );
                })}

                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(2)',
                    opacity: 0.2,
                    pointerEvents: 'none',
                  }}
                >
                  <LogoAzul style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </div>

                <div style={{ marginTop: '20px', fontSize: '9pt', textAlign: 'right' }}>
                  <p><strong>Fecha de generación:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </ParentCard>
          </>
        )}
      </ParentCard>
    </div>
  );
};


export default ImportacionesReporte;