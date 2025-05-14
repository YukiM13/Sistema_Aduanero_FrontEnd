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
import { useNavigate } from 'react-router-dom';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
import OrdenCompraCreate from './OrdenCompraCrear';
// import OrdenesComprasEdit from './OrdenesComprasEdit';
// import OrdenesComprasDetails from './OrdenesComprasDetails'; // Agregado

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import { alertMessages } from 'src/layouts/config/alertConfig';

const OrdenesCompras = () => {
  const [ordenesCompras, setOrdenesCompras] = useState([]);
  const [modo, setModo] = useState('listar');
  const [ordenCompraEditando, setOrdenCompraEditando] = useState(null);
  const [ordenCompraSeleccionada, setOrdenCompraSeleccionada] = useState(null);
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

  const cargarOrdenesCompras = () => {
    axios.get(`${apiUrl}/api/OrdenCompra/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setOrdenesCompras(response.data.data);
        }
      })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    cargarOrdenesCompras();
  }, []);

  const abrirMenu = (evento, ordenCompra) => {
    setPosicionMenu(evento.currentTarget);
    setOrdenCompraSeleccionada(ordenCompra);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  const handleEditar = () => {
    if (ordenCompraSeleccionada) {
        setOrdenCompraEditando(ordenCompraSeleccionada);
      setModo('editar');
    }
    cerrarMenu();
  };

  const confirmarEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const handleEliminar = () => {
    if (!ordenCompraSeleccionada) return;
    const ordenCompraEliminar = {
      orco_Id: ordenCompraSeleccionada.orco_Id,
      orco_Estado: false
    };
    axios.post(`${apiUrl}/api/OrdenCompra/Eliminar`, ordenCompraEliminar, {
        headers: { 'XApiKey': apiKey }
    })
    .then(() => {
      cargarOrdenesCompras();
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

  const filteredData = ordenesCompras.filter((ordenCompra) =>
    ordenCompra.clie_Nombre_O_Razon_Social.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.orco_Codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.orco_FechaEmision.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.orco_FechaLimite.toString().includes(searchQuery.trim()) ||
    ordenCompra.fopa_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.orco_Materiales.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.code_EspecificacionEmbalaje.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.orco_EstadoOrdenCompra.toString().includes(searchQuery.trim()) ||
    ordenCompra.orco_DireccionEntrega.toString().includes(searchQuery.trim()) ||
    ordenCompra.orco_Id.toString().includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const navigate = useNavigate();

  return (
    <div>
      <Breadcrumb title="OrdenesCompras" subtitle="Listar" />
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
                            <TableCell><Typography variant="h6">Cliente</Typography></TableCell>
                            <TableCell><Typography variant="h6">Código</Typography></TableCell>
                            <TableCell><Typography variant="h6">Fecha Emisión</Typography></TableCell>
                            <TableCell><Typography variant="h6">Fecha Límite</Typography></TableCell>
                            <TableCell><Typography variant="h6">Método de Pago</Typography></TableCell>
                            <TableCell><Typography variant="h6">Materiales</Typography></TableCell>
                            <TableCell><Typography variant="h6">Embalaje</Typography></TableCell>
                            <TableCell><Typography variant="h6">Estado</Typography></TableCell>
                            <TableCell><Typography variant="h6">Dirección de entrega</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                ).map((ordenCompra) => (
                    <TableRow key={ordenCompra.orco_Id}>
                        <TableCell align="center">
                        <IconButton onClick={(e) => abrirMenu(e, ordenCompra)}>
                            <SettingsIcon sx={{ color: '#2196F3', fontSize: '20px' }} />
                        </IconButton>
                        </TableCell>
                        {/* <TableCell>{ordenCompra.orco_Id}</TableCell> */}
                        <TableCell>{ordenCompra.clie_Nombre_O_Razon_Social}</TableCell>
                        <TableCell>{ordenCompra.orco_Codigo}</TableCell>
                        <TableCell>{ordenCompra.orco_FechaEmision}</TableCell>
                        <TableCell>{ordenCompra.orco_FechaLimite}</TableCell>
                        <TableCell>{ordenCompra.fopa_Descripcion}</TableCell>
                        <TableCell>{ordenCompra.orco_Materiales}</TableCell>
                        <TableCell>{ordenCompra.code_EspecificacionEmbalaje}</TableCell>
                        <TableCell>{ordenCompra.orco_EstadoOrdenCompra}</TableCell>
                        <TableCell>{ordenCompra.orco_DireccionEntrega}</TableCell>
                        <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={!ordenCompra.orco_Id}
                          onClick={() => navigate(`/ordenCompraDetalle/list/${ordenCompra.orco_Id}`)}
                          >
                          Ver detalle
                        </Button>
                        </TableCell>
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
          <OrdenCompraCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarOrdenesCompras();
              mostrarAlerta('guardado');
            }}
          />
        )}

        {/* {modo === 'editar' && (
          <OrdenesComprasEdit
            ordenCompraInicial={ordenCompraEditando}
            onCancelar={() => {
              setModo('listar');
              setProvinciaEditando(null);
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              setProvinciaEditando(null);
              cargarOrdenesCompras();
              mostrarAlerta('actualizado');
            }}
          />
        )}

        {modo === 'detalle' && (
          <OrdenesComprasDetails
            ordenCompra={ordenCompraSeleccionada}
            onCancelar={() => setModo('listar')}
          />
        )} */}

            <Dialog open={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
                <DialogTitle color="warning.main">
                    <WarningAmberIcon sx={{ mr: 1 }} />
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    ¿Está seguro que desea eliminar la ordenCompra "{ordenCompraSeleccionada?.orco_Codigo}"?
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

export default OrdenesCompras;
