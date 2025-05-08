import React from 'react';
import {
    Grid, Typography, Divider, Box, Button, Stack, Paper
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

import 'jspdf-autotable';
import ParentCard from '../../../components/shared/ParentCard';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';

const DeclaracionValorImpresionPdf = ({declaracionValor, onCancelar}) => {
 
     const contenidoRef = useRef();

     const convertToPdf = async () => {

       const opt = {
         margin: 1,
         filename: 'temporal.pdf',
         image: { type: 'jpeg', quality: 0.98 },
         html2canvas: { scale: 2 },
         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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

<h5 style={{ textAlign: 'center' }}>  Previsualización Declaración de Valor </h5>
<ParentCard>


<div ref={contenidoRef} style={{ display: 'flex'}}>
<p>fecha y hora de impresion: {new Date().toLocaleString()} </p>

{/* <div style={{ width: '20px', backgroundColor: 'gray', textAlign: 'center' ,fontSize: 'auto' }}>
<p style={{ rotate: '90deg' }}>
      Declaracion de Valor de Importacion y Exportacion
</p>
</div> */}


<div style={{ width: '720px' }}>
<table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word' }} border="2" cellpadding="8" cellspacing="0">
<tr bgcolor="#eeeeee">
    {/* <td style={{ textAlign: 'center', fontSize: '22px',border:"2px solid black" }}>Invertido</td> */}
    <th colspan="6" style={{ textAlign: 'center', fontSize: '22px',border:"2px solid black" }}>DECLARACION DE VALOR DE IMPORTACIÓN Y EXPORTACIÓN <br /> <span style={{ fontSize: '17px' }}>-- IMPRESA --</span> </th>
    <th rowspan="2" id="qr"  style={{ height: '150px', width: '150px',textAlign: 'center', backgroundColor: 'gray',border:"2px solid black" }}>QR</th>
  </tr>

  <tr>
    <th  bgcolor="#f8f8f8">Aduana : </th>
    <td >{declaracionValor.adua_IngresoNombre}</td>
    <th bgcolor="#f8f8f8">adua_IngresoCodigo</th>
    <td>{declaracionValor.adua_IngresoCodigo}</td>
    <th bgcolor="#f8f8f8">adua_DespachoCodigo</th>
    <td>{declaracionValor.adua_DespachoCodigo}</td>
  </tr>

  <tr>
    <th bgcolor="#f8f8f8">deva_Id</th>
    <td>{declaracionValor.deva_Id}</td>
    <th bgcolor="#f8f8f8">regi_Codigo</th>
    <td>{declaracionValor.regi_Codigo}</td>
    <th bgcolor="#f8f8f8">duca_No_DUCA</th>
    <td>{declaracionValor.duca_No_DUCA}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">regi_Descripcion</th> 
    <td colspan="3">{declaracionValor.regi_Descripcion}</td>
    <th bgcolor="#f8f8f8">deva_FechaAceptacion</th>
    <td>{declaracionValor.deva_FechaAceptacion}</td>
  </tr>
  <tr bgcolor="#eeeeee">
    <th colspan="6" style={{ border: "2px solid black" }}>INFORMACIÓN DEL IMPORTADOR</th>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">impo_Nombre_Raso</th>
    <td >{declaracionValor.impo_Nombre_Raso}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">impo_NumRegistro</th>
    <td >{declaracionValor.impo_NumRegistro}</td>
    <th bgcolor="#f8f8f8">impo_RTN</th>
    <td >{declaracionValor.impo_RTN}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">impo_Direccion_Exacta</th>
    <td colspan="5">{declaracionValor.impo_Direccion_Exacta}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">impo_CiudadNombre</th>
    <td>{declaracionValor.impo_CiudadNombre}</td>
    <th bgcolor="#f8f8f8">impo_PaisNombre</th>
    <td>{declaracionValor.impo_PaisNombre}</td>
    <th bgcolor="#f8f8f8">impo_Telefono</th>
    <td>{declaracionValor.impo_Telefono}</td>
  </tr>
  <tr bgcolor="#eeeeee">
    <th colspan="6" style={{ border: "2px solid black" }}>TRANSPORTE Y EXPORTACIÓN</th>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">embarcacionNombre</th>
    <td >{declaracionValor.embarcacionNombre}</td>
    <th bgcolor="#f8f8f8">pais_ExportacionNombre</th>
    <td >{declaracionValor.pais_ExportacionNombre}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">deva_FechaExportacion</th>
    <td >{declaracionValor.deva_FechaExportacion}</td>
    <th bgcolor="#f8f8f8">lugarEmbarque</th>
    <td >{declaracionValor.lugarEmbarque}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">monedaNombre</th>
    <td>{declaracionValor.monedaNombre}</td>
    <th bgcolor="#f8f8f8">inco_Descripcion</th>
    <td>{declaracionValor.inco_Descripcion}</td>
    <th bgcolor="#f8f8f8">inco_Version</th>
    <td>{declaracionValor.inco_Version}</td>
  </tr>
  <tr bgcolor="#eeeeee">
    <th colspan="6" style={{ border: "2px solid black" }}>PROVEEDOR</th>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">prov_Nombre_Raso</th>
    <td colspan="5">{declaracionValor.prov_Nombre_Raso}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">prov_NumeroIdentificacion</th>
    <td >{declaracionValor.prov_NumeroIdentificacion}</td>
    <th bgcolor="#f8f8f8">coco_Descripcion</th>
    <td >{declaracionValor.coco_Descripcion}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">prov_Direccion_Exacta</th>
    <td colspan="5">{declaracionValor.prov_Direccion_Exacta}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">prov_CiudadNombre</th>
    <td>{declaracionValor.prov_CiudadNombre}</td>
    <th bgcolor="#f8f8f8">prov_PaisNombre</th>
    <td>{declaracionValor.prov_PaisNombre}</td>
    <th bgcolor="#f8f8f8">prov_Telefono</th>
    <td>{declaracionValor.prov_Telefono}</td>
  </tr>

  <tr bgcolor="#eeeeee" style={{ border: "2px solid black" }}>
    <th colspan="7">VALORES</th>
  </tr>
  <tr >
    <th bgcolor="#f8f8f8">base_PrecioFactura</th>
    <td bgcolor="#f8f8f8">{declaracionValor.base_PrecioFactura}</td>
    <th bgcolor="#f8f8f8">base_ComisionCorrelaje</th>
    <td>{declaracionValor.base_ComisionCorrelaje}</td>
    <th bgcolor="#f8f8f8">base_Gasto_Otros</th>
    <td>{declaracionValor.base_Gasto_Otros}</td>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">base_Total_Ajustes_Precio_Pagado</th>
    <td>{declaracionValor.base_Total_Ajustes_Precio_Pagado}</td>
    <th bgcolor="#f8f8f8">base_PrecioReal</th>
    <td>{declaracionValor.base_PrecioReal}</td>
    <th bgcolor="#f8f8f8">base_Valor_Aduana</th>
    <td>{declaracionValor.base_Valor_Aduana}</td>
  </tr>

  
  <tr bgcolor="#eeeeee">
    <th colspan="7" style={{ border: "2px solid black" }}>OBSERVACIONES</th>
  </tr>
  <tr>
    <th bgcolor="#f8f8f8">deva_Observaciones</th>
    <td colspan="5">{declaracionValor.deva_Observaciones}</td>
  </tr>

</table>
</div>

{/* 
"deva_Id": 23,
      "deva_AduanaIngresoId": 1,
      "adua_IngresoNombre": "Aduana Amapalaaaaa",
      "adua_IngresoCodigo": "0001",
      "adua_DespachoCodigo": "0002",
      "regi_Id": 0,
      "regi_Codigo": "4000",
      "regi_Descripcion": "Régimen de Importación Definitiva",
      "inco_Codigo": "CPT",
      "duca_No_DUCA": null,--que es esto?
      "deva_AduanaDespachoId": 2,
      "adua_DespachoNombre": "Aduana La Ceiba",
      "deva_DeclaracionMercancia": "Usado",

      "deva_FechaAceptacion": "2023-10-12T00:00:00",
      "deva_Finalizacion": true,
      "deva_PagoEfectuado": true,
      "pais_ExportacionId": 49,
      "pais_ExportacionNombre": "CN - CHINA",
      "deva_FechaExportacion": "2023-10-03T00:00:00",
      "mone_Id": 101,
      "mone_Otra": "",
      "monedaNombre": "BIT - BITCOIN",
      "deva_ConversionDolares": 14598,
      "emba_Id": 25121,
      "lugarEmbarque": "HNCMY - Comayagua",

      "nico_Id": 2,
      "nico_Descripcion": "Mayorista",
      "emba_Codigo": "HNCMY",
      "impo_Id": 14,
      "impo_NumRegistro": "25668745874697",
      "impo_RTN": "2566-8745-874697",
      "impo_NivelComercial_Otro": "",
      "impo_Nombre_Raso": "Mario Andres Hernandez",
      "impo_Direccion_Exacta": "Residencial San Carlos",
      "impo_CiudadNombre": "05 - Cortes",
      "impo_PaisNombre": "HN - HONDURAS",
      "impo_Correo_Electronico": "marioandes@hotmail.com",
      "impo_Telefono": "+504 985478965",
      "impo_Fax": "",
      "impo_ciudId": 69,
      "impo_paisId": 97,
      "coco_Id": 2,
      "coco_Descripcion": "Fabricante",
      "pvde_Condicion_Otra": "",
      "pvde_Id": 11,
      "prov_NumeroIdentificacion": "4887-4587-79987",
      "prov_Nombre_Raso": "Alex Castro Mejia",
      "prov_Direccion_Exacta": "Casa 25 Calle 13",
      "prov_CiudadNombre": "04 - Copan",
      "prov_PaisNombre": "HN - HONDURAS",
      "prov_Correo_Electronico": "alexcm2@gmail.com",
      "prov_Telefono": "+504 31321321321",
      "prov_Fax": "212.132.313",
      "prov_ciudId": 68,
      "prov_paisId": 97,
      "tite_Id": null,
      "tipoIntermediario": null,
      "inte_Id": null,
      "inte_ciudId": null,
      "inte_paisId": null,
      "inte_Tipo_Otro": null,
      "inte_NumeroIdentificacion": null,
      "inte_Nombre_Raso": null,
      "inte_Direccion_Exacta": null,
      "inte_Correo_Electronico": null,
      "inte_CiudadNombre": null,
      "inte_PaisNombre": null,
      "inte_Telefono": null,
      "inte_Fax": null,
      "deva_LugarEntrega": "Col Cerro Verde",
      "pais_EntregaId": 97,
      "pais_EntregaNombre": "HN - HONDURAS",
      "inco_Id": 4,
      "inco_Descripcion": "Transporte pagado",
      "inco_Version": "2023",
      "deva_NumeroContrato": "258785",
      "deva_FechaContrato": "2023-10-12T00:00:00",
      "foen_Id": 1,
      "foen_Descripcion": "Fraccionado",
      "deva_FormaEnvioOtra": "",
      "fopa_Id": 1,
      "fopa_Descripcion": "Cheque bancario/cheque personal",
      "deva_FormaPagoOtra": "",
      "codi_Id": 12,
      "codi_Restricciones_Utilizacion": false,
      "codi_Indicar_Restricciones_Utilizacion": "",
      "codi_Depende_Precio_Condicion": false,
      "codi_Indicar_Existe_Condicion": "",
      "codi_Condicionada_Revertir": false,
      "codi_Vinculacion_Comprador_Vendedor": false,
      "codi_Tipo_Vinculacion": "",
      "codi_Vinculacion_Influye_Precio": false,
      "codi_Pagos_Descuentos_Indirectos": false,
      "codi_Concepto_Monto_Declarado": "",
      "codi_Existen_Canones": false,
      "codi_Indicar_Canones": "",
      "base_Id": 12,
      "base_PrecioFactura": 4569,
      "base_PagosIndirectos": 0,
      "base_PrecioReal": 4569,
      "base_MontCondicion": 0,
      "base_MontoReversion": 0,
      "base_ComisionCorrelaje": 0,
      "base_Gasto_Envase_Embalaje": 5,
      "base_ValoresMateriales_Incorporado": 0,
      "base_Valor_Materiales_Utilizados": 0,
      "base_Valor_Materiales_Consumidos": 0,
      "base_Valor_Ingenieria_Importado": 0,
      "base_Valor_Canones": 0,
      "base_Gasto_TransporteM_Importada": 0,
      "base_Gastos_Carga_Importada": 0,
      "base_Costos_Seguro": 0,
      "base_Total_Ajustes_Precio_Pagado": 5,
      "base_Gastos_Asistencia_Tecnica": 0,
      "base_Gastos_Transporte_Posterior": 0,
      "base_Derechos_Impuestos": 0,
      "base_Monto_Intereses": 0,
      "base_Deducciones_Legales": 0,
      "base_Total_Deducciones_Precio": 0,
      "base_Valor_Aduana": 4574,
      "usua_UsuarioCreacion": 1,
      "usua_CreacionNombre": "juan",
      "deva_FechaCreacion": "2023-10-12T11:46:39",
      "usua_ModificacionNombre": 1,
      "deva_FechaModificacion": "2023-08-29T20:18:55.553",
      "deva_Estado": true */}


          
        </div>
        </ParentCard>
        </>

    );
};

export default DeclaracionValorImpresionPdf;