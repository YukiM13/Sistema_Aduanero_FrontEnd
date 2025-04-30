import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const EmpleadosComponent = () => {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Empleados/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
     
      setEmpleados(response.data.data);
     
    })
    .catch(error => {
      console.error('Error al obtener las empleados:', error);
    });
  }, []);

  return (
    <div>
       <Breadcrumb title="Empleados" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Sexo</TableCell>
                <TableCell>Fecha Nacimiento</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Direccion</TableCell>
                <TableCell>Estado Civil</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow key={empleado.empl_Id}>
                  <TableCell>{empleado.empl_Id}</TableCell>
                  <TableCell>{empleado.empl_DNI}</TableCell>
                  <TableCell>{empleado.empl_NombreCompleto}</TableCell>
                  <TableCell>{empleado.empl_CorreoElectronico}</TableCell>
                  <TableCell>{empleado.empl_Sexo}</TableCell>
                  <TableCell>{empleado.empl_FechaNacimiento}</TableCell>
                  <TableCell>{empleado.empl_Telefono}</TableCell>
                  <TableCell>{empleado.carg_Nombre}</TableCell>
                  <TableCell>{empleado.empl_DireccionExacta}</TableCell>
                  <TableCell>{empleado.escv_Nombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
     
    </div>
  );
};

export default EmpleadosComponent;
