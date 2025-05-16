import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import {
    Button, Stack, TextField
} from '@mui/material';
import { useFormik } from 'formik';
import ParentCard from '../../../components/shared/ParentCard';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import { Search } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';

const ProduccionPorModuloPdf = () => {
    const [produccionData, setProduccionData] = useState(null);
    
    const contenidoRef = useRef();

    const today = new Date();

    const formik = useFormik({
        initialValues: {
            fecha_inicio: today.toISOString().substring(0, 10),
            fecha_fin: today.toISOString().substring(0, 10)
        },
        onSubmit: (values) => {
            buscarProduccion(values);
        }
    });

    const buscarProduccion = async (values) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        if (!values.fecha_inicio || !values.fecha_fin) {
            alert('Por favor seleccione un rango de fechas');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/Reportes/ProduccionPorModulo`, values, {
                headers: {
                    'XApiKey': apiKey
                }
            });

            if (response.data && response.data.data) {
                setProduccionData(response.data.data);
            }
        } catch (error) {
            console.error('Error al buscar Producción por Módulo', error);
        }
    }

    const convertToPdf = async () => {
        const opt = {
            margin: 3,
            filename: 'Produccion-por-modulo.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2pdf: {
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
        }

        html2pdf().from(contenidoRef.current).set(opt).save();
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={2}>
                                <CustomFormLabel>Fecha Inicio</CustomFormLabel>
                                <TextField
                                    type="date"
                                    name="fecha_inicio"
                                    value={formik.values.fecha_inicio}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <CustomFormLabel>Fecha Fin</CustomFormLabel>
                                <TextField
                                    type="date"
                                    name="fecha_fin"
                                    value={formik.values.fecha_fin}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item style={{ marginTop: '5%' }}>
                                <Button
                                    style={{ width: '300px', height: '40px' }}
                                    variant="outlined"
                                    type="submit"
                                    startIcon={<Search style={{ fontSize: '18px' }} />}
                                >
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>

                {produccionData && (
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon style={{ fontSize: '18px' }} />}
                                onClick={() => window.history.back()}
                            >
                                Volver
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon style={{ fontSize: '18px' }} />}
                                onClick={convertToPdf}
                            >
                                Descargar PDF
                            </Button>
                        </Stack>
                        <ParentCard>
                            <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización Reporte de Producción por Módulo</h5>
                            <div ref={contenidoRef} style={{ position: 'relative' }}>
                                <p style={{ fontSize: '8pt', margin: '2px 0' }}>Fecha y hora de impresión: {new Date().toLocaleString()} </p>
                                <br />
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                                            REPORTE DE PRODUCCIÓN POR MÓDULO <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Fecha Inicio:</th>
                                        <td colSpan="3">{new Date(formik.values.fecha_inicio).toLocaleDateString()}</td>
                                        <th bgcolor="#f8f8f8">Fecha Fin:</th>
                                        <td colSpan="4">{new Date(formik.values.fecha_fin).toLocaleDateString()}</td>
                                    </tr>
                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>LISTADO DE PRODUCCIÓN POR MÓDULO</th>
                                    </tr>
                                </table>

                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                                    <thead>
                                        <tr bgcolor="#eeeeee">
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Nombre del Módulo</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Total Producción</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Promedio Cantidad</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Promedio Daño</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Promedio Producción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produccionData.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: "1px solid black" }}>{item.modu_Nombre}</td>
                                                <td style={{ border: "1px solid black" }}>{item.totalProduccion}</td>
                                                <td style={{ border: "1px solid black" }}>{item.promedioCantidad}</td>
                                                <td style={{ border: "1px solid black" }}>{item.promedioDanio}</td>
                                                <td style={{ border: "1px solid black" }}>{item.promedioProduccion}</td>
                                            </tr>
                                        ))}
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
    )
}

export default ProduccionPorModuloPdf;