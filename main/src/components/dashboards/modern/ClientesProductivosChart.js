import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, Box, CircularProgress } from '@mui/material';
import { IconCoin, IconUser } from '@tabler/icons';
import axios from 'axios';
import DashboardCard from '../../shared/DashboardCard';

const ClientesProductivosChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [clienteData, setClienteData] = useState(null);
  
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const info = theme.palette.info.main;
  
  // Fetch data from API - versión simplificada
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    
    setLoading(true);
    axios.get(`${apiUrl}/api/Graficas/ClientesProductivos`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      setClienteData(response.data.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error al obtener datos:', error);
      setError(true);
      setLoading(false);
    });
  }, []);

  // Prepare chart data - simplificado
  const prepareChartData = () => {
    if (clienteData?.length === 0) return { series: [], labels: [] };
    
    // Ordenar y obtener top 5 clientes
    const topClientes = [...(clienteData || [])]
      .sort((a, b) => b.cantidadIngresos - a.cantidadIngresos)
      .slice(0, 5);
    
    return {
      series: topClientes.map(cliente => cliente.cantidadIngresos),
      labels: topClientes.map(cliente => cliente.clie_Nombre_O_Razon_Social)
    };
  };

  const { series, labels } = prepareChartData();
  
  // Total de ingresos
  const totalIngresos = series.length > 0 ? series.reduce((sum, val) => sum + val, 0) : 0;
  
  // Opciones del gráfico
  const optionsDonutChart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 240,
    },
    colors: [primary, secondary, success, info, theme.palette.warning.main],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  return (
    <DashboardCard title="Clientes Productivos">
      <Grid container spacing={3}>
        {/* columna izquierda - información */}
        <Grid item xs={7} sm={7}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress size={30} />
            </Box>
          ) : (
            <>
              <Typography variant="h3" fontWeight="700">
                {new Intl.NumberFormat('es-HN', { 
                  style: 'currency', 
                  currency: 'HNL',
                  maximumFractionDigits: 0
                }).format(totalIngresos)}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" mt={1}>
                Ingresos Totales
              </Typography>
              
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 27, height: 27 }}>
                  <IconCoin width={18} style={{ fontSize: '18px' }} color={theme.palette.primary.main} />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  {clienteData?.length || 0} clientes
                </Typography>
              </Stack>
              
              {/* Lista de clientes con su color correspondiente */}
              <Stack spacing={2} mt={4}>
                {labels.map((label, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{ 
                        width: 9, 
                        height: 9, 
                        bgcolor: optionsDonutChart.colors[index], 
                        svg: { display: 'none' } 
                      }}
                    ></Avatar>
                    <Typography variant="subtitle2" color="textSecondary">
                      {label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          )}
        </Grid>
        
        {/* columna derecha - gráfico */}
        <Grid item xs={5} sm={5}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress size={30} />
            </Box>
          ) : (
            <Chart options={optionsDonutChart} series={series} type="donut" height="180px" />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ClientesProductivosChart;
