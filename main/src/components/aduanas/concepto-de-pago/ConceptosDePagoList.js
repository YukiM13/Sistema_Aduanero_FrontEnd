import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const ConceptosDePagoList = () => {
    const [conpa, setconpas] = useState([]);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
    
        axios.get(`${apiUrl}/api/ConceptoPago/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
            setconpas(response.data.data);
        })
        .catch(error => {
          console.error('Error al obtener las personas:', error);
        });
      }, []);

    return (
        <div>
        <Breadcrumb title="Conceptos de pago" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Descripcion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conpa.map((conpa) => (
                <TableRow key={conpa.conpa_Id}>
                  <TableCell>{conpa.copa_Id}</TableCell>
                  <TableCell>{conpa.copa_Descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
      </div>
    );

}


export default ConceptosDePagoList;