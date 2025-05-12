import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  InputAdornment
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons';
import {
  IconUser,
  IconWorld,
  IconBuildingFactory2,
  IconPackgeExport,
  IconFileText,
  IconFileCertificate,
  IconHome
} from '@tabler/icons';
import Menuitems from '../sidebar/MenuItems';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { Link, useLocation } from 'react-router-dom';

const Search = () => {
  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSerach] = useState('');
  const location = useLocation();

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  const filterRoutes = (rotr, cSearch) => {
    if (rotr.length > 1)
      return rotr.filter((t) =>
        t.title ? t.href.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()) : '',
      );
    return rotr;
  };

  const searchData = filterRoutes(Menuitems, search);

  return (
    <>
      <IconButton
        aria-label="show search"
        color="inherit"
        aria-controls="search-menu"
        aria-haspopup="true"
        onClick={() => setShowDrawer2(true)}
        size="large"
      >
        <IconSearch size="16" />
      </IconButton>
      <Dialog
        open={showDrawer2}
        onClose={handleDrawerClose2}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
      >
        <DialogContent className="testdialog">
          <Stack direction="row" spacing={2} alignItems="center">
            <CustomTextField
              id="tb-search"
              placeholder="Buscar..."
              fullWidth
              onChange={(e) => setSerach(e.target.value)}
              inputProps={{ 'aria-label': 'Search here' }}
            />
            <IconButton size="small" variant="outlined" onClick={handleDrawerClose2}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Box>
            <List component="nav">
              {searchData.map((menu) => {
                return (
                  <Box key={menu.title ? menu.id : menu.subheader}>
                    {menu.title && !menu.children ? (
                      <>
                        {menu.title === 'Inicio' && (
                          <>
                            <Typography variant="h5" sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                              <InputAdornment position="start">
                                <IconHome />
                              </InputAdornment>
                              Inicio
                            </Typography>
                            <ListItemButton
                              sx={{
                                py: 0.5,
                                px: 1,
                                backgroundColor: location.pathname === menu.href ? 'primary.light' : 'inherit',
                                color: location.pathname === menu.href ? 'primary.main' : 'inherit',
                              }}
                              to={menu.href}
                              component={Link}
                            >
                              <ListItemText
                                primary={menu.title}
                                sx={{ my: 0, py: 1 }}
                              />
                            </ListItemButton>
                          </>
                        )}
                        {['Declaración de valor', 'Ducas'].includes(menu.title) && (
                          <>
                            <Typography variant="h5" sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                              <InputAdornment position="start">
                                <IconFileCertificate />
                              </InputAdornment>
                              Principales
                            </Typography>
                            <ListItemButton
                              sx={{
                                py: 0.5,
                                px: 1,
                                backgroundColor: location.pathname === menu.href ? 'primary.light' : 'inherit',
                                color: location.pathname === menu.href ? 'primary.main' : 'inherit',
                              }}
                              to={menu.href}
                              component={Link}
                            >
                              <ListItemText
                                primary={menu.title}
                                sx={{ my: 0, py: 1 }}
                              />
                            </ListItemButton>
                          </>
                        )}
                      </>
                    ) : (
                      ''
                    )}
                    {menu.children ? (
                      <>
                        {menu.children.filter((child) => child.title === 'Usuarios' || child.title === 'Roles').length > 0 && (
                          <>
                            <Typography variant="h5" sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                              <InputAdornment position="start">
                                <IconUser />
                              </InputAdornment>
                              Acceso
                            </Typography>
                            {menu.children
                              .filter((child) => child.title === 'Usuarios' || child.title === 'Roles')
                              .map((child) => {
                                return (
                                  <ListItemButton
                                    sx={{
                                      py: 0.5,
                                      px: 1,
                                      backgroundColor: location.pathname === child.href ? 'primary.light' : 'inherit',
                                      color: location.pathname === child.href ? 'primary.main' : 'inherit',
                                    }}
                                    to={child.href}
                                    component={Link}
                                    key={child.title ? child.id : menu.subheader}
                                  >
                                    <ListItemText
                                      primary={child.title}
                                      sx={{ my: 0, py: 1 }}
                                    />
                                  </ListItemButton>
                                );
                              })}
                          </>
                        )}
                        {menu.children.filter((child) =>
                          [
                            'Aldea',
                            'Cargos',
                            'Colonias',
                            'Ciudades',
                            'Estados Civiles',
                            'Empleados',
                            'Oficinas',
                            'Oficio Profesiones',
                            'Formas de Envio',
                            'Monedas',
                            'Paises',
                            'Provincias',
                            'Proveedores',
                            'Unidades de Medida',
                          ].includes(child.title)
                        ).length > 0 && (
                          <>
                            <Typography variant="h5" sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                              <InputAdornment position="start">
                                <IconWorld />
                              </InputAdornment>
                              Generales
                            </Typography>
                            {menu.children
                              .filter((child) =>
                                [
                                  'Aldea',
                                  'Cargos',
                                  'Colonias',
                                  'Ciudades',
                                  'Estados Civiles',
                                  'Empleados',
                                  'Oficinas',
                                  'Oficio Profesiones',
                                  'Formas de Envio',
                                  'Monedas',
                                  'Paises',
                                  'Provincias',
                                  'Proveedores',
                                  'Unidades de Medida',
                                ].includes(child.title)
                              )
                              .map((child) => {
                                return (
                                  <ListItemButton
                                    sx={{
                                      py: 0.5,
                                      px: 1,
                                      backgroundColor: location.pathname === child.href ? 'primary.light' : 'inherit',
                                      color: location.pathname === child.href ? 'primary.main' : 'inherit',
                                    }}
                                    to={child.href}
                                    component={Link}
                                    key={child.title ? child.id : menu.subheader}
                                  >
                                    <ListItemText
                                      primary={child.title}
                                      sx={{ my: 0, py: 1 }}
                                    />
                                  </ListItemButton>
                                );
                              })}
                          </>
                        )}
                        {menu.children.filter((child) =>
                          [
                            'Aduanas',
                            'Personas',
                            'Persona Natural',
                            'Persona Jurídica',
                            'Concepto de Pago',
                            'Formas de Pago',
                            'Comerciante Individual',
                            'Niveles Comerciales',
                            'Marcas',
                            'Modos de Transporte',
                            'Tipo de Identificacion',
                            'Tipo Intermediario',
                          ].includes(child.title)
                        ).length > 0 && (
                          <>
                            <Typography variant="h5" sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                              <InputAdornment position="start">
                                <IconPackgeExport />
                              </InputAdornment>
                              Aduanas
                            </Typography>
                            {menu.children
                              .filter((child) =>
                                [
                                  'Aduanas',
                                  'Personas',
                                  'Persona Natural',
                                  'Persona Jurídica',
                                  'Concepto de Pago',
                                  'Formas de Pago',
                                  'Comerciante Individual',
                                  'Niveles Comerciales',
                                  'Marcas',
                                  'Modos de Transporte',
                                  'Tipo de Identificacion',
                                  'Tipo Intermediario',
                                ].includes(child.title)
                              )
                              .map((child) => {
                                return (
                                  <ListItemButton
                                    sx={{
                                      py: 0.5,
                                      px: 1,
                                      backgroundColor: location.pathname === child.href ? 'primary.light' : 'inherit',
                                      color: location.pathname === child.href ? 'primary.main' : 'inherit',
                                    }}
                                    to={child.href}
                                    component={Link}
                                    key={child.title ? child.id : menu.subheader}
                                  >
                                    <ListItemText
                                      primary={child.title}
                                      sx={{ my: 0, py: 1 }}
                                    />
                                  </ListItemButton>
                                );
                              })}
                          </>
                        )}
                        {menu.children.filter((child) =>
                          [
                            'Categorias',
                            'Marcas Maquinas',
                            'Tipo Embalaje',
                            'Tallas',
                            'Sub Categorias',
                            'Orden Compra',
                          ].includes(child.title)
                        ).length > 0 && (
                          <>
                            <Typography variant="h5" sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                              <InputAdornment position="start">
                                <IconBuildingFactory2 />
                              </InputAdornment>
                              Produccion
                            </Typography>
                            {menu.children
                              .filter((child) =>
                                [
                                  'Categorias',
                                  'Marcas Maquinas',
                                  'Tipo Embalaje',
                                  'Tallas',
                                  'Sub Categorias',
                                  'Orden Compra',
                                ].includes(child.title)
                              )
                              .map((child) => {
                                return (
                                  <ListItemButton
                                    sx={{
                                      py: 0.5,
                                      px: 1,
                                      backgroundColor: location.pathname === child.href ? 'primary.light' : 'inherit',
                                      color: location.pathname === child.href ? 'primary.main' : 'inherit',
                                    }}
                                    to={child.href}
                                    component={Link}
                                    key={child.title ? child.id : menu.subheader}
                                  >
                                    <ListItemText
                                      primary={child.title}
                                      sx={{ my: 0, py: 1 }}
                                    />
                                  </ListItemButton>
                                );
                              })}
                          </>
                        )}
                        {menu.children.filter((child) =>
                          ['I. Declaracion de Valor', 'I. Duca'].includes(child.title)
                        ).length > 0 && (
                          <>
                            <Typography variant="h5" sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                              <InputAdornment position="start">
                                <IconFileText />
                              </InputAdornment>
                              Impresion
                            </Typography>
                            {menu.children
                              .filter((child) =>
                                ['I. Declaracion de Valor', 'I. Duca'].includes(child.title)
                              )
                              .map((child) => {
                                return (
                                  <ListItemButton
                                    sx={{
                                      py: 0.5,
                                      px: 1,
                                      backgroundColor: location.pathname === child.href ? 'primary.light' : 'inherit',
                                      color: location.pathname === child.href ? 'primary.main' : 'inherit',
                                    }}
                                    to={child.href}
                                    component={Link}
                                    key={child.title ? child.id : menu.subheader}
                                  >
                                    <ListItemText
                                      primary={child.title}
                                      sx={{ my: 0, py: 1 }}
                                    />
                                  </ListItemButton>
                                );
                              })}
                          </>
                        )}
                      </>
                    ) : (
                      ''
                    )}
                  </Box>
                );
              })}
            </List>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Search;