import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import PersonasCreateComponent from './PersonaCreate';

const PersonasComponent = () => {
  const [personas, setPersonas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // 👈 nuevo estado

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Personas/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      setPersonas(response.data.data);
    })
    .catch(error => {
      console.error('Error al obtener las personas:', error);
    });
  }, []);

  return (
    <div>
      <Breadcrumb title="Personas" subtitle={mostrarFormulario ? "Crear" : "Listar"} />
      
      <Stack direction="row" justifyContent="flex-start" mb={2}>
        <Button
          variant="contained"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? 'Volver a la lista' : 'Nuevo'}
        </Button>
      </Stack>

      
        <ParentCard>
        {mostrarFormulario ? (
        <PersonasCreateComponent />
      ) : (
          <container>
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
          </container>
          )}
        </ParentCard>
     
    </div>
  );
};

export default PersonasComponent;