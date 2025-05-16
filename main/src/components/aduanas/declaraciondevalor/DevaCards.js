import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import img1 from 'src/assets/images/blog/blog-img1.jpg';
import logo from 'src/assets/images/logos/LOGUITO.svg';
import {
TextField,InputAdornment,TablePagination,Paper, Grid,  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  Tooltip,
  Skeleton,
    Fab,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlankCard from '../../shared/BlankCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { IconBuilding, IconCalendarEvent, IconFlag } from '@tabler/icons';
import Breadcrumb from "src/layouts/full/shared/breadcrumb/Breadcrumb";
import DeclaracionValorImpresionPdf from "../declaracion-valor/declaracion-valor-impresion-pdf";
import DeclaracionValor from "./DeclaracionValor";
import AddIcon from '@mui/icons-material/Add';
import StyledButton from "src/components/shared/StyledButton";

import { Link } from "react-router-dom";
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import ParentCard from "src/components/shared/ParentCard";
import { f } from "html2pdf.js";
const DevaCards = () => {
    const [devas, setDevas] = useState([]);
     const [page, setPage] = useState(0);//Define como la pagina actual
          const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
          const [searchQuery, setSearchQuery] = useState('');
          const [modo, setModo] = useState('listar');
        const [isLoading, setLoading] = useState(true);
          const [selectedDeclaracion, setSelectedDeclaracion] = useState(null);
          const [modoImpresion, setModoImpresion] = useState(false);
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

      
      const handlePrintClick = (declaracion) => {
        setSelectedDeclaracion(declaracion);
        setModoImpresion(true);
        };

    const handleVolver = () => {
        setModoImpresion(false);
        setSelectedDeclaracion(null);
    };
    
      const filteredData = devas.filter((deva) =>
      deva.deva_Id.toString().includes(searchQuery.trim())
      );

      const formatearFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString("es-ES", {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        });
    };
     
    return(
        <div>  
            <Breadcrumb title="Declaración de valor" subtitle={modoImpresion ? "Impresión" : "Listar"} />
            {!modoImpresion ? (
            <ParentCard >
                {modo === 'listar' && (
                    <container>
                <Stack direction="row" justifyContent="flex-start" mb={2}>
                    <StyledButton  
                    sx={{}} 
                    title="Nuevo"
                    event={() => setModo('crear')}>
                    </StyledButton>
                </Stack>
                <TextField placeholder="Buscar" variant="outlined" size="small" sx={{ mb: 2, mt:2, width: '25%', ml: '73%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                    </InputAdornment>
                    ),
                }}/>
                <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                    {filteredData
                        .reverse()
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((deva) => (
                        <Grid item xs={12} sm={6} lg={4} key={deva.deva_Id}>
                    <BlankCard
                    sx={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                        borderRadius: '12px',
                    }}>
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
                            borderBottomLeftRadius: '0px',
                            borderBottomRightRadius: '0px',
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
                            DEVA #{deva.deva_Id}
                        </Typography>
                        </Box>
                        <CardContent
                        sx={{
                            backgroundColor: '#fff',
                            borderBottomLeftRadius: '12px',
                            borderBottomRightRadius: '12px',
                            borderTop: '1px solid #ccc',
                            padding: '30px 32px',
                            fontFamily: 'Georgia, serif',
                            boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.05)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        >
                        

                        {/* Marca de agua */}
                        <Box
                            sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '100px',
                            color: 'rgba(0, 0, 0, 0.05)',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            }}
                        >
                            FL
                        </Box>

                        
                        {/* Encabezado del documento */}
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, borderBottom: '1px solid #ccc', pb: 1 }}>
                            Registro de Declaración de Valor
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        size="small" 
                        onClick={() => handlePrintClick(deva)}
                        sx={{
                            borderColor: '#1976D2',
                            color: '#1976D2',
                            textTransform: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            px: 1.5,
                            py: 0.5,
                            minHeight: '30px',
                            '&:hover': {
                            borderColor: '#115293',
                            backgroundColor: 'rgba(25, 118, 210, 0.87)',
                            },
                            '& .MuiButton-startIcon': {
                            marginRight: '6px',
                            },
                        }}
                        >
                        Exportar PDF
                        </Button>
                        </Box>

                        
                        <Grid container spacing={2} sx={{ fontSize: '15px' }}> {/* Tamaño uniforme */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                <IconFlag size={16} style={{ marginRight: 6 }} />
                                Aduana de Ingreso:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                {deva.adua_IngresoNombre}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                <IconBuilding size={16} style={{ marginRight: 6 }} />
                                Aduana de Despacho:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                {deva.adua_DespachoNombre}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                <IconCalendarEvent size={16} style={{ marginRight: 6 }} />
                                Fecha de aceptación:
                                </Typography>
                                <Typography variant="body1">
                                {formatearFecha(deva.deva_FechaAceptacion)}
                                </Typography>
                            </Grid>
                            </Grid>

                        {/* Pie de página */}
                        <Box sx={{ mt: 4, borderTop: '1px dashed #ccc', pt: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'flex', fontStyle: 'italic', alignItems: 'center', color: '#555' }}>
                            Documento generado electrónicamente por Frontier Logistic – {formatearFecha(deva.deva_FechaCreacion)}
                            </Typography>
                        </Box>
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
            </container>
            )}
             </ParentCard>
                
            ) : (
                <DeclaracionValorImpresionPdf 
                    declaracionValor={selectedDeclaracion} 
                    onCancelar={handleVolver}
                />
            )}
            {modo === 'crear' && (
                <DeclaracionValor
                    onCancelar={() => setModo('listar')}
                />
            )}
            
        </div>
    )
}

export default DevaCards;