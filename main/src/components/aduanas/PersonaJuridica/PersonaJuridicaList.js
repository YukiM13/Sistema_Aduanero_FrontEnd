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
import PersonaJuridicaForm from './PersonaJuridicaForm';
import PersonaJuridicaDetails from './PersonaJuridicaDetails';

const PersonaJuridicaList = () => {
  const [personasJuridicas, setPersonasJuridicas] = useState([]);
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

  const cargarPersonasJuridicas = () => {
    axios.get(`${apiUrl}/api/PersonaJuridica/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then((response) => {
        setPersonasJuridicas(response.data.data || []);
      })
      .catch(error => console.error('Error al obtener las personas jurídicas:', error));
  };

  useEffect(() => {
    cargarPersonasJuridicas();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = personasJuridicas.filter((persona) =>
    (persona.pers_Nombre?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (persona.pers_RTN || '').includes(searchQuery.trim())
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
      <Breadcrumb title="Personas Jurídicas" subtitle={modo === 'listar' ? 'Listar' : 'Crear/Editar/Detalles'} />
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
                        <Typography variant="h6">RTN</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Ciudad</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Correo Electrónico</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((persona) => (
                      <TableRow key={persona.peju_Id}>
                        <TableCell align="center">
                          <IconButton size="small" onClick={(e) => abrirMenu(e, persona)}>
                            <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                          </IconButton>
                        </TableCell>
                        <TableCell>{persona.peju_Id}</TableCell>
                        <TableCell>{persona.pers_Nombre}</TableCell>
                        <TableCell>{persona.pers_RTN}</TableCell>
                        <TableCell>{persona.ciud_Nombre}</TableCell>
                        <TableCell>{persona.peju_CorreoElectronico}</TableCell>
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
          <PersonaJuridicaForm
            onCancelar={() => setModo('listar')}
            onGuardar={() => {
              setModo('listar');
              cargarPersonasJuridicas();
              setOpenSnackbar(true);
              setAlertConfig({ severity: 'success', message: 'Persona jurídica creada exitosamente.' });
            }}
          />
        )}
        {modo === 'editar' && personaSeleccionada && (
          <PersonaJuridicaForm
            esEditar={true}
            personaJuridica={personaSeleccionada}
            onCancelar={() => setModo('listar')}
            onGuardar={() => {
              setModo('listar');
              cargarPersonasJuridicas();
              setOpenSnackbar(true);
              setAlertConfig({ severity: 'success', message: 'Persona jurídica editada exitosamente.' });
            }}
          />
        )}
        {modo === 'detalle' && personaSeleccionada && (
          <PersonaJuridicaDetails
            persona={personaSeleccionada}
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

export default PersonaJuridicaList;
