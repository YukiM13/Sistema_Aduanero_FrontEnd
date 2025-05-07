import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Box
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { IconPrinter } from '@tabler/icons';
import DeclaracionValorImpresionPdf from './declaracion-valor-impresion-pdf';

const DeclaracionValor = () => {
  const [declaracionValor, setDeclaracionValor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeclaracion, setSelectedDeclaracion] = useState(null);
  const [modoImpresion, setModoImpresion] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Declaracion_Valor/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setDeclaracionValor(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las declaraciones de valor:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handlePrintClick = (declaracion) => {
    setSelectedDeclaracion(declaracion);
    setModoImpresion(true);
  };

  const handleVolver = () => {
    setModoImpresion(false);
    setSelectedDeclaracion(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Breadcrumb title="Declaración de Valor" subtitle={modoImpresion ? "Impresión" : "Listar"} />

      {!modoImpresion ? (
        <ParentCard>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Acción</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Aduana Ingreso</TableCell>
                  <TableCell>Código Despacho</TableCell>
                  <TableCell>Régimen</TableCell>
                  <TableCell>Aduana Despacho</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {declaracionValor.length > 0 ? (
                  declaracionValor.map((deVa) => (
                    <TableRow key={deVa.deva_Id}>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          startIcon={<IconPrinter fontSize="small" />}
                          onClick={() => handlePrintClick(deVa)}
                        >
                          Imprimir
                        </Button>
                      </TableCell>
                      <TableCell>{deVa.deva_Id}</TableCell>
                      <TableCell>{deVa.adua_IngresoNombre}</TableCell>
                      <TableCell>{deVa.adua_DespachoCodigo}</TableCell>
                      <TableCell>{deVa.regi_Descripcion}</TableCell>
                      <TableCell>{deVa.adua_DespachoNombre}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay declaraciones de valor disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </ParentCard>
      ) : (
        <DeclaracionValorImpresionPdf 
          declaracionValor={selectedDeclaracion} 
          onCancelar={handleVolver}
        />
      )}
    </div>
  );
};

export default DeclaracionValor;
