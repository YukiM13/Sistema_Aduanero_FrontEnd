import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const SubCategoriasComponent = () => {
  const [SubCategorias, setSubCategorias] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    axios.get(`${apiUrl}/api/SubCategoria/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setSubCategorias(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las SubCategorias:', error);
    });
  }, []);

  return (
    <div>
       <Breadcrumb title="SubCategorias" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Categoria</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SubCategorias.map((subcategorias) => (
                <TableRow key={subcategorias.subc_Id}>
                  <TableCell>{subcategorias.subc_Id}</TableCell>
                  <TableCell>{subcategorias.subc_Descripcion}</TableCell>
                  <TableCell>{subcategorias.cate_Descripcion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
     
    </div>
  );
};

export default SubCategoriasComponent;
