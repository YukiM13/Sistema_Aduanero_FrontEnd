import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const OficinasComponent = () => {
  const [Oficinas, setOficinas] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Oficinas/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setOficinas(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las Oficinas:', error);
    });
  }, []);

  return (
    <div>
       <Breadcrumb title="Oficinas" subtitle="Listar" />
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
              {Oficinas.map((Oficinas) => (
                <TableRow key={Oficinas.ofic_Id}>
                  <TableCell>{Oficinas.ofic_Id}</TableCell>
                  <TableCell>{Oficinas.ofic_Nombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
     
    </div>
  );
};

export default OficinasComponent;
