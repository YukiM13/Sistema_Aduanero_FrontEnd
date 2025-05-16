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
import OficinasCreate from './OficinasCreate';
import OficinasEdit from './OficinasEdit';
import OficinasDetails from './OficinasDetails';
import OficinaModel from 'src/models/oficinamodel';

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

const infoLogin = localStorage.getItem('DataUsuario');
  const infoParseada = infoLogin ? JSON.parse(infoLogin) : null;
  const user = infoParseada ? infoParseada.usua_Id : 1;

const OficinasComponent = () => {
  const [oficinas, setOficinas] = useState([]);
  const [modo, setModo] = useState('listar');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [oficinaSeleccionada, setOficinaSeleccionada] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [iconRotated, setIconRotated] = useState(false);
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

  function DetalleOficina(oficina) {
    console.log('Detalle:', oficina.ofic_Id);
    setOficinaSeleccionada(oficina);
    setModo('detalle');
    cerrarMenu();
  }
  
  function editarOficina(oficina) {
    console.log('Editar Oficina:', oficina.ofic_Id);
    setOficinaSeleccionada(oficina);
    setModo('editar');
    cerrarMenu();
  }
  
  function eliminarOficina(oficina) {
    console.log('Eliminar Oficina:', oficina.ofic_Id);
    setOficinaSeleccionada(oficina);
    setConfirmarEliminacion(true);
    cerrarMenu();
  }
  function abrirMenu(evento, oficina) {
    setPosicionMenu(evento.currentTarget);
    setOficinaSeleccionada(oficina);
    setMenuAbierto(true);
    setIconRotated(true); // Activar rotación
  }

  function cerrarMenu() {
    setMenuAbierto(false);
    setIconRotated(false); // Detener rotación
  }

  const cargarOficinas = () => {
    axios.get(`${apiUrl}/api/Oficinas/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setOficinas(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las Oficinas:', error);
    });
  };

  const eliminar = (oficina) => {
    const oficinaEliminar = {...OficinaModel};
    oficinaEliminar.ofic_Id = oficina.ofic_Id;
    oficinaEliminar.usua_UsuarioEliminacion = user; // ID real del usuario
    oficinaEliminar.ofic_FechaEliminacion = new Date().toISOString();
  
    axios.post(`${apiUrl}/api/Oficinas/Eliminar`, oficinaEliminar, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarOficinas();
        mostrarAlerta('eliminado');
      })
      .catch(error => {
        console.error('Error al eliminar oficina:', error);
        mostrarAlerta('errorEliminar');
      });
  };

  useEffect(() => {
    cargarOficinas();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, oficinas.length - page * rowsPerPage);

  const filteredData = oficinas.filter((oficina) =>
    oficina.ofic_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    oficina.ofic_Id.toString().includes(searchQuery.trim())
  );

  return (
    <div>
      <Breadcrumb title="Oficinas" subtitle="Listar" />
      <ParentCard>
        {modo === 'listar' && (
          <container>            <Stack direction="row" justifyContent="flex-start" mb={2}>
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
                        <Typography variant="h6">Nombre</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((oficina, index) => (
                        <TableRow 
                          key={oficina.ofic_Id}
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                            '&:hover': { backgroundColor: '#e3f2fd' },
                          }}
                        >
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => abrirMenu(e, oficina)}
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
                          <TableCell><Typography variant="body1">{oficina.ofic_Id}</Typography></TableCell>
                          <TableCell><Typography variant="body1">{oficina.ofic_Nombre}</Typography></TableCell>
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
          <OficinasCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('guardado');
              cargarOficinas();
            }}
          />
        )}
        {modo === 'editar' && (
          <OficinasEdit
            oficina={oficinaSeleccionada}
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('actualizado');
              cargarOficinas();
            }}
          />
        )}
        {modo === 'detalle' && (
          <OficinasDetails
            oficina={oficinaSeleccionada}
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
        <MenuItem onClick={() => editarOficina(oficinaSeleccionada)}>
          <ListItemIcon>
            <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => DetalleOficina(oficinaSeleccionada)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => eliminarOficina(oficinaSeleccionada)}>
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
            ¿Estás seguro que deseas eliminar la oficina <strong>{oficinaSeleccionada?.ofic_Nombre}</strong>?
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
              eliminar(oficinaSeleccionada);
              setConfirmarEliminacion(false);
              setOficinaSeleccionada(null);
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

export default OficinasComponent;