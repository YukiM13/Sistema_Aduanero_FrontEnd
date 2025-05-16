import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, Button, Stack, TextField, InputAdornment,
  TablePagination, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import CategoriasCreate from './CategoriasCreate';
import CategoriasEdit from './CategoriasEdit';
import CategoriasDetails from './CategoriasDetails';
import CategoriaModel from 'src/models/categoriamodel';

// Importamos los iconos
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Snackbar, Alert } from '@mui/material';
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import { alertMessages } from 'src/layouts/config/alertConfig';
import StyledButton from 'src/components/shared/StyledButton';

const CategoriasComponent = () => {
  const [categorias, setCategorias] = useState([]);
  const [modo, setModo] = useState('listar');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [iconRotated, setIconRotated] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    severity: '',
    message: '',
  });

const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1;

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

  function DetalleCategoria(categoria) {
    console.log('Detalle:', categoria.cate_Id);
    setCategoriaSeleccionada(categoria);
    setModo('detalle');
    cerrarMenu();
  }
  
  function editarCategoria(categoria) {
    console.log('Editar Categoría:', categoria.cate_Id);
    setCategoriaSeleccionada(categoria);
    setModo('editar');
    cerrarMenu();
  }
  
  function eliminarCategoria(categoria) {
    console.log('Eliminar Categoría:', categoria.cate_Id);
    setCategoriaSeleccionada(categoria);
    setConfirmarEliminacion(true);
    cerrarMenu();
  }
  function abrirMenu(evento, categoria) {
    setPosicionMenu(evento.currentTarget);
    setCategoriaSeleccionada(categoria);
    setMenuAbierto(true);
    setIconRotated(true); // Activar rotación
  }

  function cerrarMenu() {
    setMenuAbierto(false);
    setIconRotated(false); // Detener rotación
  }

  const cargarCategorias = () => {
    axios.get(`${apiUrl}/api/Categoria/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setCategorias(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las categorías:', error);
    });
  };

  const eliminar = (categoria) => {
    const categoriaEliminar = {...CategoriaModel};
    categoriaEliminar.cate_Id = categoria.cate_Id;
    categoriaEliminar.usua_UsuarioEliminacion = user; // ID real del usuario
    categoriaEliminar.cate_FechaEliminacion = new Date().toISOString();
  
    axios.post(`${apiUrl}/api/Categoria/Eliminar`, categoriaEliminar, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarCategorias();
        mostrarAlerta('eliminado');
      })
      .catch(error => {
        console.error('Error al eliminar categoría:', error);
        mostrarAlerta('errorEliminar');
      });
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, categorias.length - page * rowsPerPage);

  const filteredData = categorias.filter((categoria) =>
    categoria.cate_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    categoria.cate_Id.toString().includes(searchQuery.trim())
  );

  return (
    <div>
      <Breadcrumb title="Categorías" subtitle="Listar" />
      <ParentCard>
        {modo === 'listar' && (
          <container>
            <Stack direction="row" justifyContent="flex-start" mb={2}>              <StyledButton  
                sx={{}} 
                title="Nuevo"
                event={() => setModo('crear')}>
              </StyledButton>
            </Stack>
            <Paper variant="outlined">
              <TextField 
                placeholder="Buscar" 
                variant="outlined" 
                size="small" 
                sx={{ mb: 2, mt:2, width: '25%', ml: '73%' }} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ fontSize: '18px' }} />
                    </InputAdornment>
                  ),
                }}
              />              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Acciones</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">ID</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Descripción</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((categoria, index) => (
                        <TableRow 
                          key={categoria.cate_Id}
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                            '&:hover': { backgroundColor: '#e3f2fd' },
                          }}
                        >
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => abrirMenu(e, categoria)}
                              sx={{
                                backgroundColor: '#d9e7ef',
                                color: 'rgb(0, 83, 121)',
                                '&:hover': {
                                  backgroundColor: 'rgb(157, 191, 207)',
                                },
                                border: '2px solid rgb(0, 83, 121)',
                                borderRadius: '8px',
                                padding: '6px'
                              }}
                            >
                              <SettingsIcon 
                                sx={{
                                  transition: 'transform 0.3s ease-in-out',
                                  transform: iconRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                                fontSize="small" 
                              />
                            </IconButton>
                          </TableCell>
                          <TableCell><Typography variant="body1">{categoria.cate_Id}</Typography></TableCell>
                          <TableCell><Typography variant="body1">{categoria.cate_Descripcion}</Typography></TableCell>
                        </TableRow>
                      ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={3} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>              <TablePagination 
                component="div" 
                count={filteredData.length} 
                page={page} 
                onPageChange={handleChangePage} 
                rowsPerPage={rowsPerPage} 
                onRowsPerPageChange={handleChangeRowsPerPage} 
                ActionsComponent={TablePaginationActions} 
                labelRowsPerPage="Filas por página"
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
              />
            </Paper>
          </container>
        )}
        {modo === 'crear' && (
          <CategoriasCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('guardado');
              cargarCategorias();
            }}
          />
        )}
        {modo === 'editar' && (
          <CategoriasEdit
            categoria={categoriaSeleccionada}
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('actualizado');
              cargarCategorias();
            }}
          />
        )}
        {modo === 'detalle' && (
          <CategoriasDetails
            categoria={categoriaSeleccionada}
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
        anchorEl={posicionMenu}
        open={menuAbierto}
        onClose={cerrarMenu}
      >
        <MenuItem onClick={() => editarCategoria(categoriaSeleccionada)}>
          <ListItemIcon>
            <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => DetalleCategoria(categoriaSeleccionada)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => eliminarCategoria(categoriaSeleccionada)}>
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
          <WarningAmberIcon color="warning" style={{ fontSize: '18px' }} />
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar la categoría <strong>{categoriaSeleccionada?.cate_Descripcion}</strong>?
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
              eliminar(categoriaSeleccionada);
              setConfirmarEliminacion(false);
              setCategoriaSeleccionada(null);
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
};

export default CategoriasComponent;
