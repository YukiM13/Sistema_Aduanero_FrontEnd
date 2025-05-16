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

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ComercianteIndividualCreate from './ComercianteIndividualCreate';

import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import { alertMessages } from 'src/layouts/config/alertConfig';

const ComercianteIndividualList = () => {
  const [comerciantes, setComerciantes] = useState([]);
  const [modo, setModo] = useState('listar');
  const [comercianteSeleccionado, setComercianteSeleccionado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
   const localStorageData = localStorage.getItem('DataUsuario');
    const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
     
  const admin = parsedData ? parsedData.usua_EsAdmin : false;
  const mostrarAlerta = (tipo) => {
    const config = alertMessages[tipo];
    if (config) {
      setAlertConfig(config);
      setOpenSnackbar(true);
    }
  };

  const cargarComerciantes = () => {
    axios.get(`${apiUrl}/api/ComercianteIndividual/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setComerciantes(response.data.data);
        }
      })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    cargarComerciantes();
  }, []);

  const abrirMenu = (evento, comerciante) => {
    setPosicionMenu(evento.currentTarget);
    setComercianteSeleccionado(comerciante);
    setMenuAbierto(true);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = comerciantes.filter((item) =>
    item.pers_Nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.coin_Id.toString().includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  return (
    <div>
       <Breadcrumb title="Comerciante Individual" subtitle="Listar" />
      <ParentCard>
      {admin? 
        <>
       
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setMostrarFormulario(prev => {
                    const nuevoEstado = !prev;
                    if (!prev) window.scrollTo({ top: 0, behavior: 'smooth' });
                    return nuevoEstado;
                  });
                }}
              >
                {mostrarFormulario ? 'Ocultar' : 'Nuevo'}
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

            <Collapse in={mostrarFormulario} timeout="auto" unmountOnExit>
              <ComercianteIndividualCreate
                onSaveSuccess={() => {
                  setMostrarFormulario(false);
                  cargarComerciantes();
                  mostrarAlerta('successCrear');
                }}
                onCancel={() => setMostrarFormulario(false)}
              />
            </Collapse>

            {!mostrarFormulario && (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'><Typography variant="h6">Acciones</Typography></TableCell>
                        <TableCell><Typography variant="h6">ID</Typography></TableCell>
                        <TableCell><Typography variant="h6">Nombre</Typography></TableCell>
                        <TableCell><Typography variant="h6">RTN</Typography></TableCell>
                        <TableCell><Typography variant="h6">Forma Representación</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : filteredData
                      ).map((item) => (
                        <TableRow key={item.coin_Id}>
                          <TableCell align="center">
                            <IconButton onClick={(e) => abrirMenu(e, item)}>
                              <SettingsIcon sx={{ color: '#2196F3', fontSize: '20px' }} />
                            </IconButton>
                          </TableCell>
                          <TableCell>{item.coin_Id}</TableCell>
                          <TableCell>{item.pers_Nombre}</TableCell>
                          <TableCell>{item.pers_RTN}</TableCell>
                          <TableCell>{item.formaRepresentacionDesc}</TableCell>
                        </TableRow>
                      ))}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={5} />
                        </TableRow>
                      )}
                    </TableBody>
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

            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
            </Snackbar>
          </>
        )}
    
      </>
        :
        <ComercianteIndividualCreate />
      }
      </ParentCard>
    </div>
  );
};

export default ComercianteIndividualList;
