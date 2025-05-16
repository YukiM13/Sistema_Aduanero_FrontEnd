import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, CardContent, Grid, Typography } from '@mui/material';
import icon1 from '../../../assets/images/svgs/ship.svg';
import axios from 'axios';

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
      bgcolor: 'success',

    },
    {
      href: '/user-profile',

      title: 'Importaciones Este Mes',
      digits: impContMes.cantidad ?? 0,
      bgcolor: 'primary',
    },
    {
      href: '/apps/blog/posts',

      title: 'Importaciones Esta Semana',
      digits: impContSemana.cantidad ?? 0,
      bgcolor: 'warning',
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
                  variant="h5"
                  fontWeight={600}
                >
                  {topcard.title}
                </Typography>
                <Typography color={topcard.bgcolor + '.main'} variant="h2" fontWeight={600}>
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