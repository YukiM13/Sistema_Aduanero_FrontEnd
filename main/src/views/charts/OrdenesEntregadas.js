import {React, useState, useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Doughtnut Chart',
  },
];

const OrdenesCharts = () => {

    const [anualData, setAnualData] = useState({ series: [], labels: [] });
    const [mensualData, setMensualData] = useState({ series: [], labels: [] });
    const [semanalData, setSemanalData] = useState({ series: [], labels: [] });
    const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;


    const cargarSemanal = () => {
          axios.get(`${apiUrl}/api/Graficas/OrdenenesEntregadasPendientes_Semanal`, {
            headers: {
              'XApiKey': apiKey
            }
          })
          .then(response => {
              const datos = response.data.data;

              const series = datos.map(item => item.orco_Conteo);
              const labels = datos.map(item => item.orco_Avance); 

              setSemanalData({ series, labels });
          })
          .catch(error => {
            console.error('Error al obtener las  personas:', error);
          });
    }

    const cargarMensual = () => {
          axios.get(`${apiUrl}/api/Graficas/OrdenenesEntregadasPendientes_Mensual`, {
            headers: {
              'XApiKey': apiKey
            }
          })
          .then(response => {
              const datos = response.data.data;

              const series = datos.map(item => item.orco_Conteo);
              const labels = datos.map(item => item.orco_Avance); 

              setMensualData({ series, labels });
          })
          .catch(error => {
            console.error('Error al obtener las personas:', error);
          });
    }

    const cargarAnual = () => {
          axios.get(`${apiUrl}/api/Graficas/OrdenenesEntregadasPendientes_Anual`, {
            headers: {
              'XApiKey': apiKey
            }
          })
          .then(response => {
              const datos = response.data.data;

              const series = datos.map(item => item.orco_Conteo);
              const labels = datos.map(item => item.orco_Avance); 

              setAnualData({ series, labels });
          })
          .catch(error => {
            console.error('Error al obtener las personas:', error);
          });
    }

  // chart color
  const theme = useTheme();
  const primary = '  #007EA7 ';
  const secondary = '#FFB400';
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;

   

  const anualPieChart = (labels) =>({
    chart: {
      id: 'pie-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    colors: [primary, secondary, secondarylight, warning],
    tooltip: {
      fillSeriesColor: false,
    },
    labels: labels
  });


  const mensualPieChart = (labels) =>({
    chart: {
      id: 'pie-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    colors: [primary, secondary, secondarylight, warning],
    tooltip: {
      fillSeriesColor: false,
    },
    labels: labels
  });


  const semanalPieChart = (labels) =>({
    chart: {
      id: 'pie-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    colors: [primary, secondary, secondarylight, warning],
    tooltip: {
      fillSeriesColor: false,
    },
    labels: labels
  });

  useEffect(() => {
    cargarAnual();
    cargarMensual();
    cargarSemanal();
    }, []);


  return (
      <Grid container spacing={3}>
        <Grid item lg={4} md={12} xs={12}>
          <ParentCard title='Ordenes entregadas - Anual'>
            <Chart options={anualPieChart(anualData.labels)} series={anualData.series} type="pie" height="300px" />
          </ParentCard>
        </Grid>
        <Grid item lg={4} md={12} xs={12}>
          <ParentCard title='Ordenes entregadas - Mensual'>
            <Chart options={mensualPieChart(mensualData.labels)} series={mensualData.series} type="pie" height="300px" />
          </ParentCard>
        </Grid>
        <Grid item lg={4} md={12} xs={12}>
          <ParentCard title='Ordenes entregadas - Semanal'>
            <Chart options={semanalPieChart(semanalData.labels)} series={semanalData.series} type="pie" height="300px" />
          </ParentCard>
        </Grid>
      </Grid>
  );
};

export default OrdenesCharts;
