// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Button, Stack,
//   IconButton, Menu, MenuItem,
//   ListItemIcon, ListItemText,TextField,InputAdornment,TablePagination,Typography, Dialog, DialogTitle, DialogContent, DialogActions,
//   DialogContentText
// } from '@mui/material';
// import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
// import ParentCard from '../../../components/shared/ParentCard';
// import ProvinciasCreateComponent from './ProvinciasCreate';
// // import ProvinciasEditComponent from './ProvinciasEdit';
// import ProvinciasDetailsComponent from './ProvinciasDetails';
// import AddIcon from '@mui/icons-material/Add';
// import SettingsIcon from '@mui/icons-material/Settings';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { Snackbar, Alert } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// // import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import { alertMessages } from 'src/layouts/config/alertConfig';
// //Se exporta este para evitar reescribir ese mismo codigo que es mas que nada el diseño
// import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
// const ProvinciasComponent = () => {
//   const [provincias, setProvincias] = useState([]);
//   const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [menuAbierto, setMenuAbierto] = useState(false);
//   const [posicionMenu, setPosicionMenu] = useState(null);
//   const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
//   const [page, setPage] = useState(0);//Define como la pagina actual
//   const [rowsPerPage, setRowsPerPage] = useState(10);//Cantidad de lineas a mostrar- Puse 10 pero puede variar xd
//   const [searchQuery, setSearchQuery] = useState('');
//   const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     severity: '',
//     message: '',
//   });
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const apiKey = process.env.REACT_APP_API_KEY;
//   const mostrarAlerta = (tipo) => {
//     const config = alertMessages[tipo];
//     if (config) {
//       setAlertConfig(config);
//       setOpenSnackbar(true);
//     } else {
//       console.error('Tipo de alerta no encontrado:', tipo);
//     }
//   };
//     function DetallePais(pais) {
//       console.log('Detalle:', pais.pais_Id);
//       setModo('detalle');
//       cerrarMenu();
//     }
    
//     function editarPais(pais) {
//       console.log('Editar Provincia:', pais.pais_Id);
//       setModo('editar');
//       cerrarMenu();
//     }
    

//     function abrirMenu(evento, pais) {
//       //obtenemos la posicion donde deberia mostrarse el menu 
//       setPosicionMenu(evento.currentTarget);
//       //obtenemos la fila de info correspondiente 
//       setProvinciaSeleccionada(pais);
//       //con setMenuAbierto(); definimos si el menu esta abierto  
//       setMenuAbierto(true);
//     }
  
//     function cerrarMenu() {
//       setMenuAbierto(false);
//     }
//   const cargarProvincias = () => { //pasamos el listar a una funcion fuera del useEffect y llamamos la funcion dentro del useEffect
   
//     axios.get(`${apiUrl}/api/Provincias/Listar`, {
//       headers: { 'XApiKey': apiKey }
//     })
//     .then(response => setProvincias(response.data.data))
//     .catch(error => console.error('Error al obtener las provinciaes:', error));
//   };

//   const confirmarEliminar = () => {
//       setConfirmarEliminacion(true);
//       cerrarMenu();
//     };
  
//     // const handleEliminar = () => {
//     //   if (!provinciaSeleccionada) return;
//     //   const provinciaEliminar = {
//     //     pvin_Id: provinciaSeleccionada.pvin_Id,
//     //     usua_UsuarioEliminacion: 1,
//     //     pvin_FechaEliminacion: new Date().toISOString()
//     //   };
//     //   axios.post(`${apiUrl}/api/Provincias/Eliminar`, provinciaEliminar, {
//     //     headers: { 'XApiKey': apiKey }
//     //   })
//     //     .then(() => {
//     //       cargarProvincias();
//     //       mostrarAlerta('eliminado');
//     //     })
//     //     .catch(() => mostrarAlerta('errorEliminar'));
//     //   setConfirmarEliminacion(false);
//     // };

// //   const eliminar = (provincia) => {
// //     axios.post(`${apiUrl}/api/Provincias/Eliminar`, provincia, {
// //       headers: { 'XApiKey': apiKey }
// //     })
// //     .then(() => {
// //       cargarProvincias();
// //       mostrarAlerta('eliminado');
// //     })
// //     .catch(() => mostrarAlerta('errorEliminar'));
// //   };
  
// // const handleDelete = async (id) => {
// //     try {
// //         const response = await axios.post(`${apiUrl}/api/Provincias/Eliminar`, {
// //             pvin_Id: id,
// //             pvin_FechaEliminacion: new Date().toISOString(),
// //             usua_UsuarioEliminacion: 1
// //           }, {
// //             headers: { 'XApiKey': apiKey }
// //     });
          
  
// //       if (response.data && response.data.message === "Provincia eliminada con éxito") {
// //         alert("¡Eliminación exitosa!");
// //         cargarProvincias(); // Recargar la lista
// //       } else {
// //         alert("No se pudo eliminar la provincia.");
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       alert("Ocurrió un error al eliminar.");
// //     }
// //   };
  
  

