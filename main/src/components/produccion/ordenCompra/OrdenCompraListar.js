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
import '../ordenCompra/ordenCompraDataGrid.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OrdenesComprasDetalle from '../ordenCompraDetalle/OrdenCompraDetalleList';

import { useNavigate } from 'react-router-dom';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
import OrdenCompraComponent from './OrdenCompraCrear';
import OrdenCompraDetallesCreateComponent from '../ordenCompraDetalle/OrdenCompraDetalleCreate';

import OrdenCompraEditComponent from './OrdenCompraEditar';
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

import { Collapse} from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// // ...
// const [expandedRow, setExpandedRow] = useState(null); // nuevo estado

// const toggleExpandRow = (id) => {
//   setExpandedRow((prev) => (prev === id ? null : id));
// };

const OrdenesCompras = () => {
  const [collapseAbiertoId, setCollapseAbiertoId] = useState(null);

  const [ordenesCompras, setOrdenesCompras] = useState([]);
  const [modo, setModo] = useState('listar');
  const [ordenCompraEditando, setOrdenCompraEditando] = useState(null);
  const [ordenCompraSeleccionada, setOrdenCompraSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [showCollapse, setShowCollapse] = useState(false);

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
    console.log(ordenCompra);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  const handleAgregarClick = () => {
    setShowCollapse(true);
  };

  const [alerta, setAlerta] = useState(null);
  const handleGuardadoExitoso = () => {
    setAlerta({ tipo: 'success', mensaje: 'Detalle guardado correctamente.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCollapseAbiertoId(null);
    console.log('Guardado exitoso');
  };

  const handleCancelar = () => {
    setShowCollapse(false);
    console.log('Cancelar'); 
  };

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
    ordenCompra.orco_Materiales.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.code_EspecificacionEmbalaje.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompra.orco_EstadoOrdenCompra.toString().includes(searchQuery.trim()) ||
    ordenCompra.orco_DireccionEntrega.toString().includes(searchQuery.trim()) ||
    ordenCompra.orco_Id.toString().includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  // const navigate = useNavigate();

  return (
    <div>
      
      <Breadcrumb title="OrdenesCompras" subtitle="Listar" />
      <ParentCard sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
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

            {alerta && (
              <Alert severity={alerta.tipo} onClose={() => setAlerta(null)}>
                {alerta.mensaje}
              </Alert>
            )}
            <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow> 
                            <TableCell><Typography variant="h6"></Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Acciones</Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Cliente</Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Código</Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Fecha Emisión</Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Fecha Límite</Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Método de Pago</Typography></TableCell>
                            <TableCell align='center' sx={{ minWidth: 70 }}><Typography variant="h6">Materiales</Typography></TableCell>
                            <TableCell align='center' sx={{ minWidth: 120 }}><Typography variant="h6">Embalaje</Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Estado</Typography></TableCell>
                            <TableCell align='center'><Typography variant="h6">Dirección de Entrega</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                ).map((ordenCompra) => (
                  <React.Fragment key={ordenCompra.orco_Id}>
                  <TableRow align="center">
                  <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() =>
                          setCollapseAbiertoId(
                            collapseAbiertoId === ordenCompra.orco_Id ? null : ordenCompra.orco_Id
                          )
                        }
                        > 
                        {collapseAbiertoId === ordenCompra.orco_Id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={(e) => abrirMenu(e, ordenCompra)}>
                        <SettingsIcon sx={{ color: '#7521f3', fontSize: '20px' }} />
                      </IconButton>
                    </TableCell>
                    <TableCell align='center'>{ordenCompra.clie_Nombre_O_Razon_Social}</TableCell>
                    <TableCell align='center'>{ordenCompra.orco_Codigo}</TableCell>
                    <TableCell align='center'>{ordenCompra.orco_FechaEmision}</TableCell>
                    <TableCell align='center'>{ordenCompra.orco_FechaLimite}</TableCell>
                    <TableCell align='center'>{ordenCompra.fopa_Descripcion}</TableCell>
                    <TableCell align='center'>
                      {ordenCompra.orco_Materiales === true
                        ? 'Sí'
                        : ordenCompra.orco_Materiales === false
                        ? 'No'
                        : '—'}
                    </TableCell>
                    <TableCell align='center'>{ordenCompra.tiem_Descripcion ?? '—'}</TableCell>
                    <TableCell align='center'>{ordenCompra.orco_EstadoOrdenCompra}</TableCell>
                    <TableCell align='center' sx={{ minWidth: 250, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {ordenCompra.orco_DireccionEntrega ?? '—'}
                    </TableCell>

                  </TableRow>

                  {collapseAbiertoId === ordenCompra.orco_Id && (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={true} timeout="auto" unmountOnExit>
                      {ordenCompra?.orco_Id > 0 && (
                        <OrdenCompraDetallesCreateComponent 
                        ordenCompraId={ordenCompra.orco_Id} 
                        onGuardadoExitoso={handleGuardadoExitoso}
                        onCancelar={handleCancelar}
                        />
                      )}

                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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
          <OrdenCompraComponent
            onCancelar={() => {
              setModo('listar');
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarOrdenesCompras();
              mostrarAlerta('guardado');
            }}
          />
        )}

        { modo === 'editar' && (
          <OrdenCompraEditComponent
            ordenCompra = {ordenCompraSeleccionada}
            // ordenCompraInicial={ordenCompraEditando}
            onCancelar={() => {
              setModo('listar');
              setOrdenCompraEditando(null);
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              setOrdenCompraEditando(null);
              cargarOrdenesCompras();
              mostrarAlerta('actualizado');
            }}
          />
        )}

        { modo === 'detalle' && (
          <>
            <Button onClick={() => setModo('listar')}>
              Regresar
            </Button>
            <OrdenesComprasDetalle
              orco_Id = {ordenCompraSeleccionada.orco_Id}
            />
          </>
        )}

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
                message="¡Detalle guardado exitosamente!"
            >
            <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
            </Snackbar>
        </ParentCard>
    </div>
  );
};

export default OrdenesCompras;
