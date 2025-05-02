// import React, { useEffect, useState } from 'react';	
// import axios from 'axios';
// import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
// import ParentCard from '../../../components/shared/ParentCard';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

// const CiudadList = () => {
//     const [ciudades, setCiudades] = useState([]);

//  useEffect(( ) => {
//     const apiUrl = process.env.REACT_APP_API_URL;
//     const apiKey = process.env.REACT_APP_API_KEY;
//     axios.get(`${apiUrl}/api/Ciudades/Listar`, {
//         headers: {
//             'XApiKey': apiKey
//         }

//     })
//     .then(response => {
//         setCiudades(response.data.data);
//         console.log("React E10", response.data.data)
//     })
//     .catch(error => {
//         console.error('Error al obtener los datos de Ciudad:', error);
//     });

// }, []); // El
// //  array vacío asegura que el efecto se ejecute solo una vez al montar el componente
// return (
//     <div>
//     <Breadcrumb title="Ciudades" subtitle="Listar" />
//     <ParentCard>
//         <TableContainer component={Paper}>
//         <Table>
//             <TableHead>
//             <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Nombre</TableCell>
//                 <TableCell>Provincia</TableCell>
//             </TableRow>
//             </TableHead>
//             <TableBody>
//             {ciudades.map((ciudad) => (
//                 <TableRow key={ciudad.ciud_Id}>
//                     <TableCell>{ciudad.ciud_Id}</TableCell>
//                     <TableCell>{ciudad.ciud_Nombre}</TableCell>
//                     <TableCell>{ciudad.pvin_Id}</TableCell>
//                 </TableRow>
//             ))}
//             </TableBody>
//         </Table>
//         </TableContainer>
//     </ParentCard>
//     </div>
//     );
// }

// export default CiudadList;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Button, Stack
// } from '@mui/material';
// import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
// import ParentCard from '../../../components/shared/ParentCard';
// import CiudadesCreateComponent from './CiudadCreate';
// import AddIcon from '@mui/icons-material/Add';
// const CiudadesComponent = () => {
//   const [ciudades, setCiudades] = useState([]);
//   const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
//   const cargarCiudades = () => { //pasamos el listar a una funcion fuera del useEffect y llamamos la funcion dentro del useEffect
//     const apiUrl = process.env.REACT_APP_API_URL;
//     const apiKey = process.env.REACT_APP_API_KEY;
  
//     axios.get(`${apiUrl}/api/Ciudades/Listar`, {
//       headers: { 'XApiKey': apiKey }
//     })
//     .then(response => setCiudades(response.data.data))
//     .catch(error => console.error('Error al obtener las ciudades:', error));
//   };
//   useEffect(() => {
//     cargarCiudades(); //Aca llamamos
//   }, []);

//   return (
//     <div>
//       <Breadcrumb title="Ciudades" subtitle={ "Listar"} />
      
      

      
//         <ParentCard>
//         {modo === 'listar' && ( //esta linea muestra el listar osea la tabla
       
   
//           <container>
//             <Stack direction="row" justifyContent="flex-start" mb={2}>
//       <Button variant="contained" onClick={() => setModo('crear')}   startIcon={<AddIcon />}>
//           {'Nuevo'}
//         </Button>
//       </Stack>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Nombre</TableCell>
//                   <TableCell>Provincia</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {ciudades.map((ciudad) => (
//                   <TableRow key={ciudad.ciud_Id}>
//                     <TableCell>{ciudad.ciud_Id}</TableCell>
//                     <TableCell>{ciudad.ciud_Nombre}</TableCell>
//                     <TableCell>{ciudad.pvin_Id}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           </container>
//           )}
//           {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

//     <CiudadesCreateComponent
//       onCancelar={() => setModo('listar')} 
//       onGuardadoExitoso={() => {
//         setModo('listar');
//         // Recarga los datos después de guardar
//         cargarCiudades();
//       }}
//     />

// )}
//         </ParentCard>
     
//     </div>
//   );
// };

