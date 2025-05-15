import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Button, CircularProgress, Box, Stack, MenuItem, Autocomplete } from '@mui/material';
import ParentCard from '../../../components/shared/ParentCard';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import { Search } from '@mui/icons-material';
import materialesporcompra from '../../../models/materialesporpoModel.js';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { IconArrowBack, IconDownload } from '@tabler/icons';

const Materialesporpo = () => {
  const [Materialesporpo, setmaterialesporpo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const contenidoRef = useRef();

  const [orcoId, setOrcoId] = useState('');
  const [ordenes, setOrdenes] = useState([]);

  React.useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    axios.get(`${apiUrl}/api/OrdenCompra/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setOrdenes(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener las órdenes de compra:', error);
      });
  }, []);

  const buscarMaterialesPorPO = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/Reportes/MaterialesPorPO`,
        { orco_Id: orcoId },
        { headers: { 'XApiKey': apiKey } }
      );
      if (response.data && Array.isArray(response.data.data)) {
        setmaterialesporpo(response.data.data);
        console.log('Materiales por PO:', response.data.data);
        setShowTable(true);
      }
    } catch (error) {
      console.error('Error al obtener los materiales por PO:', error);
    }
    setLoading(false);
  };

  const convertToPdf = async () => {
    const opt = {
      margin: 3,
      filename: 'materialesporpo.pdf',
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

    const nombreArchivo = `documentos/materialesporpo-${Date.now()}.pdf`;
    const archivoRef = ref(storage, nombreArchivo);

    const pdfBlobSinQR = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');
    await uploadBytes(archivoRef, pdfBlobSinQR);

    const urlDescarga = await getDownloadURL(archivoRef);
    const qrDataUrl = await QRCode.toDataURL(urlDescarga);

    const qrContainer = document.getElementById("qr-materialesporpo");
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
      <Breadcrumb title="Materiales por Orden de compra" subtitle="Listar" />
      <ParentCard>
        <Grid container spacing={3} mb={3} alignItems="center">
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Orden de Compra</CustomFormLabel>
            <Autocomplete
              options={ordenes}
              getOptionLabel={orden => `${orden.orco_Id} - ${orden.orco_Codigo}`}
              value={ordenes.find(o => o.orco_Id === orcoId) || null}
              onChange={(_, value) => setOrcoId(value ? value.orco_Id : '')}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Buscar orden"
                  variant="outlined"
                  fullWidth
                />
              )}
              isOptionEqualToValue={(option, value) => option.orco_Id === value.orco_Id}
            />
          </Grid>
          <Grid item lg={6} md={12} sm={12} display="flex" alignItems="center">
            <Box display="flex" justifyContent="flex-start" alignItems="center" height="100%" mt={{ xs: 2, md: 4 }}>
              <Button
                variant="contained"
                onClick={buscarMaterialesPorPO}
                startIcon={<Search />}
                sx={{ minWidth: 150 }}
              >
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <CircularProgress />
          </Box>
        )}

        {showTable && Materialesporpo.length > 0 && (
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
              <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización Materiales por Orden de Compra </h5>
              <div ref={contenidoRef} style={{ position: 'relative' }}>
                <p style={{ fontSize: '8pt', margin: '2px 0' }}>fecha y hora de impresion: {new Date().toLocaleString()} </p>
                <br />
                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                  <tr bgcolor="#eeeeee">
                    <th colSpan="5" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                      REPORTE DE MATERIALES POR ORDEN DE COMPRA <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                    </th>
                    <th rowSpan="2" id="qr-materialesporpo" style={{ height: '100px', width: '100px', textAlign: 'center', backgroundColor: 'rgb(180 237 255)', border: "1px solid black", color: 'rgb(23, 151, 190)' }}>QR</th>
                  </tr>
                  <tr>
                    <th bgcolor="#f8f8f8">Orden Seleccionada:</th>
                    <td colSpan="4">
                      {ordenes.find(o => o.orco_Id === orcoId)?.orco_Codigo || ''}
                    </td>
                  </tr>
                  <tr bgcolor="#eeeeee">
                    <th colSpan="6" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>LISTADO DE MATERIALES POR ORDEN DE COMPRA</th>
                  </tr>
                </table>
                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                  <thead>
                    <tr bgcolor="#eeeeee">
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Código Orden</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Cliente</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Material</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Cantidad Solicitada</th>
                      <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Fecha Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Materialesporpo.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ border: "1px solid black", textAlign: 'center' }}>{item.orco_Codigo}</td>
                        <td style={{ border: "1px solid black" }}>{item.clie_Nombre_O_Razon_Social}</td>
                        <td style={{ border: "1px solid black" }}>{item.mate_Descripcion}</td>
                        <td style={{ border: "1px solid black", textAlign: 'right' }}>{item.ppde_Cantidad}</td>
                        <td style={{ border: "1px solid black" }}>{item.orco_FechaCreacion ? new Date(item.orco_FechaCreacion).toLocaleDateString() : ''}</td>
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

export default Materialesporpo;