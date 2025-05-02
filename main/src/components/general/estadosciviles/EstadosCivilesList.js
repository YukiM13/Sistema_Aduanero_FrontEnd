import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton,
  Menu, MenuItem, Stack
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import EstadosCivilesCreate from './EstadosCivilesCreate';
import EstadosCivilesEdit from './EstadosCivilesEdit';
import EstadoCivilModel from 'src/models/estadocivilmodel';

const EstadosCiviles = () => {
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [modo, setModo] = useState('listar');
  const [estadoEditando, setEstadoEditando] = useState(null); // Estado para el estado civil que estamos editando

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const cargarEstadosCiviles = () => {
    axios.get(`${apiUrl}/api/EstadosCiviles/Listar?escv_EsAduana=true`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setEstadosCiviles(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener los estados civiles:', error);
      });
  };

  useEffect(() => {
    cargarEstadosCiviles();
  }, []);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEditar = () => {
    const estado = estadosCiviles.find(e => e.escv_Id === selectedId);
    if (estado) {
      setEstadoEditando(estado); // Cargar el estado civil seleccionado
      setModo('editar'); // Cambiar el modo a "editar"
    }
    handleMenuClose();
  };

  const handleDetalle = () => {
    console.log('Detalle', selectedId);
    handleMenuClose();
  };

  const handleEliminar = () => {
    const estado = estadosCiviles.find(e => e.escv_Id === selectedId);
    if (!estado) return;
  
    const estadoEliminar = new EstadoCivilModel();
    estadoEliminar.escv_Id = estado.escv_Id;
    estadoEliminar.usua_UsuarioEliminacion = 1; // ID real del usuario
    estadoEliminar.escv_FechaEliminacion = new Date().toISOString();
  
    axios.post(`${apiUrl}/api/EstadosCiviles/Eliminar`, estadoEliminar, {
      headers: { 'XApiKey': apiKey }
    })
      .then(() => {
        cargarEstadosCiviles();
      })
      .catch(error => {
        console.error('Error al eliminar estado civil:', error);
      });
  
    handleMenuClose();
  };

  return (
    <div>
      <Breadcrumb title="Estados Civiles" subtitle="Listar" />
      <ParentCard>
        {modo === 'listar' && (
          <>
            <Stack direction="row" justifyContent="flex-start" mb={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setModo('crear')}
              >
                Nuevo
              </Button>
            </Stack>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Acciones</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estadosCiviles.map((estado) => (
                    <TableRow key={estado.escv_Id}>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuClick(e, estado.escv_Id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{estado.escv_Id}</TableCell>
                      <TableCell>{estado.escv_Nombre}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditar}>Editar</MenuItem>
              <MenuItem onClick={handleEliminar}>Eliminar</MenuItem>
              <MenuItem onClick={handleDetalle}>Detalles</MenuItem>
            </Menu>
          </>
        )}
        {modo === 'crear' && (
          <EstadosCivilesCreate
            onCancelar={() => setModo('listar')}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarEstadosCiviles();
            }}
          />
        )}
        {modo === 'editar' && (
          <EstadosCivilesEdit
            estadoInicial={estadoEditando}
            onCancelar={() => {
              setModo('listar');
              setEstadoEditando(null);
            }}
            onGuardadoExitoso={() => {
              setModo('listar');
              cargarEstadosCiviles();
              setEstadoEditando(null);
            }}
          />
        )}
      </ParentCard>
    </div>
  );
};

export default EstadosCiviles;
