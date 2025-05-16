import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import PageContainer from '../../container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Doughtnut Chart',
  },
];

const OrcoPorEstadi = () => {

   
    const [semanalData, setSemanalData] = useState({ series: [], labels: [] });
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;


    const cargarSemanal = () => {
          axios.get(`${apiUrl}/api/Graficas/ContadorOrdenesCompraPorEstado`, {
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

    
  // chart color
  const theme = useTheme();
  const primary = '  #007EA7 ';
  const secondary = '#FFB400';
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;


  


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
   
    cargarSemanal();
    }, []);


  return (
   
          <ParentCard title='Ordenes Compra - Por Estado'>
            <Chart options={semanalPieChart(semanalData.labels)} series={semanalData.series} type="pie" height="300px" />
          </ParentCard>
        
  );
};

export default OrcoPorEstadi;
