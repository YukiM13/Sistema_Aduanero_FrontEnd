import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, TextField, InputAdornment,
  TablePagination, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
  Snackbar, Alert, Collapse
} from '@mui/material';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TablePaginationActions from 'src/_mockApis/actions/TablePaginationActions';
import { alertMessages } from 'src/layouts/config/alertConfig';

import FormasEnvioCreate from './FormasEnvioCreate';
import FormasEnvioEdit from './FormasEnvioEdit';
import FormasEnvioDetails from './FormasEnvioDetails'; // ✅ Importar componente de detalles

const FormasEnvio = () => {
  const [formasenvio, setFormasEnvio] = useState([]);
  const [modo, setModo] = useState('listar');
  const [formaSeleccionada, setFormaSeleccionada] = useState(null);
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

  const cargarFormasEnvio = () => {
    axios.get(`${apiUrl}/api/FormasEnvio/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setFormasEnvio(response.data.data);
        }
      })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    cargarFormasEnvio();
  }, []);

  const abrirMenu = (evento, forma) => {
    setPosicionMenu(evento.currentTarget);
    setFormaSeleccionada(forma);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  const confirmarEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const handleEliminar = () => {
    if (!formaSeleccionada) return;
    const data = {
      foen_Id: formaSeleccionada.foen_Id,
      usua_UsuarioEliminacion: 1,
      foen_FechaEliminacion: new Date().toISOString()
    };
    axios.post(`${apiUrl}/api/FormasEnvio/Eliminar`, data, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarFormasEnvio();
        mostrarAlerta('eliminado');
      })
      .catch(() => mostrarAlerta('errorEliminar'));
    setConfirmarEliminacion(false);
  };

  const filteredData = formasenvio.filter((forma) =>
    forma.foen_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forma.foen_Codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forma.foen_Id.toString().includes(searchQuery.trim())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  return (
    <div>
      <Breadcrumb title="Formas de Envío" subtitle="Listar" />
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
                    <TableCell><Typography variant="h6">Código</Typography></TableCell>
                    <TableCell><Typography variant="h6">Descripción</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                  ).map((forma) => (
                    <TableRow key={forma.foen_Id}>
                      <TableCell align="center">
                        <IconButton onClick={(e) => abrirMenu(e, forma)}>
                          <SettingsIcon sx={{ color: '#2196F3', fontSize: '20px' }} />
                        </IconButton>
                      </TableCell>
                      <TableCell>{forma.foen_Id}</TableCell>
                      <TableCell>{forma.foen_Codigo}</TableCell>
                      <TableCell>{forma.foen_Descripcion}</TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Menu anchorEl={posicionMenu} open={menuAbierto} onClose={cerrarMenu}>
              <MenuItem onClick={() => { cerrarMenu(); setModo('editar'); }}>
                <ListItemIcon><EditIcon fontSize="small" sx={{ color: 'orange' }} /></ListItemIcon>
                <ListItemText primary="Editar" />
              </MenuItem>
              <MenuItem onClick={() => { cerrarMenu(); setModo('detalles'); }}>
                <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#9C27B0' }} /></ListItemIcon>
                <ListItemText primary="Detalles" />
              </MenuItem>
              <MenuItem onClick={confirmarEliminar}>
                <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: 'red' }} /></ListItemIcon>
                <ListItemText primary="Eliminar" />
              </MenuItem>
            </Menu>

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

        <Collapse in={modo === 'crear'} timeout="auto" unmountOnExit>
          <FormasEnvioCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarFormasEnvio();
            }}
          />
        </Collapse>

        <Collapse in={modo === 'editar'} timeout="auto" unmountOnExit>
          <FormasEnvioEdit
            formaSeleccionada={formaSeleccionada}
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarFormasEnvio();
            }}
          />
        </Collapse>

        <Collapse in={modo === 'detalles'} timeout="auto" unmountOnExit>
          <FormasEnvioDetails
            formaEnvio={formaSeleccionada}
            onCancelar={() => setModo('listar')}
          />
        </Collapse>

        <Dialog open={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
          <DialogTitle color="warning.main">
            <WarningAmberIcon sx={{ mr: 1 }} />
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro que desea eliminar la forma de envío "{formaSeleccionada?.foen_Descripcion}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmarEliminacion(false)}>Cancelar</Button>
            <Button onClick={handleEliminar} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
      </ParentCard>
    </div>
  );
};

export default FormasEnvio;
