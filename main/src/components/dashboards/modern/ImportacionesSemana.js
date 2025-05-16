import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const ImportacionesSemanaChart = () => {
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

  const fetchImportacionesSemana = () => {
    axios.get(`${apiUrl}/api/AduanasGraficas/Importaciones_Semana`, {
      headers: {
        "XApiKey": apiKey,
      },
    })
    .then((response) => {
      const datos = response.data.data || response.data; // por si viene directo sin "data"
      const dias = datos.map((d) => d.fecha);
      const conteos = datos.map((d) => d.cantidad);

      const colores = conteos.map((_, i) => i % 2 === 0 ? primary : primarylight);

      setCategories(dias);
      setData(conteos);
      setColors(colores);

      const totalSuma = conteos.reduce((acc, val) => acc + val, 0);
      setTotal(totalSuma);
      setMaxValor(Math.max(...conteos));
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
  };

  useEffect(() => {
    fetchImportacionesSemana();
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
      subtitle="Por día de la semana"
      dataLabel1="Total semana"
      dataItem1={total}
      dataLabel2="Máximo diario"
      dataItem2={maxValor}
    >
      <Chart options={options} series={series} type="bar" height="280px" />
    </DashboardWidgetCard>
  );
};

export default ImportacionesSemanaChart;
