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

const DeclaracionValorImpresionPdf = ({declaracionValor, onCancelar}) => {
    const handleDownloadPDF = () => {
        if (!declaracionValor) return;
        
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(16);
        doc.text('DECLARACIÓN DE VALOR', 105, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Declaración #: ${declaracionValor.deva_Id}`, 14, 30);
        doc.text(`Fecha: ${new Date(declaracionValor.deva_FechaAceptacion).toLocaleDateString()}`, 14, 38);
        
        // Información de la aduana
        doc.setFontSize(14);
        doc.text('INFORMACIÓN DE LA ADUANA', 14, 50);
        doc.setFontSize(10);
        
        doc.text(`Aduana de Ingreso: ${declaracionValor.adua_IngresoNombre} (${declaracionValor.adua_IngresoCodigo})`, 14, 60);
        doc.text(`Aduana de Despacho: ${declaracionValor.adua_DespachoNombre} (${declaracionValor.adua_DespachoCodigo})`, 14, 68);
        doc.text(`Régimen: ${declaracionValor.regi_Descripcion} (${declaracionValor.regi_Codigo})`, 14, 76);
        
        // Información del importador si existe
        if (declaracionValor.impo_Nombre_Raso) {
            doc.setFontSize(14);
            doc.text('INFORMACIÓN DEL IMPORTADOR', 14, 90);
            doc.setFontSize(10);
            
            doc.text(`Nombre: ${declaracionValor.impo_Nombre_Raso}`, 14, 100);
            doc.text(`RTN: ${declaracionValor.impo_RTN || 'No disponible'}`, 14, 108);
            doc.text(`Dirección: ${declaracionValor.impo_Direccion_Exacta || 'No disponible'}`, 14, 116);
            
            if (declaracionValor.impo_CiudadNombre && declaracionValor.impo_PaisNombre) {
                doc.text(`Ciudad/País: ${declaracionValor.impo_CiudadNombre}, ${declaracionValor.impo_PaisNombre}`, 14, 124);
            }
        }
        
        // Guardar PDF
        doc.save(`Declaracion_Valor_${declaracionValor.deva_Id}.pdf`);
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
                    onClick={handleDownloadPDF}
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
        </>
    );
};

export default DeclaracionValorImpresionPdf;