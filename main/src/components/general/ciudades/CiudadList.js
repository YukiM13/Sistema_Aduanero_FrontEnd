import React, { useEffect, useState } from 'react';	
import axios from 'axios';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

const CiudadList = () => {
    const [ciudades, setCiudades] = useState([]);

 useEffect(( ) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    axios.get(`${apiUrl}/api/Ciudades/Listar`, {
        headers: {
            'XApiKey': apiKey
        }

    })
    .then(response => {
        setCiudades(response.data.data);
        console.log("React E10", response.data.data)
    })
    .catch(error => {
        console.error('Error al obtener los datos de Ciudad:', error);
    });

}, []); // El
//  array vacío asegura que el efecto se ejecute solo una vez al montar el componente
return (
    <div>
    <Breadcrumb title="Ciudades" subtitle="Listar" />
    <ParentCard>
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Provincia</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {ciudades.map((ciudad) => (
                <TableRow key={ciudad.ciud_Id}>
                <TableCell>{ciudad.ciud_Nombre}</TableCell>
                <TableCell>{ciudad.pvin_Id}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </ParentCard>
    </div>
    );
}

export default CiudadList;