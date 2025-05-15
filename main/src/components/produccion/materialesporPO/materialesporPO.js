import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Grid, MenuItem, FormControl } from '@mui/material';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Stack
} from '@mui/material';
import ParentCard from '../../../components/shared/ParentCard';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import { Search } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';

const MaterialesPorPOPdf = () => {
    const [materialesData, setMaterialesData] = useState(null);
    const [ordenesCompra, setOrdenesCompra] = useState([]);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState('');
    const contenidoRef = useRef();

    // Cargar órdenes de compra cuando se monte el componente
    useEffect(() => {
        cargarOrdenesCompra();
    }, []);

    const cargarOrdenesCompra = async () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        
        try {
            const response = await axios.get(`${apiUrl}/api/OrdenCompra/Listar`, {
                headers: {
                    'XApiKey': apiKey
                }
            });
            
            if (response.data && response.data.data) {
                setOrdenesCompra(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar órdenes de compra:', error);
        }
    };

    const buscarMaterialesPorPO = async () => {
        if (!ordenSeleccionada) {
            alert('Por favor seleccione una orden de compra');
            return;
        }

        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
        
        try {
            // Enviar solo el ID de la orden como parte del objeto JSON en el cuerpo de la solicitud POST
            const requestData = {
                orco_Id: parseInt(ordenSeleccionada)
            };
            
            const response = await axios.post(`${apiUrl}/api/Reportes/MaterialesPorPO`, requestData, {
                headers: {
                    'XApiKey': apiKey,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data && response.data.data) {
                setMaterialesData(response.data.data);
                console.log('Datos de materiales:', response.data.data);
            }
        } catch (error) {
            console.error('Error al buscar materiales:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
        }
    };

    const handleOrdenChange = (event) => {
        setOrdenSeleccionada(event.target.value);
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

        const nombreArchivo = `documentos/materiales-po-${ordenSeleccionada}-${Date.now()}.pdf`;
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

        // 7. Subir el nuevo PDF (sobrescribiendo el anterior)
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
        }, 1000);
    };

    // Obtener la orden seleccionada para mostrar sus detalles
    const getOrdenSeleccionada = () => {
        return ordenesCompra.find(orden => orden.orco_Id === parseInt(ordenSeleccionada));
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} style={{ display: 'flex'}}>
                            <div style={{ width: '25%' }}>
                                <CustomFormLabel>Seleccione Orden de Compra</CustomFormLabel>
                                <FormControl fullWidth>
                                    <CustomTextField
                                        select
                                        fullWidth
                                        name="orco_Id"
                                        value={ordenSeleccionada}
                                        onChange={handleOrdenChange}
                                    >
                                        <MenuItem value="">Seleccionar...</MenuItem>
                                        {ordenesCompra.map((orden) => (
                                            <MenuItem key={orden.orco_Id} value={orden.orco_Id}>
                                                {orden.orco_Codigo} - {orden.clie_Nombre_O_Razon_Social}
                                            </MenuItem>
                                        ))}
                                    </CustomTextField>
                                </FormControl>
                            </div>
                            <Button
                                style={{width:'300px', height:'40px', marginTop:'5%', marginLeft:'10px'}}
                                variant="outlined"
                                onClick={buscarMaterialesPorPO}
                                startIcon={<Search style={{ fontSize: '18px' }}/>}
                            >
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>
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
                            <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> 
                                Previsualización Materiales por Orden de Compra 
                            </h5>
                            <div ref={contenidoRef} style={{ position: 'relative' }}>
                                <p style={{ fontSize: '8pt', margin: '2px 0' }}>Fecha y hora de impresion: {new Date().toLocaleString()} </p>
                                <br />
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="8" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                                            REPORTE DE MATERIALES POR ORDEN DE COMPRA <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                                        </th>
                                        <th rowSpan="2" id="qr" style={{ height: '100px', width: '100px', textAlign: 'center', backgroundColor: 'rgb(180 237 255)', border: "1px solid black", color: 'rgb(23, 151, 190)' }}>QR</th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Código PO:</th>
                                        <td colSpan="3">{getOrdenSeleccionada()?.orco_Codigo || ''}</td>
                                        <th bgcolor="#f8f8f8">Cliente:</th>
                                        <td colSpan="4">{getOrdenSeleccionada()?.clie_Nombre_O_Razon_Social || ''}</td>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Fecha Emisión:</th>
                                        <td colSpan="3">{getOrdenSeleccionada()?.orco_FechaEmision ? new Date(getOrdenSeleccionada().orco_FechaEmision).toLocaleDateString() : ''}</td>
                                        <th bgcolor="#f8f8f8">Fecha Límite:</th>
                                        <td colSpan="4">{getOrdenSeleccionada()?.orco_FechaLimite ? new Date(getOrdenSeleccionada().orco_FechaLimite).toLocaleDateString() : ''}</td>
                                    </tr>

                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>LISTADO DE MATERIALES</th>
                                    </tr>
                                </table>
                                
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                                    <thead>
                                        <tr bgcolor="#eeeeee">
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Categoría</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Subcategoría</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Material</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Código Lote</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Color</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Área</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Unidad Medida</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Cantidad</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {materialesData.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: "1px solid black" }}>{item.cate_Descripcion || '-'}</td>
                                                <td style={{ border: "1px solid black" }}>{item.subc_Descripcion || '-'}</td>
                                                <td style={{ border: "1px solid black" }}>{item.mate_Descripcion || '-'}</td>
                                                <td style={{ border: "1px solid black" }}>{item.lote_CodigoLote || '-'}</td>
                                                <td style={{ border: "1px solid black" }}>
                                                    <div style={{ 
                                                        backgroundColor: item.colr_CodigoHtml || '#FFFFFF', 
                                                        width: '10px', 
                                                        height: '10px', 
                                                        display: 'inline-block', 
                                                        marginRight: '5px', 
                                                        border: '1px solid #000' 
                                                    }}></div>
                                                    {item.colr_Nombre || '-'}
                                                </td>
                                                <td style={{ border: "1px solid black" }}>{item.tipa_area || '-'}</td>
                                                <td style={{ border: "1px solid black" }}>{item.unme_Descripcion || '-'}</td>
                                                <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.ppde_Cantidad || '0'}</td>
                                                <td style={{ border: "1px solid black" }}>{item.lote_Observaciones || '-'}</td>
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
                                    <LogoAzul style={{maxWidth: '100%', maxHeight: '100%'}}/>
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

export default MaterialesPorPOPdf;