import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';


const OrcoSemanal = () => {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [valorMaximo, setValorMaximo] = useState([]);
  const [total, setTotal] = useState([]);
  const [color, setColor] = useState([])

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const listadoMensual = () => {
    axios.get(`${apiUrl}/api/Graficas/TotalOrdenesCompraDiario`, {
      headers: {
        "XApiKey": apiKey,
      },
    })
      .then((response) => {
         const datos = response.data.data;
        const semanas = datos.map((duca) => duca.fecha);
        const conteos = datos.map((duca) => duca.orco_Conteo);
        var colores = [];
        for(let i = 0; i<datos.length;i++ )
        {
            if(i%2===0)
            {
                colores.push(primary);
            }
            else
            {
                colores.push(primarylight);
            }
        }
        setColor(colores);
        setCategories(semanas);
        setData(conteos);
        console.log(conteos)
        var totalSuma = conteos.reduce((acc, val) => acc + val,0);
        var Maximo = Math.max(...conteos);
        setTotal(totalSuma);
        setValorMaximo(Maximo)
      
       
        console.log(colores);
       
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  useEffect(() => {
    listadoMensual();
    
  }, []);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.secondary.main;

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 280,
    },
    colors: color,
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: categories, // aquí usas la variable dinámica
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart = [
    {
      name: '',
      data: data, // aquí también datos dinámicos
    },
  ];

 

    return (
        <DashboardWidgetCard
            title="Orden de compra"
            subtitle="Semanal"
            dataLabel1="total"
            dataItem1={total}
            dataLabel2="Mayor venta"
            dataItem2= {valorMaximo}
        >
            <>
                <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="280px" />
            </>
        </DashboardWidgetCard>
    );
};

export default OrcoSemanal;
