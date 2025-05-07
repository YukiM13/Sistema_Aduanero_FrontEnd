import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const FormasEnvio = () => {
  const [formasenvio, setFormasEnvio] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/FormasEnvio/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setFormasEnvio(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las formas de envío:', error);
    });
  }, []);

  return (
    <div>
      <Breadcrumb title="Formas de Envío" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formasenvio.map((forma) => (
                <TableRow key={forma.foen_Id}>
                  <TableCell>{forma.foen_Id}</TableCell>
                  <TableCell>{forma.foen_Codigo}</TableCell>
                  <TableCell>{forma.foen_Descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
    </div>
  );
};

export default FormasEnvio;
