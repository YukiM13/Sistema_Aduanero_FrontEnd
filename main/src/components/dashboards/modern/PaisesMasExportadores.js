import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const PaisesConImportacionesChart = () => {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.secondary.main;

  const fetchPaisesConImportaciones = () => {
  axios.get(`${apiUrl}/api/AduanasGraficas/PaisesMasExportadores`, {
    headers: {
      "XApiKey": apiKey,
    },
  })
  .then((response) => {
    const datos = response.data; // usa response.data directamente

    if (!Array.isArray(datos) || datos.length === 0) {
      console.warn("No hay datos o el formato no es un arreglo.");
      return;
    }

    const paises = datos.map(d => d.pais_Nombre);
    const cantidades = datos.map(d => d.cantidad); // usar minúscula

    const sumaTotal = cantidades.reduce((acc, val) => acc + val, 0);

    setCategories(paises);
    setData(cantidades);
    setTotal(sumaTotal);
  })
  .catch((error) => {
    console.error('Error al obtener los datos:', error);
  });
};


  useEffect(() => {
    fetchPaisesConImportaciones();
  }, []);

  const colors = data.map((_, i) => i % 2 === 0 ? primary : primarylight);

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
        columnWidth: '50%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { yaxis: { lines: { show: false } } },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { show: true },
      title: {
        text: 'Cantidad',
        style: { color: '#adb0bb', fontSize: '12px' },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `${val} importaciones`,
      },
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
      title="Países con más importaciones"
      subtitle="Top 5 países"
      dataLabel1="Total importaciones"
      dataItem1={total}
    >
      <Chart options={options} series={series} type="bar" height="280px" />
    </DashboardWidgetCard>
  );
};

export default PaisesConImportacionesChart;
