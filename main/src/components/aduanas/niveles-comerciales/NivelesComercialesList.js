import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const NivelesComercialesList = () => {
    const [nico, setnico] = useState([]);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
    
        axios.get(`${apiUrl}/api/NivelesComerciales/Listar`, {
          headers: {
            'XApiKey': apiKey
          }
        })
        .then(response => {
            setnico(response.data.data);
        })
        .catch(error => {
          console.error('Error al obtener las personas:', error);
        });
      }, []);

    return (
        <div>
        <Breadcrumb title="Niveles comerciales" subtitle="Listar" />
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
              {nico.map((nico) => (
                <TableRow key={nico.nico_Id}>
                  <TableCell>{nico.nico_Id}</TableCell>
                  <TableCell>{nico.nico_Descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
      </div>
    );

}


export default NivelesComercialesList;