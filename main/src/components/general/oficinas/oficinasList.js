import React, { useEffect, useState } from 'react';
import axios from 'axios';

// agregar estos imports: IconButton, Menu, MenuItem ListItemIcon, ListItemText 
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

// Importamos los iconos
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const OficinasComponent = () => {

//estos son hooks de useState, pa actualizar los valores, asi como "[oficinas, setOficinas]",
//oficinas es el valor inicial y setOficinas es como la funcion con la que podriamos actualizar el valor
  
 const [oficinas, setOficinas] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicionMenu, setPosicionMenu] = useState(null);
  const [oficinaSeleccionada, setOficinaSeleccionada] = useState(null);

  //Funcion para cada accion

  function DetalleOficina(oficina) {
    console.log('Detaie:', oficina.ofic_Id);
    cerrarMenu();
  }
  
  function editarOficina(oficina) {
    console.log('Editar Oficina:', oficina.ofic_Id);
    cerrarMenu();
  }
  
  function eliminarOficina(oficina) {
    console.log('Eliminar Oficina:', oficina.ofic_Id);
    cerrarMenu();
  }

  
  function abrirMenu(evento, oficina) {
    //obtenemos la posicion donde deberia mostrarse el menu 
    setPosicionMenu(evento.currentTarget);
    //obtenemos la fila de info correspondiente 
    setOficinaSeleccionada(oficina);
    //con setMenuAbierto(); definimos si el menu esta abierto  
    setMenuAbierto(true);
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    
    axios.get(`${apiUrl}/api/Oficinas/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setOficinas(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las Oficinas:', error);
    });
  }, []);

  return (
    <div>
      <Breadcrumb title="Oficinas" subtitle="Listar" />
      <ParentCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell align="center">Acciones</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
              
              </TableRow>
            </TableHead>
            <TableBody>
              {oficinas.map((oficina) => (
                <TableRow key={oficina.ofic_Id}>
                   <TableCell align="center">

                    <IconButton
                      size="small" 
                      // se abre el menu y se selecciona la data de la fila 
                      onClick={(e) => abrirMenu(e, oficina)}
                    >
                     <SettingsIcon style={{ color: '#2196F3', fontSize: '20px' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell>{oficina.ofic_Id}</TableCell>
                  <TableCell>{oficina.ofic_Nombre}</TableCell>
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
      

      <Menu
      //so, si 'menuAbierto' esta en true se muestra dado el caso q no pues se cierra 
        anchorEl={posicionMenu}
        open={menuAbierto}
        onClose={cerrarMenu}
      >
        <MenuItem onClick={() => editarOficina(oficinaSeleccionada)}>
          <ListItemIcon>
            <EditIcon fontSize="small" style={{ color: 'rgb(255 161 53)', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => DetalleOficina(oficinaSeleccionada)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" style={{ color: '#9C27B0', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Detalles</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => eliminarOficina(oficinaSeleccionada)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" style={{ color: '#F44336', fontSize: '18px' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default OficinasComponent;