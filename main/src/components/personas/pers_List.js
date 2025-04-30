import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

const PersonasComponent = () => {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Personas/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setPersonas(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las personas:', error);
    });
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Lista de Personas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>RTN</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Oficina</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personas.map((persona) => (
              <TableRow key={persona.pers_Id}>
                <TableCell>{persona.pers_Id}</TableCell>
                <TableCell>{persona.pers_RTN}</TableCell>
                <TableCell>{persona.pers_Nombre}</TableCell>
                <TableCell>{persona.ofic_Nombre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PersonasComponent;
