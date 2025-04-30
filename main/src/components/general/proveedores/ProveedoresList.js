import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const ProveedoresList = () => {
    const [prov, setprov] = useState([]);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
    
        axios.get(`${apiUrl}/api/Proveedores/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
            setprov(response.data.data);
        })
        .catch(error => {
          console.error('Error al obtener las personas:', error);
        });
      }, []);

    return (
        <div>
        <Breadcrumb title="Proveedores" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nombre de la compañía</TableCell>
                <TableCell>Nombre del contacto</TableCell>
                <TableCell>Correo electrónico</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Código postal</TableCell>
                <TableCell>País</TableCell>
                <TableCell>Provincia</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Dirección exacta</TableCell>
                <TableCell>Fax</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prov.map((prov) => (
                <TableRow key={prov.prov_Id}>
                  <TableCell>{prov.prov_Id}</TableCell>
                  <TableCell>{prov.prov_NombreCompania}</TableCell>
                  <TableCell>{prov.prov_NombreContacto}</TableCell>
                  <TableCell>{prov.prov_CorreoElectronico}</TableCell>
                  <TableCell>{prov.prov_Telefono}</TableCell>
                  <TableCell>{prov.prov_CodigoPostal}</TableCell>
                  <TableCell>{prov.pais_Nombre}</TableCell>
                  <TableCell>{prov.pvin_Nombre}</TableCell>
                  <TableCell>{prov.ciud_Nombre}</TableCell>
                  <TableCell>{prov.prov_DireccionExacta}</TableCell>
                  <TableCell>{prov.prov_Fax}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
      </div>
    );

}


export default ProveedoresList;