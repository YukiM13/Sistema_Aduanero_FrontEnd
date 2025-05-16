import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText,TextField,InputAdornment,TablePagination,Typography, Tooltip,  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

//Components
import AduanasCreateComponent from './AduanaCreate';
import AduanasEditComponent from './AduanaEdit';
import AduanasDetailsComponent from './AduanaDetails';

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import StyledButton from 'src/components/shared/StyledButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { alertMessages } from 'src/layouts/config/alertConfig';
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";

const AduanasList = () => {
    const [aduanas, setAduanas] = useState([]);
    const [iconRotated, setIconRotated] = useState(false);
    const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [aduanaSeleccionada, setAduanaSeleccionada] = useState(null);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
      severity: '',
      message: '',
    });

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

    function detalleAduana(aduana) {
      console.log('Detalle:', aduana.adua_Id);
      setModo('detalle');
      cerrarMenu();
    }
    
    function editarAduana(aduana) {
      console.log('Editar Oficina:', aduana.adua_Id);
      setModo('editar');
      cerrarMenu();
    }
    
    function eliminarAduana(aduana) {
      console.log('Eliminar Oficina:', aduana.adua_Id);
      setAduanaSeleccionada(aduana);
      setConfirmarEliminacion(true);
      cerrarMenu();
    }


    function abrirMenu(evento, aduana) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setAduanaSeleccionada(aduana);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
      setIconRotated(true); // Activar rotación
    }
  
    function cerrarMenu() {
      setMenuAbierto(false);
      setIconRotated(false); // Detener rotación
    }

    const cargarAduanas = () => {
      axios.get(`${apiUrl}/api/Aduanas/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
          setAduanas(response.data.data);
      })
      .catch(error => {
        console.error('Error al obtener las personas:', error);
      });
    }

    const eliminar = (aduana) =>{
      axios.post(`${apiUrl}/api/Aduanas/Eliminar`,aduana, {
        headers: { 'XApiKey': apiKey }
      })
      .then(
        cargarAduanas(),
        mostrarAlerta('eliminado')
      )
      .catch( mostrarAlerta('errorEliminar'));
    }  

    useEffect(() => {
        cargarAduanas(); //Aca llamamos
      }, []);


    const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };//Cambia el numero de filas de la siguiente pagina


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, aduanas.length - page * rowsPerPage);
  //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
  //si tu tamaño siguiera siendo de 10 registros

    const filteredData = aduanas.filter((aduana) =>
      aduana.adua_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aduana.adua_Id.toString().includes(searchQuery.trim())
    );
      

    return (
      <div>
        <Breadcrumb title="Aduanas" subtitle={ "Listar"} />
        
        
  
        
          <ParentCard>
          {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
         
     
            <container>
        <Stack direction="row" justifyContent="flex-start" mb={2}>
            <StyledButton  
            sx={{}} 
            title="Nuevo"
            event={() => setModo('crear')}>
            </StyledButton>
        </Stack>
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
              <Table stickyHeader>
                <TableHead>
                  <TableRow >
                    <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Acciones</Typography>
                    </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Código</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Nombre</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Dirección exacta</Typography>
                      </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((aduana, index) => (
                    <TableRow
                      key={aduana.pers_Id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                        '&:hover': { backgroundColor: '#e3f2fd' },
                      }}
                    >
                      <TableCell align="center">
                        <Tooltip title="Acciones">
                        <IconButton
                          size="small"
                          onClick={(e) => abrirMenu(e, aduana)}
                          sx={{
                            backgroundColor: '#d9e7ef', // Fondo celeste claro
                            color: 'rgb(0, 83, 121)',           // Color del icono
                            '&:hover': {
                              backgroundColor: 'rgb(157, 191, 207)',
                            },
                            border: '2px solid rgb(0, 83, 121)', // Borde opcional
                            borderRadius: '8px',         // Bordes redondeados
                            padding: '6px'
                          }}
                        >
                          <SettingsIcon 
                          sx={{transition: 'transform 0.3s ease-in-out',
                            transform: iconRotated ? 'rotate(180deg)' : 'rotate(0deg)',}}
                          fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      </TableCell>
                      <TableCell><Typography variant="body1">{aduana.adua_Codigo}</Typography></TableCell>
                      <TableCell><Typography variant="body1">{aduana.adua_Nombre}</Typography></TableCell>
                      <TableCell><Typography variant="body1">{aduana.adua_Direccion_Exacta}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
              <TablePagination component="div" count={aduanas.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} 
              sx={{
                backgroundColor: '#fff',
                color: '#333',
                borderTop: '1px solid #e0e0e0',
                fontSize: '0.85rem',
                '& .MuiTablePagination-toolbar': {
                  padding: '8px 16px',
                  minHeight: '48px',
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: '#666',
                  fontSize: '0.8rem',
                  mb: '0'
                },
                '& .MuiTablePagination-actions': {
                  '& button': {
                    color: '#666',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  },
                },
                '& .MuiInputBase-root': {
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  backgroundColor: '#f9f9f9',
                  padding: '2px 6px',
                },
                '& .MuiSelect-icon': {
                  color: '#888',
                }
              }}
              labelRowsPerPage="Filas por página" />
              </Paper>
            </container>
            )}
            {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
      <AduanasCreateComponent
        onCancelar={() => setModo('listar')} 
        onGuardadoExitoso={() => {
          setModo('listar');
          mostrarAlerta('guardado')
          // Recarga los datos después de guardar
          cargarAduanas();
        }}
      />
  
  )}
   {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
  <AduanasEditComponent
     aduana={aduanaSeleccionada}
    onCancelar={() => setModo('listar')} 
    onGuardadoExitoso={() => {
      setModo('listar');
      mostrarAlerta('actualizado')
      // Recarga los datos después de guardar
      cargarAduanas();
    }}
  />
  
  )}
  {modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
  <AduanasDetailsComponent
     aduana={aduanaSeleccionada}
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
          <MenuItem onClick={() => editarAduana(aduanaSeleccionada)}>
            <ListItemIcon>
              <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => detalleAduana(aduanaSeleccionada)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
            </ListItemIcon>
            <ListItemText>Detalles</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => eliminarAduana(aduanaSeleccionada)}>
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
              ¿Estás seguro que deseas eliminar a <strong>{aduanaSeleccionada?.adua_Nombre}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmarEliminacion(false)}
              variant="outlined"
              color="info"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                eliminar(aduanaSeleccionada)
                setConfirmarEliminacion(false);
                setAduanaSeleccionada(null);
                
              }}
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

}


export default AduanasList;