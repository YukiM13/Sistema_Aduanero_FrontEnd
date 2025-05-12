import React from 'react';
import { Stack, Typography } from '@mui/material';

import ChildCard from 'src/components/shared/ChildCard';
import { IconBriefcase, IconDeviceDesktop, IconMail, IconMapPin } from '@tabler/icons';

const IntroCard = () => {
   const localStorageData = localStorage.getItem('DataUsuario');
  const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
   const userEmail = parsedData ? parsedData.empl_CorreoElectronico : 'Correo';
  const userRole = parsedData ? parsedData.role_Descripcion : 'Rol';

   console.log(parsedData);
   return (
    <ChildCard alignItems="center" sx={{ padding: 3 }}>
      
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconBriefcase size="21" />
        <Typography variant="h6">{userRole}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconMail size="21" />
        <Typography variant="h6">{userEmail}</Typography>
      </Stack>

    </ChildCard>
   )
};

export default IntroCard;
