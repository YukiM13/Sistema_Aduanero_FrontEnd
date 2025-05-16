import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Box, Typography, Card, CardContent, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const PersonaJuridicaDetails = ({ persona, onCancelar }) => {
  console.log('Persona Juridica Details:', persona);
  return (
    <div>
      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          <BusinessIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Información General
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">ID:</Typography>
                <Typography variant="body1">{persona.peju_Id}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Nombre:</Typography>
                <Typography variant="body1">{persona.pers_Nombre}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">RTN:</Typography>
                <Typography variant="body1">{persona.pers_RTN}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Estado Civil:</Typography>
                <Typography variant="body1">{persona.escv_Nombre}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Oficina:</Typography>
                <Typography variant="body1">{persona.ofic_Nombre}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Oficio/Profesión:</Typography>
                <Typography variant="body1">{persona.ofpr_Nombre}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          <LocationOnIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Ubicación de la Empresa
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Ciudad:</Typography>
                <Typography variant="body1">{persona.ciudadEmpresa}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Colonia:</Typography>
                <Typography variant="body1">{persona.coliniaEmpresa}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Aldea:</Typography>
                <Typography variant="body1">{persona.aldeaEmpresa}</Typography>
              </Grid>
              <Grid item lg={6} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Punto de Referencia:</Typography>
                <Typography variant="body1">{persona.peju_PuntoReferencia}</Typography>
              </Grid>
              <Grid item lg={6} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Número Local/Apartamento:</Typography>
                <Typography variant="body1">{persona.peju_NumeroLocalApart}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Ubicación del Representante Legal
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Ciudad:</Typography>
                <Typography variant="body1">{persona.ciudadRepresentante}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Colonia:</Typography>
                <Typography variant="body1">{persona.coloniaRepresentante}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Aldea:</Typography>
                <Typography variant="body1">{persona.aldeaRepresemtante}</Typography>
              </Grid>
              <Grid item lg={6} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Punto de Referencia:</Typography>
                <Typography variant="body1">{persona.peju_PuntoReferenciaRepresentante}</Typography>
              </Grid>
              <Grid item lg={6} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Número Local/Apartamento:</Typography>
                <Typography variant="body1">{persona.peju_NumeroLocalRepresentante}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          <ContactMailIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Información de Contacto
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Teléfono Empresa:</Typography>
                <Typography variant="body1">{persona.peju_TelefonoEmpresa}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Teléfono Fijo Representante:</Typography>
                <Typography variant="body1">{persona.peju_TelefonoFijoRepresentanteLegal}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Teléfono Representante:</Typography>
                <Typography variant="body1">{persona.peju_TelefonoRepresentanteLegal}</Typography>
              </Grid>
              <Grid item lg={6} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Correo Electrónico:</Typography>
                <Typography variant="body1">{persona.peju_CorreoElectronico}</Typography>
              </Grid>
              {persona.peju_CorreoElectronicoAlternativo && (
                <Grid item lg={6} md={6} sm={12}>
                  <Typography variant="subtitle1" fontWeight="600">Correo Alternativo:</Typography>
                  <Typography variant="body1">{persona.peju_CorreoElectronicoAlternativo}</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 3 }} />
      
      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          Historial de Cambios
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Acción</TableCell>
                <TableCell align="center">Usuario</TableCell>
                <TableCell align="center">Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">Crear</TableCell>
                <TableCell align="center">{persona.usua_UsuarioCreacionNombre || 'Sistema'}</TableCell>
                <TableCell align="center">{new Date(persona.peju_FechaCreacion).toLocaleString()}</TableCell>
              </TableRow>
              {persona.peju_FechaModificacion && (
                <TableRow>
                  <TableCell align="center">Editar</TableCell>
                  <TableCell align="center">{persona.usua_UsuarioModificacionNombre || 'Sistema'}</TableCell>
                  <TableCell align="center">{new Date(persona.peju_FechaModificacion).toLocaleString()}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      <Grid container justifyContent="flex-end" spacing={2} mt={2}>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={onCancelar}
            startIcon={<ArrowBackIcon />}
          >
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default PersonaJuridicaDetails;
