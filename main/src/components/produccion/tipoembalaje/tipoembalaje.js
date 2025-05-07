import React, {useEffect, useState} from "react";
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from "src/layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "src/components/shared/ParentCard";

const TipoembalajeComponent = () => {
    const [tipoembalajes, setTipoembalajes] = useState([]);
    
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL
        const apiKey = process.env.REACT_APP_API_KEY;

        axios.get(`${apiUrl}/api/TipoEmbalaje/Listar`, {
            headers: {
                'XApiKey': apiKey
            }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
                setTipoembalajes(response.data.data);
                console.log(response.data.data);
            }
        })
        .catch(error => {
            console.error('Error al obtener los tipoembalajes:', error);
        });
    }, []);

    return (
        <div>
            <Breadcrumb title="Tipo Embalaje" subtitle="Listar"/>
            <ParentCard>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Descripción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tipoembalajes.map((tipoembalaje) => (
                                <TableRow key={tipoembalaje.tiem_Id}>
                                    <TableCell>{tipoembalaje.tiem_Id}</TableCell>
                                    <TableCell>{tipoembalaje.tiem_Descripcion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ParentCard>
        </div>
    );
}

export default TipoembalajeComponent;