import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Box,
  IconButton, Menu, MenuItem, Button,
  ListItemIcon, ListItemText, TextField, InputAdornment,
  TablePagination, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
  Snackbar, Alert
} from '@mui/material';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ComercianteIndividualCreate from './ComercianteIndividualCreate';
import ComercianteIndividualEdit from './ComercianteIndividualEdit';

import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import { alertMessages } from 'src/layouts/config/alertConfig';
import StyledButton from 'src/components/shared/StyledButton';

const ComercianteIndividualList = () => {
  const [comerciantes, setComerciantes] = useState([]);
  const [modo, setModo] = useState('listar');
  const [comercianteSeleccionado, setComercianteSeleccionado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [iconRotated, setIconRotated] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const mostrarAlerta = (tipo) => {
    const config = alertMessages[tipo];
    if (config) {
      setAlertConfig(config);
      setOpenSnackbar(true);
    }
  };

  const cargarComerciantes = () => {
    axios.get(`${apiUrl}/api/ComercianteIndividual/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setComerciantes(response.data.data);
        }
      })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    cargarComerciantes();
  }, []);

  const abrirMenu = (evento, comerciante) => {
    setPosicionMenu(evento.currentTarget);
    setComercianteSeleccionado(comerciante);
    setMenuAbierto(true);
    setIconRotated(true);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
    setPosicionMenu(null);
    setIconRotated(false);
  };

  const handleEditar = () => {
    setMostrarFormularioEditar(true);
    cerrarMenu();
    // Desplazar la vista hacia arriba para ver el formulario de edición
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const confirmarEliminar = () => {
    axios.put(`${apiUrl}/api/ComercianteIndividual/Eliminar?id=${comercianteSeleccionado.coin_Id}`, {}, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarComerciantes();
        mostrarAlerta('successEliminar');
        setConfirmarEliminacion(false);
      })
      .catch(() => {
        mostrarAlerta('errorEliminar');
        setConfirmarEliminacion(false);
      });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = comerciantes.filter((item) =>
    item.pers_Nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.coin_Id.toString().includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  const obtenerComercianteDetalle = (id) => {
    return axios.get(`${apiUrl}/api/ComercianteIndividual/Buscar?id=${id}`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && response.data.data) {
          return response.data.data;
        }
        return null;
      })
      .catch(error => {
        console.error("Error al obtener detalle del comerciante:", error);
        mostrarAlerta('errorBuscar');
        return null;
      });
  };

  return (
    <div>
      <Breadcrumb title="Comerciante Individual" subtitle={modo === 'listar' ? 'Listar' : 'Crear/Editar'} />
      <ParentCard>
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
              {mostrarFormulario ? (
                <StyledButton
                  title="Ocultar"
                  event={() => {
                    setMostrarFormulario(false);
                  }}
                />
              ) : (
                <StyledButton
                  title="Nuevo"
                  event={() => {
                    setMostrarFormulario(true);
                    setMostrarFormularioEditar(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </Stack>

            <Collapse in={mostrarFormulario} timeout="auto" unmountOnExit>
              <ComercianteIndividualCreate
                onSaveSuccess={() => {
                  setMostrarFormulario(false);
                  cargarComerciantes();
                  mostrarAlerta('successCrear');
                }}
                onCancel={() => setMostrarFormulario(false)}
              />
            </Collapse>

            <Collapse in={mostrarFormularioEditar} timeout="auto" unmountOnExit>
              {comercianteSeleccionado && (
                <ComercianteIndividualEdit
                  comercianteData={comercianteSeleccionado}
                  onSaveSuccess={() => {
                    setMostrarFormularioEditar(false);
                    cargarComerciantes();
                    mostrarAlerta('successEditar');
                  }}
                  onCancel={() => setMostrarFormularioEditar(false)}
                />
              )}
            </Collapse>

            {!mostrarFormulario && !mostrarFormularioEditar && (
              <Paper variant="outlined">
                <TextField
                  placeholder="Buscar"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2, mt: 2, width: '25%', ml: '73%' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }} align="center">
                          <Typography variant="h6">Acciones</Typography>
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                          <Typography variant="h6">ID</Typography>
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                          <Typography variant="h6">Nombre</Typography>
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                          <Typography variant="h6">RTN</Typography>
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                          <Typography variant="h6">Forma Representación</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : filteredData
                      ).map((item, index) => (
                        <TableRow 
                          key={item.coin_Id}
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                            '&:hover': { backgroundColor: '#e3f2fd' },
                          }}
                        >
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => abrirMenu(e, item)}
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
                                  transform: iconRotated && comercianteSeleccionado?.coin_Id === item.coin_Id ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                                fontSize="small"
                              />
                              <Typography variant="h6" sx={{ ml: 1, fontSize: '0.95rem' }}>Acciones</Typography>
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">{item.coin_Id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">{item.pers_Nombre}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">{item.pers_RTN}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">{item.formaRepresentacionDesc}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={5} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
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
                  labelRowsPerPage="Filas por página"
                />
              </Paper>
            )}

            {/* Menú de opciones */}
            <Menu
              anchorEl={posicionMenu}
              open={menuAbierto}
              onClose={cerrarMenu}
            >
              <MenuItem onClick={handleEditar}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                </ListItemIcon>
                <ListItemText>Editar</ListItemText>
              </MenuItem>
            </Menu>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
              open={confirmarEliminacion}
              onClose={() => setConfirmarEliminacion(false)}
            >
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
                  Confirmar Eliminación
                </Box>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  ¿Está seguro que desea eliminar este registro?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmarEliminacion(false)} color="primary">
                  Cancelar
                </Button>
                <Button onClick={confirmarEliminar} color="error" autoFocus>
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert severity={alertConfig.severity} sx={{ width: '100%' }} onClose={() => setOpenSnackbar(false)}>
                {alertConfig.message}
              </Alert>
            </Snackbar>
          </>
        )}
      </ParentCard>
    </div>
  );
};

export default ComercianteIndividualList;