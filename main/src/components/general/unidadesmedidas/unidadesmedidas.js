import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, TablePagination, TextField, InputAdornment, Typography
} from "@mui/material";
import Breadcrumb from "src/layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "src/components/shared/ParentCard";
import SearchIcon from '@mui/icons-material/Search';

//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";

const UnidadesMedidasComponent = () => {
    const [unidadesmedidas, setUnidadesMedidas] = useState([]);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        axios.get(`${apiUrl}/api/UnidadMedidas/Listar?unme_EsAduana=true`, {
            headers: {
                "XApiKey": apiKey,
            },
        })
        .then((response) => {
            if (response.data && Array.isArray(response.data.data)) {
                setUnidadesMedidas(response.data.data);
            }
        })
        .catch((error) => {
            console.error("Error al obtener las unidades de medida:", error);
        });
    }, []);

    const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };//Cambia el numero de filas de la siguiente pagina

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, unidadesmedidas.length - page * rowsPerPage);
    //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
    //si tu tamaño siguiera siendo de 10 registros

    const filteredData = unidadesmedidas.filter((unidad) =>
        unidad.unme_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unidad.unme_Id.toString().includes(searchQuery.trim())
    );
    //FilteredData trae el arreglo que se asigno antes para el list en este caso unidadesmedidas y pasara agarrar su campos
    //y utilizarlo para filtrar, y en el caso de que el input de filtrar detecta algo, pues el filteredData cambiara y la tabla 
    //solo mostrara los datos que coincidan, que filteredData es el nuevo arreglo por decirlo asi
      

    return (
        <div>
            <Breadcrumb title="Unidades de Medida" subtitle="Listar" />
            <ParentCard title="Unidades de Medida">
                <Paper variant="outlined">
                    <TextField placeholder="Buscar" variant="outlined" size="small" sx={{ mb: 2, mt:2, width: '25%', ml: '73%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}/>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h6">ID</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Descripción</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((unidadmedida) => (
                                        <TableRow key={unidadmedida.unme_Id}>
                                            <TableCell>{unidadmedida.unme_Id}</TableCell>
                                            <TableCell>{unidadmedida.unme_Descripcion}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>   
                    <TablePagination component="div" count={unidadesmedidas.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
                </Paper>
            </ParentCard>
        </div>
    );
};

export default UnidadesMedidasComponent;