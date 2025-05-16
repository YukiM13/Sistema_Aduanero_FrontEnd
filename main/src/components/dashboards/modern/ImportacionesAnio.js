import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const ImportacionesAnioChart = () => {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [maxValor, setMaxValor] = useState(0);
  const [total, setTotal] = useState(0);
  const [colors, setColors] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.secondary.main;

  const fetchImportacionesAnio = () => {
    axios.get(`${apiUrl}/api/AduanasGraficas/Importaciones_Anio`, {
      headers: {
        "XApiKey": apiKey,
      },
    })
    .then((response) => {
      const datos = response.data.data || response.data;

      // Asegura que los meses estén en orden correcto
      const mesesOrden = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];

      const datosOrdenados = mesesOrden
        .map((mes) => {
          const encontrado = datos.find((d) => d.fecha.toLowerCase() === mes);
          return encontrado ? { ...encontrado, mes } : { fecha: mes, cantidad: 0 };
        });

      const categorias = datosOrdenados.map((d) => d.fecha);
      const cantidades = datosOrdenados.map((d) => d.cantidad);
      const colores = cantidades.map((_, i) => i % 2 === 0 ? primary : primarylight);

      setCategories(categorias);
      setData(cantidades);
      setColors(colores);

      const totalSuma = cantidades.reduce((acc, val) => acc + val, 0);
      setTotal(totalSuma);
      setMaxValor(Math.max(...cantidades));
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
  };

  useEffect(() => {
    fetchImportacionesAnio();
  }, []);

  const options = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 280,
    },
    colors: colors,
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const series = [
    {
      name: 'Importaciones',
      data: data,
    },
  ];

  return (
    <DashboardWidgetCard
      title="Importaciones"
      subtitle="Por mes del año"
      dataLabel1="Total año"
      dataItem1={total}
      dataLabel2="Mayor mensual"
      dataItem2={maxValor}
    >
      <Chart options={options} series={series} type="bar" height="280px" />
    </DashboardWidgetCard>
  );
};

export default ImportacionesAnioChart;
