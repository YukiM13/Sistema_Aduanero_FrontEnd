import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  CircularProgress, 
  Typography, 
  Stack 
} from '@mui/material';
import { IconShirt, IconAlertTriangle } from '@tabler/icons';
import axios from 'axios';
import DashboardCard from '../../shared/DashboardCard';
import PrendasPedidasModel from '../../../models/PrendasPedidasModel';

// Los estilos se cargarán desde la API

// Mapeo de códigos de sexo a descripciones más legibles
const sexoMapping = {
  'M': 'Masculino',
  'F': 'Femenino',
  'U': 'Unisex'
};

const PrendasPedidasChart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [prendasData, setPrendasData] = useState([]);
  const [estilosDisponibles, setEstilosDisponibles] = useState([]);
  const [selectedEstilo, setSelectedEstilo] = useState(4); // Valor predeterminado
  const [loadingEstilos, setLoadingEstilos] = useState(true);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const info = theme.palette.info.main;
  const warning = theme.palette.warning.main;
  const success = theme.palette.success.main;

  // Función para obtener datos de prendas
  const fetchPrendasData = async (estiloId) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    setLoading(true);
    setError(false);

    try {
      // Creamos una copia del modelo y actualizamos el esti_Id
      const requestData = { ...PrendasPedidasModel, esti_Id: estiloId };

      const response = await axios.post(
        `${apiUrl}/api/Graficas/PrendasPedidas`,
        requestData,
        {
          headers: {
            'XApiKey': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        setPrendasData(response.data.data);
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
        setError(true);
      }
    } catch (error) {
      console.error('Error al obtener datos de prendas pedidas:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estilos disponibles desde la API
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    setLoadingEstilos(true);
    
    axios.get(`${apiUrl}/api/Estilos/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      const estilos = response.data.data.map(estilo => ({
        id: estilo.esti_Id,
        nombre: estilo.esti_Descripcion
      }));
      setEstilosDisponibles(estilos);
      
      // Si hay estilos, usar el primero como valor predeterminado
      if (estilos.length > 0) {
        setSelectedEstilo(estilos[0].id);
      }
    })
    .catch(error => {
      console.error('Error al obtener estilos:', error);
      // Valor por defecto simple
      setEstilosDisponibles([{ id: 4, nombre: "Polo" }]);
    })
    .finally(() => {
      setLoadingEstilos(false);
    });
  }, []);

  // Efecto para cargar datos cuando cambia el estilo seleccionado
  useEffect(() => {
    fetchPrendasData(selectedEstilo);
  }, [selectedEstilo]);

  // Preparar datos para el gráfico de manera simplificada
  const prepareChartData = () => {
    if (prendasData.length === 0) return { categories: [], data: [] };

    // Ordenar por código de sexo
    const sortedData = [...prendasData].sort((a, b) => 
      (a.code_Sexo > b.code_Sexo) ? 1 : -1
    );

    // Categorías y datos para el gráfico
    const categories = sortedData.map(item => sexoMapping[item.code_Sexo] || item.code_Sexo);
    const data = sortedData.map(item => item.prendasSumatoria);

    return { categories, data };
  };

  const { categories, data } = prepareChartData();

  // Total de prendas
  const totalPrendas = data.reduce((sum, val) => sum + val, 0);

  // Colores para las barras según el código de sexo
  const getColors = () => {
    const colorMap = {
      'Masculino': primary,
      'Femenino': secondary,
      'Unisex': info
    };

    return categories.map(cat => colorMap[cat] || warning);
  };

  // Configuración del gráfico
  const optionsBarChart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 250,
    },
    colors: getColors(),
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toLocaleString('es-HN');
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
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
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function(val) {
          return val.toLocaleString('es-HN') + ' unidades';
        }
      }
    },
  };

  const seriesBarChart = [
    {
      name: 'Prendas Pedidas',
      data: data,
    },
  ];

  // Obtener el nombre del estilo seleccionado
  const getEstiloNombre = (id) => {
    const estilo = estilosDisponibles.find(e => e.id === id);
    return estilo ? estilo.nombre : 'Desconocido';
  };

  return (
    <DashboardCard 
      title="Prendas Pedidas por Género" 
      subtitle="Distribución por tipo"
      action={
        <IconShirt 
          color={theme.palette.primary.main} 
          style={{ fontSize: '18px' }} 
          width={18}
        />
      }
    >
      <Box mb={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="estilo-select-label">Estilo de Prenda</InputLabel>
          <Select
            labelId="estilo-select-label"
            id="estilo-select"
            value={selectedEstilo}
            label="Estilo de Prenda"
            onChange={(e) => setSelectedEstilo(e.target.value)}
            disabled={loading}
          >
            {estilosDisponibles.map((estilo) => (
              <MenuItem key={estilo.id} value={estilo.id}>
                {estilo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="250px">
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="250px">
          <IconAlertTriangle width={40} color={theme.palette.error.main} />
          <Typography variant="body1" color="error" mt={1}>
            Error al cargar los datos
          </Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="250px">
          <Typography variant="body1" color="textSecondary">
            No hay datos disponibles
          </Typography>
        </Box>
      ) : (
        <>
          <Chart
            options={optionsBarChart}
            series={seriesBarChart}
            type="bar"
            height="250px"
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Typography variant="subtitle2" fontWeight="600">
              Estilo: {getEstiloNombre(selectedEstilo)}
            </Typography>
            <Typography variant="subtitle2" fontWeight="600">
              Total: {totalPrendas.toLocaleString('es-HN')} unidades
            </Typography>
          </Stack>
        </>
      )}
    </DashboardCard>
  );
};

export default PrendasPedidasChart;
