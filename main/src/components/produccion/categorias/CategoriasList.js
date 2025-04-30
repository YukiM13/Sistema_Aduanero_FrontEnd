import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const CategoriasComponent = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/Categoria/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setCategorias(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las categorias:', error);
    });
  }, []);

  return (
    <div>
       <Breadcrumb title="Categorias" subtitle="Listar" />
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
              {categorias.map((categoria) => (
                <TableRow key={categoria.cate_Id}>
                  <TableCell>{categoria.cate_Id}</TableCell>
                  <TableCell>{categoria.cate_Descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
     
    </div>
  );
};

export default CategoriasComponent;
