import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import img1 from 'src/assets/images/blog/blog-img1.jpg';
import {
TextField,InputAdornment,TablePagination,Paper, Grid,  CardContent,
  Typography,
  Stack,
  Tooltip,
  Skeleton,
    Fab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlankCard from '../../shared/BlankCard';

import { Link } from "react-router-dom";
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
const DucaCards = () => {
    const [ducas, setDucas] = useState([]);
     const [page, setPage] = useState(0);//Define como la pagina actual
          const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
          const [searchQuery, setSearchQuery] = useState('');
        const [isLoading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    const listarDucas = () => {
        axios
            .get(`${apiUrl}/api/Duca/Listar`, {
                headers: {
                    "XApiKey": apiKey,
                },
            })
            .then((response) => {
                console.log("Ducas", response.data.data);
                setDucas(response.data.data);
            })
            .catch((error) => {
                console.error("Error al obtener los datos del país:", error);
            });
    };
    useEffect(() => {
        listarDucas();
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
    
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, ducas.length - page * rowsPerPage);
      
    
      const filteredData = ducas.filter((duca) =>
        duca.duca_No_Duca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      duca.duca_Id.toString().includes(searchQuery.trim())
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
                        .map((duca) => (
                        <Grid item xs={12} sm={12} lg={4} key={duca.duca_Id}>
                    <BlankCard>
                        <Typography component={Link} to="/">
                        {isLoading ? (
                            <Skeleton variant="square" animation="wave" width="100%" height={27}></Skeleton>
                        ) : (
                            <img src={img1} alt="img" width="100%" height="60px"/>
                        )}
                        </Typography>
                        <Tooltip title="Add To Cart">
                        <Fab
                            size="small"
                            color="primary"
                            sx={{ bottom: '75px', right: '15px', position: 'absolute' }}
                        >
                           
                        </Fab>
                        </Tooltip>
                        <CardContent sx={{ p: 3, pt: 2 }} minHeight="10vh">
                        <Typography variant="h6">{duca.duca_No_Duca}</Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                            <Stack direction="row" alignItems="center">
                            <Typography variant="h6">${duca.duca_No_Correlativo_Referencia}</Typography>
                            <Typography color="textSecondary" ml={1} sx={{ textDecoration: 'line-through' }}>
                                ${duca.duca_No_Correlativo_Referencia}
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
             <TablePagination component="div" count={ducas.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
            </Paper>
        </div>
    )
}

export default DucaCards;