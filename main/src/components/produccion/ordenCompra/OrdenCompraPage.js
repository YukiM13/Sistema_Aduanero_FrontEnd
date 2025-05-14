import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Card, CardContent, Typography } from '@mui/material';
import OrdenCompraDataGrid from './OrdenCompraDataGrid';

const BCrumb = [
  { title: 'Órdenes de Compra', to: '/ordencompra' },
  { title: 'Listado' },
];

const OrdenCompraPage = () => {
  return (
    <PageContainer title="Órdenes de Compra" description="Gestión de órdenes de compra">
      <Breadcrumb title="Órdenes de Compra" items={BCrumb} />
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom component="div">
            Gestión de Órdenes de Compra
          </Typography>
          <OrdenCompraDataGrid />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default OrdenCompraPage;