import React, {useEffect, useState} from 'react';
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

import MarcaCreateComponent from './MarcaCreate';
import MarcaEditComponent from './MarcaEdit';
import MarcaDetailsComponent from './MarcaDetails';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { alertMessages } from 'src/layouts/config/alertConfig';
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import StyledButton from 'src/components/shared/StyledButton';


const Marca = () => {
      const [marcas, setMarca] = useState([]);
      const [iconRotated, setIconRotated] = useState(false);
      const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
      const [openSnackbar, setOpenSnackbar] = useState(false);
      const [menuAbierto, setMenuAbierto] = useState(false);
      const [posicionMenu, setPosicionMenu] = useState(null);
      const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
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

      
    function DetalleMarca(marca) {
      // console.log('Detaie:', marca.marc_Id);
      setModo('detalle');
      cerrarMenu();
    }
    
    function editarMarca(marca) {
      // console.log('Editar Oficina:', persona.pers_Id);
      setModo('editar');
      cerrarMenu();
    }
    
    function eliminarMarca(marca) {
      // console.log('Eliminar Oficina:', persona.pers_Id);
      setMarcaSeleccionada(marca);
      setConfirmarEliminacion(true);
      cerrarMenu();
    }

    function abrirMenu(evento, marca) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setMarcaSeleccionada(marca);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
      setIconRotated(true);
    }
  
    function cerrarMenu() {
      setMenuAbierto(false);
      setIconRotated(false);
    }




      const cargarMarcas = () => { //pasamos el listar a una funcion fuera del useEffect y llamamos la funcion dentro del useEffect
   
        axios.get(`${apiUrl}/api/Marcas/Listar`, {
          headers: { 'XApiKey': apiKey }
        })
        .then(response => setMarca(response.data.data))
        .catch(error => console.error('Error al obtener las marcas:', error));
      };

      const eliminar = (marca) =>{
          axios.post(`${apiUrl}/api/Marcas/Eliminar`,marca, {
            headers: { 'XApiKey': apiKey }
          })
          .then(
            cargarMarcas(),
            mostrarAlerta('eliminado')
          )
          .catch( mostrarAlerta('errorEliminar'));
        }

    useEffect(() => {

        // axios.get('https:localhost:44380/api/Marcas/Listar', {

        //     headers: {
        //         'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc'
        //     }

        // })
        // .then(response => {
        //     setMarca(response.data.data);
        //     console.log('React E10', response.data.data);

        // })
        // .catch(error => {
        //     console.log('Error', error);
        // });

      cargarMarcas();
      
      


    }, []);


    const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };//Cambia el numero de filas de la siguiente pagina

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, marcas.length - page * rowsPerPage);
  //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
  //si tu tamaño siguiera siendo de 10 registros

  const filteredData = marcas.filter((marca) =>
    marca.marc_Descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
  marca.marc_Id.toString().includes(searchQuery.trim())
  );
  //FilteredData trae el arreglo que se asigno antes para el list en este caso unidadesmedidas y pasara agarrar su campos
  //y utilizarlo para filtrar, y en el caso de que el input de filtrar detecta algo, pues el filteredData cambiara y la tabla 
  //solo mostrara los datos que coincidan, que filteredData es el nuevo arreglo por decirlo asi
    


    return (

        // <div>
        //     <h2>Listado de Tallas</h2>
        //     <ul>
        //         {tallas.map(talla => (
        //             <li>
        //                 {talla.tall_Id} - {talla.tall_Nombre}
        //             </li>
        //         ))}
        //     </ul>
        // </div>


      
        
          <div>
            <Breadcrumb title="Marcas" subtitle={ "Listar"} />
            
            
      
            
              <ParentCard title="">
              {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
             
         
                <container>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
                <StyledButton
                    sx={{}}
                    title="Nuevo"
                    event={() => setModo('crear')}
                >
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
                        <TableCell sx={{ backgroundColor: '#356f90', color: 'white', fontWeight: 'bold' }}>
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
                      .map((marca, index) => (
                        <TableRow key={marca.marc_Id}
                          sx={{
                              backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                              '&:hover': { backgroundColor: '#e3f2fd' },
                          }}
                        >
                          <TableCell align="center">
      
                          <IconButton
                            size="small" 
                            onClick={(e) => abrirMenu(e, marca)}
                            sx={{
                                backgroundColor: '#d9e7f7',
                                color: 'rgb(0, 83, 121)',
                                '&:hover': {
                                    backgroundColor: 'rgb(157, 191, 207)',
                                },
                                border: '2px solid rgb(0, 83, 121)',
                                borderRadius: '8px',
                                padding: '6px'
                            }}
                          >
                            <SettingsIcon sx={{transition: 'transform 0.3s ease-in-out',
                                transform: iconRotated ? 'rotate(180deg)' : 'rotate(0deg)',}}
                                fontSize="small" 
                            />
                            <Typography variante="h6">Acciones</Typography>
                          </IconButton>
                          </TableCell>
                          <TableCell><Typography variant="body1">{marca.marc_Descripcion}</Typography></TableCell>
                          
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
                  <TablePagination component="div" count={marcas.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
                  </Paper>
                </container>
                )}
                {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
      
          <MarcaCreateComponent
            onCancelar={() => setModo('listar')} 
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('guardado')
              // Recarga los datos después de guardar
              cargarMarcas();
            }}
          />
      
      )}
       {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
      
      <MarcaEditComponent
         marca={marcaSeleccionada}
        onCancelar={() => setModo('listar')} 
        onGuardadoExitoso={() => {
          setModo('listar');
          mostrarAlerta('actualizado')
          // Recarga los datos después de guardar
          cargarMarcas();
        }}
      />
      
      )}
      {modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
      
      <MarcaDetailsComponent
         marca={marcaSeleccionada}
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
              <MenuItem onClick={() => editarMarca(marcaSeleccionada)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                </ListItemIcon>
                <ListItemText>Editar</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => DetalleMarca(marcaSeleccionada)}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                </ListItemIcon>
                <ListItemText>Detalles</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={() => eliminarMarca(marcaSeleccionada)}>
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
                  ¿Estás seguro que deseas eliminar a <strong>{marcaSeleccionada?.marc_Descripcion}</strong>?
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
                    eliminar(marcaSeleccionada)
                    setConfirmarEliminacion(false);
                    marcaSeleccionada(null);
                    
                  }}
                  variant="contained"
                  color="error"
                >
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        









        // <div>
        //        <Breadcrumb title="Marcas" subtitle="Listar" />
        //       <ParentCard>
        //         <TableContainer component={Paper}>
        //           <Table>
        //             <TableHead>
        //               <TableRow>
        //                 <TableCell>ID</TableCell>
        //                 <TableCell>Descripcion</TableCell>
                        
                        
        //               </TableRow>
        //             </TableHead>
        //             <TableBody>
        //               {marcas.map((item) => (
        //                 <TableRow key={item.marc_Id}>
        //                   <TableCell>{item.marc_Id}</TableCell>
        //                   <TableCell>{item.marc_Descripcion}</TableCell>
                          
                          
        //                 </TableRow>
        //               ))}
        //             </TableBody>
        //           </Table>
        //         </TableContainer>
        //       </ParentCard>
             
        //     </div>


    );





};

export default Marca;