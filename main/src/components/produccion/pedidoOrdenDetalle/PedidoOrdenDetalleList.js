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
import { useParams } from 'react-router-dom';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
import PedidoOrdenDetallesCreateComponent from './PedidoOrdenDetalleCreate';
// import OrdenCompraDetalleEditComponent from './OrdenCompraDetalleEdit';
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
import PedidoOrdenDetalleEditComponent from './PedidoOrdenDetalleEdit';

const PedidosOrdenesDetalle = ({peor_Id}) => {
              // const { id } = useParams();
              // const peor_Id = id && !isNaN(parseInt(id)) ? parseInt(id) : null;
  // const ordenCompraID = useParams().id;

  const [pedidosOrdenes, setPedidosOrdenes] = useState([]);
  const [modo, setModo] = useState('listar');
  const [ordenCompraDetalleEditando, setPedidoOrdenDetalleEditando] = useState(null);
  const [pedidoOrdenDetalleSeleccionada, setPedidoOrdenDetalleSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
 const [alertConfig, setAlertConfig] = useState({
  severity: 'success',
  message: ''
});

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
    console.log(peor_Id);
    axios.get(`${apiUrl}/api/PedidosOrdenDetalles/Listar?peor_Id=${peor_Id}`, {
        headers: { 'XApiKey': apiKey }
    })
    .then(response => {
      console.log("Respuesta:", response.data);
      if (response.data && Array.isArray(response.data.data)) {
        setPedidosOrdenes(response.data.data);
      }
    })
      .catch(() => mostrarAlerta('errorListar'));
  };

// useEffect(() => {
//   console.log("ID desde params:", id);
//   console.log("ID parseado:", peor_Id);
//   if (peor_Id) {
//     cargarPedidosOrdenes();
//   }
// }, [peor_Id]);
 useEffect(() => {
    console.log(peor_Id);
    if (peor_Id) {
      cargarPedidosOrdenes(peor_Id);
    }
  }, [peor_Id]);
  

  const abrirMenu = (evento, pedidoOrdenDetalle) => {
    setPosicionMenu(evento.currentTarget);
    setPedidoOrdenDetalleSeleccionada(pedidoOrdenDetalle);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  const handleEditar = () => {
    if (pedidoOrdenDetalleSeleccionada) {
        setPedidoOrdenDetalleEditando(pedidoOrdenDetalleSeleccionada);
      setModo('editar');
    }
    cerrarMenu();
  };

  const confirmarEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const handleEliminar = () => {
    if (!pedidoOrdenDetalleSeleccionada) return;
    const pedidoOrdenDetalleEliminar = {
      peor_Id: pedidoOrdenDetalleSeleccionada.peor_Id,
      prod_Estado: false
    };
    axios.post(`${apiUrl}/api/PedidosOrdenDetalles/Eliminar`, pedidoOrdenDetalleEliminar, {
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



  const filteredData = pedidosOrdenes.filter((pedidoOrdenDetalle) =>
    pedidoOrdenDetalle.mate_Id.toString().includes(searchQuery.toLowerCase()) ||
    pedidoOrdenDetalle.prod_Cantidad.toString().includes(searchQuery.toLowerCase()) ||
    pedidoOrdenDetalle.prod_Precio.toString().includes(searchQuery.trim())
    // pedidoOrdenDetalle.peor_Id.toString().includes(searchQuery.trim())
  );

    /* SIIII */

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  // const navigate = useNavigate();
  // const { id } = useParams();

  // Podés usar `id` para hacer fetch o lo que necesites
  // console.log("ID de la orden:", id);
  return (
    <div>
      {/* <Breadcrumb title="PedidosOrdenes" subtitle="Listar" /> 
      <ParentCard> */}
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
                            {/* <TableCell><Typography variant="h6">Pedido Orden ID</Typography></TableCell> */}
                            <TableCell><Typography variant="h6">Materiales</Typography></TableCell>
                            <TableCell><Typography variant="h6">Cantidad</Typography></TableCell>
                            <TableCell><Typography variant="h6">Precio</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                ).map((pedidoOrdenDetalle) => (
                    <TableRow key={pedidoOrdenDetalle.peor_Id}>
                        <TableCell align="center">
                        <IconButton onClick={(e) => abrirMenu(e, pedidoOrdenDetalle)}>
                            <SettingsIcon sx={{ color: '#2196F3', fontSize: '20px' }} />
                        </IconButton>
                        </TableCell>
                        {/* <TableCell>{ordenCompraDetalle.peor_Id}</TableCell> */}
                        {/* <TableCell>{pedidoOrdenDetalle.peor_Id}</TableCell> */}
                        <TableCell>{pedidoOrdenDetalle.mate_Descripcion}</TableCell>
                        <TableCell>{pedidoOrdenDetalle.prod_Cantidad}</TableCell>
                        <TableCell>{pedidoOrdenDetalle.prod_Precio}</TableCell>
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
          <PedidoOrdenDetallesCreateComponent
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarPedidosOrdenes();
              mostrarAlerta('guardado');
            }}
          />
        )}

        {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
          <PedidoOrdenDetalleEditComponent
              pedidosOrdenesDetalles={pedidoOrdenDetalleSeleccionada}
              onCancelar={() => setModo('listar')} 
              onGuardadoExitoso={() => {
                  setModo('listar');
                  mostrarAlerta('actualizado')
                  // Recarga los datos después de guardar
                  cargarPedidosOrdenes();
              }}>
          </PedidoOrdenDetalleEditComponent>
        )}

            <Dialog open={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
                <DialogTitle color="warning.main">
                    <WarningAmberIcon sx={{ mr: 1 }} />
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    ¿Está seguro que desea eliminar el pedido orden detalle "{pedidoOrdenDetalleSeleccionada?.peor_Codigo}"?
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
        {/* </ParentCard> */}
    </div>
  );
};

export default PedidosOrdenesDetalle;