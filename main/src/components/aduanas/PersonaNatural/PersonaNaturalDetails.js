import React from 'react';
import {
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Box, Typography, Card, CardContent, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ReceiptIcon from '@mui/icons-material/Receipt';

const PersonaNaturalDetailsComponent = ({ persona, onCancelar }) => {
  return (
    <div>
      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          Información Personal
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">ID:</Typography>
                <Typography variant="body1">{persona.pena_Id}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Nombre:</Typography>
                <Typography variant="body1">{persona.cliente}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Ciudad:</Typography>
                <Typography variant="body1">{persona.ciud_Nombre}</Typography>
              </Grid>
              <Grid item lg={12} md={12} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Dirección Exacta:</Typography>
                <Typography variant="body1">{persona.pena_DireccionExacta}</Typography>
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
                <Typography variant="subtitle1" fontWeight="600">Teléfono Fijo:</Typography>
                <Typography variant="body1">{persona.pena_TelefonoFijo || 'No proporcionado'}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Teléfono Celular:</Typography>
                <Typography variant="body1">{persona.pena_TelefonoCelular}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Correo Electrónico:</Typography>
                <Typography variant="body1">{persona.pena_CorreoElectronico}</Typography>
              </Grid>
              {persona.pena_CorreoAlternativo && (
                <Grid item lg={4} md={6} sm={12}>
                  <Typography variant="subtitle1" fontWeight="600">Correo Alternativo:</Typography>
                  <Typography variant="body1">{persona.pena_CorreoAlternativo}</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          <DescriptionIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Documentación e Identificación
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">RTN:</Typography>
                <Typography variant="body1">{persona.pena_RTN}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">DNI:</Typography>
                <Typography variant="body1">{persona.pena_DNI}</Typography>
              </Grid>
              {persona.pena_NombreArchRTN && (
                <Grid item lg={4} md={6} sm={12}>
                  <Typography variant="subtitle1" fontWeight="600">Archivo RTN:</Typography>
                  <Box mt={1}>
                    {persona.pena_ArchivoRTN && (
                      <>
                        {/\.(jpg|jpeg|png|jfif)$/i.test(persona.pena_NombreArchRTN) ? (
                          <Box>
                            <img
                              src={persona.pena_ArchivoRTN}
                              alt="Archivo RTN"
                              style={{ maxWidth: 150, maxHeight: 150, display: 'block', borderRadius: 4 }}
                            />
                            <Typography variant="caption">{persona.pena_NombreArchRTN}</Typography>
                          </Box>
                        ) : (
                          <Button 
                            variant="outlined" 
                            href={persona.pena_ArchivoRTN}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DescriptionIcon />}
                          >
                            Ver Archivo RTN
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Grid>
              )}
              {persona.pena_NombreArchDNI && (
                <Grid item lg={4} md={6} sm={12}>
                  <Typography variant="subtitle1" fontWeight="600">Archivo DNI:</Typography>
                  <Box mt={1}>
                    {persona.pena_ArchivoDNI && (
                      <>
                        {/\.(jpg|jpeg|png|jfif)$/i.test(persona.pena_NombreArchDNI) ? (
                          <Box>
                            <img
                              src={persona.pena_ArchivoDNI}
                              alt="Archivo DNI"
                              style={{ maxWidth: 150, maxHeight: 150, display: 'block', borderRadius: 4 }}
                            />
                            <Typography variant="caption">{persona.pena_NombreArchDNI}</Typography>
                          </Box>
                        ) : (
                          <Button 
                            variant="outlined" 
                            href={persona.pena_ArchivoDNI}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DescriptionIcon />}
                          >
                            Ver Archivo DNI
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" fontWeight="500" mb={2}>
          <ReceiptIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Información de Pago
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography variant="subtitle1" fontWeight="600">Número de Recibo:</Typography>
                <Typography variant="body1">{persona.pena_NumeroRecibo}</Typography>
              </Grid>
              {persona.pena_NombreArchRecibo && (
                <Grid item lg={4} md={6} sm={12}>
                  <Typography variant="subtitle1" fontWeight="600">Archivo de Recibo:</Typography>
                  <Box mt={1}>
                    {persona.pena_ArchivoNumeroRecibo && (
                      <>
                        {/\.(jpg|jpeg|png|jfif)$/i.test(persona.pena_NombreArchRecibo) ? (
                          <Box>
                            <img
                              src={persona.pena_ArchivoNumeroRecibo}
                              alt="Archivo Recibo"
                              style={{ maxWidth: 150, maxHeight: 150, display: 'block', borderRadius: 4 }}
                            />
                            <Typography variant="caption">{persona.pena_NombreArchRecibo}</Typography>
                          </Box>
                        ) : (
                          <Button 
                            variant="outlined" 
                            href={persona.pena_ArchivoNumeroRecibo}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DescriptionIcon />}
                          >
                            Ver Archivo Recibo
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
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
                <TableCell align="center">{persona.usua_UsuarioCreacion_Nombre || 'Sistema'}</TableCell>
                <TableCell align="center">{new Date(persona.pena_FechaCreacion).toLocaleString()}</TableCell>
              </TableRow>
              {persona.pena_FechaModificacion && (
                <TableRow>
                  <TableCell align="center">Editar</TableCell>
                  <TableCell align="center">{persona.usua_UsuarioModificacion_Nombre || 'Sistema'}</TableCell>
                  <TableCell align="center">{new Date(persona.pena_FechaModificacion).toLocaleString()}</TableCell>
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

export default PersonaNaturalDetailsComponent;
