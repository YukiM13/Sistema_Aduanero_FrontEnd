import React, { useEffect, useState } from 'react';	
import axios from 'axios';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

const PaisesList = () => {
    const [paises, setPaises] = useState([]);

 useEffect(( ) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    axios.get(`${apiUrl}/api/Paises/Listar?pais_EsAduana=true`, {
        headers: {
            'XApiKey': apiKey
        }

    })
    .then(response => {
        setPaises(response.data.data);
        console.log("React E10", response.data.data)
    })
    .catch(error => {
        console.error('Error al obtener los datos del país:', error);
    });

}, []); // El
//  array vacío asegura que el efecto se ejecute solo una vez al montar el componente
return (
    <div>
    <Breadcrumb title="Paises" subtitle="Listar" />
    <ParentCard>
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {paises.map((pais) => (
                <TableRow key={pais.pais_Id}>
                    <TableCell>{pais.pais_Id}</TableCell>
                    <TableCell>{pais.pais_Codigo}</TableCell>
                    <TableCell>{pais.pais_Nombre}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </ParentCard>
    </div>
    );
}

export default PaisesList;