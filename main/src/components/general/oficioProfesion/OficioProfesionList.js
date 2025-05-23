import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Stack,
    IconButton, Menu, MenuItem,
    ListItemIcon, ListItemText,TextField,InputAdornment,TablePagination,Typography, 
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { alertMessages } from 'src/layouts/config/alertConfig';
import OficioDetailsComponent from './OficioProfesionDetails';
import OficioCreateComponent from './OficioProfesionCreate';
import OficioEditComponent from './OficioProfesionEdit';
import StyledButton from 'src/components/shared/StyledButton';
const OficioProfesionComponent = () => {
  const [oficioProfesiones, setOficioProfesiones] = useState([]);
   const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [oficioProfesionSeleccionada, setOficioProfesionSeleccionada] = useState(null);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
    const [searchQuery, setSearchQuery] = useState('');
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
      function DetalleOficina(oficioProfesion) {
        console.log('Detaie:', oficioProfesion);
        setModo('detalle');
        cerrarMenu();
      }
      
      function editarOficina(oficioProfesion) {
        console.log('Editar Oficina:', oficioProfesion);
        setModo('editar');
        cerrarMenu();
      }
      
     
  
      function abrirMenu(evento, oficioProfesion) {
        //obtenemos la posicion donde deberia mostrarse el menu 
        setPosicionMenu(evento.currentTarget);
        //obtenemos la fila de info correspondiente 
        setOficioProfesionSeleccionada(oficioProfesion);
        //con setMenuAbierto(); definimos si el menu esta abierto  
        setMenuAbierto(true);
         setIconRotated(true);

      }
    
      function cerrarMenu() {
        setMenuAbierto(false);
        setIconRotated(false);

      }
    const cargarOficio = () =>{
      
    axios.get(`${apiUrl}/api/Oficio_Profesiones/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
     
      setOficioProfesiones(response.data.data);
     
    })
    .catch(error => {
      console.error('Error al obtener las oficioProfesiones:', error);
    });
    }
  useEffect(() => {
    cargarOficio();

  }, []);
  const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };//Cambia el numero de filas de la siguiente pagina

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, oficioProfesiones.length - page * rowsPerPage);
  //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
  //si tu tamaño siguiera siendo de 10 registros

  const filteredData = oficioProfesiones.filter((oficioProfesion) =>
  oficioProfesion.ofpr_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
  oficioProfesion.ofpr_Id.toString().includes(searchQuery.trim())
);
  return (
    <div>
       <Breadcrumb title="Oficio Profesiones" subtitle="Listar" />
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
            <TableHead>
              <TableRow>
                <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold',align:'center' }}>
                 <Typography variant="h6">Acciones</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                  <Typography variant="h6">Descripcion</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((oficioProfesion) => (
                <TableRow key={oficioProfesion.ofpr_Id}>
                 <TableCell align="center">

                  <IconButton
                      size="small"
                      onClick={(e) => abrirMenu(e, oficioProfesion)}
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
                  <TableCell><Typography variant="body1">{oficioProfesion.ofpr_Nombre}</Typography></TableCell>

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
            <TablePagination component="div" count={oficioProfesiones.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
            </Paper>
          </container>
          
          )}
          {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
                  
            <OficioCreateComponent
              onCancelar={() => setModo('listar')} 
              onGuardadoExitoso={() => {
                setModo('listar');
                mostrarAlerta('guardado')
                          // Recarga los datos después de guardar
                cargarOficio();
              }}
            />      
         )}
         {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
                  
            <OficioEditComponent
                oficioProfesion={oficioProfesionSeleccionada}
                onCancelar={() => setModo('listar')} 
                onGuardadoExitoso={() => {
                setModo('listar');
                mostrarAlerta('actualizado')
                // Recarga los datos después de guardar
                cargarOficio();
              }}
            />   
          )}
          {modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
                  
            <OficioDetailsComponent
              oficioProfesion={oficioProfesionSeleccionada}
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
              <MenuItem onClick={() => editarOficina(oficioProfesionSeleccionada)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                </ListItemIcon>
                <ListItemText>Editar</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => DetalleOficina(oficioProfesionSeleccionada)}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                </ListItemIcon>
                <ListItemText>Detalles</ListItemText>
              </MenuItem>
              
              
            </Menu>
      
    </div>
  );
};

export default OficioProfesionComponent;
