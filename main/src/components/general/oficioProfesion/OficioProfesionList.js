import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const OficioProfesionComponent = () => {
  const [oficioProfesiones, setOficioProfesiones] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
     
      setOficioProfesiones(response.data.data);
     
    })
    .catch(error => {
      console.error('Error al obtener las oficioProfesiones:', error);
    });
  }, []);

  return (
    <div>
       <Breadcrumb title="oficioProfesiones" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripcion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {oficioProfesiones.map((oficioProfesion) => (
                <TableRow key={oficioProfesion.ofpr_Id}>
                  <TableCell>{oficioProfesion.ofpr_Id}</TableCell>
                  <TableCell>{oficioProfesion.ofpr_Nombre}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
     
    </div>
  );
};

export default OficioProfesionComponent;
