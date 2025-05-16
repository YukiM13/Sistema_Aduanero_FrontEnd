import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CardContent, 
  Chip, 
  Paper, 
  Stack, 
  Typography, 
  LinearProgress, 
  CircularProgress 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { IconBuildingFactory2, IconAlertTriangle } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';

const colores = ['primary', 'secondary', 'success', 'warning', 'info'];

const ProductividadModulosChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modulosData, setModulosData] = useState([]);
  
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;
  const warning = theme.palette.warning.main;
  const warninglight = theme.palette.warning.light;
  const info = theme.palette.info.main;
  const infolight = theme.palette.info.light;
  const borderColor = theme.palette.grey[100];
  
  // Fetch data from API - versión simplificada
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    
    setLoading(true);
    axios.get(`${apiUrl}/api/Graficas/ProductividadModulos`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      // Ordenar por porcentaje de producción (mayor a menor)
      const sortedData = response.data.data
        .sort((a, b) => parseFloat(b.porcentajeProduccion) - parseFloat(a.porcentajeProduccion));
      setModulosData(sortedData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error al obtener datos:', error);
      setError(true);
      setLoading(false);
    });
  }, []);

  // Obtener el color para el chip según el índice
  const getColorConfig = (index) => {
    const colorName = colores[index % colores.length];
    const colorMap = {
      'primary': { bg: primarylight, color: primary },
      'secondary': { bg: secondarylight, color: secondary },
      'success': { bg: successlight, color: success },
      'warning': { bg: warninglight, color: warning },
      'info': { bg: infolight, color: info }
    };
    
    return {
      colorName,
      ...colorMap[colorName]
    };
  };

  // Calcular el total de producción
  const totalProduccion = modulosData.reduce((total, modulo) => 
    total + modulo.totalProduccionDia, 0);

  return (
    <DashboardCard 
      title="Productividad por Módulos" 
      subtitle="Contribución por módulo"
      action={
        <IconBuildingFactory2 
          color={theme.palette.primary.main} 
          style={{ fontSize: '18px' }} 
          width={18}
        />
      }
    >
      {loading ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <Box p={0}>
          <Stack spacing={3}>
            {modulosData.map((modulo, i) => {
              const { colorName, bg, color } = getColorConfig(i);
              const porcentaje = parseFloat(modulo.porcentajeProduccion);
              
              return (
                <Box key={i} sx={{ mb: 1 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    mb={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {modulo.modu_Nombre}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Intl.NumberFormat('es-HN').format(modulo.totalProduccionDia)} u.
                      </Typography>
                    </Box>
                    <Chip
                      sx={{
                        backgroundColor: bg,
                        color: color,
                        borderRadius: '4px',
                        height: 24,
                        fontSize: '12px',
                        minWidth: 45,
                      }}
                      label={`${porcentaje}%`}
                      size="small"
                    />
                  </Stack>
                  <LinearProgress 
                    value={porcentaje} 
                    variant="determinate" 
                    color={colorName} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              );
            })}
          </Stack>

          <Box mt={3} pt={3} sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle1" fontWeight="600">
              Producción Total: {new Intl.NumberFormat('es-HN').format(totalProduccion)} unidades
            </Typography>
          </Box>
        </Box>
      )}
    </DashboardCard>
  );
};

export default ProductividadModulosChart;
