import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';

const EstilosComponent = () => {
  const [Estilos, setEstilos] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Colonias/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setEstilos(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las personas:', error);
    });
  }, []);

  return (
    <div>
      <Breadcrumb title="Estilos" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Ciudad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Estilos.map((estilo) => (
                <TableRow key={estilo.colo_Id}>
                  <TableCell>{estilo.colo_Id}</TableCell>
                  <TableCell>{estilo.colo_Nombre}</TableCell>
                  <TableCell>{estilo.ciud_Nombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
    </div>
  );
};

export default EstilosComponent;