// export default CiudadesComponent;


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
import CiudadesCreateComponent from './CiudadCreate';
import CiudadesEditComponent from './CiudadEdit';
import CiudadesDetailsComponent from './CiudadDetails';
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
const CiudadesComponent = () => {
  const [ciudades, setCiudades] = useState([]);
  const [modo, setModo] = useState('listar'); // 'listar' | 'crear' | 'editar' | 'detalle' dependiendo de lo que tenga va a mostrar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [ciudadSeleccionada, setciudadSeleccionada] = useState(null);
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
    function DetalleOficina(ciudad) {
      console.log('Detalle:', ciudad.ciud_Id);
      setModo('detalle');
      cerrarMenu();
    }
    
    function editarOficina(ciudad) {
      console.log('Editar Provincia:', ciudad.ciud_Id);
      setModo('editar');
      cerrarMenu();
    }
    
    function eliminarOficina(ciudad) {
      console.log('Eliminar Provincia:', ciudad.ciud_Id);
      setciudadSeleccionada(ciudad);
      setConfirmarEliminacion(true);
      cerrarMenu();
    }

    function abrirMenu(evento, ciudad) {
      //obtenemos la posicion donde deberia mostrarse el menu 
      setPosicionMenu(evento.currentTarget);
      //obtenemos la fila de info correspondiente 
      setciudadSeleccionada(ciudad);
      //con setMenuAbierto(); definimos si el menu esta abierto  
      setMenuAbierto(true);
    }
  
    function cerrarMenu() {
      setMenuAbierto(false);
    }
  const cargarCiudades = () => { //pasamos el listar a una funcion fuera del useEffect y llamamos la funcion dentro del useEffect
   
    axios.get(`${apiUrl}/api/Ciudades/Listar`, {
      headers: { 'XApiKey': apiKey }
    })
    .then(response => setCiudades(response.data.data))
    .catch(error => console.error('Error al obtener las ciudades:', error));
  };

//   const eliminar = (ciudad) => {
//     axios.post(`${apiUrl}/api/Ciudades/Eliminar`, ciudad, {
//       headers: { 'XApiKey': apiKey }
//     })
//     .then(() => {
//       cargarCiudades();
//       mostrarAlerta('eliminado');
//     })
//     .catch(() => mostrarAlerta('errorEliminar'));
//   };
  
const handleDelete = async (id) => {
    try {
        const response = await axios.post(`${apiUrl}/api/Ciudades/Eliminar`, {
            ciud_Id: id,
            ciud_FechaEliminacion: new Date().toISOString(),
            usua_UsuarioEliminacion: 1
          }, {
            headers: { 'XApiKey': apiKey }
          });
          
  
      if (response.data && response.data.message === "Ciudad eliminada con éxito") {
        alert("¡Eliminación exitosa!");
        cargarCiudades(); // Recargar la lista
      } else {
        alert("No se pudo eliminar la ciudad.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar.");
    }
  };
  
  

  useEffect(() => {
    cargarCiudades(); //Aca llamamos
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);//Cambia a la siguiente pagina
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };//Cambia el numero de filas de la siguiente pagina

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, ciudades.length - page * rowsPerPage);
  //Esto evita la deformacion de la tabla. Ejemplo si en la ultima pagina hay un solo registro, la tabla mantendra su tamaño como
  //si tu tamaño siguiera siendo de 10 registros

  const filteredData = ciudades.filter((ciudad) =>
    ciudad.ciud_Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
  ciudad.ciud_Id.toString().includes(searchQuery.trim())
  );
  //FilteredData trae el arreglo que se asigno antes para el list en este caso unidadesmedidas y pasara agarrar su campos
  //y utilizarlo para filtrar, y en el caso de que el input de filtrar detecta algo, pues el filteredData cambiara y la tabla 
  //solo mostrara los datos que coincidan, que filteredData es el nuevo arreglo por decirlo asi
    

  return (
    <div>
      <Breadcrumb title="Ciudades" subtitle={ "Listar"} />
      
      

      
        <ParentCard>
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
                    <Typography variant="h6">Nombre</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Provincia</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ciudad) => (
                  <TableRow key={ciudad.ciud_Id}>
                    <TableCell align="center">

                    <IconButton
                      size="small" 
                      // se abre el menu y se selecciona la data de la fila 
                      onClick={(e) => abrirMenu(e, ciudad)}
                    >
                    <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                    </IconButton>
                    </TableCell>
                    <TableCell>{ciudad.ciud_Nombre}</TableCell>
                    <TableCell>{ciudad.pvin_Nombre}</TableCell>
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
            <TablePagination component="div" count={ciudades.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} labelRowsPerPage="Filas por página" />
            </Paper>
          </container>
          )}
          {modo === 'crear' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

    <CiudadesCreateComponent
      onCancelar={() => setModo('listar')} 
      onGuardadoExitoso={() => {
        setModo('listar');
        mostrarAlerta('guardado')
        // Recarga los datos después de guardar
        cargarCiudades();
      }}
    />

)}
 {modo === 'editar' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

<CiudadesEditComponent
   ciudad={ciudadSeleccionada}
  onCancelar={() => setModo('listar')} 
  onGuardadoExitoso={() => {
    setModo('listar');
    mostrarAlerta('actualizado')
    // Recarga los datos después de guardar
    cargarCiudades();
  }}
/>

)}
{modo === 'detalle' && ( //en caso de que el modo sea crear muestra el componente de crear y seria lo mismo para el editar y details

<CiudadesDetailsComponent
   ciudad={ciudadSeleccionada}
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
        <MenuItem onClick={() => editarOficina(ciudadSeleccionada)}>
          <ListItemIcon>
            <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => DetalleOficina(ciudadSeleccionada)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Detalles</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleDelete(ciudadSeleccionada)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" style={{ color: '#F44336', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* <Dialog
        open={confirmarEliminacion}
        onClose={() => setConfirmarEliminacion(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar a <strong>{ciudadSeleccionada?.ciud_Nombre}</strong>?
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
              handleDelete(ciudadSeleccionada)
              setConfirmarEliminacion(false);
              setciudadSeleccionada(null);
              
            }}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
  open={confirmarEliminacion}
  onClose={() => setConfirmarEliminacion(false)}
>
  <DialogTitle>Confirmar eliminación</DialogTitle>
  <DialogContent>
    <DialogContentText>
      ¿Estás segura de que deseas eliminar esta ciudad?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmarEliminacion(false)}>Cancelar</Button>
    <Button
      onClick={() => {
        if (ciudadSeleccionada) {
          handleDelete(ciudadSeleccionada.ciud_Id);
        }
        setConfirmarEliminacion(false);
      }}
      color="error"
      variant="contained"
    >
      Eliminar
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default CiudadesComponent;