import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, TextField, InputAdornment, TablePagination, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import RolesCreate from './rolesCreate';
import RolesEdit from './rolesEdit';
import RolesDetails from './rolesDetails';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle'
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [roleSeleccionado, setRoleSeleccionado] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    severity: '',
    message: '',
  });
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const mostrarAlerta = (severity, message) => {
    setAlertConfig({ severity, message });
    setOpenSnackbar(true);
  };

  const cargarRoles = () => {
    Promise.all([
      axios.get(`${apiUrl}/api/Roles/Listar?role_Aduana=false`, {
        headers: { 'XApiKey': apiKey }
      }),
      axios.get(`${apiUrl}/api/Roles/Listar?role_Aduana=true`, {
        headers: { 'XApiKey': apiKey }
      })
    ])
      .then(([responseFalse, responseTrue]) => {
        const rolesCombinados = [
          ...responseFalse.data.data,
          ...responseTrue.data.data
        ];
        setRoles(rolesCombinados);
      })
      .catch(error => console.error('Error al obtener los roles:', error));
  };

  const detalleRol = (role) => {
    setRoleSeleccionado(role);
    setModo('detalle');
    cerrarMenu();
  };

  const editarRol = (role) => {
    setRoleSeleccionado(role);
    setModo('editar');
    cerrarMenu();
  };

  const eliminarRol = (role) => {
    setRoleSeleccionado(role);
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const eliminar = (role) => {
    const payload = {
      role_Id: role.role_Id,
      usua_UsuarioEliminacion: 1, // ID del usuario logueado
      role_FechaEliminacion: new Date(),
    };

    axios.post(`${apiUrl}/api/Roles/Eliminar`, payload, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarRoles();
        mostrarAlerta('success', 'Rol eliminado correctamente.');
      })
      .catch(() => mostrarAlerta('error', 'Error al eliminar el rol.'));
  };

  const abrirMenu = (evento, role) => {
    setPosicionMenu(evento.currentTarget);
    setRoleSeleccionado(role);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, roles.length - page * rowsPerPage);

  const filteredData = roles.filter((role) =>
    role.role_Descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    cargarRoles();
  }, []);

  return (
    <div>
      <Breadcrumb title="Roles" subtitle="Listar" />

      <ParentCard>
        {modo === 'listar' && (
          <div>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
              <Button variant="contained" onClick={() => setModo('crear')} startIcon={<AddIcon />}>
                Nuevo
              </Button>
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Typography variant="h6">Acciones</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Descripción del Rol</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((role) => (
                        <TableRow key={role.role_Id}>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => abrirMenu(e, role)}
                            >
                              <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                            </IconButton>
                          </TableCell>
                          <TableCell>{role.role_Descripcion}</TableCell>
                        </TableRow>
                      ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={2} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={roles.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
              />
            </Paper>
          </div>
        )}

        {modo === 'crear' && (
          <RolesCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('success', 'Rol creado correctamente.');
              cargarRoles();
            }}
          />
        )}

        {modo === 'editar' && (
          <RolesEdit
            role={roleSeleccionado}
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('success', 'Rol actualizado correctamente.');
              cargarRoles();
            }}
          />
        )}

        {modo === 'detalle' && (
          <RolesDetails
            role={roleSeleccionado}
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
        <MenuItem onClick={() => editarRol(roleSeleccionado)}>
          <ListItemIcon>
            <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => detalleRol(roleSeleccionado)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => eliminarRol(roleSeleccionado)}>
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
          <WarningAmberIcon color="warning" />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar el rol <strong>{roleSeleccionado?.role_Descripcion}</strong>?
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
              eliminar(roleSeleccionado);
              setConfirmarEliminacion(false);
              setRoleSeleccionado(null);
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

export default RolesList;