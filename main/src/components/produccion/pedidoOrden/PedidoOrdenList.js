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
// import '../pedidoOrden/pedidoOrdenDataGrid.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PedidosOrdenesDetalle from '../pedidoOrdenDetalle/PedidoOrdenDetalleList';

import { useNavigate } from 'react-router-dom';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
// import pedidoOrdenModel from './pedidoOrdenModel';
import PedidoOrdenCreateComponent from './PedidoOrdenCreate';
import PedidoOrdenDetallesCreateComponent from '../pedidoOrdenDetalle/PedidoOrdenDetalleCreate';

import PedidoOrdenEditComponent from './PedidoOrdenEdit';
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
import StyledButton from 'src/components/shared/StyledButton';
import { Collapse} from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// // ...
// const [expandedRow, setExpandedRow] = useState(null); // nuevo estado

// const toggleExpandRow = (id) => {
//   setExpandedRow((prev) => (prev === id ? null : id));
// };

const PedidosOrdenes = () => {
  const [collapseAbiertoId, setCollapseAbiertoId] = useState(null);
  const [iconRotated, setIconRotated] = useState(false);
  const [pedidosOrdenes, setPedidosOrdenes] = useState([]);
  const [modo, setModo] = useState('listar');
  const [pedidoOrdenEditando, setPedidoOrdenEditando] = useState(null);
  const [pedidoOrdenSeleccionada, setPedidoOrdenSeleccionado] = useState(null);
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

  const cargarPedidosOrdenes = () => {
    axios.get(`${apiUrl}/api/PedidosOrden/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setPedidosOrdenes(response.data.data);
        }
      })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    cargarPedidosOrdenes();
  }, []);

  const abrirMenu = (evento, pedidoOrden) => {
    setPosicionMenu(evento.currentTarget);
    console.log(pedidoOrden);
    setMenuAbierto(true);
    setPedidoOrdenSeleccionado(pedidoOrden);
    setIconRotated(true);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
    setIconRotated(false)
  }

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
    if (pedidoOrdenSeleccionada) {
        setPedidoOrdenEditando(pedidoOrdenSeleccionada);
      setModo('editar');
    }
    cerrarMenu();
  };

  const confirmarEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const handleEliminar = () => {
    if (!pedidoOrdenSeleccionada) return;
    const pedidoOrdenEliminar = {
      peor_Id: pedidoOrdenSeleccionada.peor_Id,
      peor_Estado: false
    };
    axios.post(`${apiUrl}/api/PedidosOrden/Eliminar`, pedidoOrdenEliminar, {
        headers: { 'XApiKey': apiKey }
    })
    .then(() => {
      cargarPedidosOrdenes();
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

  const filteredData = pedidosOrdenes.filter((pedidoOrden) =>
    pedidoOrden.peor_Codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pedidoOrden.prov_Id.toString().includes(searchQuery.toLowerCase()) ||
    pedidoOrden.duca_Id.toString().includes(searchQuery.toLowerCase()) ||
    pedidoOrden.ciud_Id.toString().includes(searchQuery.trim()) ||
    pedidoOrden.peor_DireccionExacta.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pedidoOrden.peor_FechaEntrada.toString().includes(searchQuery.toLowerCase()) ||
    pedidoOrden.peor_Obsevaciones.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pedidoOrden.peor_Impuestos.includes(searchQuery.trim()) ||
    pedidoOrden.peor_Id.toString().includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  // const navigate = useNavigate();

  return (
    <div>
      
      <Breadcrumb title="Pedidos Órdenes" subtitle="Listar" />
      <ParentCard sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <StyledButton
                  sx={{}}
                  title="Nuevo"
                  event={() => setModo('crear')}
              >
              </StyledButton>
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
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6"></Typography>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Acciones</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Código</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Proveedor</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">DUCA</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Ciudad</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Dirección Exacta</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Fecha Entrada</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Observaciones</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                              <Typography variant="h6">Impuestos</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                ).map((pedidoOrden, index) => (
                  <React.Fragment key={pedidoOrden.peor_Id}>
                  <TableRow sx={{backgroundColor: index %2 === 0 ? 'white' : '#f5f5f5'}} align="center">
                  <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() =>
                          setCollapseAbiertoId(
                            collapseAbiertoId === pedidoOrden.peor_Id ? null : pedidoOrden.peor_Id
                          )
                        }
                        > 
                        {collapseAbiertoId === pedidoOrden.peor_Id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => abrirMenu(e, pedidoOrden)}
                        sx={{
                            backgroundColor: '#d9e7f7',
                            color: 'rgb(0, 83, 121)',
                            '&:hover': {
                                backgroundColor: 'rgb(157, 191, 207)',
                            },
                            border: '2px solid rgb(0, 83, 121)',
                            borderRadius: '8px',
                            padding: '6px'
                        }}
                      >
                        <SettingsIcon sx={{transition: 'transform 0.3s ease-in-out',
                            transform: iconRotated ? 'rotate(180deg)' : 'rotate(0deg)',}}
                            fontSize="small" 
                        />
                        <Typography variante="h6">Acciones</Typography>
                      </IconButton>
                    </TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.peor_Codigo}</Typography></TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.prov_NombreCompania}</Typography></TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.duca_No_Duca ?? '---'}</Typography></TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.ciud_Nombre}</Typography></TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.peor_DireccionExacta}</Typography></TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.peor_FechaEntrada ?? '—--'}</Typography></TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.peor_Obsevaciones}</Typography></TableCell>
                    <TableCell align='center'><Typography variant="body1">{pedidoOrden.peor_Impuestos ?? '—--'}</Typography></TableCell>
                  </TableRow>

                  {collapseAbiertoId === pedidoOrden.peor_Id && (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={true} timeout="auto" unmountOnExit>
                      {pedidoOrden?.peor_Id > 0 && (
                        <PedidoOrdenDetallesCreateComponent 
                        pedidoOrdenId={pedidoOrden.peor_Id} 
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
                            setPedidoOrdenSeleccionado(pedidoOrdenSeleccionada);
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
          <PedidoOrdenCreateComponent
            onCancelar={() => {
              setModo('listar');
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarPedidosOrdenes();
              mostrarAlerta('guardado');
            }}
          />
        )}

        { modo === 'editar' && (
          <PedidoOrdenEditComponent
            pedidoOrden = {pedidoOrdenSeleccionada}
            // pedidoOrdenInicial={pedidoOrdenEditando}
            onCancelar={() => {
              setModo('listar');
              setPedidoOrdenEditando(null);
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              setPedidoOrdenEditando(null);
              cargarPedidosOrdenes();
              mostrarAlerta('actualizado');
            }}
          />
        )} 

        { modo === 'detalle' && pedidoOrdenSeleccionada && (
          <>
            <Button onClick={() => setModo('listar')}>
              Regresar
            </Button>
            <PedidosOrdenesDetalle
              // pedidoOrdenId={pedidoOrdenSeleccionada.peor_Id} 
              peor_Id = {pedidoOrdenSeleccionada.peor_Id}
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
                    ¿Está seguro que desea eliminar la pedido orden "{pedidoOrdenSeleccionada?.peor_Codigo}"?
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

export default PedidosOrdenes;
