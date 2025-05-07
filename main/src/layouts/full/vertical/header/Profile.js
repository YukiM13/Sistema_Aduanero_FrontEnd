import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import breadcrumbImg from 'src/assets/images/breadcrumb/breadcrumb.png';
import { IconMail } from '@tabler/icons';
import { Stack } from '@mui/system';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const localStorageData = localStorage.getItem('DataUsuario');
  const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
  const userName = parsedData ? parsedData.emplNombreCompleto : 'Usuario';
  const userEmail = parsedData ? parsedData.empl_CorreoElectronico : 'Correo';
  const userRole = parsedData ? parsedData.role_Descripcion : 'Rol';
  const userImage = parsedData ? parsedData.usua_Image : 'Imagen';

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={userImage || ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">Usuario</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar src={userImage} alt={ProfileImg} sx={{ width: 95, height: 95 }} />
              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {userName}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {userRole}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <IconMail width={15} height={15} />
                  {userEmail}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Box mt={2}>
              <Box bgcolor="primary.light" p={3} mb={3} overflow="hidden" position="relative">
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" mb={2}>
                      Frontier <br />
                      Logistic
                    </Typography>
                  </Box>
                  <img src={breadcrumbImg} alt="unlimited" className="signup-bg"></img>
                </Box>
              </Box>
              <Button
                to="/auth/login"
                variant="outlined"
                color="primary"
                component={Link}
                fullWidth
              >
                Cerrar sesión
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
