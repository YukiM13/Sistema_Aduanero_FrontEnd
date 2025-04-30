import React, {useEffect, useState} from "react";
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from "src/layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "src/components/shared/ParentCard";

const UnidadesMedidasComponent = () => {
    const [unidadesmedidas, setUnidadesMedidas] = useState([]);
    
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL
        const apiKey = process.env.REACT_APP_API_KEY;

        axios.get(`${apiUrl}/api/UnidadMedidas/Listar?unme_EsAduana=true`, {
            headers: {
                'XApiKey': apiKey
            }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
                setUnidadesMedidas(response.data.data);
                console.log(response.data.data);
            }
        })
        .catch(error => {
            console.error('Error al obtener las unidades de medida:', error);
        });
    }, []);

    return (
        <div>
            <Breadcrumb title="Unidades de Medida" subtitle="Listar"/>
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
                            {unidadesmedidas.map((unidadmedida) => (
                                <TableRow key={unidadmedida.unme_Id}>
                                    <TableCell>{unidadmedida.unme_Id}</TableCell>
                                    <TableCell>{unidadmedida.unme_Descripcion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ParentCard>
        </div>
    );
}

export default UnidadesMedidasComponent;