import React from 'react';
import Chart from 'react-apexcharts';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Radialbar Chart',
  },
];

const RadialbarChart = () => {
  
   // chart color
   const theme = useTheme();
   const primary = theme.palette.primary.main;
   const secondary = theme.palette.secondary.main;
   const success = theme.palette.success.main;
   const warning = theme.palette.warning.main;

  const optionsradialchart = {
    chart: {
      id: 'pie-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: [primary, secondary, success, warning],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter() {
              return 249;
            },
          },
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
  };
  const seriesradialchart = [44, 55, 67, 83];

  

  return (
      <Grid container spacing={3}>
        <Grid item lg={4} md={12} xs={12}>
          <ParentCard title="Radialbar Charts">
            <Chart
              options={optionsradialchart}
              series={seriesradialchart}
              type="radialBar"
              height="300px"
            />
          </ParentCard>
        </Grid>
        <Grid item lg={4} md={12} xs={12}>
          <ParentCard title="Radialbar Charts">
            <Chart
              options={optionsradialchart}
              series={seriesradialchart}
              type="radialBar"
              height="300px"
            />
          </ParentCard>
        </Grid>
        <Grid item lg={4} md={12} xs={12}>
          <ParentCard title="Radialbar Charts">
            <Chart
              options={optionsradialchart}
              series={seriesradialchart}
              type="radialBar"
              height="300px"
            />
          </ParentCard>
        </Grid>
        
      </Grid>
  );
};

export default RadialbarChart;
