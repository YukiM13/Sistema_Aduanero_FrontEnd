import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, CardContent, Grid, Typography } from '@mui/material';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const ImportacionesContadores = () => {
  const [imp_cont_mes, setmaterialesimp_cont_mes] = useState(0);
  const [imp_cont_semana, setimp_cont_semana] = useState(0);

  useEffect(() => {
    axios.get(`${apiUrl}/api/AduanasGraficas/Importaciones_Contador_Mes`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => setmaterialesimp_cont_mes(response.data.data ?? 0))
      .catch(() => setmaterialesimp_cont_mes(0));

    axios.get(`${apiUrl}/api/AduanasGraficas/Importaciones_Contador_Semana`, {
      headers: { 'XApiKey': apiKey }
    })
      .then(response => setimp_cont_semana(response.data.data ?? 0))
      .catch(() => setimp_cont_semana(0));
  }, []);

  const topcards = [
    {
    href: '/user-profile',
    icon: icon2,
    title: 'Profile',
    digits: '3,685',
    bgcolor: 'primary',
  },
  {
    href: '/apps/blog/posts',
    icon: icon3,
    title: 'Blog',
    digits: '256',
    bgcolor: 'warning',
  },
  {
    href: '/apps/calendar',
    icon: icon4,
    title: 'Calendar',
    digits: '932',
    bgcolor: 'secondary',
  },
  {
    href: '/apps/email',
    icon: icon5,
    title: 'Email',
    digits: '$348K',
    bgcolor: 'error',
  },
  {
    href: '/apps/chats',
    icon: icon6,
    title: 'Chats',
    digits: '96',
    bgcolor: 'success',
  },
  {
    href: '/apps/contacts',
    icon: icon1,
    title: 'Contacts',
    digits: '48',
    bgcolor: 'info',
  },
  ];

  return (
    <Grid container spacing={3} mt={3}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i}>
          <Link to={topcard.href}>
            <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
              <CardContent>
                <img src={topcard.icon} alt={topcard.icon} width="50" />
                <Typography
                  color={topcard.bgcolor + '.main'}
                  mt={1}
                  variant="subtitle1"
                  fontWeight={600}
                >
                  {topcard.title}
                </Typography>
                <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                  {topcard.digits}
                </Typography>
              </CardContent>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImportacionesContadores;