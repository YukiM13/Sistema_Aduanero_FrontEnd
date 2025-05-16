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
import OrdenCompraDetallesCreateComponent from './OrdenCompraDetalleCreate';
import OrdenCompraDetalleEditComponent from './OrdenCompraDetalleEdit';
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

const OrdenesComprasDetalle = ({orco_Id}) => {
  // const ordenCompraID = useParams().id;

  const [ordenesCompras, setOrdenesCompras] = useState([]);
  const [modo, setModo] = useState('listar');
  const [ordenCompraDetalleEditando, setOrdenCompraDetalleEditando] = useState(null);
  const [ordenCompraDetalleSeleccionada, setOrdenCompraDetalleSeleccionada] = useState(null);
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

  // const mostrarAlerta = (tipo) => {
  //   const config = alertMessages[tipo];
  //   if (config) {
  //     setAlertConfig(config);
  //     setOpenSnackbar(true);
  //   }
  // };
const mostrarAlerta = (tipo) => {
  const mensajes = {
    creado: '¡Detalle de orden de compra creada exitosamente!',
    actualizado: '¡Detalle de orden de compra actualizada exitosamente!',
    eliminado: '¡Detalle de orden de compra eliminada exitosamente!'
  };

  setAlertConfig({
    severity: 'success',
    message: mensajes[tipo]
  });
  setOpenSnackbar(true);
};


  const cargarOrdenesCompras = () => {
    console.log(orco_Id);
    axios.get(`${apiUrl}/api/OrdenCompraDetalles/Listar?orco_Id=${orco_Id}`, {
        headers: { 'XApiKey': apiKey }
    })
    .then(response => {
      console.log("Respuesta:", response.data);
      if (response.data && Array.isArray(response.data.data)) {
        setOrdenesCompras(response.data.data);
      }
    })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    console.log(orco_Id);
    if (orco_Id) {
      cargarOrdenesCompras(orco_Id);
    }
  }, [orco_Id]);
  

  const abrirMenu = (evento, ordenCompraDetalle) => {
    setPosicionMenu(evento.currentTarget);
    setOrdenCompraDetalleSeleccionada(ordenCompraDetalle);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  const handleEditar = () => {
    if (ordenCompraDetalleSeleccionada) {
        setOrdenCompraDetalleEditando(ordenCompraDetalleSeleccionada);
      setModo('editar');
    }
    cerrarMenu();
  };

  const confirmarEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const handleEliminar = () => {
    if (!ordenCompraDetalleSeleccionada) return;
    const ordenCompraDetalleEliminar = {
      orco_Id: ordenCompraDetalleSeleccionada.orco_Id,
      orco_Estado: false
    };
    axios.post(`${apiUrl}/api/OrdenCompraDetalles/Eliminar`, ordenCompraDetalleEliminar, {
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



  const filteredData = ordenesCompras.filter((ordenCompraDetalle) =>
    ordenCompraDetalle.code_CantidadPrenda ||
    ordenCompraDetalle.esti_Descripcion.includes(searchQuery.toLowerCase()) ||
    ordenCompraDetalle.tall_Nombre.toString().includes(searchQuery.trim()) ||
    ordenCompraDetalle.code_Sexo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompraDetalle.colr_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ordenCompraDetalle.proc_DescripcionComienza.toString().includes(searchQuery.trim()) ||
    ordenCompraDetalle.proc_DescripcionActual.toString().includes(searchQuery.trim()) ||
    ordenCompraDetalle.code_Unidad ||
    ordenCompraDetalle.code_Valor ||
    ordenCompraDetalle.code_Impuesto ||
    ordenCompraDetalle.code_EspecificacionEmbalaje.toString().includes(searchQuery.trim()) ||
    ordenCompraDetalle.code_FechaProcActual.toString().includes(searchQuery.trim())
    // ordenCompraDetalle.orco_Id.toString().includes(searchQuery.trim())
  );

    /* SIIII */

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  // const navigate = useNavigate();
  // const { id } = useParams();

  // Podés usar `id` para hacer fetch o lo que necesites
  // console.log("ID de la orden:", id);
  return (
    <div>
      {/* <Breadcrumb title="OrdenesCompras" subtitle="Listar" /> */}
      {/* <ParentCard> */}
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
                            <TableCell><Typography variant="h6">Orden de Compra ID</Typography></TableCell>
                            <TableCell><Typography variant="h6">Cantidad de Prendas</Typography></TableCell>
                            <TableCell><Typography variant="h6">Estilo</Typography></TableCell>
                            <TableCell><Typography variant="h6">Talla</Typography></TableCell>
                            <TableCell><Typography variant="h6">Sexo</Typography></TableCell>
                            <TableCell><Typography variant="h6">Color</Typography></TableCell>
                            <TableCell><Typography variant="h6">Proceso ID Inicio</Typography></TableCell>
                            <TableCell><Typography variant="h6">Proceso ID Actual</Typography></TableCell>
                            <TableCell><Typography variant="h6">Unidad</Typography></TableCell>
                            <TableCell><Typography variant="h6">Valor</Typography></TableCell>
                            <TableCell><Typography variant="h6">Impuesto</Typography></TableCell>
                            <TableCell><Typography variant="h6">Especificación de Embalaje</Typography></TableCell>
                            <TableCell><Typography variant="h6">Fecha Proceso Actual</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                ).map((ordenCompraDetalle) => (
                    <TableRow key={ordenCompraDetalle.orco_Id}>
                        <TableCell align="center">
                        <IconButton onClick={(e) => abrirMenu(e, ordenCompraDetalle)}>
                            <SettingsIcon sx={{ color: '#2196F3', fontSize: '20px' }} />
                        </IconButton>
                        </TableCell>
                        {/* <TableCell>{ordenCompraDetalle.orco_Id}</TableCell> */}
                        <TableCell>{ordenCompraDetalle.orco_Id}</TableCell>
                        <TableCell>{ordenCompraDetalle.code_CantidadPrenda}</TableCell>
                        <TableCell>{ordenCompraDetalle.esti_Descripcion}</TableCell>
                        <TableCell>{ordenCompraDetalle.tall_Nombre}</TableCell>
                        <TableCell>{ordenCompraDetalle.code_Sexo}</TableCell>
                        <TableCell>{ordenCompraDetalle.colr_Nombre}</TableCell>
                        <TableCell>{ordenCompraDetalle.proc_DescripcionComienza}</TableCell>
                        <TableCell>{ordenCompraDetalle.proc_DescripcionActual}</TableCell>
                        <TableCell>{ordenCompraDetalle.code_Unidad}</TableCell>
                        <TableCell>{ordenCompraDetalle.code_Valor}</TableCell>
                        <TableCell>{ordenCompraDetalle.code_Impuesto}</TableCell>
                        <TableCell>{ordenCompraDetalle.code_EspecificacionEmbalaje}</TableCell>
                        <TableCell>{ordenCompraDetalle.code_FechaProcActual}</TableCell>
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
          <OrdenCompraDetallesCreateComponent
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarOrdenesCompras();
              mostrarAlerta('creado');
            }}
          />
        )}

        {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
          <OrdenCompraDetalleEditComponent
              ordenesComprasDetalles={ordenCompraDetalleSeleccionada}
              onCancelar={() => setModo('listar')} 
              onGuardadoExitoso={() => {
                  setModo('listar');
                  mostrarAlerta('actualizado')
                  // Recarga los datos después de guardar
                  cargarOrdenesCompras();
              }}>
          </OrdenCompraDetalleEditComponent>
        )}

            <Dialog open={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
                <DialogTitle color="warning.main">
                    <WarningAmberIcon sx={{ mr: 1 }} />
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    ¿Está seguro que desea eliminar la ordenCompraDetalle "{ordenCompraDetalleSeleccionada?.orco_Codigo}"?
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

export default OrdenesComprasDetalle;