import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, CardContent, Grid, Typography, Card } from '@mui/material';
import icon1 from '../../../assets/images/svgs/ship.svg';
import axios from 'axios';
import { IconFileImport } from '@tabler/icons';

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const ImportacionesContadores = () => {
  const [impContMes, setImpContMes] = useState({});
  const [impContSemana, setImpContSemana] = useState({});
  const [impContAnio, setImpContAnio] = useState({});


useEffect(() => {
  axios.get(`${apiUrl}/api/AduanasGraficas/Importaciones_Contador_Mes`, {
    headers: { 'XApiKey': apiKey }
  })
    .then(response => {
      const data = Array.isArray(response.data.data) ? response.data.data[0] : {};
      setImpContMes(data ?? {});
    })
    .catch(() => setImpContMes({}));

  axios.get(`${apiUrl}/api/AduanasGraficas/Importaciones_Contador_Semana`, {
    headers: { 'XApiKey': apiKey }
  })
    .then(response => {
      const data = Array.isArray(response.data.data) ? response.data.data[0] : {};
      setImpContSemana(data ?? {});
    })
    .catch(() => setImpContSemana({}));
  axios.get(`${apiUrl}/api/AduanasGraficas/Importaciones_Contador_Anio`, {
    headers: { 'XApiKey': apiKey }
  })
    .then(response => {
      const data = Array.isArray(response.data.data) ? response.data.data[0] : {};
      setImpContAnio(data ?? {});
    })
    .catch(() => setImpContAnio({}));
}, []);

  const topcards = [
    {
      href: '/apps/blog/posts',
      title: 'Importaciones Este año',
      digits: impContAnio.cantidad ?? 0,
      bgcolor: '#006298',
      icon: IconFileImport,
      color1: '#0c314f',
    color2: '#4994cf',

    },
    {
      href: '/user-profile',
      title: 'Importaciones Este Mes',
      digits: impContMes.cantidad ?? 0,
      bgcolor: '#002146	',
      icon: IconFileImport,
      color1: '#16244b',
    color2: '#354b6e',
    },
    {
      href: '/apps/blog/posts',
      title: 'Importaciones Esta Semana',
      digits: impContSemana.cantidad ?? 0,
      bgcolor: '#2f3539',
      icon: IconFileImport,
      color1: '#2f3336',
    color2: '#84959c',
    },

  ];

  return (
    <Grid container spacing={3} mt={3}>
  {topcards.map((topcard, i) => {
    const IconComponent = topcard.icon;

    return (
      <Grid item xs={12} sm={6} md={4} lg={4} key={i}>
        <Link to={topcard.href} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: topcard.bgcolor,
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              p: 3,
              boxShadow: 3,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${topcard.color1}, ${topcard.color2})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <IconComponent size={30} color="white" />
            </Box>

            <Typography variant="subtitle2" color="white" fontWeight={500}>
              {topcard.title}
            </Typography>

            <Typography variant="h4" fontWeight={700} mt={1} color="white">
              {topcard.digits}
            </Typography>

            {/* Patrón decorativo */}
          <Box
  sx={{
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 100,
    height: 100,
    opacity: 0.09,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='4'%3E%3Cpath d='M-10 10 L50 70'/%3E%3Cpath d='M-10 -10 L50 50'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    pointerEvents: 'none',
  }}
/>
          </Box>
        </Link>
      </Grid>
    );
  })}
</Grid>
  );
};

export default ImportacionesContadores;