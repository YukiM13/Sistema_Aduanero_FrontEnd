import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const AduanasList = () => {
    const [aduanas, setAduanas] = useState([]);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
    
        axios.get(`${apiUrl}/api/Aduanas/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
            setAduanas(response.data.data);
        })
        .catch(error => {
          console.error('Error al obtener las personas:', error);
        });
      }, []);

    return (
        <div>
        <Breadcrumb title="Aduanas" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Direccion Exacta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aduanas.map((aduana) => (
                <TableRow key={aduana.adua_Codigo}>
                  <TableCell>{aduana.adua_Nombre}</TableCell>
                  <TableCell>{aduana.adua_DireccionExacta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
      </div>
    );

}


export default AduanasList;