//   useEffect(() => {
//     cargarProvincias(); //Aca llamamos
//   }, []);

//   const confirmarEliminado = () => {
//       setConfirmarEliminacion(true);
//       cerrarMenu();
//     };
  
//     const handleEliminado = () => {
//       if (!provinciaSeleccionada) return;
//       const provinciaEliminar = {
//         pvin_Id: provinciaSeleccionada.pvin_Id,
//         usua_UsuarioEliminacion: 1,
//         pvin_FechaEliminacion: new Date().toISOString()
//       };
//       axios.post(`${apiUrl}/api/Provincias/Eliminar`, provinciaEliminar, {
//         headers: { 'XApiKey': apiKey }
//       })
//         .then(() => {
//           cargarProvincias();
//           mostrarAlerta('eliminado');
//         })
//         .catch(() => mostrarAlerta('errorEliminar'));
//       setConfirmarEliminacion(false);
//     };

//   const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
//   const handleChangeRowsPerPage = (event) => {
//       setRowsPerPage(parseInt(event.target.value, 10));
//       setPage(0);
//   };//Cambia el numero de filas de la siguiente pagina

//   const emptyRows = rowsPerPage - Math.min(rowsPerPage, provincias.length - page * rowsPerPage);
//   //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
//   //si tu tamaño siguiera siendo de 10 registros

//   const filteredData = provincias.filter((provincia) =>
//     provincia.pvin_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   provincia.pvin_Id.toString().includes(searchQuery.trim())
//   );
//   //FilteredData trae el arreglo que se asigno antes para el list en este caso unidadesmedidas y pasara agarrar su campos
//   //y utilizarlo para filtrar, y en el caso de que el input de filtrar detecta algo, pues el filteredData cambiara y la tabla 
//   //solo mostrara los datos que coincidan, que filteredData es el nuevo arreglo por decirlo asi
    

