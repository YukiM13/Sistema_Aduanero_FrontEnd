import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Grid, Button, CircularProgress, Box, Stack
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { IconDownload, IconArrowBack } from '@tabler/icons';
import ParentCard from '../shared/ParentCard';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import { storage } from '../../layouts/config/firebaseConfig';
import { useFormik } from 'formik';

// Eliminamos el objeto fieldOrder ya que usaremos directamente las claves del objeto detalles
// const fieldOrder = [...]

// Mapeo de nombres de la base de datos a nombres amigables para mostrar
const fieldNameMapping = {
  'item_Secuencia': 'Secuencia',
  'item_Inciso': 'Inciso',
  'item_CodProducto': 'Código',
  'item_DescProducto': 'Descripción',
  'item_PaisOrigen': 'País Origen',
  'item_UnidadMedida': 'U. Medida',
  'item_Cantidad': 'Cantidad',
  'item_PesoBruto': 'Peso Bruto (kg)',
  'item_PesoNeto': 'Peso Neto (kg)',
  'item_ValorFOB': 'Valor FOB ($)',
  'item_ValorFlete': 'Flete ($)',
  'item_ValorSeguro': 'Seguro ($)',
  'item_ValorAduana': 'Valor Aduana ($)',
  // Añade otros campos según sea necesario
};

