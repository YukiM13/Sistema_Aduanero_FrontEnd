import React from 'react';
import { Box, Grid } from '@mui/material';
import TopCards from '../../components/dashboards/modern/TopCards';
import RevenueUpdates from '../../components/dashboards/modern/RevenueUpdates';
import YearlyBreakup from '../../components/dashboards/modern/YearlyBreakup';
import MonthlyEarnings from '../../components/dashboards/modern/MonthlyEarnings';
import Customers from '../../components/dashboards/modern/Customers';
import Projects from '../../components/dashboards/modern/Projects';
import Social from '../../components/dashboards/modern/Social';
import SellingProducts from '../../components/dashboards/modern/SellingProducts';
import WeeklyStats from '../../components/dashboards/modern/WeeklyStats';
import TopPerformers from '../../components/dashboards/modern/TopPerformers';
import ClientesProductivosChart from '../../components/dashboards/modern/ClientesProductivosChart';
import ProductividadModulosChart from '../../components/dashboards/modern/ProductividadModulosChart';
import PrendasPedidasChart from '../../components/dashboards/modern/PrendasPedidasChart';
import Welcome from 'src/layouts/full/shared/welcome/Welcome';
import ImportacionesContadores from 'src/components/dashboards/modern/importaciones_contadores';
import OrcoMensual from 'src/components/dashboards/modern/OrdenCompraMensual';
import OrcoSemanal from 'src/components/dashboards/modern/OrdenCompraSemanal';
import OrdenesCharts from '../charts/OrdenesEntregadas';
import OrcoPorEstadi from 'src/components/dashboards/modern/OrdenCompraPorEstado';
import ImportacionesSemana from 'src/components/dashboards/modern/ImportacionesSemana';
import ImportacionesAnio from 'src/components/dashboards/modern/ImportacionesAnio';
import PaisesMasExportadores from 'src/components/dashboards/modern/PaisesMasExportadores';

const Modern = () => {
  if (localStorage.getItem('DataUsuario') === null) {
    window.location.href = '/auth/login';
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* column */}
        <Grid item sm={12} lg={12}>
          <ImportacionesContadores />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={8}>
          <RevenueUpdates />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={12}>
              <YearlyBreakup />
            </Grid>
            <Grid item xs={12} sm={6} lg={12}>
              <MonthlyEarnings />
            </Grid>
          </Grid>
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={6}>
          <OrcoMensual />
        </Grid>
        <Grid item xs={12} lg={6}>
          <OrcoSemanal />
        </Grid>
         <Grid item xs={12} lg={12}>
          <OrcoPorEstadi />
        </Grid>
         <Grid item xs={12} lg={6}>
          <ImportacionesSemana />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ImportacionesAnio />
        </Grid>
        <Grid item xs={12} lg={6}>
          <PaisesMasExportadores />
        </Grid>
        
        {/* column */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Customers />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Projects />
            </Grid>
            <Grid item xs={12}>
              <Social />
            </Grid>
          </Grid>
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          <SellingProducts />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          <PaisesMasExportadores />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={8}>
          <ClientesProductivosChart />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          <ProductividadModulosChart />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          <PrendasPedidasChart />
        </Grid>
        <Grid item xs={12} lg={8}>
          <TopPerformers />
        </Grid>
        <Grid item xs={12} lg={23}>
          <OrdenesCharts />
        </Grid>
      </Grid>
      {/* column */}
      <Welcome />
    </Box>
  );
};

export default Modern;