//   return (
//     <div>
//       <Breadcrumb title="Provincias" subtitle={ "Listar"} />
      
      

      
//         <ParentCard>
//         {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
       
   
//           <container>
//       <Stack direction="row" justifyContent="flex-start" mb={2}>
//           <Button variant="contained" onClick={() => setModo('crear')}   startIcon={<AddIcon />}>
//             {'Nuevo'}
//           </Button>
//       </Stack>
//         <Paper variant="outlined">
//           <TextField placeholder="Buscar" variant="outlined" size="small" sx={{ mb: 2, mt:2, width: '25%', ml: '73%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//                 ),
//             }}/>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell align="center">
//                       <Typography variant="h6">Acciones</Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="h6">Código</Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="h6">Nombre</Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="h6">País</Typography>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//               {filteredData
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((provincia) => (
//                   <TableRow key={provincia.pvin_Id}>
//                     <TableCell align="center">

//                     <IconButton
//                       size="small" 
//                       // se abre el menu y se selecciona la data de la fila 
//                       onClick={(e) => abrirMenu(e, provincia)}
//                     >
//                     <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
//                     </IconButton>
//                     </TableCell>
//                     <TableCell>{provincia.pvin_Codigo}</TableCell>
//                     <TableCell>{provincia.pvin_Nombre}</TableCell>
//                     <TableCell>{provincia.pais_Id}</TableCell>
//                   </TableRow>
//                 ))}
//                 {emptyRows > 0 && (
//                   <TableRow style={{ height: 53 * emptyRows }}>
//                      <TableCell colSpan={2} />
//                   </TableRow>
//                    )}
//               </TableBody>

//               <Menu anchorEl={posicionMenu} open={menuAbierto} onClose={cerrarMenu}>
//                 {/* <MenuItem onClick={handleEditar}>
//                   <ListItemIcon>
//                     <EditIcon fontSize="small" sx={{ color: 'orange' }} />
//                   </ListItemIcon>
//                   <ListItemText primary="Editar" />
//                 </MenuItem> */}
              
//                 <MenuItem onClick={() => {
//                   setModo('detalle');
//                   cerrarMenu();
//                 }}>
//                   <ListItemIcon>
//                     <VisibilityIcon fontSize="small" sx={{ color: '#9C27B0' }} />
//                   </ListItemIcon>
//                   <ListItemText primary="Detalles" />
//                 </MenuItem>
              
//                 <MenuItem onClick={confirmarEliminar}>
//                   <ListItemIcon>
//                     <DeleteIcon fontSize="small" sx={{ color: 'red' }} />
//                   </ListItemIcon>
//                   <ListItemText primary="Eliminar" />
//                 </MenuItem>
//               </Menu>
//             </Table>
//           </TableContainer>
//             <TablePagination component="div" count={provincias.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
//             </Paper>
//           </container>
//           )}
//           {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

//     <ProvinciasCreateComponent
//       onCancelar={() => setModo('listar')} 
//       onGuardadoExitoso={() => {
//         setModo('listar');
//         mostrarAlerta('guardado')
//         // Recarga los datos después de guardar
//         cargarProvincias();
//       }}
//     />

// )}
//  {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

// {/* <ProvinciasEditComponent
//    provincia={provinciaSeleccionada}
//   onCancelar={() => setModo('listar')} 
//   onGuardadoExitoso={() => {
//     setModo('listar');
//     mostrarAlerta('actualizado')
//     // Recarga los datos después de guardar
//     cargarProvincias();
//   }}
// /> */}

// )}
// {modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

// <ProvinciasDetailsComponent
//    provincia={provinciaSeleccionada}
//   onCancelar={() => setModo('listar')} 
 
// /> 

// )}


//         </ParentCard>
//         <Snackbar
//   open={openSnackbar}
//   autoHideDuration={3000}
//   onClose={() => setOpenSnackbar(false)}
//   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
// >
//   <Alert
//     onClose={() => setOpenSnackbar(false)}
//     severity={alertConfig.severity}
//     sx={{ width: '100%' }}
//   >
//     {alertConfig.message}
//   </Alert>
// </Snackbar>


//       <Menu
//       //so, si 'menuAbierto' esta en true se muestra dado el caso q no pues se cierra 
//         anchorEl={posicionMenu}
//         open={menuAbierto}
//         onClose={cerrarMenu}
//       >
//         <MenuItem onClick={() => editarPais(provinciaSeleccionada)}>
//           <ListItemIcon>
//             <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
//           </ListItemIcon>
//           <ListItemText>Editar</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => DetallePais(provinciaSeleccionada)}>
//           <ListItemIcon>
//             <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
//           </ListItemIcon>
//           <ListItemText>Detalles</ListItemText>
//         </MenuItem>
        
//         <MenuItem onClick={() => handleEliminado(provinciaSeleccionada)}>
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" style={{ color: '#F44336', fontSize: '18px' }} />
//           </ListItemIcon>
//           <ListItemText>Eliminar</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* <Dialog
//         open={confirmarEliminacion}
//         onClose={() => setConfirmarEliminacion(false)}
//       >
//         <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <WarningAmberIcon color="warning" />
//           Confirmar eliminación
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             ¿Estás seguro que deseas eliminar a <strong>{provinciaSeleccionada?.pvin_Nombre}</strong>?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setConfirmarEliminacion(false)}
//             variant="outlined"
//             color="primary"
//           >
//             Cancelar
//           </Button>
//           <Button
//             onClick={() => {
//               handleDelete(provinciaSeleccionada)
//               setConfirmarEliminacion(false);
//               setprovinciaSeleccionada(null);
              
//             }}
//             variant="contained"
//             color="error"
//           >
//             Eliminar
//           </Button>
//         </DialogActions>
//       </Dialog> */}
//       <Dialog
//   open={confirmarEliminacion}
//   onClose={() => setConfirmarEliminacion(false)}
// >
//   <DialogTitle>Confirmar eliminación</DialogTitle>
//   <DialogContent>
//     <DialogContentText>
//       ¿Estás seguro de que deseas eliminar esta provincia?
//     </DialogContentText>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setConfirmarEliminacion(false)}>Cancelar</Button>
//     <Button
//       onClick={() => {
//         if (provinciaSeleccionada) {
//             handleEliminado(provinciaSeleccionada.pvin_Id);
//         }
//         setConfirmarEliminacion(false);
//       }}
//       color="error"
//       variant="contained"
//     >
//       Eliminar
//     </Button>
//   </DialogActions>
// </Dialog>

//     </div>
//   );
// };

// export default ProvinciasComponent;


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
import ProvinciasCreate from './ProvinciasCreate';
import ProvinciasEdit from './ProvinciasEdit';
import ProvinciasDetails from './ProvinciasDetails'; // Agregado

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TablePaginationActions from "src/_mockApis/actions/TablePaginationActions";
import { alertMessages } from 'src/layouts/config/alertConfig';

const Provincias = () => {
  const [provincias, setProvincias] = useState([]);
  const [modo, setModo] = useState('listar');
  const [provinciaEditando, setProvinciaEditando] = useState(null);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ severity: '', message: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const mostrarAlerta = (tipo) => {
    const config = alertMessages[tipo];
    if (config) {
      setAlertConfig(config);
      setOpenSnackbar(true);
    }
  };

  const cargarProvincias = () => {
    axios.get(`${apiUrl}/api/Provincias/Listar?pvin_EsAduana=true`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setProvincias(response.data.data);
        }
      })
      .catch(() => mostrarAlerta('errorListar'));
  };

  useEffect(() => {
    cargarProvincias();
  }, []);

  const abrirMenu = (evento, provincia) => {
    setPosicionMenu(evento.currentTarget);
    setProvinciaSeleccionada(provincia);
    setMenuAbierto(true);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  const handleEditar = () => {
    if (provinciaSeleccionada) {
        setProvinciaEditando(provinciaSeleccionada);
      setModo('editar');
    }
    cerrarMenu();
  };

  const confirmarEliminar = () => {
    setConfirmarEliminacion(true);
    cerrarMenu();
  };

  const handleEliminar = () => {
    if (!provinciaSeleccionada) return;
    const provinciaEliminar = {
      pvin_Id: provinciaSeleccionada.pvin_Id,
      usua_UsuarioEliminacion: 1,
      pvin_FechaEliminacion: new Date().toISOString()
    };
    axios.post(`${apiUrl}/api/Provincias/Eliminar`, provinciaEliminar, {
        headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarProvincias();
        mostrarAlerta('eliminado');
      })
      .catch(() => mostrarAlerta('errorEliminar'));
    setConfirmarEliminacion(false);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = provincias.filter((provincia) =>
    provincia.pvin_Codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provincia.pvin_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provincia.pvin_Id.toString().includes(searchQuery.trim()) ||
    provincia.pais_Id.toString().includes(searchQuery.trim())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  return (
    <div>
      <Breadcrumb title="Provincias" subtitle="Listar" />
      <ParentCard>
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModo('crear')}>
                Nuevo
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'><Typography variant="h6">Acciones</Typography></TableCell>
                            <TableCell><Typography variant="h6">ID</Typography></TableCell>
                            <TableCell><Typography variant="h6">Código</Typography></TableCell>
                            <TableCell><Typography variant="h6">Nombre</Typography></TableCell>
                            <TableCell><Typography variant="h6">País</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredData
                ).map((provincia) => (
                    <TableRow key={provincia.pvin_Id}>
                        <TableCell align="center">
                        <IconButton onClick={(e) => abrirMenu(e, provincia)}>
                            <SettingsIcon sx={{ color: '#2196F3', fontSize: '20px' }} />
                        </IconButton>
                        </TableCell>
                        <TableCell>{provincia.pvin_Id}</TableCell>
                        <TableCell>{provincia.pvin_Codigo}</TableCell>
                        <TableCell>{provincia.pvin_Nombre}</TableCell>
                        <TableCell>{provincia.pais_Nombre}</TableCell>
                    </TableRow>
                ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
                    <Menu anchorEl={posicionMenu} open={menuAbierto} onClose={cerrarMenu}>
                        <MenuItem onClick={handleEditar}>
                            <ListItemIcon>
                            <EditIcon fontSize="small" sx={{ color: 'orange' }} />
                            </ListItemIcon>
                            <ListItemText primary="Editar" />
                        </MenuItem>

                        <MenuItem onClick={() => {
                            setModo('detalle');
                            cerrarMenu();
                        }}>
                        <ListItemIcon>
                            <VisibilityIcon fontSize="small" sx={{ color: '#9C27B0' }} />
                        </ListItemIcon>
                        <ListItemText primary="Detalles" />
                        </MenuItem>

                        <MenuItem onClick={confirmarEliminar}>
                            <ListItemIcon>
                            <DeleteIcon fontSize="small" sx={{ color: 'red' }} />
                            </ListItemIcon>
                            <ListItemText primary="Eliminar" />
                        </MenuItem>

                    </Menu>

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

        {modo === 'crear' && (
          <ProvinciasCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarProvincias();
              mostrarAlerta('guardado');
            }}
          />
        )}

        {modo === 'editar' && (
          <ProvinciasEdit
            provinciaInicial={provinciaEditando}
            onCancelar={() => {
              setModo('listar');
              setProvinciaEditando(null);
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              setProvinciaEditando(null);
              cargarProvincias();
              mostrarAlerta('actualizado');
            }}
          />
        )}

        {modo === 'detalle' && (
          <ProvinciasDetails
            provincia={provinciaSeleccionada}
            onCancelar={() => setModo('listar')}
          />
        )}

            <Dialog open={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
                <DialogTitle color="warning.main">
                    <WarningAmberIcon sx={{ mr: 1 }} />
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    ¿Está seguro que desea eliminar la provincia "{provinciaSeleccionada?.pvin_Nombre}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmarEliminacion(false)}>Cancelar</Button>
                    <Button onClick={handleEliminar} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
            <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
            </Snackbar>
        </ParentCard>
    </div>
  );
};

export default Provincias;
