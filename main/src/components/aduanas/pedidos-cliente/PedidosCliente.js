import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Button, CircularProgress, Box, Stack } from '@mui/material';
import {
  Table, TableBody, TableCell, TableContainer,Autocomplete,TextField,
  TableHead, TableRow, Paper
} from '@mui/material';
import { useFormik } from 'formik';
import SaveIcon from '@mui/icons-material/Save';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { IconPrinter, IconArrowBack, IconDownload } from '@tabler/icons';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import { Search } from '@mui/icons-material';
import pedidosClienteModel from '../../../models/pedidosClienteModel';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';

const PedidosCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [clie, setClie] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const contenidoRef = useRef();

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const formik = useFormik({
    initialValues: {
      ...pedidosClienteModel,
      clie_Id: 0
    },
  });

  const listarClientes = () => {
      axios.get(`${apiUrl}/api/Clientes/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setClie(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener los estados civiles:', error);
      });
  } 

  useEffect(() => {
    listarClientes();
    }, []);

  const buscarPedidoCliente = () => {
        
        const clienteId = formik.values.clie_Id;

        if (!clienteId) {
            alert("Por favor selecciona un cliente.");
            return;
        }

        setLoading(true);

        axios.post(`${apiUrl}/api/Reportes/PedidosCliente`,
            { clie_Id: clienteId },
            {
            headers: {
                'XApiKey': apiKey
            }
            }
        )
        .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
            setClientes(response.data.data);
            setShowTable(true);
            } else {
            setClientes([]);
            setShowTable(false);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error('Error al obtener las declaraciones de valor:', error);
            setLoading(false);
        });
    };

  const convertToPdf = async () => {
    const opt = {
      margin: 3,
      filename: 'pedidosCliente.pdf',
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

    const nombreArchivo = `documentos/pedidosCliente-${Date.now()}.pdf`;
    const archivoRef = ref(storage, nombreArchivo);

    const pdfBlobSinQR = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');


    await uploadBytes(archivoRef, pdfBlobSinQR);

    const urlDescarga = await getDownloadURL(archivoRef);

    const qrDataUrl = await QRCode.toDataURL(urlDescarga);

    const qrContainer = document.getElementById("qr-devas");
    const img = document.createElement("img");
    img.src = qrDataUrl;
    img.width = 100;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    qrContainer.innerHTML = '';
    qrContainer.appendChild(img);
    const pdfBlobConQR = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');

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

  return (
    <div>
      <Breadcrumb title="Pedidos Cliente" subtitle="Listar" />
      <ParentCard>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Cliente</CustomFormLabel>
            <Autocomplete
                fullWidth
                variant="outlined"
                sx={{
                    backgroundColor: '#fafafa',
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#aaa' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                    },
                }}
                options={clie}
                getOptionLabel={(option) => option.clie_Nombre_O_Razon_Social + ' (' +option.clie_RTN+')' || ''}
                value={clienteSeleccionado}
                onChange={(event, newValue) => {
                    setClienteSeleccionado(newValue);
                    if (newValue) {
                    formik.setFieldValue('clie_Id', newValue.clie_Id);
                    } else {
                    formik.setFieldValue('clie_Id', 0);
                    }
                }}
                renderInput={(params) => (
                    <TextField 
                    {...params}
                    variant="outlined"
                    placeholder="Seleccione un nivel comercial"
                    error={formik.touched.clie_Id && Boolean(formik.errors.clie_Id)}
                    helperText={formik.touched.clie_Id && formik.errors.clie_Id}
                    />
                )}
                noOptionsText="No hay clientes disponibles"
                isOptionEqualToValue={(option, value) => option.clie_Id === value?.clie_Id}
                />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={buscarPedidoCliente} startIcon={<Search />}>
              Buscar
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <CircularProgress />
          </Box>
        )}

        {showTable && clientes.length > 0 && (
          <>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<IconArrowBack style={{ fontSize: '18px' }} />}
                onClick={() => window.history.back()}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                startIcon={<IconDownload style={{ fontSize: '18px' }} />}
                onClick={convertToPdf}
              >
                Descargar PDF
              </Button>
            </Stack>
            <ParentCard>
              <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización de pedidos cliente </h5>
              <div ref={contenidoRef} style={{ position: 'relative' }}>
                <p style={{ fontSize: '8pt', margin: '2px 0' }}>fecha y hora de impresion: {new Date().toLocaleString()} </p>
                <br />
                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                  <tr bgcolor="#eeeeee">
                    <th colSpan="4" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                      REPORTE DE PEDIDOS CLIENTE <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                    </th>
                    <th rowSpan="2" id="qr-devas" style={{ height: '100px', width: '100px', textAlign: 'center', backgroundColor: 'rgb(180 237 255)', border: "1px solid black", color: 'rgb(23, 151, 190)' }}>QR</th>
                  </tr>
                  <tr>
                    <th bgcolor="#f8f8f8">Fecha Inicio:</th>
                    <td colSpan="1">{formik.values.fechaInicio ? new Date(formik.values.fechaInicio).toLocaleDateString() : ''}</td>
                    <th bgcolor="#f8f8f8">Fecha Fin:</th>
                    <td colSpan="1">{formik.values.fechaFin ? new Date(formik.values.fechaFin).toLocaleDateString() : ''}</td>
                  </tr>
                  <tr bgcolor="#eeeeee">
                    <th colSpan="5" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>LISTADO DE PEDIDOS CLIENTE</th>
                  </tr>
                </table>
                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                  <thead>
                    <tr bgcolor="#eeeeee">
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>ID</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Nombre o razón social</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Nombre de contacto</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>RTN</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Numero de contacto</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Correo electrónico</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Pedidos pendientes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((item) => (
                      <tr key={item.clie_Id}>
                        <td style={{ border: "1px solid black", textAlign: 'center' }}>{item.clie_Id}</td>
                        <td style={{ border: "1px solid black" }}>{item.clie_Nombre_O_Razon_Social}</td>
                        <td style={{ border: "1px solid black" }}>{item.clie_Nombre_Contacto}</td>
                        <td style={{ border: "1px solid black" }}>{item.clie_RTN}</td>
                        <td style={{ border: "1px solid black" }}>{item.clie_Numero_Contacto}</td>
                        <td style={{ border: "1px solid black" }}>{item.clie_Correo_Electronico}</td>
                        <td style={{ border: "1px solid black" }}>{item.pedidosPendientes}</td>
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
          </>
        )}
      </ParentCard>
    </div>
  );
};

export default PedidosCliente;
