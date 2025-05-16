import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import {
TextField,InputAdornment,TablePagination, Grid,  CardContent,
  Typography,
  Stack,
  Tooltip,
    Fab,Box,Button, Menu, MenuItem,
  ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Snackbar, Alert, Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DucaCreateComponent from "./DucaCreate";
import { IconUser, IconCalendar, IconMapPin } from '@tabler/icons';
import SearchIcon from '@mui/icons-material/Search';
import BlankCard from '../../shared/BlankCard';
import ParentCard from "src/components/shared/ParentCard";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import { alertMessages } from 'src/layouts/config/alertConfig';
import logo from 'src/assets/images/logos/LOGUITO.svg';
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import DucaPrintComponent from "./DucaPrint";
const DucaCards = () => {
    const [ducas, setDucas] = useState([]);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
    const [searchQuery, setSearchQuery] = useState('');
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [verMasSet, setVerMasSet] = useState(new Set());

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
      setPersonaSeleccionada(persona);
      setModo('detalle');
      cerrarMenu();
    }
    
    function editarOficina(persona) {
      console.log('Editar Oficina:', persona.duca_Id);
      localStorage.setItem('ducaId', persona.duca_Id);
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
        .catch((error) => {
           console.error('Error al eliminar la oficina:', error);
           mostrarAlerta('errorEliminar')
           
        });
    }

    function abrirMenu(evento, persona) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setPersonaSeleccionada(persona);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
    }
    const abrirMas = (evento, tipo, id) => {
      setVerMasSet((prev) => {
        const nuevoSet = new Set(prev);
        if (tipo === 1) {
          nuevoSet.add(id);
        } else if (tipo === 2) {
          nuevoSet.delete(id);
        }
        return nuevoSet;
      });
    };
    
  
    function cerrarMenu() {
      setMenuAbierto(false);
    }
    const listarDucas = () => {
        axios.get(`${apiUrl}/api/Duca/Listar`, {
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
        ducas.duca_FechaVencimiento = new Date(ducas.duca_FechaVencimiento).toLocaleDateString('es-HN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
        });
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
            <Breadcrumb title="DUCA" subtitle={ "Listar"} />
            <ParentCard  >
                   {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
                    <container>
                    <Stack direction="row" justifyContent="flex-start" mb={2}>
                        <Button variant="contained" onClick={() => { setModo('crear');
                           localStorage.removeItem('ducaId'); 
                           localStorage.removeItem('edit');
                           localStorage.removeItem('devaDuca');
                        
                          }
                        }   startIcon={<AddIcon />}>
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
                    
                    
        
                        {filteredData.reverse()
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((duca) => (
                        <Grid item  md={12} sm={12} lg={4} key={duca.duca_Id}>
                            <BlankCard
                             sx={{
                              backgroundColor: '#fff',
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                                borderRadius: '12px',
                              }}>
                                <Box  sx={{position: 'relative'}}>
                                 
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
                                      DUCA #{duca.duca_No_Duca}
                                  </Typography>

                                {/* Tooltip justo debajo de la imagen */}
                                <Tooltip title="Acciones">
                                    <Fab
                                    size="small"
                                    color="primary"
                                    sx={{
                                        top: '40px', right: '15px', position: 'absolute' 
                                       
                                    }}
                                    onClick={(e) => abrirMenu(e, duca)}
                                    >
                                      <SettingsIcon size="16" />
                                    </Fab>
                                </Tooltip>
                                </Box>
                                <CardContent sx={{
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
                                    Registro de Declaración Unica Centroamericana (DUCA)
                                    </Typography>
                             
                                    
                                    <Grid container spacing={2} sx={{ fontSize: '15px' }}> {/* Tamaño uniforme */}
                                      <Grid item xs={12}>
                                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                          <IconUser size={16} style={{ marginRight: 6 }} />
                                          No. de Referencia:
                                          </Typography>
                                          <Typography variant="body1" sx={{ mb: 2 }}>
                                          {duca.duca_No_Correlativo_Referencia}
                                          </Typography>
                                      </Grid>
                                      <Grid item xs={12}>
                                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                          <IconUser size={16} style={{ marginRight: 6 }} />
                                          Declarante:
                                          </Typography>
                                          <Typography variant="body1" sx={{ mb: 2 }}>
                                          {duca.duca_NombreSocial_Declarante}
                                          </Typography>
                                      </Grid>
                                      {!verMasSet.has(duca.duca_Id) ?
                                      <Grid item xs={12}>
                                          
                                         <Typography variant="body2"  onClick={(e) => abrirMas(e, 1, duca.duca_Id)}>
                                           <Link  underline="hover" color={"black"}>
                                              {'Ver más'}
                                            </Link>
                                         </Typography>
                                       
                                         
                                      </Grid>
                                      :
                                      <>
                                      <Grid item xs={12}>
                                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                          <IconMapPin size={16} style={{ marginRight: 6 }} />
                                          Aduana de Ingreso:
                                          </Typography>
                                          <Typography variant="body1" sx={{ mb: 2 }}>
                                          {duca.nombre_Aduana_Registro}
                                          </Typography>
                                      </Grid>
                                    
                                      <Grid item xs={12}>
                                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                          <IconMapPin size={16} style={{ marginRight: 6 }} />
                                          Aduana de Despacho:
                                          </Typography>
                                          <Typography variant="body1" sx={{ mb: 2 }}>
                                          {duca.nombre_Aduana_Destino}
                                          </Typography>
                                      </Grid>
                                    
                                      <Grid item xs={12}>
                                          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                                          <IconCalendar
                                           size={16} style={{ marginRight: 6 }} />
                                          Fecha de vencimiento:
                                          </Typography>
                                          <Typography variant="body1">
                                          {formatearFecha(duca.duca_FechaVencimiento)}
                                          </Typography>
                                      </Grid>
                                       <Grid item xs={12}>
                                          
                                         <Typography variant="body2"   onClick={(e) => abrirMas(e, 2, duca.duca_Id)}>
                                            <Link  underline="hover" color={"black"}>
                                              {'Ver menos'}
                                            </Link>
                                         </Typography>
                                       
                                         
                                      </Grid>
                                      </>
                                     
                                      }
                                      </Grid>
                                    
                                  {/* Pie de página */}
                                  <Box sx={{ mt: 4, borderTop: '1px dashed #ccc', pt: 2 }}>
                                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'flex', fontStyle: 'italic', alignItems: 'center', color: '#555' }}>
                                      Documento generado electrónicamente por Frontier Logistic – {formatearFecha(duca.duca_FechaCreacion)}
                                      </Typography>
                                  </Box>
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
             onCancelar={() =>{ setModo('listar');
              localStorage.removeItem('ducaId'); 
              localStorage.removeItem('edit');
              localStorage.removeItem('devaDuca');
              localStorage.removeItem('Devas');
             }}
             onGuardadoExitoso={() => {
              localStorage.removeItem('ducaId'); 
              localStorage.removeItem('edit');
              localStorage.removeItem('devaDuca');
              localStorage.removeItem('Devas');
              setModo('listar');
              mostrarAlerta('guardado')
              // Recarga los datos después de guardar
              listarDucas(); 
             }}
             />
            )} 
          {modo === 'editar' && (
            <DucaCreateComponent 
             onCancelar={() => { setModo('listar');
              localStorage.removeItem('ducaId'); 
              localStorage.removeItem('edit');
              localStorage.removeItem('devaDuca');
              localStorage.removeItem('Devas');
             }}
             onGuardadoExitoso={() => {
              localStorage.removeItem('ducaId'); 
              localStorage.removeItem('edit');
              localStorage.removeItem('devaDuca');
              localStorage.removeItem('Devas');
              setModo('listar');
              mostrarAlerta('actualizado')
              // Recarga los datos después de guardar
              listarDucas(); 
             }}
             />
             
            )} 

             {modo === 'detalle' && ( 
                  
                <DucaPrintComponent
                  Duca={personaSeleccionada}
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
                    {ducas.duca_Finalizado ?(
                       <MenuItem onClick={() => DetalleOficina(personaSeleccionada)}>
                        <ListItemIcon>
                          <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                        </ListItemIcon>
                        <ListItemText>Detalles</ListItemText>
                      </MenuItem>
                    ):(
                      <>
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
                                <ListItemText>Finalizar</ListItemText>
                    </MenuItem>
                    </>
                    )}
                    
                   
                  </Menu>
            
                  <Dialog
                    open={confirmarEliminacion}
                    onClose={() => setConfirmarEliminacion(false)}
                  >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningAmberIcon color="warning" />
                      Confirmar Finalizacion
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        ¿Estás seguro que deseas finalizar la DUCA # <strong>{personaSeleccionada?.duca_No_Duca}</strong>?
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
                        Finalizar
                      </Button>
                    </DialogActions>
                  </Dialog>
        </div>
    )
}

export default DucaCards;