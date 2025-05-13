import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import img1 from 'src/assets/images/blog/blog-img1.jpg';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import {
TextField,InputAdornment,TablePagination, Grid,  CardContent,
  Typography,
  Stack,
  Tooltip,
  Skeleton,
    Fab,Box,Button, Menu, MenuItem,
  ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DucaCreateComponent from "./DucaCreate";
import {IconArrowsDiff, IconUser } from '@tabler/icons';
import SearchIcon from '@mui/icons-material/Search';
import BlankCard from '../../shared/BlankCard';
import ParentCard from "src/components/shared/ParentCard";
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import { alertMessages } from 'src/layouts/config/alertConfig';
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
const DucaCards = () => {
    const [ducas, setDucas] = useState([]);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        severity: '',
        message: '',
    });
    const [modo, setModo] = useState('listar');
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    const mostrarAlerta = (tipo) => {
        const config = alertMessages[tipo];
        if (config) {
          setAlertConfig(config);
          setOpenSnackbar(true);
        } else {
          console.error('Tipo de alerta no encontrado:', tipo);
        }
      };
     function DetalleOficina(persona) {
      console.log('Detaie:', persona.duca_Id);
      setModo('detalle');
      cerrarMenu();
    }
    
    function editarOficina(persona) {
      console.log('Editar Oficina:', persona.duca_Id);
      setModo('editar');
      cerrarMenu();
    }
    const confirmarEliminar = (persona) =>{
        setPersonaSeleccionada(persona);
      setConfirmarEliminacion(true);
      cerrarMenu();
        
      }
      
    const eliminar = (persona) => {
        console.log('Eliminar Oficina:', persona.duca_Id);
        axios.post(`${apiUrl}/api/Duca/FinalizarDuca?duca_Id = ${persona.duca_Id}`,null, {
             headers: {
                'XApiKey': apiKey,
            },
           
        })
         .then(
        listarDucas(),
        mostrarAlerta('eliminado')
      )
      .catch( mostrarAlerta('errorEliminar'));
    }

    function abrirMenu(evento, persona) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setPersonaSeleccionada(persona);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
    }
  
    function cerrarMenu() {
      setMenuAbierto(false);
    }
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
      duca.duca_NombreSocial_Declarante?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      duca.duca_Id.toString().includes(searchQuery.trim())
      );
     
    return(
        <div>  
            <Breadcrumb title="DUCA" subtitle={ "Listar"} />
            <ParentCard  >
                   {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
                    <container>
                    <Stack direction="row" justifyContent="flex-start" mb={2}>
                        <Button variant="contained" onClick={() => setModo('crear')}   startIcon={<AddIcon />}>
                            {'Nuevo'}
                        </Button>
                    </Stack>
                    <TextField placeholder="Buscar" variant="outlined" size="small" sx={{ mb: 2, mt:2, width: '25%', ml: '73%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                        </InputAdornment>
                        ),
                    }}/>
                    <Grid container spacing={3} mb={3} >  {/* Esto es como el div con class row */}
                    
                    
        
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((duca) => (
                        <Grid item  md={12} sm={12} lg={4} key={duca.duca_Id}>
                            <BlankCard>
                                <Box sx={{ position: 'relative' }}>
                                <Typography component={Link} to="/">
                                    {isLoading ? (
                                    <Skeleton variant="square" animation="wave" width="100%" height={60} />
                                    ) : (
                                    <img src={img1} alt="img" width="100%" height="60px" />
                                    )}
                                </Typography>

                                {/* Tooltip justo debajo de la imagen */}
                                <Tooltip title="Acciones">
                                    <Fab
                                    size="small"
                                    color="primary"
                                    sx={{
                                        top: '50px', right: '15px', position: 'absolute' 
                                       
                                    }}
                                    onClick={(e) => abrirMenu(e, duca)}
                                    >
                                      <SettingsIcon size="16" />
                                    </Fab>
                                </Tooltip>

                                <CardContent sx={{ p: 3, pt: 4 }}>
                                    <Typography variant="h6">{duca.duca_No_Duca}</Typography>
                                    <IconUser size="16" /> {duca.duca_NombreSocial_Declarante} <br />
                                    {duca.nombre_Aduana_Registro} <IconArrowsDiff size="16" /> {duca.nombre_Aduana_Destino}
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                                    <Stack direction="row" alignItems="center">
                                        <Typography variant="h6">{duca.duca_No_Correlativo_Referencia}</Typography>
                                    </Stack>
                                    </Stack>
                                </CardContent>
                                </Box>
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
                </container>
            )}
          {modo === 'crear' && (
            <DucaCreateComponent 
             onCancelar={() => setModo('listar')} 
             />
            )}
            </ParentCard>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={alertConfig.severity}
                    sx={{ width: '100%' }}
                >
                    {alertConfig.message}
                </Alert>
            </Snackbar>

             <Menu
                  //so, si 'menuAbierto' esta en true se muestra dado el caso q no pues se cierra 
                    anchorEl={posicionMenu}
                    open={menuAbierto}
                    onClose={cerrarMenu}
                  >
                    <MenuItem onClick={() => editarOficina(personaSeleccionada)}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                      </ListItemIcon>
                      <ListItemText>Editar</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => DetalleOficina(personaSeleccionada)}>
                      <ListItemIcon>
                        <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                      </ListItemIcon>
                      <ListItemText>Detalles</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => confirmarEliminar(personaSeleccionada)}>
                                <ListItemIcon>
                                  <DeleteIcon fontSize="small" style={{ color: '#F44336', fontSize: '18px' }} />
                                </ListItemIcon>
                                <ListItemText>Eliminar</ListItemText>
                    </MenuItem>
                   
                  </Menu>
            
                  <Dialog
                    open={confirmarEliminacion}
                    onClose={() => setConfirmarEliminacion(false)}
                  >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningAmberIcon color="warning" />
                      Confirmar eliminación
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        ¿Estás seguro que deseas eliminar a <strong>{personaSeleccionada?.pers_Nombre}</strong>?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setConfirmarEliminacion(false)}
                        variant="outlined"
                        color="primary"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          eliminar(personaSeleccionada)
                          setConfirmarEliminacion(false);
                          setPersonaSeleccionada(null);
                          
                        }}
                        variant="contained"
                        color="error"
                      >
                        Eliminar
                      </Button>
                    </DialogActions>
                  </Dialog>
        </div>
    )
}

export default DucaCards;