import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { IconPower } from '@tabler/icons';
import {Link} from "react-router-dom";

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  const localStorageData = localStorage.getItem('DataUsuario');
  const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
  const userName = parsedData ? parsedData.usua_Nombre : 'Usuario';
  const userRole = parsedData ? parsedData.role_Descripcion : 'Rol';
  const userImage = parsedData ? parsedData.usua_Image : 'Imagen';

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'#002d48'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={userImage} />

          <Box>
            <Typography variant="h6"  color="#D6E6FF">{userName}</Typography>
            <Typography variant="caption" color="#D6E6FF">{userRole}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" component={Link} to="/auth/login" aria-label="logout" size="small">
                <IconPower size="15" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
