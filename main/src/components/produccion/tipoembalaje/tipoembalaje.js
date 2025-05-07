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
import TipoEmbalajeCreateComponent from './tipoembalajeCreate';
import TipoEmbalajeDetailsComponent from './tipoembalajeDetails';
import TipoEmbalajeEditComponent from './tipoembalajeEdit';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { alertMessages } from 'src/layouts/config/alertConfig';
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";

const TipoEmbalajeComponent = () => {
    const [tipoEmbalajes, setTipoEmbalajes] = useState([]);
    const [modo, setModo] = useState('listar');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [tipoEmbalajeSeleccionado, setTipoEmbalajeSeleccionado] = useState(null);
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

    const mostrarAlerta = (tipo) => {
        const config = alertMessages[tipo];
        if (config) {
            setAlertConfig(config);
            setOpenSnackbar(true);
        } else {
            console.error('Tipo de alerta no encontrado:', tipo);
        }
    };

    const cargarTipoEmbalajes = () => {
        axios.get(`${apiUrl}/api/TipoEmbalaje/Listar`, {
            headers: { 'XApiKey': apiKey }
        })
            .then(response => setTipoEmbalajes(response.data.data))
            .catch(error => console.error('Error al obtener los tipo de embalaje:', error));
    };

    const detalleTipoEmbalaje = (tipoEmbalaje) => {
        setTipoEmbalajeSeleccionado(tipoEmbalaje);
        setModo('detalle');
        cerrarMenu();
    };

    const editarTipoEmbalaje = (tipoEmbalaje) => {
        setTipoEmbalajeSeleccionado(tipoEmbalaje);
        setModo('editar');
        cerrarMenu();
    };

    const eliminarTipoEmbalaje = (tipoEmbalaje) => {
        setTipoEmbalajeSeleccionado(tipoEmbalaje);
        setConfirmarEliminacion(true);
        cerrarMenu();
    };

    const eliminar = (tipoEmbalaje) => {
        axios.post(`${apiUrl}/api/TipoEmbalaje/Eliminar`, tipoEmbalaje, {
            headers: { 'XApiKey': apiKey }
        })
            .then(() => {
                cargarTipoEmbalajes();
                mostrarAlerta('eliminado');
            })
            .catch(() => mostrarAlerta('errorEliminar'));
    };

    const abrirMenu = (evento, tipoEmbalaje) => {
        setPosicionMenu(evento.currentTarget);
        setTipoEmbalajeSeleccionado(tipoEmbalaje);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tipoEmbalajes.length - page * rowsPerPage);

    const filteredData = tipoEmbalajes.filter((tipoEmbalaje) =>
        tipoEmbalaje.tiem_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tipoEmbalaje.tiem_Id.toString().includes(searchQuery.trim())
    );

    useEffect(() => {
        cargarTipoEmbalajes();
    }, []);

    return (
        <div>
            <Breadcrumb title="Tipo Embalaje" subtitle={"Listar"} />

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
                                                <Typography variant="h6">Descripción</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((tipoEmbalaje) => (
                                                <TableRow key={tipoEmbalaje.tiem_Id}>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => abrirMenu(e, tipoEmbalaje)}
                                                        >
                                                            <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{tipoEmbalaje.tiem_Descripcion}</TableCell>
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
                            <TablePagination component="div" count={tipoEmbalajes.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}/>
                        </Paper>
                    </div>
                )}

                {modo === 'crear' && (
                    <TipoEmbalajeCreateComponent
                        onCancelar={() => setModo('listar')}
                        onGuardadoExitoso={() => {
                            setModo('listar');
                            mostrarAlerta('guardado');
                            cargarTipoEmbalajes();
                        }}
                    />
                )}

                {modo === 'editar' && (
                    <TipoEmbalajeEditComponent
                        tipoEmbalaje={tipoEmbalajeSeleccionado}
                        onCancelar={() => setModo('listar')}
                        onGuardadoExitoso={() => {
                            setModo('listar');
                            mostrarAlerta('actualizado');
                            cargarTipoEmbalajes();
                        }}
                    />
                )}
                {modo === 'detalle' && (
                    <TipoEmbalajeDetailsComponent
                        tipoEmbalaje={tipoEmbalajeSeleccionado}
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

            <Menu anchorEl={posicionMenu} open={menuAbierto} onClose={cerrarMenu}>
                <MenuItem onClick={() => editarTipoEmbalaje(tipoEmbalajeSeleccionado)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => detalleTipoEmbalaje(tipoEmbalajeSeleccionado)}>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText>Detalles</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => eliminarTipoEmbalaje(tipoEmbalajeSeleccionado)}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" style={{ color: '#F44336', fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText>Eliminar</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog open={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon color="warning" />
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro que deseas eliminar el tipo de embalaje <strong>{tipoEmbalajeSeleccionado?.tiem_Descripcion}</strong>?
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
                            eliminar(tipoEmbalajeSeleccionado);
                            setConfirmarEliminacion(false);
                            setTipoEmbalajeSeleccionado(null);
                        }} variant="contained" color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TipoEmbalajeComponent;