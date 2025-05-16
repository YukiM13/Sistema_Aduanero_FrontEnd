
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText,TextField,InputAdornment,TablePagination,Typography, 
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

//Components
import NivelesComercialesCreateComponent from './NivelesComercialesCreate';
import NivelesComercialesEditComponent from './NivelesComercialesEdit';

import SettingsIcon from '@mui/icons-material/Settings';
import StyledButton from 'src/components/shared/StyledButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { alertMessages } from 'src/layouts/config/alertConfig';
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";

const NivelesComercialesList = () => {
    const [nivelcomercial, setnivelescomerciales] = useState([]);
    const [iconRotated, setIconRotated] = useState(false);
    const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
    const [searchQuery, setSearchQuery] = useState('');
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

    function editarNivelComercial(nivelcomercial) {
      console.log('Editar Oficina:', nivelcomercial.nico_Id);
      setModo('editar');
      cerrarMenu();
    }
    

    function abrirMenu(evento, nivelcomercial) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setNivelSeleccionado(nivelcomercial);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
      setIconRotated(true); // Activar rotación
    }
  
    function cerrarMenu() {
      setMenuAbierto(false);
      setIconRotated(false);
    }

    const cargarNivelesComerciales = () => {
      axios.get(`${apiUrl}/api/NivelesComerciales/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
          setnivelescomerciales(response.data.data);
      })
      .catch(error => {
        console.error('Error al obtener las personas:', error);
      });
    }

    

    useEffect(() => {
        cargarNivelesComerciales(); //Aca llamamos
      }, []);


    const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };//Cambia el numero de filas de la siguiente pagina


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, nivelcomercial.length - page * rowsPerPage);
  //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
  //si tu tamaño siguiera siendo de 10 registros

    const filteredData = nivelcomercial.filter((nico) =>
      nico.nico_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nico.nico_Id.toString().includes(searchQuery.trim())
    );
      

    return (
      <div>
        <Breadcrumb title="Niveles comerciales" subtitle={ "Listar"} />
        
        
  
        
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
                  <TableRow>
                    <TableCell align="center" sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Acciones</Typography>
                      </TableCell>
                    <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Código</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Descripción</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((nivelcomercial, index) => (
                    <TableRow key={nivelcomercial.nico_Id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                        '&:hover': { backgroundColor: '#e3f2fd' },
                      }}>
                      <TableCell align="center">
  
                      <IconButton
                          size="small"
                          onClick={(e) => abrirMenu(e, nivelcomercial)}
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
                          <Typography variante="h6">Acciones</Typography>
                        </IconButton>
                      </TableCell>
                      <TableCell><Typography variant="body1">{nivelcomercial.nico_Codigo}</Typography></TableCell>
                      <TableCell><Typography variant="body1">{nivelcomercial.nico_Descripcion}</Typography></TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                       <TableCell colSpan={2} />
                    </TableRow>
                     )}
                </TableBody>
              </Table>
            </TableContainer>
              <TablePagination component="div" count={nivelcomercial.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" 
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
              }}/>
              </Paper>
            </container>
            )}
            {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
      <NivelesComercialesCreateComponent
        onCancelar={() => setModo('listar')} 
        onGuardadoExitoso={() => {
          setModo('listar');
          mostrarAlerta('guardado')
          // Recarga los datos después de guardar
          cargarNivelesComerciales();
        }}
      />
  
  )}
   {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
  <NivelesComercialesEditComponent
    nivelcomercial={nivelSeleccionado}
    onCancelar={() => setModo('listar')} 
    onGuardadoExitoso={() => {
      setModo('listar');
      mostrarAlerta('actualizado')
      // Recarga los datos después de guardar
      cargarNivelesComerciales();
    }}
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
          <MenuItem onClick={() => editarNivelComercial(nivelSeleccionado)}>
            <ListItemIcon>
              <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
        </Menu>
  
        
      </div>
    );

}


export default NivelesComercialesList;