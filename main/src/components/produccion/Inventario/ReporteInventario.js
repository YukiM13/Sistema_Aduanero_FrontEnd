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
      material: null
    },
  });

  // Obtener materiales
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

    if (!materialSeleccionado) return;

    setLoading(true);
    axios.post(`${apiUrl}/api/Reportes/Inventario`, {
      mate_Id: materialSeleccionado.mate_Id
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
      html2canvas: { scale: 1.5 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const pdfBlob = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');
    const archivoRef = ref(storage, `documentos/inventario-${Date.now()}.pdf`);
    await uploadBytes(archivoRef, pdfBlob);
    const urlDescarga = await getDownloadURL(archivoRef);
    window.open(urlDescarga, '_blank');
  };

  return (
    <div>
      <Breadcrumb title="Inventario" subtitle="Reporte por Material" />
      <ParentCard>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={materiales}
              getOptionLabel={(option) => option.mate_Descripcion}
              onChange={(e, value) => formik.setFieldValue('material', value)}
              renderInput={(params) => (
                <TextField {...params} label="Seleccionar Material" variant="outlined" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
              <div ref={contenidoRef} style={{ position: 'relative' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Reporte de Inventario</h3>
                <p style={{ fontSize: '9pt', textAlign: 'right' }}>Fecha y hora: {new Date().toLocaleString()}</p>

                {datos.map((item, idx) => (
                  <Box key={idx} mb={2}>
                    <h4>Material: {item.mate_Descripcion}</h4>
                    <p><strong>Categoría:</strong> {item.cate_Descripcion} | <strong>Subcategoría:</strong> {item.subc_Descripcion}</p>
                    <p><strong>Stock total:</strong> {item.stockTotal}</p>

                    {item.mate_Imagen && (
                      <img src={item.mate_Imagen} alt="Imagen material" style={{ maxWidth: 200, maxHeight: 200 }} />
                    )}

                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID Lote</TableCell>
                            <TableCell>Código</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Unidad</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Área</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {JSON.parse(item.Detalles || '[]').map((detalle, i) => (
                            <TableRow key={i}>
                              <TableCell>{detalle.lote_Id}</TableCell>
                              <TableCell>{detalle.lote_CodigoLote}</TableCell>
                              <TableCell>{detalle.lote_Stock}</TableCell>
                              <TableCell>{detalle.unme_Descripcion}</TableCell>
                              <TableCell>{detalle.colr_Nombre}</TableCell>
                              <TableCell>{detalle.tipa_area}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}

                {/* Marca de agua */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(2)',
                  opacity: 0.15,
                  pointerEvents: 'none'
                }}>
                  <LogoAzul />
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
