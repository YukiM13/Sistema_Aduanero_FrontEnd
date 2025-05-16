import {React, useState, useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ParentCard from '../../components/shared/ParentCard';


const PaisesMasExportadores = () => {
  const [paisesData, setPaisesData] = useState({ series: [], labels: [], total: 0 });
   // chart color
   const theme = useTheme();
   const primary = theme.palette.primary.main;
   const secondary = theme.palette.secondary.main;
   const success = theme.palette.success.main;
   const warning = theme.palette.warning.main;

   const apiUrl = process.env.REACT_APP_API_URL;
   const apiKey = process.env.REACT_APP_API_KEY;

   const cargarPaisesExpo = () => {
          axios.get(`${apiUrl}/api/AduanasGraficas/PaisesMasExportadores`, {
            headers: {
              'XApiKey': apiKey
            }
          })
          .then(response => {
              const datos = response.data.data;

              const series = datos.map(item => parseFloat(item.porcentaje));
              const labels = datos.map(item => item.pais_Nombre); 
              const total = datos.reduce((acc, item) => acc + item.cantidad, 0);

              setPaisesData({ series, labels, total });
          })
          .catch(error => {
            console.error('Error al obtener las personas:', error);
          });
    }

  const paisesMasExpoChart  = (labels, total) =>({
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
              return total;
            },
          },
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
    labels: labels
  });

  useEffect(() => {
      cargarPaisesExpo();
      }, []);

  

  return (
          <ParentCard title="Paises mas exportadores">
            <Chart
              options={paisesMasExpoChart(paisesData.labels, paisesData.total)}
              series={paisesData.series}
              type="radialBar"
              height="300px"
            />
          </ParentCard>
  );
};

export default PaisesMasExportadores;

