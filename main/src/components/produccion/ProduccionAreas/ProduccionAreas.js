import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Grid, MenuItem } from '@mui/material';
import {
    Button, Stack, Select, FormControl
} from '@mui/material';
import { useFormik } from 'formik';
import ParentCard from '../../../components/shared/ParentCard';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import { Search } from '@mui/icons-material';
import jsPDF from 'jspdf';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const ProduccionAreasPdf = () => {
    const [produccionData, setProduccionData] = useState(null);
    const [areasLista, setAreasLista] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const contenidoRef = useRef();

    const today = new Date();

    const formik = useFormik({
        initialValues: {
            fechaInicio: today.toISOString().substring(0, 10),
            fechaFin: today.toISOString().substring(0, 10),
            tipa_Id: 0
        },
        onSubmit: (values) => {
            buscarProduccionAreas(values);
        }
    });

    useEffect(() => {
        cargarAreas();
    }, []);

    const cargarAreas = async () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            const response = await axios.get(`${apiUrl}/api/Areas/Listar`, {
                headers: {
                    'XApiKey': apiKey
                }
            });

            if (response.data && response.data.data) {
                setAreasLista(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar áreas:', error);
        }
    };

    const buscarProduccionAreas = async (values) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        if (values.tipa_Id === 0) {
            alert('Por favor seleccione un área.');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/Reportes/ProduccionAreas`, values, {
                headers: {
                    'XApiKey': apiKey
                }
            });

            if (response.data && response.data.data) {
                setProduccionData(response.data.data);
                setPdfUrl(null); // Limpiar previsualización previa
            }
        } catch (error) {
            console.error('Error al buscar producción por áreas:', error);
        }
    };

    // Genera el PDF y lo muestra en el visor
    const previewPdf = async () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });
        await doc.html(contenidoRef.current, {
            margin: [10, 10, 10, 10],
            autoPaging: 'text',
            html2canvas: {
                scale: 1.5,
                useCORS: true,
            },
            callback: function (doc) {
                const blob = doc.output('blob');
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setPdfBlob(blob);
            },
        });
    };

    // Descarga el PDF generado
    const downloadPdf = () => {
        if (pdfBlob) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'produccion-areas.pdf';
            link.click();
        }
    };

    const obtenerDetalles = (jsonString) => {
        if (!jsonString) return [];
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error al parsear detalles JSON:', error);
            return [];
        }
    };

    const obtenerNombreArea = () => {
        const areaSeleccionada = areasLista.find(area => area.tipa_Id === formik.values.tipa_Id);
        return areaSeleccionada ? areaSeleccionada.tipa_area : 'Área';
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={2}>
                                <CustomFormLabel>Área</CustomFormLabel>
                                <FormControl fullWidth>
                                    <Select
                                        value={formik.values.tipa_Id}
                                        name="tipa_Id"
                                        onChange={formik.handleChange}
                                        placeholder="Seleccione un área"
                                        displayEmpty
                                    >
                                        <MenuItem value={0} disabled>
                                            Seleccione un área
                                        </MenuItem>
                                        {areasLista.map((area) => (
                                            <MenuItem key={area.tipa_Id} value={area.tipa_Id}>
                                                {area.tipa_area}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <CustomFormLabel>Fecha Inicio</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    type="date"
                                    name="fechaInicio"
                                    value={formik.values.fechaInicio}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <CustomFormLabel>Fecha Fin</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    type="date"
                                    name="fechaFin"
                                    value={formik.values.fechaFin}
                                    onChange={formik.handleChange}
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
                                startIcon={<VisibilityIcon style={{ fontSize: '18px' }} />}
                                onClick={previewPdf}
                            >
                                Previsualizar PDF
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<DownloadIcon style={{ fontSize: '18px' }} />}
                                onClick={downloadPdf}
                                disabled={!pdfUrl}
                            >
                                Descargar PDF
                            </Button>
                        </Stack>

                        <ParentCard>
                            <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}>
                                Previsualización Reporte de Producción - Área: {obtenerNombreArea()}
                            </h5>
                            <div
                                ref={contenidoRef}
                                style={{
                                    background: '#fff',
                                    width: '794px', // A4 width at 96dpi
                                    minHeight: '1123px', // A4 height at 96dpi
                                    margin: '0 auto',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                    padding: '32px',
                                    fontSize: '10pt',
                                    color: '#222',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <p style={{ fontSize: '9pt', margin: '2px 0' }}>
                                    Fecha y hora de impresión: {new Date().toLocaleString()}
                                </p>
                                <br />
                                <table style={{
                                    width: '100%',
                                    tableLayout: 'fixed',
                                    wordWrap: 'break-word',
                                    fontSize: '9pt',
                                    borderCollapse: 'collapse'
                                }} border="1" cellPadding="2" cellSpacing="0">
                                    <tbody>
                                        <tr style={{ background: '#eeeeee' }}>
                                            <th colSpan="9" style={{
                                                background: '#1797be',
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: '13px',
                                                border: "1px solid black"
                                            }}>
                                                REPORTE DE PRODUCCIÓN POR ÁREAS <br />
                                                <span style={{ fontSize: '11px' }}>-- IMPRESA --</span>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{ background: '#f8f8f8' }}>Área:</th>
                                            <td colSpan="3">{obtenerNombreArea()}</td>
                                            <th style={{ background: '#f8f8f8' }}>Fecha Inicio:</th>
                                            <td>{new Date(formik.values.fechaInicio).toLocaleDateString()}</td>
                                            <th style={{ background: '#f8f8f8' }}>Fecha Fin:</th>
                                            <td>{new Date(formik.values.fechaFin).toLocaleDateString()}</td>
                                        </tr>
                                        <tr style={{ background: '#eeeeee' }}>
                                            <th colSpan="9" style={{
                                                border: "1px solid black",
                                                color: '#1797be',
                                                textAlign: 'center',
                                                fontSize: '12px'
                                            }}>
                                                RESUMEN DE PRODUCCIÓN
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>

                                {produccionData.map((item, index) => (
                                    <div key={index} style={{ pageBreakInside: 'avoid' }}>
                                        <table style={{
                                            width: '100%',
                                            tableLayout: 'fixed',
                                            wordWrap: 'break-word',
                                            fontSize: '9pt',
                                            marginTop: '10px',
                                            borderCollapse: 'collapse'
                                        }} border="1" cellPadding="2" cellSpacing="0">
                                            <thead>
                                                <tr style={{ background: '#eeeeee' }}>
                                                    <th colSpan="2" style={{
                                                        border: "1px solid black",
                                                        background: '#1797be',
                                                        color: 'white',
                                                        textAlign: 'center'
                                                    }}>
                                                        Estadísticas de {item.tipa_area}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8', width: '50%' }}>Total del Periodo:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.totalPeriodo.toLocaleString()}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Total Dañado:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.totalDanado.toLocaleString()}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Total Exitoso:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.totalExitoso.toLocaleString()}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Porcentaje Dañado:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{(item.porcentajeDanado * 100).toFixed(2)}%</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Porcentaje Bueno:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{(item.porcentajeBueno).toFixed(2)}%</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Promedio Diario:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.promedioDia.toLocaleString()}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Promedio Dañado:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.promedioDanado.toLocaleString()}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid black", background: '#f8f8f8' }}>Promedio Exitoso:</td>
                                                    <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.promedioExitoso.toLocaleString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <table style={{
                                            width: '100%',
                                            tableLayout: 'fixed',
                                            wordWrap: 'break-word',
                                            fontSize: '9pt',
                                            marginTop: '10px',
                                            borderCollapse: 'collapse'
                                        }} border="1" cellPadding="2" cellSpacing="0">
                                            <thead>
                                                <tr style={{ background: '#eeeeee' }}>
                                                    <th colSpan="7" style={{
                                                        border: "1px solid black",
                                                        background: '#1797be',
                                                        color: 'white',
                                                        textAlign: 'center'
                                                    }}>
                                                        Detalles de Producción
                                                    </th>
                                                </tr>
                                                <tr style={{ background: '#eeeeee' }}>
                                                    <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Código Orden</th>
                                                    <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Fecha</th>
                                                    <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Estilo</th>
                                                    <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Sexo</th>
                                                    <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Total Día</th>
                                                    <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Total Dañado</th>
                                                    <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {obtenerDetalles(item.detalles).map((detalle, i) => (
                                                    <tr key={i}>
                                                        <td style={{ border: "1px solid black" }}>{detalle.orco_Codigo}</td>
                                                        <td style={{ border: "1px solid black", textAlign: 'center' }}>{new Date(detalle.remo_Fecha).toLocaleDateString()}</td>
                                                        <td style={{ border: "1px solid black" }}>{detalle.esti_Descripcion}</td>
                                                        <td style={{ border: "1px solid black", textAlign: 'center' }}>{detalle.code_Sexo}</td>
                                                        <td style={{ border: "1px solid black", textAlign: 'right' }}>{detalle.rdet_TotalDia.toLocaleString()}</td>
                                                        <td style={{ border: "1px solid black", textAlign: 'right' }}>{detalle.rdet_TotalDanado.toLocaleString()}</td>
                                                        <td style={{ border: "1px solid black", textAlign: 'right' }}>{detalle.code_Valor.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}

                                {/* Marca de agua o logo */}
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

                        {/* Previsualizador PDF */}
                        {pdfUrl && (
                            <div style={{ marginTop: 32 }}>
                                <h5 style={{ textAlign: 'center', marginBottom: 8 }}>Vista previa del PDF generado</h5>
                                <iframe
                                    src={pdfUrl}
                                    title="Previsualización PDF"
                                    width="100%"
                                    height="600px"
                                    style={{ border: '1px solid #ccc' }}
                                />
                            </div>
                        )}
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default ProduccionAreasPdf;