const ImportacionesReporte = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const contenidoRef = useRef();

  const formik = useFormik({
    initialValues: {
      fechaInicio: '',
      fechaFin: ''
    },
  });

  

  const buscarReporte = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const { fechaInicio, fechaFin } = formik.values;
    if (!fechaInicio || !fechaFin) return;

    setLoading(true);
    axios.get(`${apiUrl}/api/Reportes/Importaciones`, {
      params: {
        fechaInicio,
        fechaFin
      },
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      setDatos(response.data.data || []);
      setShowTable(true);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error al obtener el reporte:', error);
      setLoading(false);
    });
  };

  const exportarPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: [10, 5, 10, 5], // [top, right, bottom, left] en mm
      filename: `reporte-importaciones-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true 
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'landscape', // Cambiado a horizontal para mejor visualización
        compress: true 
      },
      pagebreak: { mode: ['avoid-all'] }
    };


    

    const pdfBlob = await html2pdf().from(contenidoRef.current).set(opt).outputPdf('blob');
    const archivoRef = ref(storage, `documentos/importaciones-${Date.now()}.pdf`);
    await uploadBytes(archivoRef, pdfBlob);
    const urlDescarga = await getDownloadURL(archivoRef);
    window.open(urlDescarga, '_blank')?.print();
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(parseFloat(value))) return '0.00';
    return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const cellHeaderStyle = {
  border: "1px solid black",
  background: '#1797be',
  color: 'white',
  textAlign: 'center',
  fontSize: '8pt',
  padding: '4px'
};

const cellBodyStyle = {
  border: "1px solid black",
  padding: '4px',
  textAlign: 'left',
  fontSize: '7.5pt',
  wordWrap: 'break-word'
};


  return (
    <div>
      <Breadcrumb title="Importaciones" subtitle="Reporte por Rango de Fechas" />
      <ParentCard>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Fecha Inicio</CustomFormLabel>
            <CustomTextField
              fullWidth
              name="fechaInicio"
              id="fechaInicio"
              type="date"
              value={formik.values.fechaInicio}
              onChange={formik.handleChange}
              error={formik.touched.fechaInicio && Boolean(formik.errors.fechaInicio)}
              helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
            />
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel>Fecha Fin</CustomFormLabel>
            <CustomTextField
              fullWidth
              name="fechaFin"
              id="fechaFin"
              type="date"
              value={formik.values.fechaFin}
              onChange={formik.handleChange}
              error={formik.touched.fechaFin && Boolean(formik.errors.fechaFin)}
              helperText={formik.touched.fechaFin && formik.errors.fechaFin}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={buscarReporte} startIcon={<Search />}>
              Buscar
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <CircularProgress />
          </Box>
        )}

        {showTable && datos.length > 0 && (
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
                onClick={exportarPDF}
              >
                Descargar PDF
              </Button>
            </Stack>
            <ParentCard>
              <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización Reporte de Importaciones </h5>
              <div ref={contenidoRef} style={{ position: 'relative' }}>
                <p style={{ fontSize: '8pt', margin: '2px 0' }}>Fecha y hora de impresión: {new Date().toLocaleString()} </p>
                <br />
                <table
                  style={{
                    width: '100%',
                    tableLayout: 'fixed',
                    wordWrap: 'break-word',
                    fontSize: '8pt'
                  }}
                  border="3"
                  cellPadding="2"
                  cellSpacing="0"
                >
                  <thead>
                    <tr bgcolor="#eeeeee">
                      <th
                        colSpan="4"
                        style={{
                          background: '#1797be',
                          color: 'white',
                          textAlign: 'center',
                          fontSize: '14px',
                          border: "1px solid black"
                        }}
                      >
                        REPORTE DE IMPORTACIONES <br />
                        <span style={{ fontSize: '12px' }}>-- IMPRESO --</span>
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          height: '60px',
                          width: '100px',
                          textAlign: 'center',
                          backgroundColor: 'rgb(180 237 255)',
                          border: "1px solid black",
                          color: 'rgb(23, 151, 190)'
                        }}
                      >
                        <LogoAzul style={{ width: '80%', height: '80%' }} />
                      </th>
                    </tr>
                    <tr>
                      <th bgcolor="#f8f8f8">Fecha Inicio:</th>
                      <td colSpan="1">
                        {formik.values.fechaInicio
                          ? formatDate(formik.values.fechaInicio)
                          : ''}
                      </td>
                      <th bgcolor="#f8f8f8">Fecha Fin:</th>
                      <td colSpan="1">
                        {formik.values.fechaFin
                          ? formatDate(formik.values.fechaFin)
                          : ''}
                      </td>
                    </tr>
                  </thead>
                </table>

                {datos.map((item, idx) => {
                  const detalles = JSON.parse(item.detalles || '[]');
                  const valoresTotales = JSON.parse(item.valoresTotales || '[]')[0] || {};
                  return (
                    <div key={idx} style={{ marginTop: '15px', pageBreakInside: 'avoid' }}>
                     <table style={{ width: '100%', fontSize: '8pt', marginTop: '10px' }} border="1" cellPadding="3" cellSpacing="0">
  <tbody>
    <tr style={{ background: '#1797be', color: 'white' }}>
      <th colSpan="6" style={{ border: "1px solid black", textAlign: 'center', fontSize: '11pt', padding: '5px' }}>
        DUCA ID: {item.duca_Id} | Nº DUCA: {item.duca_No_Duca} | Correlativo: {item.duca_No_Correlativo_Referencia}
      </th>
    </tr>
    <tr style={{ background: '#f8f8f8' }}>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Fecha:</strong> {formatDate(item.duca_FechaCreacion)}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Manifiesto:</strong> {item.duca_Manifiesto}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Título:</strong> {item.duca_Titulo}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Declarante:</strong> {item.duca_NombreSocial_Declarante}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Transportista:</strong> {item.duca_Transportista_Nombre}</td>
    </tr>
    <tr style={{ background: '#f8f8f8' }}>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>País Procedencia:</strong> {item.nombre_Pais_procedencia || '-'}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>País Destino:</strong> {item.nombre_pais_destino || '-'}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Regimen:</strong> {item.duca_Regimen_Aduanero}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Modalidad:</strong> {item.duca_Modalidad}</td>
      <td style={{ border: "1px solid black", padding: '4px' }}><strong>Clase:</strong> {item.duca_Clase}</td>
    </tr>
  </tbody>
</table>


                 {detalles.length > 0 && (
  <table
    style={{
      width: '100%',
      fontSize: '7.5pt',
      marginTop: '10px',
      tableLayout: 'fixed',
      borderCollapse: 'collapse'
    }}
    border="1"
    cellPadding="3"
    cellSpacing="0"
  >
    <thead>
      <tr style={{ background: '#eeeeee' }}>
        <th style={cellHeaderStyle}>Descripción Mercancía</th>
        <th style={cellHeaderStyle}>Fecha Aceptación</th>
        <th style={cellHeaderStyle}>País Exportación</th>
        <th style={cellHeaderStyle}>Lugar Embarque</th>
        <th style={cellHeaderStyle}>Importador</th>
        <th style={cellHeaderStyle}>Dirección Importador</th>
        <th style={cellHeaderStyle}>Proveedor</th>
        <th style={cellHeaderStyle}>País Proveedor</th>
        <th style={cellHeaderStyle}>Intermediario</th>
        <th style={cellHeaderStyle}>Lugar Entrega</th>
        <th style={cellHeaderStyle}>INCOTERM</th>
        <th style={cellHeaderStyle}>Forma de Envío</th>
        <th style={cellHeaderStyle}>Forma de Pago</th>
      </tr>
    </thead>
    <tbody>
      {detalles.map((detalle, i) => (
        <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
          <td style={cellBodyStyle}>{detalle.deva_DeclaracionMercancia}</td>
          <td style={cellBodyStyle}>{formatDate(detalle.deva_FechaAceptacion)}</td>
          <td style={cellBodyStyle}>{detalle.pais_ExportacionNombre}</td>
          <td style={cellBodyStyle}>{detalle.LugarEmbarque}</td>
          <td style={cellBodyStyle}>{detalle.impo_Nombre_Raso}</td>
          <td style={cellBodyStyle}>{detalle.impo_Direccion_Exacta}</td>
          <td style={cellBodyStyle}>{detalle.prov_Nombre_Raso}</td>
          <td style={cellBodyStyle}>{detalle.prov_PaisNombre}</td>
          <td style={cellBodyStyle}>{detalle.inte_Nombre_Raso}</td>
          <td style={cellBodyStyle}>{detalle.deva_LugarEntrega}</td>
          <td style={cellBodyStyle}>{detalle.inco_Descripcion} ({detalle.inco_Codigo})</td>
          <td style={cellBodyStyle}>{detalle.foen_Descripcion}</td>
          <td style={cellBodyStyle}>{detalle.fopa_Descripcion}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
<table
  style={{
    width: '100%',
    fontSize: '7.5pt',
    marginTop: '10px',
    tableLayout: 'fixed',
    borderCollapse: 'collapse'
  }}
  border="1"
  cellPadding="3"
  cellSpacing="0"
>
  <thead>
    <tr style={{ background: '#eeeeee' }}>
      <th colSpan={6} style={cellHeaderStyle}>Resumen de Totales</th>
    </tr>
    <tr style={{ background: '#f8f8f8' }}>
      <th style={cellHeaderStyle}>Valor Transacción</th>
      <th style={cellHeaderStyle}>Otros Gastos</th>
      <th style={cellHeaderStyle}>Gastos Transporte</th>
      <th style={cellHeaderStyle}>Seguro</th>
      <th style={cellHeaderStyle}>Valor en Aduana</th>
      <th style={cellHeaderStyle}>Peso Bruto / Peso Neto</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={cellBodyStyle}>${formatNumber(valoresTotales.item_ValorTransaccion)}</td>
      <td style={cellBodyStyle}>${formatNumber(valoresTotales.item_OtrosGastos)}</td>
      <td style={cellBodyStyle}>${formatNumber(valoresTotales.item_GastosDeTransporte)}</td>
      <td style={cellBodyStyle}>${formatNumber(valoresTotales.item_Seguro)}</td>
      <td style={cellBodyStyle}>${formatNumber(valoresTotales.item_ValorAduana)}</td>
      <td style={cellBodyStyle}>
        {formatNumber(valoresTotales.item_PesoBruto)} kg / {formatNumber(valoresTotales.item_PesoNeto)} kg
      </td>
    </tr>
  </tbody>
</table>


                    </div>
                  );
                })}

                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.5)',
                    opacity: 0.15,
                    pointerEvents: 'none',
                    zIndex: -1,
                    width: '300px',
                    height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <LogoAzul style={{ width: '100%', height: '100%' }} />
                </div>

                <div style={{ marginTop: '20px', fontSize: '9pt', textAlign: 'right' }}>
                  <p><strong>Fecha de generación:</strong> {formatDate(new Date())} {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </ParentCard>
             {datos.length > 0 && (
  <Box mt={4}>
    <h4 style={{ textAlign: 'center', marginBottom: '12px' }}>Resumen Global</h4>
    <table
      style={{
        width: '100%',
        fontSize: '8pt',
        tableLayout: 'fixed',
        borderCollapse: 'collapse'
      }}
      border="1"
      cellPadding="4"
      cellSpacing="0"
    >
      <thead style={{ background: '#1797be', color: 'white' }}>
        <tr>
          <th style={cellHeaderStyle}>Total Valor Aduana</th>
          <th style={cellHeaderStyle}>Total Peso Bruto</th>
          <th style={cellHeaderStyle}>Total Peso Neto</th>
          <th style={cellHeaderStyle}>Total Impuestos</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellBodyStyle}>
            ${formatNumber(
              datos.reduce((acc, curr) => {
                let valores = {};
                try {
                  valores = JSON.parse(curr.valoresTotales || '[{}]')[0] || {};
                } catch {
                  valores = {};
                }
                return acc + (parseFloat(valores.item_ValorAduana) || 0);
              }, 0)
            )}
          </td>
          <td style={cellBodyStyle}>
            {formatNumber(
              datos.reduce((acc, curr) => {
                let valores = {};
                try {
                  valores = JSON.parse(curr.valoresTotales || '[{}]')[0] || {};
                } catch {
                  valores = {};
                }
                return acc + (parseFloat(valores.item_PesoBruto) || 0);
              }, 0)
            )} kg
          </td>
          <td style={cellBodyStyle}>
            {formatNumber(
              datos.reduce((acc, curr) => {
                let valores = {};
                try {
                  valores = JSON.parse(curr.valoresTotales || '[{}]')[0] || {};
                } catch {
                  valores = {};
                }
                return acc + (parseFloat(valores.item_PesoNeto) || 0);
              }, 0)
            )} kg
          </td>
          <td style={cellBodyStyle}>
            ${formatNumber(
              datos.reduce((acc, curr) => {
                const impuestoVal = parseFloat(curr.impuestos);
                return acc + (isNaN(impuestoVal) ? 0 : impuestoVal);
              }, 0)
            )}
          </td>
        </tr>
      </tbody>
    </table>
  </Box>
)}
          </>
        )}
      </ParentCard>
    


    </div>
  );
};

export default ImportacionesReporte;