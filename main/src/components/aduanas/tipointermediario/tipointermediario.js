import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Stack,
    IconButton, Menu, MenuItem,
    ListItemIcon, ListItemText, TextField, InputAdornment, TablePagination, Typography
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import TipoIntermediarioCreateComponent from './tipointermediarioCreate';
import TipoIntermediarioDetailsComponent from './tipointermediarioDetails';
import TipoIntermediarioEditComponent from './tipointermediarioEdit';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { alertMessages } from 'src/layouts/config/alertConfig';
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";

const TipoIntermediarioComponent = () => {
    const [tipoIntermediarios, setTipoIntermediarios] = useState([]);
    const [modo, setModo] = useState('listar');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [tipoIntermediarioSeleccionado, setTipoIntermediarioSeleccionado] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
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

    const cargarTipoIntermediarios = () => {
        axios.get(`${apiUrl}/api/TipoIntermediario/Listar`, {
            headers: { 'XApiKey': apiKey }
        })
            .then(response => setTipoIntermediarios(response.data.data))
            .catch(error => console.error('Error al obtener los tipos de intermediario:', error));
    };

    const detalleTipoIntermediario = (tipoIntermediario) => {
        setTipoIntermediarioSeleccionado(tipoIntermediario);
        setModo('detalle');
        cerrarMenu();
    };

    const editarTipoIntermediario = (tipoIntermediario) => {
        setTipoIntermediarioSeleccionado(tipoIntermediario);
        setModo('editar');
        cerrarMenu();
    };

    const abrirMenu = (evento, tipoIntermediario) => {
        setPosicionMenu(evento.currentTarget);
        setTipoIntermediarioSeleccionado(tipoIntermediario);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tipoIntermediarios.length - page * rowsPerPage);

    const filteredData = tipoIntermediarios.filter((tipoIntermediario) =>
        tipoIntermediario.tite_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tipoIntermediario.tite_Codigo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        cargarTipoIntermediarios();
    }, []);

    return (
        <div>
            <Breadcrumb title="Tipos de Intermediario" subtitle={"Listar"} />

            <ParentCard title={modo==='listar'? '' : `${modo.charAt(0).toLocaleUpperCase() + modo.slice(1).toLocaleLowerCase()}`}>
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
                                                <Typography variant="h6">Código</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">Descripción</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((tipoIntermediario) => (
                                                <TableRow key={tipoIntermediario.tite_Id}>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => abrirMenu(e, tipoIntermediario)}
                                                        >
                                                            <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{tipoIntermediario.tite_Codigo}</TableCell>
                                                    <TableCell>{tipoIntermediario.tite_Descripcion}</TableCell>
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
                            <TablePagination component="div" count={tipoIntermediarios.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}/>
                        </Paper>
                    </div>
                )}
                {modo === 'crear' && (
                    <TipoIntermediarioCreateComponent
                        onCancelar={() => setModo('listar')}
                        onGuardadoExitoso={() => {
                            setModo('listar');
                            mostrarAlerta('guardado');
                            cargarTipoIntermediarios();
                        }}
                    />
                )}
                {modo === 'editar' && (
                    <TipoIntermediarioEditComponent
                        tipoIntermediario={tipoIntermediarioSeleccionado}
                        onCancelar={() => setModo('listar')}
                        onGuardadoExitoso={() => {
                            setModo('listar');
                            mostrarAlerta('actualizado');
                            cargarTipoIntermediarios();
                        }}
                    />
                )}
                {modo === 'detalle' && (
                    <TipoIntermediarioDetailsComponent
                        tipoIntermediario={tipoIntermediarioSeleccionado}
                        onCancelar={() => setModo('listar')}
                    />
                )}
            </ParentCard>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={alertConfig.severity} sx={{ width: '100%' }}>
                    {alertConfig.message}
                </Alert>
            </Snackbar>

            <Menu anchorEl={posicionMenu} open={menuAbierto} onClose={cerrarMenu}>
                <MenuItem onClick={() => editarTipoIntermediario(tipoIntermediarioSeleccionado)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => detalleTipoIntermediario(tipoIntermediarioSeleccionado)}>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText>Detalles</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default TipoIntermediarioComponent;