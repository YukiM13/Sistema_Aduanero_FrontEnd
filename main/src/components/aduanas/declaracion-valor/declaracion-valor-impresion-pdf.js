import React from 'react';
import {
    Grid, Typography, Divider, Box, Button, Stack, Paper
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ParentCard from '../../../components/shared/ParentCard';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const DeclaracionValorImpresionPdf = ({declaracionValor, onCancelar}) => {
     const contentRef = useRef(null);
    const convertToPdf = () => {
          const content = contentRef.current;
  
          const options = {
              margin: 1,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: {
                  unit: 'in',
                  format: 'letter',
                  orientation: 'portrait',
              },
          };
  
          html2pdf().set(options).from(content).toPdf().get('pdf').then((pdf) => {
              const blobUrl = URL.createObjectURL(pdf.output('blob'));
              const newWindow = window.open(blobUrl);
              newWindow.onload = function () {
                  newWindow.print();
              };
          });
      };

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

<div ref={contentRef}>

 <h5>hola - {declaracionValor.deva_Id}</h5> 
<h5>hola - {declaracionValor.adua_IngresoNombre} k</h5>
<h5>holas - {declaracionValor.adua_IngresoCodigo}</h5>
<h5>holas - {declaracionValor.adua_DespachoNombre} </h5>
<h5>holas - {declaracionValor.deva_FechaAceptacion}</h5>
<h5>holas - {declaracionValor.regi_Codigo}</h5>
<h5>holas - {declaracionValor.regi_Descripcion}</h5>
<h5>holas - {declaracionValor.inco_Codigo}</h5>
<h5>holas - {declaracionValor.deva_DeclaracionMercancia}</h5>
<h5>holas - {declaracionValor.deva_FechaAceptacion}</h5>
<h5>holas - {declaracionValor.deva_Finalizacion}</h5>
<h5>holas - {declaracionValor.deva_PagoEfectuado}</h5>
<h5>holas - {declaracionValor.pais_ExportacionNombre}</h5>
<h5>holas - {declaracionValor.deva_FechaExportacion}</h5>
<h5>holas - {declaracionValor.mone_Id}</h5>
<h5>holas - {declaracionValor.mone_Otra}</h5>
<h5>holas - {declaracionValor.monedaNombre}</h5>Z
<h5>holas - {declaracionValor.deva_Observaciones}</h5>
<h5>holas - {declaracionValor.deva_ConversionDolares}</h5>
<h5>holas - {declaracionValor.embarcacionNombre}</h5>
<h5>holas - {declaracionValor.lugarEmbarque}</h5>
<h5>holas - {declaracionValor.nico_Descripcion}</h5>
<h5>holas - {declaracionValor.nico_Id}</h5>
<h5>holas - {declaracionValor.impo_Id}</h5>
<h5>holas - {declaracionValor.impo_NumRegistro}</h5>
<h5>holas - {declaracionValor.impo_NivelComercial_Otro}</h5>
<h5>holas - {declaracionValor.impo_Correo_Electronico}</h5>
<h5>holas - {declaracionValor.impo_Fax}</h5>
<h5>holas - {declaracionValor.impo_ciudId}</h5>
<h5>holas - {declaracionValor.impo_paisId}</h5>
<h5>holas - {declaracionValor.coco_Id}</h5>
<h5>holas - {declaracionValor.coco_Descripcion}</h5>
<h5>holas - {declaracionValor.pvde_Condicion_Otra}</h5>
<h5>holas - {declaracionValor.pvde_Id}</h5>
<h5>holas - {declaracionValor.prov_NumeroIdentificacion}</h5>
<h5>holas - {declaracionValor.prov_Nombre_Raso}</h5>
<h5>holas - {declaracionValor.prov_Direccion_Exacta}</h5>
<h5>holas - {declaracionValor.prov_CiudadNombre}</h5>
<h5>holas - {declaracionValor.prov_PaisNombre}</h5>
<h5>holas - {declaracionValor.prov_Telefono}</h5>
<h5>holas - {declaracionValor.prov_Fax}</h5>
<h5>holas - {declaracionValor.prov_ciudId}</h5>
<h5>holas - {declaracionValor.prov_paisId}</h5>
<h5>holas - {declaracionValor.tite_Id}</h5>
<h5>holas - {declaracionValor.tite_Descripcion}</h5>
<h5>holas - {declaracionValor.tipoIntermediario}</h5>
<h5>holas - {declaracionValor.inte_Id}</h5>
<h5>holas - {declaracionValor.inte_Nombre_Raso}</h5>
<h5>holas - {declaracionValor.inte_RTN}</h5>
<h5>holas - {declaracionValor.inte_Direccion_Exacta}</h5>
<h5>holas - {declaracionValor.inte_CiudadNombre}</h5>
<h5>holas - {declaracionValor.inte_PaisNombre}</h5>
<h5>holas - {declaracionValor.inte_Telefono}</h5>
<h5>holas - {declaracionValor.inte_Fax}</h5>
<h5>holas - {declaracionValor.deva_LugarEntrega}</h5>
<h5>holas - {declaracionValor.pais_EntregaNombre}</h5>
<h5>holas - {declaracionValor.inco_Id}</h5>
<h5>holas - {declaracionValor.inco_Descripcion}</h5>
<h5>holas - {declaracionValor.inco_Version}</h5>
<h5>holas - {declaracionValor.deva_NumeroContrato}</h5>
<h5>holas - {declaracionValor.deva_FechaContrato}</h5>
<h5>holas - {declaracionValor.foen_Id}</h5>
<h5>holas - {declaracionValor.foen_Descripcion}</h5>    
<h5>holas - {declaracionValor.deva_FormaEnvioOtra}</h5>
<h5>holas - {declaracionValor.fopa_Id}</h5>
<h5>holas - {declaracionValor.fopa_Descripcion}</h5>
<h5>holas - {declaracionValor.deva_FormaPagoOtra}</h5>
<h5>holas - {declaracionValor.codi_Id}</h5>
<h5>holas - {declaracionValor.codi_Descripcion}</h5>
<h5>holas - {declaracionValor.codi_Restricciones_Utilizacion}</h5>
<h5>holas - {declaracionValor.codi_Indicar_Restricciones_Utilizacion}</h5>
<h5>holas - {declaracionValor.codi_Depende_Precio_Condicion}</h5>
<h5>holas - {declaracionValor.codi_Indicar_Existe_Condicion}</h5>
<h5>holas - {declaracionValor.codi_Condicionada_Revertir}</h5>
<h5>holas - {declaracionValor.codi_Indicar_Condicionada_Revertir}</h5>
<h5>holas - {declaracionValor.codi_Vinculacion_Comprador_Vendedor}</h5>
<h5>holas - {declaracionValor.codi_Tipo_Vinculacion}</h5>
<h5>holas - {declaracionValor.codi_Indicar_Tipo_Vinculacion}</h5>
<h5>holas - {declaracionValor.codi_Vinculacion_Influye_Precio}</h5>
<h5>holas - {declaracionValor.codi_Indicar_Vinculacion_Influye_Precio}</h5>
<h5>holas - {declaracionValor.codi_Pagos_Descuentos_Indirectos}</h5>
<h5>holas - {declaracionValor.codi_Concepto_Monto_Declarado}</h5>
<h5>holas - {declaracionValor.codi_Indicar_Concepto_Monto_Declarado}</h5>
<h5>holas - {declaracionValor.codi_Monto_Declarado}</h5>
<h5>holas - {declaracionValor.codi_Existen_Canones}</h5>
<h5>holas - {declaracionValor.codi_Indicar_Canones}</h5>
<h5>holas - {declaracionValor.codi_Canones}</h5>
<h5>holas - {declaracionValor.base_Id}</h5>
<h5>holas - {declaracionValor.base_PrecioFactura}</h5>
<h5>holas - {declaracionValor.base_PagosIndirectos}</h5>
<h5>holas - {declaracionValor.base_PrecioReal}</h5>
<h5>holas - {declaracionValor.base_PrecioFinal}</h5>
<h5>holas - {declaracionValor.base_PrecioDeclarado}</h5>
<h5>holas - {declaracionValor.base_MontCondicion}</h5>
<h5>holas - {declaracionValor.base_MontoReversion}</h5>
<h5>holas - {declaracionValor.base_MontoDescuento}</h5>
<h5>holas - {declaracionValor.base_ComisionCorrelaje}</h5>
<h5>holas - {declaracionValor.base_Gasto_Envase_Embalaje}</h5>
<h5>holas - {declaracionValor.base_Gasto_Transporte}</h5>
<h5>holas - {declaracionValor.base_Gasto_Seguro}</h5>
<h5>holas - {declaracionValor.base_Gasto_Otros}</h5>    
<h5>holas - {declaracionValor.base_ValoresMateriales_Incorporado}</h5>
<h5>holas - {declaracionValor.base_Valor_Materiales_Utilizados}</h5>    
<h5>holas - {declaracionValor.base_Valor_Materiales_Consumidos}</h5>
<h5>holas - {declaracionValor.base_Valor_Ingenieria_Importado}</h5>    
<h5>holas - {declaracionValor.base_Valor_Ingenieria_Utilizados}</h5>
<h5>holas - {declaracionValor.base_Valor_Canones}</h5>
<h5>holas - {declaracionValor.base_Gasto_TransporteM_Importada}</h5>
<h5>holas - {declaracionValor.base_Gastos_Carga_Importada}</h5>
<h5>holas - {declaracionValor.base_Costos_Seguro}</h5>
<h5>holas - {declaracionValor.base_Total_Ajustes_Precio_Pagado}</h5>
<h5>holas - {declaracionValor.base_Gastos_Asistencia_Tecnica}</h5>
<h5>holas - {declaracionValor.base_Gastos_Transporte_Posterior}</h5>
<h5>holas - {declaracionValor.base_Gastos_Mantenimiento}</h5>
<h5>holas - {declaracionValor.base_Gastos_Otros}</h5>
<h5>holas - {declaracionValor.base_Derechos_Impuestos}</h5>
<h5>holas - {declaracionValor.base_Otros_Ajustes}</h5>
<h5>holas - {declaracionValor.base_Monto_Intereses}</h5>
|<h5>holas - {declaracionValor.base_Monto_Total}</h5>
<h5>holas - {declaracionValor.base_Deducciones_Legales}</h5>
<h5>holas - {declaracionValor.base_Total_Deducciones_Precio}</h5>
<h5>holas - {declaracionValor.base_Valor_Aduana}</h5>

<h5>holas - {declaracionValor.impo_Nombre_Raso}</h5>
<h5>holas - {declaracionValor.impo_RTN}</h5>
<h5>holas - {declaracionValor.impo_Direccion_Exacta}</h5>
<h5>holas - {declaracionValor.impo_CiudadNombre}</h5>
<h5>holas - {declaracionValor.impo_PaisNombre}</h5>
<h5>holas - {declaracionValor.impo_Telefono}</h5>


<h5>holas - {declaracionValor.adua_DespachoCodigo}</h5>
<h5>holas - {declaracionValor.prov_CiudadNombre}</h5>


<table border="5">
<tr>
  <td>manzana</td><td colspan="2" rowspan="4" >pera</td><td>fresa</td><td>naranja</td>
</tr>
<tr>
  <td>melón</td><td>sandía</td><td>pomelo</td><td>cereza</td><td>granada</td>
</tr>
<tr>
  <td colspan="3">melocotón</td><td colspan="2">kiwi</td>
</tr>
</table>

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

            <ParentCard title="Vista Previa de Declaración de Valor">
                
                <Paper elevation={0} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom align="center">
                        DECLARACIÓN DE VALOR
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom align="right">
                        Declaración #: {declaracionValor.deva_Id}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                        
                        <Typography variant="h6" gutterBottom>INFORMACIÓN DE LA ADUANA</Typography>
                        <Grid container spacing={3}>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Aduana de Ingreso:</Typography>
                                <Typography>{declaracionValor.adua_IngresoNombre} ({declaracionValor.adua_IngresoCodigo})</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Aduana de Despacho:</Typography>
                                <Typography>{declaracionValor.adua_DespachoNombre} ({declaracionValor.adua_DespachoCodigo})</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Régimen:</Typography>
                                <Typography>{declaracionValor.regi_Descripcion} ({declaracionValor.regi_Codigo})</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <Typography variant="subtitle2">Fecha de Aceptación:</Typography>
                                <Typography>{new Date(declaracionValor.deva_FechaAceptacion).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {declaracionValor.impo_Nombre_Raso && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>INFORMACIÓN DEL IMPORTADOR</Typography>
                            <Grid container spacing={3}>
                                <Grid item lg={6} md={6} sm={12}>
                                    <Typography variant="subtitle2">Nombre:</Typography>
                                    <Typography>{declaracionValor.impo_Nombre_Raso}</Typography>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12}>
                                    <Typography variant="subtitle2">RTN:</Typography>
                                    <Typography>{declaracionValor.impo_RTN || 'No disponible'}</Typography>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12}>
                                    <Typography variant="subtitle2">Dirección:</Typography>
                                    <Typography>{declaracionValor.impo_Direccion_Exacta || 'No disponible'}</Typography>
                                </Grid>
                                {(declaracionValor.impo_CiudadNombre && declaracionValor.impo_PaisNombre) && (
                                    <Grid item lg={6} md={6} sm={12}>
                                        <Typography variant="subtitle2">Ciudad/País:</Typography>
                                        <Typography>{declaracionValor.impo_CiudadNombre}, {declaracionValor.impo_PaisNombre}</Typography>
                                    </Grid>
                                )}
                                {declaracionValor.impo_Telefono && (
                                    <Grid item lg={6} md={6} sm={12}>
                                        <Typography variant="subtitle2">Teléfono:</Typography>
                                        <Typography>{declaracionValor.impo_Telefono}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </ParentCard>
        </div>
        </>

    );
};

export default DeclaracionValorImpresionPdf;