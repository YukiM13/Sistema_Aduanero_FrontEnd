import React from 'react';
import {
    Grid, Typography, Divider, Box, Button, Stack, Paper
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ParentCard from '../../../components/shared/ParentCard';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const DeclaracionValorImpresionPdf = ({declaracionValor, onCancelar}) => {
     const contentRef = useRef(null);
    const convertToPdf = () => {
          const content = contentRef.current;
  
          const options = {
              margin: 1,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: {
                  unit: 'in',
                  format: 'letter',
                  orientation: 'portrait',
              },
          };
  
          html2pdf().set(options).from(content).toPdf().get('pdf').then((pdf) => {
              const blobUrl = URL.createObjectURL(pdf.output('blob'));
              const newWindow = window.open(blobUrl);
              newWindow.onload = function () {
                  newWindow.print();
              };
          });
      };


    return (
        <>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon fontSize="small" />}
                    onClick={onCancelar}
                >
                    Volver
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon fontSize="small" />}
                    onClick={convertToPdf}
                >
                    Descargar PDF
                </Button>
            </Stack>

            <ParentCard title="Vista Previa de Declaración de Valor">
                <Paper elevation={0} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom align="center">
                        DECLARACIÓN DE VALOR
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom align="right">
                        Declaración #: {declaracionValor.deva_Id}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>INFORMACIÓN DE LA ADUANA</Typography>
                        <Grid container spacing={3}>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Aduana de Ingreso:</Typography>
                                <Typography>{declaracionValor.adua_IngresoNombre} ({declaracionValor.adua_IngresoCodigo})</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Aduana de Despacho:</Typography>
                                <Typography>{declaracionValor.adua_DespachoNombre} ({declaracionValor.adua_DespachoCodigo})</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Régimen:</Typography>
                                <Typography>{declaracionValor.regi_Descripcion} ({declaracionValor.regi_Codigo})</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Fecha de Aceptación:</Typography>
                                <Typography>{new Date(declaracionValor.deva_FechaAceptacion).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {declaracionValor.impo_Nombre_Raso && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>INFORMACIÓN DEL IMPORTADOR</Typography>
                            <Grid container spacing={3}>
                                <Grid item lg={6} md={6} sm={12}>
                                    <Typography variant="subtitle2">Nombre:</Typography>
                                    <Typography>{declaracionValor.impo_Nombre_Raso}</Typography>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12}>
                                    <Typography variant="subtitle2">RTN:</Typography>
                                    <Typography>{declaracionValor.impo_RTN || 'No disponible'}</Typography>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12}>
                                    <Typography variant="subtitle2">Dirección:</Typography>
                                    <Typography>{declaracionValor.impo_Direccion_Exacta || 'No disponible'}</Typography>
                                </Grid>
                                {(declaracionValor.impo_CiudadNombre && declaracionValor.impo_PaisNombre) && (
                                    <Grid item lg={6} md={6} sm={12}>
                                        <Typography variant="subtitle2">Ciudad/País:</Typography>
                                        <Typography>{declaracionValor.impo_CiudadNombre}, {declaracionValor.impo_PaisNombre}</Typography>
                                    </Grid>
                                )}
                                {declaracionValor.impo_Telefono && (
                                    <Grid item lg={6} md={6} sm={12}>
                                        <Typography variant="subtitle2">Teléfono:</Typography>
                                        <Typography>{declaracionValor.impo_Telefono}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </ParentCard>
            <div>
            <div ref={contentRef}>
                <h1>Hello, PDF!</h1>
                <p>
                    This is a simple example of HTML-to-PDF conversion using
                    React and html2pdf.
                </p>
            </div>
            <button onClick={convertToPdf}>Print PDF</button>
        </div>
        </>





    );
};

export default DeclaracionValorImpresionPdf;