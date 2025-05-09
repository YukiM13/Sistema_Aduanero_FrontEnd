import React, { useRef } from 'react';
import { Button, Stack } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';
import 'jspdf-autotable';
import ParentCard from '../../../components/shared/ParentCard';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg'; // Importar como componente

const DeclaracionValorImpresionPdf = ({ declaracionValor, onCancelar }) => {
    const contenidoRef = useRef();

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

        const nombreArchivo = `documentos/archivo-${Date.now()}.pdf`;
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
    }

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

            <ParentCard>
                <h5 style={{ textAlign: 'center', margin: '0 0 15px 0',fontSize: '18px' }}> Previsualización Declaración de Valor </h5>
                <div ref={contenidoRef} style={{ position: 'relative' }}>
                    <p style={{ fontSize: '8pt', margin: '2px 0' }}>fecha y hora de impresion: {new Date().toLocaleString()} </p>
                 <br />
                    <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                        <tr bgcolor="#eeeeee">
                            <th colSpan="8" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                                DECLARACION DE VALOR DE IMPORTACIÓN Y EXPORTACIÓN <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span> </th>
                            <th rowSpan="2" id="qr" style={{ height: '100px', width: '100px', textAlign: 'center', backgroundColor: 'rgb(180 237 255)', border: "1px solid black", color: 'rgb(23, 151, 190)' }}>QR</th>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">Aduana : </th>
                            <td colSpan="2">{declaracionValor.adua_IngresoNombre}</td>
                            <th bgcolor="#f8f8f8">Codigo Ingreso :</th>
                            <td colSpan="2">{declaracionValor.adua_IngresoCodigo}</td>
                            <th bgcolor="#f8f8f8">Codigo Despacho :</th>
                            <td colSpan="2">{declaracionValor.adua_DespachoCodigo}</td>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">ID Declaración Valor :</th>
                            <td colSpan="2">{declaracionValor.deva_Id}</td>
                            <th bgcolor="#f8f8f8">Codigo Regimen :</th>
                            <td colSpan="2">{declaracionValor.regi_Codigo}</td>
                            <th bgcolor="#f8f8f8">No DUCA :</th>
                            <td colSpan="2">{declaracionValor.duca_No_DUCA}</td>
                        </tr>
                        <tr>
                            <th bgcolor="#f8f8f8">Regimen :</th>
                            <td colSpan="2">{declaracionValor.regi_Descripcion}</td>
                            <th bgcolor="#f8f8f8">Fecha aceptación :</th>
                            <td>{declaracionValor.deva_FechaAceptacion}</td>
                        </tr>
                        <tr bgcolor="#eeeeee">
                            <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>INFORMACIÓN DEL IMPORTADOR</th>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">Numero Registro :</th>
                            <td colSpan="2">{declaracionValor.impo_NumRegistro}</td>
                            <th bgcolor="#f8f8f8"> RTN :</th>
                            <td colSpan="2">{declaracionValor.impo_RTN}</td>
                            <th bgcolor="#f8f8f8">Telefono :</th>
                            <td colSpan="2">{declaracionValor.impo_Telefono}</td>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">Ciudad :</th>
                            <td colSpan="2">{declaracionValor.impo_CiudadNombre}</td>
                            <th bgcolor="#f8f8f8">Pais :</th>
                            <td colSpan="2">{declaracionValor.impo_PaisNombre}</td>
                        </tr>
                        <tr>
                            <th bgcolor="#f8f8f8">Direccion :</th>
                            <td colSpan="4">{declaracionValor.impo_Direccion_Exacta}</td>
                        </tr>
                        <tr>
                            <th bgcolor="#f8f8f8">Razon Social :</th>
                            <td colSpan="2">{declaracionValor.impo_Nombre_Raso}</td>
                        </tr>
                        <tr bgcolor="#eeeeee">
                            <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>TRANSPORTE Y EXPORTACIÓN</th>
                        </tr>
                        <tr>
                            <th bgcolor="#f8f8f8">Nombre embarcacion :</th>
                            <td colSpan="2">{declaracionValor.embarcacionNombre}</td>
                            <th bgcolor="#f8f8f8">Nombre exportación :</th>
                            <td colSpan="2">{declaracionValor.pais_ExportacionNombre}</td>
                        </tr>
                        <tr>
                            <th bgcolor="#f8f8f8">Fecha exportación :</th>
                            <td colSpan="2">{declaracionValor.deva_FechaExportacion}</td>
                            <th bgcolor="#f8f8f8">lugar Embarque:</th>
                            <td colSpan="2">{declaracionValor.lugarEmbarque}</td>
                        </tr>
                        <tr>
                            <th bgcolor="#f8f8f8">Moneda :</th>
                            <td colSpan="2">{declaracionValor.monedaNombre}</td>
                            <th bgcolor="#f8f8f8">Incoterm :</th>
                            <td colSpan="2">{declaracionValor.inco_Descripcion}</td>
                            <th bgcolor="#f8f8f8">Version Incoterm :</th>
                            <td colSpan="2">{declaracionValor.inco_Version}</td>
                        </tr>
                        <tr bgcolor="#eeeeee">
                            <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>PROVEEDOR</th>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">Numero Identificacion :</th>
                            <td colSpan="2">{declaracionValor.prov_NumeroIdentificacion}</td>
                            <th bgcolor="#f8f8f8">Condiciones Comerciales :</th>
                            <td colSpan="2" >{declaracionValor.coco_Descripcion}</td>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">Ciudad :</th>
                            <td colSpan="2">{declaracionValor.prov_CiudadNombre}</td>
                            <th bgcolor="#f8f8f8">Pais :</th>
                            <td colSpan="2">{declaracionValor.prov_PaisNombre}</td>
                            <th bgcolor="#f8f8f8">Telefono :</th>
                            <td colSpan="2">{declaracionValor.prov_Telefono}</td>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">Direccion :</th>
                            <td colSpan="5">{declaracionValor.prov_Direccion_Exacta}</td>
                        </tr>

                        <tr>
                            <th bgcolor="#f8f8f8">razon social :</th>
                            <td colSpan="5">{declaracionValor.prov_Nombre_Raso}</td>
                        </tr>

                        <tr bgcolor="#eeeeee" style={{ border: "1px solid black" }}>
                            <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>VALORES</th>
                        </tr>
                        <tr >
                            <th bgcolor="#f8f8f8">Precio Factura:</th>
                            <td colSpan="2">{declaracionValor.base_PrecioFactura}</td>
                            <th bgcolor="#f8f8f8">Comision Correlaje :</th>
                            <td colSpan="2">{declaracionValor.base_ComisionCorrelaje}</td>
                            <th bgcolor="#f8f8f8">Gasto u Otros :</th>
                            <td colSpan="2">{declaracionValor.base_Gasto_Otros}</td>
                        </tr>
                        <tr>
                            <th bgcolor="#f8f8f8">Precio Pagado:</th>
                            <td colSpan="2">{declaracionValor.base_Total_Ajustes_Precio_Pagado}</td>
                            <th bgcolor="#f8f8f8">Precio Real :</th>
                            <td colSpan="2">{declaracionValor.base_PrecioReal}</td>
                            <th bgcolor="#f8f8f8">Valor Aduana :</th>
                            <td colSpan="2">{declaracionValor.base_Valor_Aduana}</td>
                        </tr>

                        <tr bgcolor="#eeeeee">
                            <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>OBSERVACIONES</th>
                        </tr>
                        <tr>
                            <th colSpan="2" bgcolor="#f8f8f8">Observaciones :</th>
                            <td colSpan="5">{declaracionValor.deva_Observaciones}</td>
                        </tr>

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
                </div>
            </ParentCard>
        </>

    );
};

export default DeclaracionValorImpresionPdf;
