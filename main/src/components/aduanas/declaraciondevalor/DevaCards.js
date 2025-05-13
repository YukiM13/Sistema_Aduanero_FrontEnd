import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import img1 from 'src/assets/images/blog/blog-img1.jpg';
import logo from 'src/assets/images/logos/LOGO.svg';
import {
TextField,InputAdornment,TablePagination,Paper, Grid,  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  Tooltip,
  Skeleton,
    Fab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlankCard from '../../shared/BlankCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { Link } from "react-router-dom";
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
const DevaCards = () => {
    const [devas, setDevas] = useState([]);
     const [page, setPage] = useState(0);//Define como la pagina actual
          const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
          const [searchQuery, setSearchQuery] = useState('');
        const [isLoading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    const listarDevas = () => {
        axios
            .get(`${apiUrl}/api/Declaracion_Valor/Listar`, {
                headers: {
                    "XApiKey": apiKey,
                },
            })
            .then((response) => {
                console.log("Declaracion_Valor", response.data.data);
                setDevas(response.data.data);
            })
            .catch((error) => {
                console.error("Error al obtener los datos del Declaracion_Valor:", error);
            });
    };
    useEffect(() => {
        listarDevas();
    }, []);

 useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);
      const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
      const handleChangeRowsPerPage = (event) => {
          setRowsPerPage(parseInt(event.target.value, 9));
          setPage(0);
      };
    
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, devas.length - page * rowsPerPage);
      
    
      const filteredData = devas.filter((deva) =>
      deva.deva_Id.toString().includes(searchQuery.trim())
      );
     
    return(
        <div>  
            <Paper variant="outlined">
                <TextField placeholder="Buscar" variant="outlined" size="small" sx={{ mb: 2, mt:2, width: '25%', ml: '73%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                    </InputAdornment>
                    ),
                }}/>
                <Grid container spacing={3} mb={3} component={Paper}>  {/* Esto es como el div con class row */}
                
                
       
                    {filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((deva) => (
                        <Grid item xs={12} sm={12} lg={4} key={deva.deva_Id}>
                    <BlankCard>
                        {/* ENCABEZADO DE LA CARD */}
                        <Box
                        sx={{
                            backgroundColor: '#1976D2',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 16px',
                            borderTopLeftRadius: '12px',
                            borderTopRightRadius: '12px',
                            backgroundColor: '#003c69',
                            backgroundImage: "https://www.transparenttextures.com/patterns/hixs-evolution.png",
                            backgroundSize: '12px 12px',
                            backgroundRepeat: 'repeat',
                        }}
                        >
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo Aduana"
                            sx={{ height: '30px', mr: 2 }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Declaración #{deva.deva_Id}
                        </Typography>
                        </Box>
                        <CardContent sx={{ p: 3, pt: 2 }} minHeight="10vh">
                        <Typography variant="h6">{deva.adua_IngresoNombre}</Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                            <Stack direction="row" alignItems="center">
                            <Typography variant="h6">${deva.adua_DespachoNombre}</Typography>
                            <Typography color="textSecondary" ml={1} sx={{ textDecoration: 'line-through' }}>
                                ${deva.duca_No_Correlativo_Referencia}
                            </Typography>
                            </Stack>
                          
                        </Stack>
   
                        </CardContent>
                    </BlankCard>
                    </Grid>
                    ))}
                    {emptyRows > 0 && (
                        <div style={{ height: 53 * emptyRows }}>
                            <div> </div>
                        </div>
                    )}
             </Grid>
             <TablePagination component="div" count={devas.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
            </Paper>
        </div>
    )
}

export default DevaCards;