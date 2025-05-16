import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, TextField, InputAdornment, TablePagination, Typography, Snackbar, Alert
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PersonaNaturalModel from '../../../models/PersonaNaturalModel';
import PersonaNaturalCreateComponent from './PersonaNaturalCreate';
import PersonaNaturalEditComponent from './PersonaNaturalEdit';
// import PersonaNaturalDetailsComponent from './PersonaNaturalDetails';

const PersonaNaturalList = () => {
  const [personas, setPersonas] = useState([]);
  const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle'
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const cargarPersonas = () => {
    axios.get(`${apiUrl}/api/PersonaNatural/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then((response) => {
        setPersonas(response.data.data);
        if (response.data.data && response.data.data.length > 0) {
          console.log('pers_Nombre:', response.data.data[0].pers_Nombre);
        }
      })
      .catch(error => console.error('Error al obtener las personas naturales:', error));
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = personas.filter((persona) =>
    (persona.pers_Nombre?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (persona.pena_DNI || '').includes(searchQuery.trim()) ||
    (persona.pena_RTN || '').includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  const abrirMenu = (evento, persona) => {
    setPosicionMenu(evento.currentTarget);
    setPersonaSeleccionada(persona);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div>
      <Breadcrumb title="Personas Naturales" subtitle={modo === 'listar' ? 'Listar' : 'Crear/Editar/Detalles'} />
      <ParentCard>
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModo('crear')}>
                {'Nuevo'}
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
                        <Typography variant="h6">ID</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Nombre</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">DNI</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">RTN</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Ciudad</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((persona) => (
                      <TableRow key={persona.pena_Id}>
                        <TableCell align="center">
                          <IconButton size="small" onClick={(e) => abrirMenu(e, persona)}>
                            <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                          </IconButton>
                        </TableCell>
                        <TableCell>{persona.pena_Id}</TableCell>
                        <TableCell>{persona.cliente}</TableCell>
                        <TableCell>{persona.pena_DNI}</TableCell>
                        <TableCell>{persona.pena_RTN}</TableCell>
                        <TableCell>{persona.ciud_Nombre}</TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
              />
            </Paper>
          </>
        )}
        {modo === 'crear' && (
          <PersonaNaturalCreateComponent
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarPersonas();
              setOpenSnackbar(true);
              setAlertConfig({ severity: 'success', message: 'Persona natural creada exitosamente.' });
            }}
          />
        )}
        
        {modo === 'editar' && (
          <PersonaNaturalEditComponent
            persona={personaSeleccionada}
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarPersonas();
              setOpenSnackbar(true);
              setAlertConfig({ severity: 'success', message: 'Persona natural editada exitosamente.' });
            }}
          />
        )}
        
        {/* 
        {modo === 'detalle' && (
          <PersonaNaturalDetailsComponent
            persona={personaSeleccionada}
            onCancelar={() => setModo('listar')}
          />
        )}
        */}
      </ParentCard>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.message}
        </Alert>
      </Snackbar>
      <Menu
        anchorEl={posicionMenu}
        open={menuAbierto}
        onClose={cerrarMenu}
      >
        <MenuItem onClick={() => { setModo('editar'); cerrarMenu(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setModo('detalle'); cerrarMenu(); }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Detalles</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PersonaNaturalList;
