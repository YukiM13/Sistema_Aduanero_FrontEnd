// ReporteInventario.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Button, CircularProgress, Box, Stack, Autocomplete, TextField
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
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';

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
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: {
        scale: 3.0,
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
              <Button variant="outlined" startIcon={<IconArrowBack />} onClick={() => window.history.back()}>
                Volver
              </Button>
              <Button variant="contained" startIcon={<IconDownload />} onClick={exportarPDF}>
                Descargar PDF
              </Button>
            </Stack>

            <ParentCard>
              <h5 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '18px' }}>Previsualización Reporte de Inventario</h5>
              <div ref={contenidoRef} style={{ position: 'relative' }}>
                <p style={{ fontSize: '8pt', margin: '2px 0' }}>
                  Fecha y hora de impresión: {new Date().toLocaleString()}
                </p>

                {datos.map((item, idx) => {
                  const detalles = JSON.parse(item.detalles || '[]');
                  return (
                    <div key={idx} style={{ marginTop: '10px' }}>
                      <table style={{ width: '100%', tableLayout: 'fixed', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                        <tbody>
                          <tr bgcolor="#eeeeee">
                            <th colSpan="6" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px' }}>
                              REPORTE DE INVENTARIO POR MATERIAL <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                            </th>
                          </tr>
                          <tr>
                            <th bgcolor="#f8f8f8">Material:</th>
                            <td>{item.mate_Descripcion}</td>
                            <th bgcolor="#f8f8f8">Categoría:</th>
                            <td>{item.cate_Descripcion}</td>
                            <th bgcolor="#f8f8f8">Subcategoría:</th>
                            <td>{item.subc_Descripcion}</td>
                          </tr>
                          <tr>
                            <th bgcolor="#f8f8f8">Stock Total:</th>
                            <td colSpan="5">{item.stockTotal}</td>
                          </tr>
                          <tr bgcolor="#eeeeee">
                            <th colSpan="6" style={{ color: '#1797be', textAlign: 'center', fontSize: '14px' }}>
                              DETALLES DEL INVENTARIO
                            </th>
                          </tr>
                        </tbody>
                      </table>

                      <table style={{ width: '100%', tableLayout: 'fixed', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                        <thead>
                          <tr bgcolor="#eeeeee">
                            <th style={{ background: '#1797be', color: 'white', textAlign: 'center' }}>ID Lote</th>
                            <th style={{ background: '#1797be', color: 'white', textAlign: 'center' }}>Código</th>
                            <th style={{ background: '#1797be', color: 'white', textAlign: 'center' }}>Stock</th>
                            <th style={{ background: '#1797be', color: 'white', textAlign: 'center' }}>Unidad</th>
                            <th style={{ background: '#1797be', color: 'white', textAlign: 'center' }}>Color</th>
                            <th style={{ background: '#1797be', color: 'white', textAlign: 'center' }}>Área</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalles.map((detalle, i) => (
                            <tr key={i}>
                              <td style={{ textAlign: 'center' }}>{detalle.lote_Id}</td>
                              <td>{detalle.lote_CodigoLote}</td>
                              <td style={{ textAlign: 'center' }}>{detalle.lote_Stock}</td>
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

              <div
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(2)',
    width: '100%',
    height: 'auto',
    opacity: 0.2,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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

export default ReporteInventario;
