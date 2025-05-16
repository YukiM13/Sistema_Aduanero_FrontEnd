import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataGrid, { 
  Column, 
  MasterDetail, 
  Paging, 
  Pager,
  FilterRow,
  HeaderFilter,
  SearchPanel,
  Export,
  Editing
} from 'devextreme-react/data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import 'devextreme/dist/css/dx.light.css';
import OrdenCompraDetallesCreateComponent from '../ordenCompraDetalle/OrdenCompraDetalleCreate';

const OrdenCompraDataGrid = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [ordenCompraSeleccionada, setOrdenCompraSeleccionada] = useState(null);
  const [isCreatingDetalle, setIsCreatingDetalle] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    listarOrdenesCompra();
  }, []);

  const listarOrdenesCompra = () => {
    axios.get(`${apiUrl}/api/OrdenCompra/Listar`, {
      headers: {
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        console.log("Órdenes de compra cargadas:", response.data.data);
        setOrdenesCompra(response.data.data);
      }
    })
    .catch(error => {
      console.error("Error al cargar órdenes de compra:", error);
    });
  };

  const listarDetallesOrdenCompra = (ordenCompraId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${apiUrl}/api/OrdenCompraDetalles/Listar?orco_Id=${ordenCompraId}`, {
        headers: {
          'XApiKey': apiKey
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          resolve(response.data.data);
        } else {
          resolve([]);
        }
      })
      .catch(error => {
        console.error(`Error al cargar detalles de la orden ${ordenCompraId}:`, error);
        reject(error);
      });
    });
  };

  const handleAgregarDetalle = (ordenCompraId) => {
    setOrdenCompraSeleccionada(ordenCompraId);
    setIsCreatingDetalle(true);
  };

  const handleGuardadoExitoso = () => {
    setIsCreatingDetalle(false);
    // Recargar los detalles si es necesario
    listarOrdenesCompra();
  };

  const handleCancelarCreacion = () => {
    setIsCreatingDetalle(false);
  };

  // Componente para renderizar los detalles de una orden de compra
  const DetalleOrdenCompra = (props) => {
    const { data: { data: ordenCompra } } = props;
    const [detalles, setDetalles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      setIsLoading(true);
      listarDetallesOrdenCompra(ordenCompra.orco_Id)
        .then(detallesData => {
          setDetalles(detallesData);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }, [ordenCompra.orco_Id]);

    return (
      <div className="master-detail-caption">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <h4>Detalles de la Orden de Compra #{ordenCompra.orco_Id}</h4>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleAgregarDetalle(ordenCompra.orco_Id)}
          >
            Agregar Detalle
          </Button>
        </div>
        
        <DataGrid
          dataSource={detalles}
          showBorders={true}
          columnAutoWidth={true}
          showColumnLines={true}
          showRowLines={true}
          rowAlternationEnabled={true}
          hoverStateEnabled={true}
          className="styled-grid"
          loadPanel={{ enabled: isLoading }}
        >
          <Paging defaultPageSize={5} />
          <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          
          <Column dataField="code_Id" caption="ID" width={70} />
          <Column dataField="orco_Id" caption="Cantidad" />
          <Column dataField="code_CantidadPrenda" caption="Cantidad" />
          <Column dataField="esti_Descripcion" caption="Estilo" />
          <Column dataField="tall_Descripcion" caption="Talla" />
          <Column dataField="code_Sexo" caption="Sexo" />
          <Column dataField="colr_Nombre" caption="Color" />
          <Column dataField="code_Valor" caption="Valor" />
          <Column dataField="code_Impuesto" caption="Impuesto" />
          <Column dataField="code_EspecificacionEmbalaje" caption="Embalaje" />
          <Column dataField="code_FechaProcActual" caption="Fecha Proc. Actual" dataType="date" format="dd/MM/yyyy" />
          
          <Editing
            mode="row"
            allowUpdating={true}
            allowDeleting={true}
          />
        </DataGrid>
      </div>
    );
  };

  return (
    <div>

      {isCreatingDetalle ? (
        <OrdenCompraDetallesCreateComponent 
          ordenCompraId={ordenCompraSeleccionada}
          onCancelar={handleCancelarCreacion}
          onGuardadoExitoso={handleGuardadoExitoso}
        />
      ) : (
        <DataGrid
          dataSource={ordenesCompra}
          showBorders={true}
          columnAutoWidth={true}
          showColumnLines={true}
          showRowLines={true}
          rowAlternationEnabled={true}
          hoverStateEnabled={true}
        >
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} width={250} placeholder="Buscar..." />
          <Export enabled={true} fileName="OrdenesCompra" allowExportSelectedData={true} />
          
          <Column dataField="orco_Id" caption="ID" width={70} />
          <Column dataField="orco_Codigo" caption="Código" />
          <Column dataField="orco_FechaEmision" caption="Fecha Emisión" dataType="date" format="dd/MM/yyyy" />
          <Column dataField="orco_FechaLimite" caption="Fecha Límite" dataType="date" format="dd/MM/yyyy" />
          <Column dataField="orco_MetodoPago" caption="Método Pago" />
          <Column
            dataField="orco_Materiales"
            caption="Materiales"
            cellRender={({ value }) => (value ? 'Sí' : 'No')}
          />
          <Column dataField="code_EspecificacionEmbalaje" caption="Embalaje" />
          <Column dataField="orco_Estado" caption="Estado" />
          
          <MasterDetail
            enabled={true}
            component={DetalleOrdenCompra}
          />
          
          <Editing
            mode="row"
            allowUpdating={true}
            allowDeleting={true}
          />
        </DataGrid>
      )}
    </div>

  );

};

export default OrdenCompraDataGrid;