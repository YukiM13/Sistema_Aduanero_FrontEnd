import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { IconPrinter } from '@tabler/icons';

const DeclaracionValor = () => {
  const [declaracionValor, setDeclaracionValor] = useState([]);
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Declaracion_Valor/Listar`,{
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
      console.error('Error al obtener las formas de pago:', error);
    });
  }, []);

  return (
    <div>
      <Breadcrumb title="Formas de Pago" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Accion</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {declaracionValor.map((deVa) => (
                  <TableRow key={deVa.deva_Id}>
                  <TableCell>  <Button variant="contained"   startIcon={<IconPrinter />}>
            {'Imprimir'}
          </Button></TableCell>
          <TableCell>{deVa.deva_Id}</TableCell>
                  <TableCell>{deVa.adua_IngresoNombre}</TableCell>
                  <TableCell>{deVa.adua_DespachoCodigo}</TableCell>
                  <TableCell>{deVa.regi_Codigo}</TableCell>
                  <TableCell>{deVa.regi_Descripcion}</TableCell>
                  <TableCell>{deVa.adua_DespachoNombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
    </div>
  );
};

export default DeclaracionValor;
