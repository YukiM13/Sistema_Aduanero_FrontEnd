import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from "src/layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "src/components/shared/ParentCard";


const TipoIntermediarioComponent = () => {
    const [tipointermediarios, setTipoIntermediarios] = useState([]);
    
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;
    
        axios.get(`${apiUrl}/api/TipoIntermediario/Listar`, {
        headers: {
            'XApiKey': apiKey
        }
        })
        .then(response => {
        setTipoIntermediarios(response.data.data);
        })
        .catch(error => {
        console.error('Error al obtener los tipos de intermediario:', error);
        });
    }, []);
    
    return (
        <div>
            <Breadcrumb title="Tipos de Intermediario" subtitle="Listar"/>
            <ParentCard>
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Codigo</TableCell>
                    <TableCell>Descripcion</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {tipointermediarios.map((tipointermediario) => (
                    <TableRow key={tipointermediario.tite_Id}>
                    <TableCell>{tipointermediario.tite_Id}</TableCell>
                    <TableCell>{tipointermediario.tite_Codigo}</TableCell>
                    <TableCell>{tipointermediario.tite_Descripcion}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            </ParentCard>
        </div>
    );
}

export default TipoIntermediarioComponent;