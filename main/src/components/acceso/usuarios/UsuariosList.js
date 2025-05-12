import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Stack,
    IconButton, Menu, MenuItem,
    ListItemIcon, ListItemText, TextField, InputAdornment, TablePagination, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    DialogContentText
} from '@mui/material';
import { Chip } from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import UsuarioCreateComponent from './UsuarioCreate';
import UsuarioEditComponent from './UsuarioEdit';
import UsuarioDetailsComponent from './UsuarioDetails';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { alertMessages } from 'src/layouts/config/alertConfig';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";

const UsuariosComponent = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle'
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [confirmarActivacion, setConfirmarActivacion] = useState(false);
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

    const cargarUsuarios = () => {
        Promise.all([
            axios.get(`${apiUrl}/api/Usuarios/Listar?empl_EsAduana=false`, {
                headers: { 'XApiKey': apiKey }
            }),
            axios.get(`${apiUrl}/api/Usuarios/Listar?empl_EsAduana=true`, {
                headers: { 'XApiKey': apiKey }
            })
        ])
            .then(([responseFalse, responseTrue]) => {
                const usuariosCombinados = [
                    ...responseFalse.data.data,
                    ...responseTrue.data.data
                ];
                console.log('Usuarios:', usuariosCombinados);
                setUsuarios(usuariosCombinados);
            })
            .catch(error => console.error('Error al obtener los usuarios:', error));
    };

    const detalleUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModo('detalle');
        cerrarMenu();
    };

    const editarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModo('editar');
        cerrarMenu();
    };

    const eliminarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setConfirmarEliminacion(true);
        cerrarMenu();
    };

    const activarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setConfirmarActivacion(true);
        cerrarMenu();
    };

    const eliminar = (usuario) => {
        axios.post(`${apiUrl}/api/Usuarios/Eliminar`, usuario, {
            headers: { 'XApiKey': apiKey }
        })
            .then(() => {
                cargarUsuarios();
                mostrarAlerta('eliminado');
            })
            .catch(() => mostrarAlerta('errorEliminar'));
    };

    const activar = (usuario) => {        
        axios.post(`${apiUrl}/api/Usuarios/Activar`, usuario, {
            headers: { 'XApiKey': apiKey }
        })
            .then(() => {
                cargarUsuarios();
                mostrarAlerta('activado');
            })
            .catch(() => mostrarAlerta('errorActivar'));
    };

    const abrirMenu = (evento, usuario) => {
        setPosicionMenu(evento.currentTarget);
        setUsuarioSeleccionado(usuario);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, usuarios.length - page * rowsPerPage);

    const filteredData = usuarios.filter((usuario) =>
        usuario.usua_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuario.emplNombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuario.empl_CorreoElectronico.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <div>
            <Breadcrumb title="Usuarios" subtitle={"Listar"} />

            <ParentCard>
                {modo === 'listar' && (
                    <div>
                        <Stack direction="row" justifyContent="flex-start" mb={2}>
                            <Button variant="contained" onClick={() => setModo('crear')} startIcon={<AddIcon />}>
                                {'Nuevo'}
                            </Button>
                        </Stack>
                        <Paper variant="outlined">
                            <TextField placeholder="Buscar" variant="outlined" size="small" sx={{ mb: 2, mt: 2, width: '25%', ml: '73%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }} />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                <Typography variant="h6">Acciones</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">Imagen</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">Nombre de Usuario</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">Nombre Completo</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">Email</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">Rol</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">Estado</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((usuario) => (
                                                <TableRow key={usuario.usua_Id}>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => abrirMenu(e, usuario)}
                                                        >
                                                            <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>
                                                        {usuario.usua_Image && (
                                                            <img
                                                                src={usuario.usua_Image}
                                                                alt={usuario.usua_Nombre}
                                                                style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{usuario.usua_Nombre}</TableCell>
                                                    <TableCell>{usuario.emplNombreCompleto}</TableCell>
                                                    <TableCell>{usuario.empl_CorreoElectronico}</TableCell>
                                                    <TableCell>{usuario.role_Descripcion}</TableCell>
                                                    <TableCell>
                                                        {usuario.usua_Estado ? (
                                                            <Chip
                                                                label="Activo"
                                                                color="success"
                                                                size="small"
                                                                sx={{ fontWeight: 'bold' }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label="Inactivo"
                                                                color="error"
                                                                size="small"
                                                                sx={{ fontWeight: 'bold' }}
                                                            />
                                                        )}
                                                    </TableCell>
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
                            <TablePagination component="div" count={usuarios.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}/>
                        </Paper>
                    </div>
                )}

                {modo === 'crear' && (
                    <UsuarioCreateComponent
                        onCancelar={() => setModo('listar')}
                        onGuardadoExitoso={() => {
                            setModo('listar');
                            mostrarAlerta('guardado');
                            cargarUsuarios();
                        }}
                    />
                )}

                {modo === 'editar' && (
                    <UsuarioEditComponent
                        usuario={usuarioSeleccionado}
                        onCancelar={() => setModo('listar')}
                        onGuardadoExitoso={() => {
                            setModo('listar');
                            mostrarAlerta('actualizado');
                            cargarUsuarios();
                        }}
                    />
                )}

                {modo === 'detalle' && (
                    <UsuarioDetailsComponent
                        usuario={usuarioSeleccionado}
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
                <MenuItem onClick={() => editarUsuario(usuarioSeleccionado)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => detalleUsuario(usuarioSeleccionado)}>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText>Detalles</ListItemText>
                </MenuItem>
                {usuarioSeleccionado?.usua_Estado === true && (
                    <MenuItem onClick={() => eliminarUsuario(usuarioSeleccionado)}>
                        <ListItemIcon>
                            <BlockIcon fontSize="small" style={{ color: '#F44336', fontSize: '18px' }} />
                        </ListItemIcon>
                        <ListItemText>Desactivar</ListItemText>
                    </MenuItem>
                )}
                {usuarioSeleccionado?.usua_Estado===false && (
                    <MenuItem onClick={() => activarUsuario(usuarioSeleccionado)}>
                        <ListItemIcon>
                            <CheckCircleIcon fontSize="small" style={{ color: '#4CAF50', fontSize: '18px' }} />
                        </ListItemIcon>
                        <ListItemText>Activar</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            <Dialog
                open={confirmarEliminacion}
                onClose={() => setConfirmarEliminacion(false)}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon color="warning" />
                    Confirmar Desactivación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro que deseas Desactivar el usuario <strong>{usuarioSeleccionado?.usua_Nombre}</strong>?
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
                            eliminar(usuarioSeleccionado);
                            setConfirmarEliminacion(false);
                            setUsuarioSeleccionado(null);
                        }}
                        variant="contained"
                        color="error"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmarActivacion}
                onClose={() => setConfirmarActivacion(false)}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RestoreIcon color="success" />
                    Confirmar activación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro que deseas activar el usuario <strong>{usuarioSeleccionado?.usua_Nombre   }</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmarActivacion(false)}
                        variant="outlined"
                        color="primary"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            activar(usuarioSeleccionado);
                            setConfirmarActivacion(false);
                            setUsuarioSeleccionado(null);
                        }}
                        variant="contained"
                        color="success"
                    >
                        Activar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UsuariosComponent;