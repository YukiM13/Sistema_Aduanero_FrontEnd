import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, TextField, InputAdornment, 
  TablePagination, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
  Snackbar, Alert
} from '@mui/material';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import EstadosCivilesCreate from './EstadosCivilesCreate';
import EstadosCivilesEdit from './EstadosCivilesEdit';
import EstadosCivilesDetails from './EstadosCivilesDetails';

import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import StyledButton from 'src/components/shared/StyledButton';

const EstadosCiviles = () => {
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [modo, setModo] = useState('listar');
  const [estadoEditando, setEstadoEditando] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [iconRotated, setIconRotated] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });
  const [errorEliminacion, setErrorEliminacion] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const cargarEstadosCiviles = () => {
    axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setEstadosCiviles(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener los estados civiles:', error);
        setOpenSnackbar(true);
        setAlertConfig({ severity: 'error', message: 'Error al cargar los estados civiles.' });
      });
  };

  useEffect(() => {
    cargarEstadosCiviles();
  }, []);

  const abrirMenu = (evento, estado) => {
    setPosicionMenu(evento.currentTarget);
    setEstadoSeleccionado(estado);
    setMenuAbierto(true);
    setIconRotated(true);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
    setIconRotated(false);
  };

  const handleEditar = () => {
    if (estadoSeleccionado) {
      setEstadoEditando(estadoSeleccionado);
      setModo('editar');
    }
    cerrarMenu();
  };

  const confirmarEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const handleEliminar = () => {
    if (!estadoSeleccionado) return;
    const estadoEliminar = {
      escv_Id: estadoSeleccionado.escv_Id,
      usua_UsuarioEliminacion: 1,
      escv_FechaEliminacion: new Date().toISOString()
    };
    axios.post(`${apiUrl}/api/EstadosCiviles/Eliminar`, estadoEliminar, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarEstadosCiviles();
        setOpenSnackbar(true);
        setAlertConfig({ severity: 'success', message: 'Estado civil eliminado exitosamente.' });
      })
      .catch((error) => {
        console.error('Error al eliminar el estado civil:', error);
        // Verificar si el error es debido a que el registro está en uso
        if (error.response && error.response.data && error.response.data.message && 
            error.response.data.message.includes('en uso')) {
          setErrorEliminacion(true);
        } else {
          setOpenSnackbar(true);
          setAlertConfig({ severity: 'error', message: 'Error al eliminar el estado civil.' });
        }
      });
    setConfirmarEliminacion(false);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = estadosCiviles.filter((estado) =>
    estado.escv_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    estado.escv_Id.toString().includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  return (
    <div>
      <Breadcrumb title="Estados Civiles" subtitle={modo === 'listar' ? 'Listar' : 'Crear/Editar/Detalles'} />
      <ParentCard>
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
              <StyledButton
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
                        <Typography variant="h6">Nombre</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((estado, index) => (
                      <TableRow
                        key={estado.escv_Id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                          '&:hover': { backgroundColor: '#e3f2fd' },
                        }}
                      >
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => abrirMenu(e, estado)}
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
                            <Typography variant="h6" sx={{ ml: 1, fontSize: '0.95rem' }}>Acciones</Typography>
                          </IconButton>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body1">{estado.escv_Nombre}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={3} />
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
          </>
        )}

        {modo === 'crear' && (
          <EstadosCivilesCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarEstadosCiviles();
              setOpenSnackbar(true);
              setAlertConfig({ severity: 'success', message: 'Estado civil creado exitosamente.' });
            }}
          />
        )}

        {modo === 'editar' && (
          <EstadosCivilesEdit
            estadoInicial={estadoEditando}
            onCancelar={() => {
              setModo('listar');
              setEstadoEditando(null);
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              setEstadoEditando(null);
              cargarEstadosCiviles();
              setOpenSnackbar(true);
              setAlertConfig({ severity: 'success', message: 'Estado civil editado exitosamente.' });
            }}
          />
        )}

        {modo === 'detalle' && (
          <EstadosCivilesDetails
            estadoCivil={estadoSeleccionado}
            onCancelar={() => setModo('listar')}
          />
        )}
      </ParentCard>
      
      {/* Snackbar de notificaciones */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.message}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog 
        open={confirmarEliminacion} 
        onClose={() => setConfirmarEliminacion(false)}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: '#e65100' }}>
          <WarningAmberIcon sx={{ mr: 1 }} />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el estado civil "{estadoSeleccionado?.escv_Nombre}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '12px 24px' }}>
          <IconButton 
            onClick={() => setConfirmarEliminacion(false)}
            sx={{
              borderRadius: '8px',
              border: '1px solid #ccc',
              padding: '6px 12px',
              color: '#666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#999',
              }
            }}
          >
            <Typography variant="button" sx={{ mr: 1 }}>Cancelar</Typography>
          </IconButton>
          <IconButton 
            onClick={handleEliminar}
            sx={{
              borderRadius: '8px',
              padding: '6px 12px',
              backgroundColor: '#F44336',
              color: 'white',
              '&:hover': {
                backgroundColor: '#D32F2F',
              }
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="button">Eliminar</Typography>
          </IconButton>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de error de eliminación */}
      <Dialog 
        open={errorEliminacion} 
        onClose={() => setErrorEliminacion(false)}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: '#d32f2f' }}>
          <WarningAmberIcon sx={{ mr: 1 }} />
          No es posible eliminar
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            No es posible eliminar el estado civil "{estadoSeleccionado?.escv_Nombre}" porque se encuentra en uso por uno o más registros del sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '12px 24px' }}>
          <IconButton 
            onClick={() => setErrorEliminacion(false)}
            sx={{
              borderRadius: '8px',
              padding: '6px 12px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              }
            }}
          >
            <Typography variant="button">Entendido</Typography>
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Menú de acciones */}
      <Menu
        anchorEl={posicionMenu}
        open={menuAbierto}
        onClose={cerrarMenu}
        sx={{
          '& .MuiPaper-root': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            minWidth: '160px'
          },
          '& .MuiMenuItem-root': {
            padding: '8px 16px',
          }
        }}
      >
        <MenuItem onClick={handleEditar}>
          <ListItemIcon>
            <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setModo('detalle'); cerrarMenu(); }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={confirmarEliminar}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" style={{ color: '#F44336', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default EstadosCiviles;