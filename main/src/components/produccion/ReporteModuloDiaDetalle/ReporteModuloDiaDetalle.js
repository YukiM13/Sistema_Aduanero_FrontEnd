import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Grid, MenuItem } from '@mui/material';
import {
    Button, Stack, Select, FormControl
} from '@mui/material';
import { useFormik } from 'formik';
import ParentCard from '../../../components/shared/ParentCard';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import { Search } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';

const ReporteModuloDiaDetallePdf = () => {
    const [moduloDiaDetalles, setModuloDiaDetalles] = useState(null);
    const [moduloDiaLista, setModuloDiaLista] = useState([]);
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const contenidoRef = useRef();
    
    const formik = useFormik({
        initialValues: {
            remo_Id: 0
        },
        onSubmit: (values) => {
            buscarModuloDiaDetalle(values.remo_Id);
        }
    });

    useEffect(() => {
        cargarModuloDias();
    }, []);

    const cargarModuloDias = async () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        
        try {
            const response = await axios.get(`${apiUrl}/api/ReporteModuloDia/Listar`, {
                headers: {
                    'XApiKey': apiKey
                }
            });
            
            if (response.data && response.data.data) {
                setModuloDiaLista(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar módulos de día:', error);
        }
    };

    const buscarModuloDiaDetalle = async (remoId) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        
        if (remoId === 0) {
            alert('Por favor seleccione un reporte de módulo.');
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/api/ReporteModuloDiaDetalle/Listar/${remoId}`, {
                headers: {
                    'XApiKey': apiKey
                }
            });
            
            if (response.data && response.data.data) {
                setModuloDiaDetalles(response.data.data);
                const moduloInfo = moduloDiaLista.find(item => item.remo_Id === remoId);
                setModuloSeleccionado(moduloInfo);
                console.log('Detalles del módulo por día:', response.data.data);
            }
        } catch (error) {
            console.error('Error al buscar detalles del módulo:', error);
        }
    };

    const convertToPdf = async () => {
        const opt = {
            margin: 3,
            filename: 'reporte-modulo-dia-detalle.pdf',
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

        html2pdf().from(contenidoRef.current).set(opt).save();
    };

    // Calcular estadísticas
    const calcularEstadisticas = () => {
        if (!moduloDiaDetalles || moduloDiaDetalles.length === 0) return null;
        
        const totalDia = moduloDiaDetalles.reduce((sum, item) => sum + item.rdet_TotalDia, 0);
        const totalDanado = moduloDiaDetalles.reduce((sum, item) => sum + item.rdet_TotalDanado, 0);
        const totalExitoso = totalDia - totalDanado;
        
        return {
            totalDia,
            totalDanado,
            totalExitoso,
            porcentajeDanado: totalDia > 0 ? (totalDanado / totalDia) * 100 : 0,
            porcentajeBueno: totalDia > 0 ? ((totalDia - totalDanado) / totalDia) * 100 : 0
        };
    };

    const estadisticas = calcularEstadisticas();

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4}>
                                <CustomFormLabel>Reporte de Módulo</CustomFormLabel>
                                <FormControl fullWidth>
                                    <Select
                                        value={formik.values.remo_Id}
                                        name="remo_Id"
                                        onChange={formik.handleChange}
                                        placeholder="Seleccione un módulo"
                                        displayEmpty
                                    >
                                        <MenuItem value={0} disabled>
                                            Seleccione un reporte de módulo
                                        </MenuItem>
                                        {moduloDiaLista.map((modulo) => (
                                            <MenuItem key={modulo.remo_Id} value={modulo.remo_Id}>
                                                {modulo.modu_Nombre} - {new Date(modulo.remo_Fecha).toLocaleDateString()} - {modulo.empleado}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item style={{ marginTop: '5%'}}>
                                <Button
                                    style={{width:'300px', height:'40px'}}
                                    variant="outlined"
                                    type="submit"
                                    startIcon={<Search style={{ fontSize: '18px' }}/>}
                                >
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>

                {moduloDiaDetalles && moduloSeleccionado && (
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon style={{ fontSize: '18px' }}/>}
                                onClick={() => window.history.back()}
                            >
                                Volver
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon style={{ fontSize: '18px' }}/>}
                                onClick={convertToPdf}
                            >
                                Descargar PDF
                            </Button>
                        </Stack>

                        <ParentCard>
                            <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}>
                                Previsualización Reporte de Módulo: {moduloSeleccionado.modu_Nombre}
                            </h5>
                            <div ref={contenidoRef} style={{ position: 'relative' }}>
                                <p style={{ fontSize: '8pt', margin: '2px 0' }}>Fecha y hora de impresión: {new Date().toLocaleString()}</p>
                                <br />
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                                    <tbody>
                                        <tr bgcolor="#eeeeee">
                                            <th colSpan="9" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                                                REPORTE DE MÓDULO DIARIO <br /> <span style={{ fontSize: '12px' }}>-- DETALLES --</span>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th bgcolor="#f8f8f8">Módulo:</th>
                                            <td colSpan="3">{moduloSeleccionado.modu_Nombre}</td>
                                            <th bgcolor="#f8f8f8">Fecha:</th>
                                            <td colSpan="3">{new Date(moduloSeleccionado.remo_Fecha).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <th bgcolor="#f8f8f8">Empleado:</th>
                                            <td colSpan="3">{moduloSeleccionado.empleado}</td>
                                            <th bgcolor="#f8f8f8">Estado:</th>
                                            <td colSpan="3">{moduloSeleccionado.remo_Finalizado ? 'Finalizado' : 'En proceso'}</td>
                                        </tr>

                                        <tr bgcolor="#eeeeee">
                                            <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>RESUMEN DEL MÓDULO</th>
                                        </tr>
                                    </tbody>
                                </table>

                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                                    <thead>
                                        <tr bgcolor="#eeeeee">
                                            <th colSpan="2" style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>
                                                Estadísticas de {moduloSeleccionado.modu_Nombre}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ border: "1px solid black", background: '#f8f8f8', width: '50%' }}>Total del Día:</td>
                                            <td style={{ border: "1px solid black", textAlign: 'right' }}>{estadisticas.totalDia.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Total Dañado:</td>
                                            <td style={{ border: "1px solid black", textAlign: 'right' }}>{estadisticas.totalDanado.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Total Exitoso:</td>
                                            <td style={{ border: "1px solid black", textAlign: 'right' }}>{estadisticas.totalExitoso.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Porcentaje Dañado:</td>
                                            <td style={{ border: "1px solid black", textAlign: 'right' }}>{estadisticas.porcentajeDanado.toFixed(2)}%</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Porcentaje Bueno:</td>
                                            <td style={{ border: "1px solid black", textAlign: 'right' }}>{estadisticas.porcentajeBueno.toFixed(2)}%</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                                    <thead>
                                        <tr bgcolor="#eeeeee">
                                            <th colSpan="7" style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Detalles de Producción</th>
                                        </tr>
                                        <tr bgcolor="#eeeeee">
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Código Orden</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Proceso</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Estilo</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Color</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Sexo</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Total Día</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Total Dañado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {moduloDiaDetalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td style={{ border: "1px solid black" }}>{detalle.orco_Codigo}</td>
                                                <td style={{ border: "1px solid black" }}>{detalle.proc_Descripcion}</td>
                                                <td style={{ border: "1px solid black" }}>{detalle.esti_Descripcion}</td>
                                                <td style={{ border: "1px solid black" }}>{detalle.colr_Nombre}</td>
                                                <td style={{ border: "1px solid black", textAlign: 'center' }}>{detalle.sexo}</td>
                                                <td style={{ border: "1px solid black", textAlign: 'right' }}>{detalle.rdet_TotalDia.toLocaleString()}</td>
                                                <td style={{ border: "1px solid black", textAlign: 'right' }}>{detalle.rdet_TotalDanado.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                                    <thead>
                                        <tr bgcolor="#eeeeee">
                                            <th colSpan="4" style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Información Adicional</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th style={{ border: "1px solid black", background: '#f8f8f8', width: '20%' }}>Cliente:</th>
                                            <td style={{ border: "1px solid black" }}>{moduloDiaDetalles[0]?.clie_Nombre_Contacto || 'N/A'}</td>
                                            <th style={{ border: "1px solid black", background: '#f8f8f8', width: '20%' }}>RTN:</th>
                                            <td style={{ border: "1px solid black" }}>{moduloDiaDetalles[0]?.clie_RTN || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '100%',
                                        height: 'auto',
                                        opacity: 0.2,
                                        pointerEvents: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transform: 'scale(2)'
                                    }}
                                >
                                    <LogoAzul style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                </div>
                                <div style={{ marginTop: '20px', fontSize: '9pt', textAlign: 'right' }}>
                                    <p><strong>Fecha de generación:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </ParentCard>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default ReporteModuloDiaDetallePdf;