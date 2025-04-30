import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const MonedasComponent = () => {
  const [monedas, setMonedas] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Moneda/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
     
      setMonedas(response.data.data);
     
    })
    .catch(error => {
      console.error('Error al obtener las monedas:', error);
    });
  }, []);

  return (
    <div>
       <Breadcrumb title="Monedas" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Codigo</TableCell>
                <TableCell>Descripcion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monedas.map((moneda) => (
                <TableRow key={moneda.mone_Id}>
                  <TableCell>{moneda.mone_Id}</TableCell>
                  <TableCell>{moneda.mone_Codigo}</TableCell>
                  <TableCell>{moneda.mone_Descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
     
    </div>
  );
};

export default MonedasComponent;
