import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const FormasDePago = () => {
  const [formasPago, setFormasPago] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/FormasDePago/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setFormasPago(response.data.data);
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
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formasPago.map((forma) => (
                <TableRow key={forma.fopa_Id}>
                  <TableCell>{forma.fopa_Id}</TableCell>
                  <TableCell>{forma.fopa_Descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
    </div>
  );
};

export default FormasDePago;
