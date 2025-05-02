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

import TallaCreateComponent from './TallaCreate';
import TallaEditComponent from './TallaEdit';
import TallaDetailsComponent from './TallaDetails';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { alertMessages } from 'src/layouts/config/alertConfig';
//Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";



const Talla = () => {

    const [Tallas, setTalla] = useState([]);
    
      const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
      const [openSnackbar, setOpenSnackbar] = useState(false);
      const [menuAbierto, setMenuAbierto] = useState(false);
      const [posicionMenu, setPosicionMenu] = useState(null);
      const [Tallaseleccionada, setTallaseleccionada] = useState(null);
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

      
    function DetalleTalla(Talla) {
      // console.log('Detaie:', Talla.tall_Id);
      setModo('detalle');
      cerrarMenu();
    }
    
    function editarTalla(Talla) {
      // console.log('Editar Oficina:', persona.pers_Id);
      setModo('editar');
      cerrarMenu();
    }
    
    function eliminarTalla(Talla) {
      // console.log('Eliminar Oficina:', persona.pers_Id);
      setTallaseleccionada(Talla);
      setConfirmarEliminacion(true);
      cerrarMenu();
    }

    function abrirMenu(evento, Talla) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setTallaseleccionada(Talla);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
    }
  
    function cerrarMenu() {
      setMenuAbierto(false);
    }




      const cargarTallas = () => { //pasamos el listar a una funcion fuera del useEffect y llamamos la funcion dentro del useEffect
   
        axios.get(`${apiUrl}/api/Tallas/Listar`, {
          headers: { 'XApiKey': apiKey }
        })
        .then(response => setTalla(response.data.data))
        .catch(error => console.error('Error al obtener las Tallas:', error));
      };

      const eliminar = (Talla) =>{
          axios.post(`${apiUrl}/api/Tallas/Eliminar`,Talla, {
            headers: { 'XApiKey': apiKey }
          })
          .then(
            cargarTallas(),
            mostrarAlerta('eliminado')
          )
          .catch( mostrarAlerta('errorEliminar'));
        }

    useEffect(() => {

        // axios.get('https:localhost:44380/api/Tallas/Listar', {

        //     headers: {
        //         'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc'
        //     }

        // })
        // .then(response => {
        //     setTalla(response.data.data);
        //     console.log('React E10', response.data.data);

        // })
        // .catch(error => {
        //     console.log('Error', error);
        // });

      cargarTallas();
      
      


    }, []);


    const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };//Cambia el numero de filas de la siguiente pagina

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, Tallas.length - page * rowsPerPage);
  //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
  //si tu tamaño siguiera siendo de 10 registros

  const filteredData = Tallas.filter((Talla) =>
    Talla.tall_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
  Talla.tall_Id.toString().includes(searchQuery.trim())
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
            <Breadcrumb title="Tallas" subtitle={ "Listar"} />
            
            
      
            
              <ParentCard title="">
              {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
             
         
                <container>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
                <Button variant="contained" onClick={() => setModo('crear')}   startIcon={<AddIcon />}>
                  {'Nuevo'}
                </Button>
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
                        <TableCell align="center">
                            <Typography variant="h6">Acciones</Typography>
                          </TableCell>
                        <TableCell>
                          <Typography variant="h6">Id</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Codigo</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Nombre</Typography>
                        </TableCell>
                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((Talla) => (
                        <TableRow key={Talla.tall_Id}>
                          <TableCell align="center">
      
                          <IconButton
                            size="small" 
                            // se abre el menu y se selecciona la data de la fila 
                            onClick={(e) => abrirMenu(e, Talla)}
                          >
                          <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                          </IconButton>
                          </TableCell>
                          <TableCell>{Talla.tall_Id}</TableCell>
                          <TableCell>{Talla.tall_Codigo}</TableCell>
                          <TableCell>{Talla.tall_Nombre}</TableCell>
                          
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
                  <TablePagination component="div" count={Tallas.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
                  </Paper>
                </container>
                )}
                {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
      
          <TallaCreateComponent
            onCancelar={() => setModo('listar')} 
            onGuardadoExitoso={() => {
              setModo('listar');
              mostrarAlerta('guardado')
              // Recarga los datos después de guardar
              cargarTallas();
            }}
          />
      
      )}
       {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
      
      <TallaEditComponent
         Talla={Tallaseleccionada}
        onCancelar={() => setModo('listar')} 
        onGuardadoExitoso={() => {
          setModo('listar');
          mostrarAlerta('actualizado')
          // Recarga los datos después de guardar
          cargarTallas();
        }}
      />
      
      )}
      {modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details
      
      <TallaDetailsComponent
         Talla={Tallaseleccionada}
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
              <MenuItem onClick={() => editarTalla(Tallaseleccionada)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
                </ListItemIcon>
                <ListItemText>Editar</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => DetalleTalla(Tallaseleccionada)}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
                </ListItemIcon>
                <ListItemText>Detalles</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={() => eliminarTalla(Tallaseleccionada)}>
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
                  ¿Estás seguro que deseas eliminar a <strong>{Tallaseleccionada?.tall_Nombre}</strong>?
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
                    eliminar(Tallaseleccionada)
                    setConfirmarEliminacion(false);
                    Tallaseleccionada(null);
                    
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
        //        <Breadcrumb title="Tallas" subtitle="Listar" />
        //       <ParentCard>
        //         <TableContainer component={Paper}>
        //           <Table>
        //             <TableHead>
        //               <TableRow>
        //                 <TableCell>ID</TableCell>
        //                 <TableCell>Nombre</TableCell>
                        
                        
        //               </TableRow>
        //             </TableHead>
        //             <TableBody>
        //               {Tallas.map((item) => (
        //                 <TableRow key={item.tall_Id}>
        //                   <TableCell>{item.tall_Id}</TableCell>
        //                   <TableCell>{item.tall_Nombre}</TableCell>
                          
                          
        //                 </TableRow>
        //               ))}
        //             </TableBody>
        //           </Table>
        //         </TableContainer>
        //       </ParentCard>
             
        //     </div>


    );





};

export default Talla;