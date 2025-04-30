import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';


const AldeasComponent = () => {
  const [Colonias, setColonias] = useState([]);

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
        setColonias(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las personas:', error);
    });
  }, []);

  return (
    <div>
       <Breadcrumb title="Colonias" subtitle="Listar" />
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
              {Colonias.map((colonia) => (
                <TableRow key={colonia.colo_Id}>
                  <TableCell>{colonia.colo_Id}</TableCell>
                  <TableCell>{colonia.colo_Nombre}</TableCell>
                  <TableCell>{colonia.ciud_Nombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
     
    </div>
  );
};

export default AldeasComponent;
