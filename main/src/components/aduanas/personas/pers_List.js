import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import PersonasCreateComponent from './PersonaCreate';
import AddIcon from '@mui/icons-material/Add';
import { Snackbar, Alert } from '@mui/material';
const PersonasComponent = () => {
  const [personas, setPersonas] = useState([]);
  const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const cargarPersonas = () => { //pasamos el listar a una funcion fuera del useEffect y llamamos la funcion dentro del useEffect
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
  
    axios.get(`${apiUrl}/api/Personas/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
    .then(response => setPersonas(response.data.data))
    .catch(error => console.error('Error al obtener las personas:', error));
  };
  useEffect(() => {
    cargarPersonas(); //Aca llamamos
  }, []);

  return (
    <div>
      <Breadcrumb title="Personas" subtitle={ "Listar"} />
      
      

      
        <ParentCard>
        {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
       
   
          <container>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
      <Button variant="contained" onClick={() => setModo('crear')}   startIcon={<AddIcon />}>
          {'Nuevo'}
        </Button>
      </Stack>
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
          {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

    <PersonasCreateComponent
      onCancelar={() => setModo('listar')} 
      onGuardadoExitoso={() => {
        setModo('listar');
        setOpenSnackbar(true);
        // Recarga los datos después de guardar
        cargarPersonas();
      }}
    />

)}
        </ParentCard>
        <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
    ¡Registro guardado con éxito!
  </Alert>
</Snackbar>
    </div>
  );
};

export default PersonasComponent;