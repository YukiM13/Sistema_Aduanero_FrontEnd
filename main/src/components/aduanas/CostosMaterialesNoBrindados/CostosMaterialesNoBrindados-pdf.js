import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Stack
} from '@mui/material';
import { useFormik } from 'formik';
import ParentCard from '../../../components/shared/ParentCard';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import { Search } from '@mui/icons-material';
import CostosMaterialesNoBrindadosModel from 'src/models/costosmaterialesnobrindadosmodel';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';

const CostosMaterialesNoBrindadosPdf = () => {
    const [materialesData, setMaterialesData] = useState(null);
    const contenidoRef = useRef();
    const formik = useFormik({
        initialValues: {
            mate_FechaInicio: CostosMaterialesNoBrindadosModel.mate_FechaInicio.substring(0, 10),
            mate_FechaLimite: CostosMaterialesNoBrindadosModel.mate_FechaLimite.substring(0, 10)
        },
        onSubmit: (values) => {
            buscarCostosMaterialesNoBrindados(values);
        }
    });

    const buscarCostosMaterialesNoBrindados = async (values) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        
        try {
            const response = await axios.post(`${apiUrl}/api/Reportes/CostosMaterialesNoBrindados`, values, {
                headers: {
                    'XApiKey': apiKey
                }
            });
            
            if (response.data && response.data.data) {
                setMaterialesData(response.data.data);
                console.log('Datos:', response.data.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const convertToPdf = async () => {
        const opt = {
            margin: 3,
            filename: 'temporal.pdf',
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

        const nombreArchivo = `documentos/materiales-no-brindados-${Date.now()}.pdf`;
        const archivoRef = ref(storage, nombreArchivo);

        // 1. Generar primer PDF (sin QR)
        const pdfBlobSinQR = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');

        // 2. Subir a Firebase
        await uploadBytes(archivoRef, pdfBlobSinQR);

        // 3. Obtener la URL del archivo subido
        const urlDescarga = await getDownloadURL(archivoRef);

        // 4. Generar el QR con esa URL
        const qrDataUrl = await QRCode.toDataURL(urlDescarga);

        // 5. Insertar el QR en el DOM
        const qrContainer = document.getElementById("qr");
        const img = document.createElement("img");
        img.src = qrDataUrl;
        img.width = 100;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        qrContainer.innerHTML = '';
        qrContainer.appendChild(img);

        // 6. Generar el PDF nuevamente, ahora con el QR
        const pdfBlobConQR = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');

        // 7. Subir el nuevo PDF (sobrescribiendo el anterior o como otro archivo)
        await uploadBytes(archivoRef, pdfBlobConQR);
        setTimeout(async () => {
            const nuevaUrlDescarga = await getDownloadURL(archivoRef);
            const printWindow = window.open(nuevaUrlDescarga, '_blank');
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print();
                };
            } else {
                alert("Por favor permite las ventanas emergentes en tu navegador.");
            }
        }, 1000); // Ajusta el tiempo si aún no carga
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={2}>
                                <CustomFormLabel>Fecha Inicio</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    type="date"
                                    name="mate_FechaInicio"
                                    value={formik.values.mate_FechaInicio}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <CustomFormLabel>Fecha Fin</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    type="date"
                                    name="mate_FechaLimite"
                                    value={formik.values.mate_FechaLimite}
                                    onChange={formik.handleChange}
                                />
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

                {materialesData && (
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
                            <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización Costos de Materiales No Brindados </h5>
                            <div ref={contenidoRef} style={{ position: 'relative' }}>
                                <p style={{ fontSize: '8pt', margin: '2px 0' }}>fecha y hora de impresion: {new Date().toLocaleString()} </p>
                                <br />
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="8" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                                           REPORTE DE COSTOS DE MATERIALES NO BRINDADOS <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                                        </th>
                                        <th rowSpan="2" id="qr" style={{ height: '100px', width: '100px', textAlign: 'center', backgroundColor: 'rgb(180 237 255)', border: "1px solid black", color: 'rgb(23, 151, 190)' }}>QR</th>
                                    </tr>

                                    {/* <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>PARÁMETROS DE BÚSQUEDA</th>
                                    </tr> */}
                                    <tr>
                                        <th bgcolor="#f8f8f8">Fecha Inicio:</th>
                                        <td colSpan="3">{new Date(formik.values.mate_FechaInicio).toLocaleDateString()}</td>
                                        <th bgcolor="#f8f8f8">Fecha Fin:</th>
                                        <td colSpan="4">{new Date(formik.values.mate_FechaLimite).toLocaleDateString()}</td>
                                    </tr>

                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>LISTADO DE MATERIALES NO BRINDADOS</th>
                                    </tr>
                                </table>
                                
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                                    <thead>
                                        <tr bgcolor="#eeeeee">
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>ID</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Descripción</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Número Serie</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Marca</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Precio Promedio</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Total Material</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Porcentaje</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {materialesData.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: "1px solid black", textAlign: 'center' }}>{item.maqu_Id}</td>
                                                <td style={{ border: "1px solid black" }}>{item.mate_Descripcion}</td>
                                                <td style={{ border: "1px solid black" }}>{item.maqu_NumeroSerie}</td>
                                                <td style={{ border: "1px solid black" }}>{item.marq_Nombre}</td>
                                                <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.precioPromedioMaterial?.toFixed(2)}</td>
                                                <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.totalMaterial?.toFixed(2)}</td>
                                                <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.porcentajeMaterial?.toFixed(2)}%</td>
                                                <td style={{ border: "1px solid black" }}>{item.mahi_Observaciones}</td>
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
                                                    <LogoAzul style={{maxWidth: '100%', maxHeight: '100%'}}/>2s
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

export default CostosMaterialesNoBrindadosPdf;