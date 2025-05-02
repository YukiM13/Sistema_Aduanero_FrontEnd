import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const EstadosCiviles = () => {
  const [estadosCiviles, setEstadosCiviles] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setEstadosCiviles(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener los estados civiles:', error);
    });
  }, []);

  return (
    <div>
      <Breadcrumb title="Estados Civiles" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estadosCiviles.map((estado) => (
                <TableRow key={estado.escv_Id}>
                  <TableCell>{estado.escv_Id}</TableCell>
                  <TableCell>{estado.escv_Nombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
    </div>
  );
};

export default EstadosCiviles;
