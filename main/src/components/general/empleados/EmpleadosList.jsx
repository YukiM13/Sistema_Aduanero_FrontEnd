import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText,TextField,InputAdornment,TablePagination,Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Chip
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';
import StyledButton from 'src/components/shared/StyledButton';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { alertMessages } from 'src/layouts/config/alertConfig';
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import EmpleadoDetailsComponent from './EmpleadoDetails';
import EmpleadosCreateComponent from './EmpleadoCreate';
import EmpleadosEditComponent from './EmpleadoEdit';
const EmpleadosComponent = () => {
  const [empleados, setEmpleados] = useState([]);
   const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
      severity: '',
      message: '',
    });
    const [iconRotated, setIconRotated] = useState(false);

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
      function DetalleOficina(empleado) {
        console.log('Detaie:', empleado);
        setModo('detalle');
        cerrarMenu();
      }

      function editarOficina(empleado) {
        console.log('Editar Oficina:', empleado);
        setModo('editar');
        cerrarMenu();
      }

      function eliminarOficina(empleado) {
        console.log('Eliminar Oficina:', empleado);
        setEmpleadoSeleccionado(empleado);
        setConfirmarEliminacion(true);
        cerrarMenu();
      }

      function abrirMenu(evento, empleado) {
        //obtenemos la posicion donde deberia mostrarse el menu
        setPosicionMenu(evento.currentTarget);
        //obtenemos la fila de info correspondiente
        setEmpleadoSeleccionado(empleado);
        //con setMenuAbierto(); definimos si el menu esta abierto
        setMenuAbierto(true);
         setIconRotated(true);
      }

      function cerrarMenu() {
        setMenuAbierto(false);
        setIconRotated(false);
      }
    const cargarEmpleados = () => { //pasamos el listar a una funcion fuera del useEffect y llamamos la funcion dentro del useEffect

      axios.get(`${apiUrl}/api/Empleados/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {

        setEmpleados(response.data.data);

      })
      .catch(error => {
        console.error('Error al obtener las empleados:', error);
      });
    };

    const eliminar = (empleado) =>{
      empleado.usua_UsuarioEliminacion = 1
      empleado.empl_FechaEliminacion = new Date().toISOString()
      empleado.usua_UsuarioActivacion = 1
      empleado.empl_FechaActivacion = new Date().toISOString()
      empleado.empl_Estado ? 
      
      axios.post(`${apiUrl}/api/Empleados/Eliminar`,empleado, {
        headers: { 'XApiKey': apiKey }
      })
      .then( (response) => {
        if (response.data?.data?.messageStatus === '1') {
          cargarEmpleados();
          mostrarAlerta('desactivar');
        } else {
          mostrarAlerta('errorDesactivar'); // puedes manejar otros casos aquí
        }
       
    })
      .catch( mostrarAlerta('errorDesactivar'))
      :
      axios.post(`${apiUrl}/api/Empleados/Reactivar`,empleado, {
        headers: { 'XApiKey': apiKey }
      })
      .then((response) => {
        if (response.data?.data?.messageStatus === '1') {
          cargarEmpleados();
          mostrarAlerta('activado');
        } else {
          mostrarAlerta('errorActivar'); // puedes manejar otros casos aquí
        }
    })
      .catch( mostrarAlerta('errorActivar'));
    }

  useEffect(() => {

    cargarEmpleados();

  }, []);
  const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, empleados.length - page * rowsPerPage);


  const filteredData = empleados.filter((empleado) =>
    empleado.empl_NombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
  empleado.empl_DNI.toLowerCase().includes(searchQuery.toLowerCase()) ||
  empleado.empl_Id.toString().includes(searchQuery.trim())
  );
  return (
    <div>
       <Breadcrumb title="Empleados" subtitle="Listar" />
      <ParentCard>
         {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
            <container>
              <Stack direction="row" justifyContent="flex-start" mb={2}>
                  <StyledButton  
                    sx={{}} 
                    title="Nuevo"
                    event={() => setModo('crear')}>
                  </StyledButton>
              </Stack>

                <Paper variant="outlined">
                  <TextField placeholder="Buscar" variant="outlined" size="small" sx={{ mb: 2, mt:2, width: '25%', ml: '73%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                        ),
                    }}/>
        <TableContainer component={Paper}>
          <Table>
            <TableHead >
              <TableRow >
                <TableCell   sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold', align:'center' }}>
                 <Typography variant="h6">Acciones</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">DNI</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Nombre</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Correo</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Sexo</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Fecha Nacimiento</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>  
                  <Typography variant="h6">Telefono</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Cargo</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Direccion</Typography>

                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Estado Civil</Typography>

                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Estado</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((empleado) => (
                  <TableRow key={empleado.empl_Id}>
                    <TableCell align="center">

                   <IconButton
                      size="small"
                      onClick={(e) => abrirMenu(e, empleado)}
                      sx={{
                        backgroundColor: '#d9e7ef', // Fondo celeste claro
                        color: 'rgb(0, 83, 121)',           // Color del icono
                        '&:hover': {
                          backgroundColor: 'rgb(157, 191, 207)',
                        },
                        border: '2px solid rgb(0, 83, 121)', // Borde opcional
                        borderRadius: '8px',         // Bordes redondeados
                        padding: '6px'
                      }}
                    >
                      <SettingsIcon 
                      sx={{transition: 'transform 0.3s ease-in-out',
                        transform: iconRotated ? 'rotate(180deg)' : 'rotate(0deg)',}}
                      fontSize="small" />
                      <Typography variante="h6">Acciones</Typography>
                    </IconButton> 
                  </TableCell>
                  <TableCell><Typography variant="body1">{empleado.empl_DNI}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.empl_NombreCompleto}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.empl_CorreoElectronico}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.empl_Sexo}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.empl_FechaNacimiento}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.empl_Telefono}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.carg_Nombre}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.empl_DireccionExacta}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{empleado.escv_Nombre}</Typography></TableCell>
                  <TableCell>
                    <Chip
                    label={empleado.empl_Estado ? 'Activo' : 'Inactivo'}
                    color={empleado.empl_Estado ? 'success' : 'error'}
                    variant="contained"
                    size="small"
                    />
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
            <TablePagination component="div" count={empleados.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
            </Paper>
          </container>
          )}
           {modo === 'crear' && (

              <EmpleadosCreateComponent
                onCancelar={() => {setModo('listar');  cargarEmpleados();}}
                onGuardadoExitoso={() => {
                  setModo('listar');
                  mostrarAlerta('guardado')
                  // Recarga los datos después de guardar
                  cargarEmpleados();
                }}
              />

          )}
          {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
          
          <EmpleadosEditComponent
          empleado={empleadoSeleccionado}
          onCancelar={() => {setModo('listar');  cargarEmpleados();}}
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('actualizado')
              // Recarga los datos después de guardar
              cargarEmpleados();
            }}
          />
          
          )}
          {modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

          <EmpleadoDetailsComponent
            empleado={empleadoSeleccionado}
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
           //so, si 'menuAbierto' esta en true se muestra dado el caso q no pues se cierra
             anchorEl={posicionMenu}
             open={menuAbierto}
             onClose={cerrarMenu}
           >
             <MenuItem onClick={() => editarOficina(empleadoSeleccionado)}>
               <ListItemIcon>
                 <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
               </ListItemIcon>
               <ListItemText>Editar</ListItemText>
             </MenuItem>
             <MenuItem onClick={() => DetalleOficina(empleadoSeleccionado)}>
               <ListItemIcon>
                 <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
               </ListItemIcon>
               <ListItemText>Detalles</ListItemText>
             </MenuItem>

             <MenuItem onClick={() => eliminarOficina(empleadoSeleccionado)}>
             {empleadoSeleccionado && (
                <ListItemIcon>
                  {empleadoSeleccionado?.empl_Estado ? <BlockIcon fontSize="small" color="error" sx={{ fontSize: 18 }} />
                    : <CheckCircleIcon fontSize="small" color="success" sx={{ fontSize: 18 }} />
                  }
                </ListItemIcon>
              )}
               <ListItemText>{empleadoSeleccionado?.empl_Estado ? 'Desactivar':'Activar'}</ListItemText>
             </MenuItem>
           </Menu>

           <Dialog
             open={confirmarEliminacion}
             onClose={() => setConfirmarEliminacion(false)}
           >
             <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <WarningAmberIcon color="warning" />
               Confirmar {empleadoSeleccionado?.empl_Estado ? 'Desactivacion':'Activacion'}
             </DialogTitle>
             <DialogContent>
               <DialogContentText>
                 ¿Estás seguro que deseas <strong>{empleadoSeleccionado?.empl_Estado ? 'Desactivar':'Activar'}</strong>  a <strong>{empleadoSeleccionado?.empl_NombreCompleto}</strong>?
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
                   eliminar(empleadoSeleccionado)
                   setConfirmarEliminacion(false);
                   setEmpleadoSeleccionado(null);

                 }}

                 variant="contained"
                 color={empleadoSeleccionado?.empl_Estado ? 'error' : 'success'}
               >
                {empleadoSeleccionado?.empl_Estado ? "Desactivar" : "Activar"}
               </Button>
             </DialogActions>
           </Dialog>
    </div>
  );
};

export default EmpleadosComponent;
