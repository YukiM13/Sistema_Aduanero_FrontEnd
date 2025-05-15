// ReporteInventario.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Button, CircularProgress, Box, Stack, Autocomplete, TextField
} from '@mui/material';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { useFormik } from 'formik';
import { Search } from '@mui/icons-material';
import { IconDownload, IconArrowBack } from '@tabler/icons';
import ParentCard from '../../../components/shared/ParentCard';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ReporteInventario = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [materiales, setMateriales] = useState([]);
  const contenidoRef = useRef();

  const formik = useFormik({
    initialValues: {
      material: null,
      fechaInicio: '',
      fechaFin: ''
    },
  });

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Materiales/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      setMateriales(response.data.data || []);
    })
    .catch(error => {
      console.error('Error al cargar materiales:', error);
    });
  }, []);

  const buscarReporte = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    const materialSeleccionado = formik.values.material;
    const fechaInicio = formik.values.fechaInicio;
    const fechaFin = formik.values.fechaFin;

    if (!materialSeleccionado) return;

    setLoading(true);
    axios.post(`${apiUrl}/api/Reportes/Inventario`, {
      mate_Id: materialSeleccionado.mate_Id,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    }, {
      headers: {
        'XApiKey': apiKey,
        'Content-Type': 'application/json'
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
      filename: `reporte-inventario-${Date.now()}.pdf`,
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
    const archivoRef = ref(storage, `documentos/inventario-${Date.now()}.pdf`);
    await uploadBytes(archivoRef, pdfBlob);
    const urlDescarga = await getDownloadURL(archivoRef);

    const printWindow = window.open(urlDescarga, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div>
      <Breadcrumb title="Inventario" subtitle="Reporte por Material" />
      <ParentCard>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={4} md={12} sm={12}>
            <CustomFormLabel>Material</CustomFormLabel>
            <Autocomplete
              options={materiales}
              getOptionLabel={(option) => option.mate_Descripcion}
              onChange={(e, value) => formik.setFieldValue('material', value)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Seleccionar Material" variant="outlined" fullWidth />
              )}
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
              <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}>
                Previsualización Reporte de Inventario
              </h5>
              <div ref={contenidoRef}>
                <p style={{ fontSize: '8pt', margin: '2px 0' }}>
                  Fecha y hora de impresión: {new Date().toLocaleString()}
                </p>

                {datos.map((item, idx) => {
  const detalles = JSON.parse(item.detalles || '[]'); // OJO: "detalles" en minúscula
  return (
    <div key={idx} style={{ marginTop: '15px' }}>
      {/* Tabla de datos generales */}
      <table style={{ width: '100%', fontSize: '8pt' }} border="1" cellPadding="4" cellSpacing="0">
        <tbody>
          <tr>
            <th colSpan="4" style={{ backgroundColor: '#1797be', color: 'white', textAlign: 'center' }}>
              Información General del Material
            </th>
          </tr>
          <tr>
            <td><strong>Descripción:</strong></td>
            <td>{item.mate_Descripcion}</td>
            <td><strong>Categoría:</strong></td>
            <td>{item.cate_Descripcion}</td>
          </tr>
          <tr>
            <td><strong>Subcategoría:</strong></td>
            <td>{item.subc_Descripcion}</td>
            <td><strong>Stock Total:</strong></td>
            <td>{item.stockTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabla de detalles */}
      <table style={{ width: '100%', marginTop: '10px', fontSize: '8pt' }} border="1" cellPadding="3" cellSpacing="0">
        <thead>
          <tr style={{ backgroundColor: '#eeeeee' }}>
            <th>ID Lote</th>
            <th>Código</th>
            <th>Stock</th>
            <th>Unidad</th>
            <th>Color</th>
            <th>Área</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle, i) => (
            <tr key={i}>
              <td>{detalle.lote_Id}</td>
              <td>{detalle.lote_CodigoLote}</td>
              <td>{detalle.lote_Stock}</td>
              <td>{detalle.unme_Descripcion}</td>
              <td>{detalle.colr_Nombre}</td>
              <td>{detalle.tipa_area}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
})}


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

export default ReporteInventario;
