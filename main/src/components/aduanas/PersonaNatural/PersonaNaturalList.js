import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, TextField, InputAdornment, TablePagination, Typography, Snackbar, Alert
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PersonaNaturalModel from '../../../models/PersonaNaturalModel';
import PersonaNaturalCreateComponent from './PersonaNaturalCreate';
import PersonaNaturalEditComponent from './PersonaNaturalEdit';
import PersonaNaturalDetailsComponent from './PersonaNaturalDetails';
import StyledButton from 'src/components/shared/StyledButton';

const PersonaNaturalList = () => {
  const [personas, setPersonas] = useState([]);
  const [modo, setModo] = useState('listar');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [iconRotated, setIconRotated] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
   const localStorageData = localStorage.getItem('DataUsuario');
    const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
     
  const admin = parsedData ? parsedData.usua_EsAdmin : false;
  const cargarPersonas = () => {
    axios.get(`${apiUrl}/api/PersonaNatural/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
      .then((response) => {
        setPersonas(response.data.data);
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
    setIconRotated(true);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
    setIconRotated(false);
  };

  return (
    <div>
      <Breadcrumb title="Personas Naturales" subtitle={modo === 'listar' ? 'Listar' : 'Crear/Editar/Detalles'} />
      <ParentCard>
        {admin?
          <>
            {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
              <StyledButton
                sx={{}}
                title="Nuevo"
                event={() => setModo('crear')}
              />
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
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }} align="center">
                        <Typography variant="h6">Acciones</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">ID</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Nombre</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">DNI</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">RTN</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Ciudad</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((persona, index) => (
                      <TableRow
                        key={persona.pena_Id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                          '&:hover': { backgroundColor: '#e3f2fd' },
                        }}
                      >
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => abrirMenu(e, persona)}
                            sx={{
                              backgroundColor: '#d9e7ef',
                              color: 'rgb(0, 83, 121)',
                              '&:hover': {
                                backgroundColor: 'rgb(157, 191, 207)',
                              },
                              border: '2px solid rgb(0, 83, 121)',
                              borderRadius: '8px',
                              padding: '6px'
                            }}
                          >
                            <SettingsIcon
                              sx={{
                                transition: 'transform 0.3s ease-in-out',
                                transform: iconRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                              fontSize="small"
                            />
                            <Typography variant="h6" sx={{ ml: 1, fontSize: '0.95rem' }}>Acciones</Typography>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">{persona.pena_Id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">{persona.cliente}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">{persona.pena_DNI}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">{persona.pena_RTN}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">{persona.ciud_Nombre}</Typography>
                        </TableCell>
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
                sx={{
                  backgroundColor: '#fff',
                  color: '#333',
                  borderTop: '1px solid #e0e0e0',
                  fontSize: '0.85rem',
                  '& .MuiTablePagination-toolbar': {
                    padding: '8px 16px',
                    minHeight: '48px',
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: '#666',
                    fontSize: '0.8rem',
                    mb: '0'
                  },
                  '& .MuiTablePagination-actions': {
                    '& button': {
                      color: '#666',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    },
                  },
                  '& .MuiInputBase-root': {
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    backgroundColor: '#f9f9f9',
                    padding: '2px 6px',
                  },
                  '& .MuiSelect-icon': {
                    color: '#888',
                  }
                }}
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
        {modo === 'detalle' && (
          <PersonaNaturalDetailsComponent
            persona={personaSeleccionada}
            onCancelar={() => setModo('listar')}
          />
        )}
        
      
     
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
          </>
          :
          <PersonaNaturalCreateComponent/>
        }
        </ParentCard>
    </div>
  );
};

export default PersonaNaturalList;