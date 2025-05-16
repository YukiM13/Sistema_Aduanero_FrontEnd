import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Grid, Button, CircularProgress, Box, Stack, TextField,
  Typography, Paper, Divider, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import { Search, CalendarToday } from '@mui/icons-material';
import { IconDownload, IconArrowBack, IconFilter } from '@tabler/icons';
import ParentCard from '../shared/ParentCard';
import html2pdf from 'html2pdf.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import { storage } from '../../layouts/config/firebaseConfig';

const ImportacionesReporte = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState(null);
  const contenidoRef = useRef();
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      fechaInicio: '',
      fechaFin: ''
    },
    validate: values => {
      const errors = {};
      if (!values.fechaInicio) errors.fechaInicio = 'Fecha de inicio requerida';
      if (!values.fechaFin) errors.fechaFin = 'Fecha final requerida';
      if (values.fechaInicio && values.fechaFin && new Date(values.fechaInicio) > new Date(values.fechaFin)) {
        errors.fechaFin = 'La fecha final debe ser posterior a la fecha de inicio';
      }
      return errors;
    }
  });

  const buscarReporte = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const { fechaInicio, fechaFin } = formik.values;
    
    // Validación básica
    if (!fechaInicio || !fechaFin) {
      setError('Por favor, ingrese ambas fechas para generar el reporte');
      return;
    }

    setError(null);
    setLoading(true);
    
    axios.get(`${apiUrl}/api/Reportes/Importaciones`, {
      params: { fechaInicio, fechaFin },
      headers: { 'XApiKey': apiKey }
    })
    .then(response => {
      const responseData = response.data.data || [];
      setDatos(responseData);
      setShowTable(responseData.length > 0);
      if (responseData.length === 0) {
        setError('No se encontraron datos para el período seleccionado');
      }
      setLoading(false);
    })
    .catch(error => {
      console.error('Error al obtener el reporte:', error);
      setError('Ocurrió un error al obtener los datos. Intente nuevamente más tarde.');
      setLoading(false);
    });
  };

  const exportarPDF = async () => {
    try {
      setLoading(true);
      
      const opt = {
        margin: 10,
        filename: `reporte-importaciones-${formik.values.fechaInicio}-a-${formik.values.fechaFin}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
      };

      const pdfBlob = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');
      const archivoRef = ref(storage, `documentos/importaciones-${Date.now()}.pdf`);
      await uploadBytes(archivoRef, pdfBlob);
      const urlDescarga = await getDownloadURL(archivoRef);
      
      window.open(urlDescarga, '_blank');
      setLoading(false);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      setError('Ocurrió un error al generar el PDF');
      setLoading(false);
    }
  };

  // Función para formatear números con 2 decimales
  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toLocaleString('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) : '0.00';
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-HN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Función para formatear encabezados de tabla
  const formatHeader = (text) => {
    if (!text) return '';
    return text
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Breadcrumb title="Importaciones" subtitle="Reporte por Rango de Fechas" />
      
      {/* Sección de Filtros */}
      <Card elevation={3} sx={{ mb: 4, overflow: 'visible' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Filtros de Búsqueda
          </Typography>
          
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <CustomFormLabel required>Fecha Inicio</CustomFormLabel>
              <TextField
                fullWidth
                type="date"
                name="fechaInicio"
                value={formik.values.fechaInicio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fechaInicio && Boolean(formik.errors.fechaInicio)}
                helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormLabel required>Fecha Fin</CustomFormLabel>
              <TextField
                fullWidth
                type="date"
                name="fechaFin"
                value={formik.values.fechaFin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fechaFin && Boolean(formik.errors.fechaFin)}
                helperText={formik.touched.fechaFin && formik.errors.fechaFin}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={buscarReporte}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IconFilter />}
                sx={{ minWidth: 150 }}
              >
                {loading ? 'Buscando...' : 'Generar Reporte'}
              </Button>
            </Grid>
          </Grid>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Sección de Resultados */}
      {showTable && datos.length > 0 && (
        <Card elevation={3}>
          <CardContent>
            <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'space-between' }}>
              <Button 
                variant="outlined"
                startIcon={<IconArrowBack />}
                onClick={() => window.history.back()}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IconDownload />}
                onClick={exportarPDF}
                disabled={loading}
              >
                {loading ? 'Generando PDF...' : 'Exportar PDF'}
              </Button>
            </Stack>

            {/* Contenido del reporte para PDF */}
            <Paper 
              elevation={0} 
              sx={{ p: 3, border: '1px solid #eee' }}
              ref={contenidoRef}
            >
              {/* Cabecera del reporte */}
              <Box sx={{ textAlign: 'center', mb: 3, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.7 }}>
                  <LogoAzul width={70} height={70} />
                </Box>
                
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  Reporte de Importaciones
                </Typography>
                
                <Typography variant="subtitle1">
                  Período: {formatDate(formik.values.fechaInicio)} - {formatDate(formik.values.fechaFin)}
                </Typography>
                
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  Fecha y hora de generación: {new Date().toLocaleString('es-HN')}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Contenido del reporte */}
              {datos.map((item, idx) => {
                const detalles = JSON.parse(item.detalles || '[]');
                const valoresTotales = JSON.parse(item.ValoresTotales || '[]')[0] || {};
                
                return (
                  <Box key={idx} sx={{ mb: 4, pageBreakInside: 'avoid' }}>
                    {/* Cabecera de cada DUCA */}
                    <Paper 
                      elevation={0}
                      sx={{ 
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      {/* Encabezado de la DUCA */}
                      <Box sx={{ 
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          DUCA ID: {item.duca_Id}
                        </Typography>
                        <Typography variant="subtitle1">
                          {formatDate(item.duca_fechaCreacion)}
                        </Typography>
                      </Box>

                      {/* Información resumida */}
                      <Box sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Valor Aduana:</Typography>
                            <Typography variant="h6">
                              ${formatNumber(valoresTotales.item_ValorAduana)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Peso Neto:</Typography>
                            <Typography variant="h6">
                              {formatNumber(valoresTotales.item_PesoNeto)} kg
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Impuestos:</Typography>
                            <Typography variant="h6" color="error.main">
                              ${formatNumber(item.Impuestos)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>

                    {/* Tabla de detalles */}
                    {detalles.length > 0 && (
                      <TableContainer component={Paper} elevation={0} sx={{ mt: 2, border: `1px solid ${theme.palette.divider}` }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                              {Object.keys(detalles[0]).map((key, i) => (
                                <TableCell key={i} sx={{ fontWeight: 'bold' }}>
                                  {formatHeader(key)}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {detalles.map((det, i) => (
                              <TableRow key={i} sx={{ '&:nth-of-type(odd)': { bgcolor: theme.palette.action.hover } }}>
                                {Object.values(det).map((val, j) => (
                                  <TableCell key={j}>{val}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                );
              })}

              {/* Marca de agua */}
              <Box sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.06,
                pointerEvents: 'none',
                zIndex: -1
              }}>
                <LogoAzul width={400} height={400} />
              </Box>

              {/* Pie de página */}
              <Box sx={{ mt: 4, borderTop: `1px solid ${theme.palette.divider}`, pt: 2, textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  Este documento es un reporte generado automáticamente.
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  © {new Date().getFullYear()} - Todos los derechos reservados
                </Typography>
              </Box>
            </Paper>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ImportacionesReporte;