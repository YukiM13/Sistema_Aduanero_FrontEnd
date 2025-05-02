import React, { useEffect, useState } from 'react';	
import axios from 'axios';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

const ProvinciasList = () => {
    const [provincias, setProvincias] = useState([]);

 useEffect(( ) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    axios.get(`${apiUrl}/api/Provincias/Listar?pvin_EsAduana=true`, {
        headers: {
            'XApiKey': apiKey
        }

    })
    .then(response => {
        setProvincias(response.data.data);
        console.log("React E10", response.data.data)
    })
    .catch(error => {
        console.error('Error al obtener los datos de la provincia:', error);
    });

}, []); // El
//  array vacío asegura que el efecto se ejecute solo una vez al montar el componente
return (
    <div>
    <Breadcrumb title="Provincias" subtitle="Listar" />
    <ParentCard>
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>País</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {provincias.map((provincia) => (
                <TableRow key={provincia.pvin_Id}>
                    <TableCell>{provincia.pvin_Id}</TableCell>
                    <TableCell>{provincia.pvin_Codigo}</TableCell>
                    <TableCell>{provincia.pvin_Nombre}</TableCell>
                    <TableCell>{provincia.pais_Id}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </ParentCard>
    </div>
    );
}

export default ProvinciasList;