import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack,
  IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText,TextField,InputAdornment,TablePagination,Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

//Components
import ProveedoresCreateComponent from './ProveedoresCreate';
import ProveedoresEditComponent from './ProveedoresEdit';
import ProveedoresDetailsComponent from './ProveedoresDetails';

import SettingsIcon from '@mui/icons-material/Settings';
import StyledButton from 'src/components/shared/StyledButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { alertMessages } from 'src/layouts/config/alertConfig';
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import { values } from 'lodash';

const ProveedoresList = () => {
    const [proveedores, setProveedores] = useState([]);
    const [iconRotated, setIconRotated] = useState(false);
    const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [posicionMenu, setPosicionMenu] = useState(null);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [page, setPage] = useState(0);//Define como la pagina actual
    const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
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

    function detalleProveedor(proveedor) {
      console.log('Detalle:', proveedor.prov_Id);
      setModo('detalle');
      cerrarMenu();
    }
    
    function editarProveedor(proveedor) {
      console.log('Editar Oficina:', proveedor.prov_Id);
      setModo('editar');
      cerrarMenu();
    }
    
    function eliminarProveedor(proveedor) {
      console.log('Eliminar Proveedor:', proveedor.prov_Id);
      setProveedorSeleccionado(proveedor);
      setConfirmarEliminacion(true);
      cerrarMenu();
    }


    function abrirMenu(evento, proveedor) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setProveedorSeleccionado(proveedor);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
      setIconRotated(true);
    }
  
    function cerrarMenu() {
      setMenuAbierto(false);
      setIconRotated(false);
    }

    const cargarProveedores = () => {
      axios.get(`${apiUrl}/api/Proveedores/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
          setProveedores(response.data.data);
      })
      .catch(error => {
        console.error('Error al obtener los proveedores:', error);
      });
    }

    const eliminar = (proveedor) =>{
      proveedor.prov_FechaEliminacion = new Date().toISOString();
      proveedor.usua_UsuarioEliminacion = 1;
      axios.post(`${apiUrl}/api/Proveedores/Eliminar`,proveedor, {
        headers: { 'XApiKey': apiKey }
      })
      .then(
        cargarProveedores(),
        mostrarAlerta('eliminado')
      )
      .catch( mostrarAlerta('errorEliminar'));
    }  

    useEffect(() => {
      cargarProveedores(); //Aca llamamos
      }, []);


    const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };//Cambia el numero de filas de la siguiente pagina


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, proveedores.length - page * rowsPerPage);
  //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
  //si tu tamaño siguiera siendo de 10 registros

    const filteredData = proveedores.filter((proveedor) =>
      proveedor.prov_NombreCompania.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proveedor.prov_Id.toString().includes(searchQuery.trim())
    );
      

    return (
      <div>
        <Breadcrumb title="Proveedores" subtitle={ "Listar"} />
        
        
  
        
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
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                        <Typography variant="h6">Acciones</Typography>
                      </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Compañia</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Contacto</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Correo electrónico</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Teléfono</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Código postal</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Pais</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Provincia</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Ciudad</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Dirección exacta</Typography>
                    </TableCell>
                    <TableCell  sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
                      <Typography variant="h6">Fax</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((proveedor, index) => (
                    <TableRow key={proveedor.pers_Id}>
                      <TableCell align="center">
  
                      <IconButton
                          size="small"
                          onClick={(e) => abrirMenu(e, proveedor)}
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
                      <TableCell><Typography variant="body1">{proveedor.prov_NombreCompania}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.prov_NombreContacto}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.prov_CorreoElectronico}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.prov_Telefono}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.prov_CodigoPostal}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.pais_Nombre}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.pvin_Nombre}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.ciud_Nombre}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.prov_DireccionExacta}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{proveedor.prov_Fax}</Typography></TableCell>
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
              <TablePagination component="div" count={proveedores.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
              </Paper>
            </container>
            )}
            {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
      <ProveedoresCreateComponent
        onCancelar={() => setModo('listar')} 
        onGuardadoExitoso={() => {
          setModo('listar');
          mostrarAlerta('guardado')
          // Recarga los datos después de guardar
          cargarProveedores();
        }}
      />
  
  )}
   {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
  <ProveedoresEditComponent
     proveedor={proveedorSeleccionado}
    onCancelar={() => setModo('listar')} 
    onGuardadoExitoso={() => {
      setModo('listar');
      mostrarAlerta('actualizado')
      // Recarga los datos después de guardar
      cargarProveedores();
    }}
  />
  
  )}
  {modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
  
  <ProveedoresDetailsComponent
     proveedor={proveedorSeleccionado}
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
          <MenuItem onClick={() => editarProveedor(proveedorSeleccionado)}>
            <ListItemIcon>
              <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => detalleProveedor(proveedorSeleccionado)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
            </ListItemIcon>
            <ListItemText>Detalles</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => eliminarProveedor(proveedorSeleccionado)}>
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
            Confirmar eliminación
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que deseas eliminar a <strong>{proveedorSeleccionado?.prov_NombreCompania}</strong>?
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
                eliminar(proveedorSeleccionado)
                setConfirmarEliminacion(false);
                setProveedorSeleccionado(null);
                
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

}


export default ProveedoresList;