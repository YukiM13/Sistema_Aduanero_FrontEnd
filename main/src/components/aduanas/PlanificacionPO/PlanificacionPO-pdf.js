import React, { useState, useRef, useEffect } from 'react';
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
import PlanificacionPoModel from 'src/models/planificacionpomodel';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';
// Autocomplete
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';  
import Autocomplete from '@mui/material/Autocomplete';
// Autocomplete

import StyledButton from 'src/components/shared/StyledButton';

const PlanificacionPoPdf = () => {
    const [planificacionData, setPlanificacionData] = useState([]);
      const [SelectedOrco, setSelectedOrco] = useState(null);
    const [orcoData, setOrcoData] = useState(null);
    const contenidoRef = useRef();

    const formik = useFormik({
        initialValues: {
            orco_Id: '1'
        },
        onSubmit: (values) => {
            buscarplanificacionPO(values);
        }
    });

    const buscarplanificacionPO = async (values) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            const response = await axios.post(`${apiUrl}/api/Reportes/PlanificacionPO`, values, {
                headers: {
                    'XApiKey': apiKey
                }
            });

            if (response.data && response.data.data) {
                setPlanificacionData(response.data.data);
                console.log('Datos:', response.data.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

  const buscarOrcoId = async (values) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            const response = await axios.get(`${apiUrl}/api/AsignacionesOrden/Listar`, {
                headers: {
                    'XApiKey': apiKey
                }
            });

            if (response.data && response.data.data) {
                setOrcoData(response.data.data);
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

        const nombreArchivo = `documentos/deva-${Date.now()}.pdf`;
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

useEffect(() => {
        buscarOrcoId()
    }, []);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={2}>
                                

        {/* Comienzo d autocomplete */}



                   
                        <CustomFormLabel>ID de Orden</CustomFormLabel>
                        <Autocomplete
                        options={orcoData}
                        getOptionLabel={(option) => option.orco_Codigo || ''}
                        value={SelectedOrco}
                        onChange={(event, newValue) => {
                            setSelectedOrco(newValue);
                            if (newValue) {
                            formik.setFieldValue('orco_Id', newValue.orco_Id);
                            } else {
                            formik.setFieldValue('orco_Id', 0);
                            formik.setFieldValue('orco_Id', 0);
                            }
                        }}
                        
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Seleccione un País"
                            error={formik.touched.orco_Id && Boolean(formik.errors.orco_Id)}
                            helperText={formik.touched.orco_Id && formik.errors.orco_Id}
                            />
              )}
              noOptionsText="No hay países disponibles"
              isOptionEqualToValue={(option, value) => option.orco_Id === value?.orco_Id} />


                                {/* <CustomTextField
                                    fullWidth
                                    name="orco_Id"
                                    value={formik.values.orco_Id}
                                    onChange={formik.handleChange}
                                />*/}
                            </Grid> 

         {/* fin d autocomplete */}                   
                            <Grid item style={{  marginTop: '5%'}}>
                                <Button
                                    variant="outlined"
                                    type="submit"
                                    startIcon={<Search />}
                                >
                                    Buscar
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>

                {planificacionData.length>0 && (
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                           

 <StyledButton           
                  sx={{}} 
                  title='Regresar' 
                  event={() => window.history.back()}
                  variant='back'
                  >
                  
                </StyledButton>


                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={convertToPdf}
                            >
                                Descargar PDF
                            </Button>
                        </Stack>

                        <ParentCard>
                            <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización Planificación PO </h5>
                            <div ref={contenidoRef} style={{ position: 'relative' }}>
                                <p style={{ fontSize: '8pt', margin: '2px 0' }}>fecha y hora de impresion: {new Date().toLocaleString()} </p>
                                <br />
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="8" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                                            PLANIFICACIÓN PO <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                                        </th>
                                        <th rowSpan="2" id="qr" style={{ height: '100px', width: '100px', textAlign: 'center', backgroundColor: 'rgb(180 237 255)', border: "1px solid black", color: 'rgb(23, 151, 190)' }}>QR</th>
                                    </tr>

                                    {/* <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>INFORMACIÓN DE LA ORDEN</th>
                                    </tr> */}
                                    <tr>
                                        <th bgcolor="#f8f8f8">Orden ID:</th>
                                        <td colSpan="2">{(planificacionData[0].orco_Id)?planificacionData[0].orco_Id:'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Cantidad Prenda:</th>                                        <td colSpan="2">{planificacionData[0].code_CantidadPrenda || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Sexo:</th>
                                        <td colSpan="2">{planificacionData[0].code_Sexo || 'No Disponible'}</td>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Fecha Inicio:</th>
                                        <td colSpan="2">{(planificacionData[0].asor_FechaInicio) ? new Date(planificacionData[0].asor_FechaInicio).toLocaleDateString() : 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Fecha Límite:</th>
                                        <td colSpan="2">{(planificacionData[0].asor_FechaLimite) ? new Date(planificacionData[0].asor_FechaLimite).toLocaleDateString() : 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Material Inicio:</th>
                                        <td colSpan="2">{(planificacionData[0].mate_FechaInicio) ? new Date(planificacionData[0].mate_FechaInicio).toLocaleDateString() : 'No Disponible'}</td>
                                    </tr>


                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>INFORMACIÓN DEL CLIENTE</th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Cliente:</th>
                                        <td colSpan="2">{planificacionData[0].clie_Nombre_O_Razon_Social||'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">RTN:</th>
                                        <td colSpan="2">{(planificacionData[0].clie_RTN)?planificacionData[0].clie_RTN:'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">ID:</th>
                                        <td colSpan="2">{(planificacionData[0].clie_Id)?planificacionData[0].clie_Id:'No Disponible'}</td>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Nombre contacto:</th>
                                        <td colSpan="2">{planificacionData[0].clie_Nombre_Contacto||'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Número Contacto:</th>
                                        <td colSpan="2">{planificacionData[0].clie_Numero_Contacto||'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Correo:</th>
                                        <td colSpan="2">{planificacionData[0].clie_Correo_Electronico||'No Disponible'}</td>
                                    </tr>

                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>DETALLES DE PRODUCCIÓN</th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Estilo:</th>
                                        <td colSpan="2">{planificacionData[0].esti_Descripcion||'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Color:</th>
                                        <td colSpan="2">{planificacionData[0].colr_Nombre||'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Talla:</th>
                                        <td colSpan="2">{planificacionData[0].tall_Nombre||'No Disponible'}</td>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Proceso:</th>
                                        <td colSpan="2">{planificacionData[0].proc_Descripcion ||'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Empleado:</th>
                                        <td colSpan="2">{planificacionData[0].empl_NombreCompleto ||'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Cantidad:</th>
                                        <td colSpan="2">{planificacionData[0].asor_Cantidad ||'No Disponible'}</td>
                                    </tr>

                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>ESTADÍSTICAS</th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Pedidos Terminados:</th>                                        <td colSpan="2">{planificacionData[0].pedidosTerminados || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">En Curso:</th>
                                        <td colSpan="2">{planificacionData[0].pedidosCurso || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Pendientes:</th>
                                        <td colSpan="2">{planificacionData[0].pedidosPendientes || 'No Disponible'}</td>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Cantidad Completada:</th>                                        <td colSpan="2">{planificacionData[0].cantidadCompletada || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8"> Completado:</th>
                                        <td colSpan="2">{(planificacionData[0].procentajeCompletado || 'No Disponible') }</td>
                                        <th bgcolor="#f8f8f8">Total Producción:</th>
                                        <td colSpan="2">{planificacionData[0].totalProduccion || 'No Disponible'}</td>
                                    </tr>

                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>INFORMACIÓN DE MÁQUINA</th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Máquina ID:</th>                                        <td colSpan="2">{planificacionData[0].maqu_Id || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Serie:</th>
                                        <td colSpan="2">{planificacionData[0].maqu_NumeroSerie || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Marca:</th>
                                        <td colSpan="2">{planificacionData[0].marq_Nombre || 'No Disponible'}</td>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Días Activa:</th>                                        <td colSpan="2">{planificacionData[0].diasActiva || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Días Inactiva:</th>
                                        <td colSpan="2">{planificacionData[0].diasInactiva || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Total Inactiva:</th>
                                        <td colSpan="2">{planificacionData[0].diasTotalesInactiva || 'No Disponible'}</td>
                                    </tr>

                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>PROMEDIOS Y TOTALES</th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Promedio Cantidad:</th>                                        <td colSpan="2">{planificacionData[0].promedioCantidad || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Promedio Daño:</th>
                                        <td colSpan="2">{planificacionData[0].promedioDanio || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Promedio Producción:</th>
                                        <td colSpan="2">{planificacionData[0].promedioProduccion || 'No Disponible'}</td>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Total Material:</th>                                        <td colSpan="2">{planificacionData[0].totalMaterial || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8">Promedio Material:</th>
                                        <td colSpan="2">{planificacionData[0].promedioMaterial || 'No Disponible'}</td>
                                        <th bgcolor="#f8f8f8"> Material:</th>
                                        <td colSpan="2">{(planificacionData[0].porcentajeMaterial || 'No Disponible')}</td>
                                    </tr>

                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>OBSERVACIONES</th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Observaciones:</th>
                                        <td colSpan="8">{planificacionData[0].mahi_Observaciones || 'No Disponible'}</td>
                                    </tr>
                                </table>

                                <div                                    style={{
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
                            </div>
                        </ParentCard>
                    </Grid>
                )}
            </Grid>
        </>
    );
};
export default PlanificacionPoPdf;