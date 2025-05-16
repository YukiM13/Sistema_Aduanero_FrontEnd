import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';

import React, { useState, useEffect } from 'react';
import { 
  
  CardContent, 
  Chip, 
  Paper, 
  LinearProgress, 
  CircularProgress 
} from '@mui/material';

import axios from 'axios';
import { IconBuildingFactory2, IconAlertTriangle, IconWorld } from '@tabler/icons';
import { set } from 'lodash';


const AvanceOrdenCompra = () => {
    // chart color
      
      

  const [month, setMonth] = React.useState('1');

  const [orco_Id, setOrco_Id ] = useState(0);
  const [ordenes, setOrdenes] = useState([]);
  const [orden, setOrden] = useState();
  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
      const info = theme.palette.info.main;

  const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

   // Fetch data from API - versión simplificada
    useEffect(() => {
      
      
    //   setLoading(true);
      axios.get(`${apiUrl}/api/OrdenCompra/Listar`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {

        setOrdenes(response.data.data);
        // Ordenar por porcentaje de producción (mayor a menor)
        // const sortedData = response.data.data
        //   .sort((a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje));
        // setModulosData(sortedData);
        // setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener datos:', error);
        // setError(true);
        // setLoading(false);
      });
    }, []);
  // chart

  // Prepare chart data - simplificado
//     const prepareChartData = (orcoid) => {

//     if (!orcoid) return { series: [], labels: [] };

//      axios.post(`${apiUrl}/api/Graficas/AvanceOrdenCompra`, {orco_Id: orcoid}, {
//                 headers: {
//                 'XApiKey': apiKey
//                 }
//             })
//             .then(response => {
//                 console.log("asdsadsa", response.data.data);
//                 if (response.data.data.length > 0) {
//                     setOrden(response.data.data.at(0));
                    
//                 }
//             })
//             .catch(error => {
//                 console.error('Error al obtener datos:', error);
//             }); 
//     if (!orden) return { series: [], labels: [] };
    
//     console.log("orden ", orden)
    
//     // Ordenar y obtener top 5 clientes
//     // const topClientes = [...(clienteData || [])]
//     //   .sort((a, b) => b.cantidadIngresos - a.cantidadIngresos)
//     //   .slice(0, 5);
//     const ordeneschart = [{label: "Porcentaje de Avance", porcentaje: orden.orco_Avance}, {label: "Porcentaje Restante", porcentaje: 1 - orden.orco_Avance}];
//     return {
//       series: ordeneschart.map(cliente => cliente.label),
//       labels: ordeneschart.map(cliente => cliente.porcentaje)
//     };
//   };

const prepareChartData = async (orcoid) => {
  if (!orcoid) return { series: [], labels: [] };

  try {
    const response = await axios.post(`${apiUrl}/api/Graficas/AvanceOrdenCompra`, { orco_Id: orcoid }, {
      headers: { 'XApiKey': apiKey }
    });

    if (response.data.data.length > 0) {
      const orden = response.data.data.at(0);
      const ordeneschart = [
        { label: "Porcentaje de Avance", porcentaje: orden.orco_Avance },
        { label: "Porcentaje Restante", porcentaje: 1 - orden.orco_Avance }
      ];
      return {
        series: ordeneschart.map(cliente => cliente.porcentaje),
        labels: ordeneschart.map(cliente => cliente.label)
      };
    }
    return { series: [], labels: [] };
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return { series: [], labels: [] };
  }
};

  const [objetochart, setObjetoChart] = useState({});
//   const { series, labels } = prepareChartData();
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
    labels: objetochart.labels,
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


  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 370,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
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
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: 'Eanings this month',
      data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0],
    },
    {
      name: 'Expense this month',
      data: [-1.8, -1.1, -2.5, -1.5, -0.6, -1.8],
    },
  ];

  return (
    <DashboardCard
      title="Avance de Orden de Compra"
      subtitle="Vista General de la Orden"
      action={
        <CustomSelect
          labelId="orden"
          id="orden"
          value={orco_Id}
          size="small"
          onChange={async e => {setOrco_Id(e.target.value);

            alert(e.target.value);

            setOrco_Id(e.target.value);
            setObjetoChart({}); // Optional: show spinner while loading
            const chartData = await prepareChartData(e.target.value);
            setObjetoChart(chartData);
            

            setObjetoChart(prepareChartData(e.target.value));
            }
          }
        >
            <MenuItem value= {0} disabled >
                <em style={{ color: '#888' }}>Seleccione Orden de Compra</em>
            </MenuItem>
        {ordenes.map((modulo) => (
            <MenuItem key={modulo.orco_Id} value={modulo.orco_Id}>
            {modulo.orco_Codigo}
            </MenuItem>
        ))}
        </CustomSelect>
      }
    >
      <Grid container spacing={3}>
        {/* column */}
        {/* <Grid item xs={12} sm={8}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="bar"
            height="370px"
          />
        </Grid> */}
        {/* circulo */}

        {/* columna derecha - gráfico */}
                {/* <Grid item xs={12} sm={8}>
                  {!objetochart ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                      <CircularProgress size={30} />
                    </Box>
                  ) : (
                    <Chart options={optionsDonutChart} series={objetochart.series} type="donut" height="180px" />
                  )}
                </Grid> */}
        {/* circulo */}

        <Grid item xs={12} sm={8}>
        {(!objetochart.series || objetochart.series.length === 0) ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={30} />
            </Box>
        ) : (
            <Chart options={optionsDonutChart} series={objetochart.series} type="donut" height="180px" />
        )}
        </Grid>

        {/* column */}
        <Grid item xs={12} sm={4}>
          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={40}
                height={40}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="primary" variant="h6" display="flex">
                  <IconGridDots width={21} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="700">
                  $63,489.50
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Earnings
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack spacing={3} my={5}>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Earnings this month
                </Typography>
                <Typography variant="h5">$48,820</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Expense this month
                </Typography>
                <Typography variant="h5">$26,498</Typography>
              </Box>
            </Stack>
          </Stack>
          <Button color="primary" variant="contained" fullWidth>
            View Full Report
          </Button>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default AvanceOrdenCompra;
