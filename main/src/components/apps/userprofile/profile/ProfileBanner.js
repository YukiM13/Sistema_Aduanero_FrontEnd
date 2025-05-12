import React, { useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,

  Avatar,
  Stack,
  CardMedia,
  styled,
  Skeleton,
} from '@mui/material';
import { IconBriefcase, IconMail } from '@tabler/icons';
import profilecover from 'src/assets/images/backgrounds/profilebg.jpg';
import userimg from 'src/assets/images/profile/user-1.jpg';

import ProfileTab from './ProfileTab';
import BlankCard from '../../../shared/BlankCard';

const ProfileBanner = () => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  }));
  const [isLoading, setLoading] = React.useState(true);
  const localStorageData = localStorage.getItem('DataUsuario');
  const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
  const userName = parsedData ? parsedData.usua_Nombre : 'Usuario';
  const userNombreCompleto = parsedData ? parsedData.emplNombreCompleto : 'Nombre Completo';
  const userImage = parsedData ? parsedData.usua_Image : 'Imagen';
  const userEmail = parsedData ? parsedData.empl_CorreoElectronico : 'Correo';
  const userRole = parsedData ? parsedData.role_Descripcion : 'Rol';
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BlankCard>
        {isLoading ? (
          <>
            <Skeleton variant="square" animation="wave" width="100%" height={330}></Skeleton>
          </>
        ) : (
          <CardMedia component="img" image={profilecover} alt={profilecover} width="100%" />
        )}
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          {/* Post | Followers | Following */}
          <Grid
            item
            lg={4}
            sm={12}
            md={5}
            xs={12}
            sx={{
              order: {
                xs: '2',
                sm: '2',
                lg: '1',
              },
            }}
          >
            <Stack direction="row" textAlign="center" justifyContent="center" gap={6} m={3}>
              
            </Stack>
          </Grid>
          {/* about profile */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: '1',
                sm: '1',
                lg: '2',
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: '-85px',
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={userImage || userimg}
                    alt={userimg}
                    sx={{
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      border: '4px solid #fff',
                    }}
                  />
                </ProfileImage>
                <Box mt={1}>
                  <Typography fontWeight={600} variant="h5">
                    {userName}
                  </Typography>
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                    {userNombreCompleto}
                  </Typography>
                  
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                    <IconBriefcase size="21" /> {userRole}</Typography>
                   
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                    <IconMail size="21" /> {userEmail}
                    </Typography>
                   <Typography color="textSecondary" variant="h6" fontWeight={400}>
                      ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
                    </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* friends following buttons */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: '3',
                sm: '3',
                lg: '3',
              },
            }}
          >
            <Stack direction={'row'} gap={2} alignItems="center" justifyContent="center" my={2}>
              
            </Stack>
          </Grid>
        </Grid>
        {/**TabbingPart**/}

      </BlankCard>
    </>
  );
};

export default ProfileBanner;
