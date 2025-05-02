import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
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
import EstadosCivilesDetails from './EstadosCivilesDetails'; // Agregado

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import { alertMessages } from 'src/layouts/config/alertConfig';

const EstadosCiviles = () => {
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [modo, setModo] = useState('listar');
  const [estadoEditando, setEstadoEditando] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const mostrarAlerta = (tipo) => {
    const config = alertMessages[tipo];
    if (config) {
      setAlertConfig(config);
      setOpenSnackbar(true);
    }
  };

  const cargarEstadosCiviles = () => {
    axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setEstadosCiviles(response.data.data);
        }
      })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    cargarEstadosCiviles();
  }, []);

  const abrirMenu = (evento, estado) => {
    setPosicionMenu(evento.currentTarget);
    setEstadoSeleccionado(estado);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

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
        mostrarAlerta('eliminado');
      })
      .catch(() => mostrarAlerta('errorEliminar'));
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
      <Breadcrumb title="Estados Civiles" subtitle="Listar" />
      <ParentCard>
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModo('crear')}>
                Nuevo
              </Button>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'><Typography variant="h6">Acciones</Typography></TableCell>
                    <TableCell><Typography variant="h6">ID</Typography></TableCell>
                    <TableCell><Typography variant="h6">Nombre</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                  ).map((estado) => (
                    <TableRow key={estado.escv_Id}>
                      <TableCell align="center">
                        <IconButton onClick={(e) => abrirMenu(e, estado)}>
                          <SettingsIcon sx={{ color: '#2196F3', fontSize: '20px' }} />
                        </IconButton>
                      </TableCell>
                      <TableCell>{estado.escv_Id}</TableCell>
                      <TableCell>{estado.escv_Nombre}</TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
               <Menu anchorEl={posicionMenu} open={menuAbierto} onClose={cerrarMenu}>
  <MenuItem onClick={handleEditar}>
    <ListItemIcon>
      <EditIcon fontSize="small" sx={{ color: 'orange' }} />
    </ListItemIcon>
    <ListItemText primary="Editar" />
  </MenuItem>

  <MenuItem onClick={() => {
    setModo('detalle');
    cerrarMenu();
  }}>
    <ListItemIcon>
      <VisibilityIcon fontSize="small" sx={{ color: '#9C27B0' }} />
    </ListItemIcon>
    <ListItemText primary="Detalles" />
  </MenuItem>

  <MenuItem onClick={confirmarEliminar}>
    <ListItemIcon>
      <DeleteIcon fontSize="small" sx={{ color: 'red' }} />
    </ListItemIcon>
    <ListItemText primary="Eliminar" />
  </MenuItem>
</Menu>

              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </>
        )}

        {modo === 'crear' && (
          <EstadosCivilesCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarEstadosCiviles();
              mostrarAlerta('guardado');
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
              mostrarAlerta('actualizado');
            }}
          />
        )}

        {modo === 'detalle' && (
          <EstadosCivilesDetails
            estadoCivil={estadoSeleccionado}
            onCancelar={() => setModo('listar')}
          />
        )}

        <Dialog open={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
          <DialogTitle color="warning.main">
            <WarningAmberIcon sx={{ mr: 1 }} />
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro que desea eliminar el estado civil "{estadoSeleccionado?.escv_Nombre}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmarEliminacion(false)}>Cancelar</Button>
            <Button onClick={handleEliminar} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
      </ParentCard>
    </div>
  );
};

export default EstadosCiviles;
