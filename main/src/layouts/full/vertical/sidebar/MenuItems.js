import {
  IconPoint,
  IconUser,
  IconShoppingCart,
  IconWorld,
  IconBuildingFactory2,
  IconPackgeExport,

} from '@tabler/icons';
//import { id } from 'date-fns/locale';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'eCommerce',
    icon: IconShoppingCart,
    href: '/dashboards/ecommerce',
  },
 

 
  

  
  {
    id: uniqueId(),
    title: 'Acceso',
    icon: IconUser,
    href: '/apps/blog/',
    children: [
     
    ],
  },
  {
    id: uniqueId(),
    title: 'General',
    icon: IconWorld,
    href: '/apps/blog/',
    children: [
      {
        id: uniqueId(),
        title: 'Cargos',
        icon: IconPoint,
        href: '/cargos/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Ciudades',
        icon: IconPoint,
        href: '/ciudades/list',
         chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Estados Civiles',
        icon: IconPoint,
        href: '/estadosciviles/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Empleados',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/empleado/list',
      },

      {
        id: uniqueId(),
        title: 'Oficinas',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/oficinas/list',
      },
      {
        id: uniqueId(),
        title: 'Oficio Profesiones',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/oficioProfesiones/list',
      },
      {
        id: uniqueId(),
        title: 'Formas de Envío',
        icon: IconPoint,
        href: '/formasenvio/list',
      },
    
      {
        id: uniqueId(),
        title: 'Monedas',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/moneda/list',
      },
      {
        id: uniqueId(),
    
        title: 'Paises',
        icon: IconPoint,
        href: '/paises/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Provincias',
        icon: IconPoint,
        href: '/provincias/list',
      },
      {
        id: uniqueId(),
        title: 'Proveedores',
        icon: IconPoint,
        href: '/proveedores/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Unidades de Medida',
        icon: IconPoint,
        href: '/unidadesmedidas/list',
        chipColor: 'secondary',
      },

    ],
  },
  {
    id: uniqueId(),
    title: 'Aduanas',
    icon: IconPackgeExport,
    href: '/apps/blog/',
    children: [
      {
        id: uniqueId(),
        title: 'Aduanas',
        icon: IconPoint,
        href: '/aduanas/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Personas',
        icon: IconPoint,
        href: '/personas/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Concepto de Pago',
        icon: IconPoint,
        href: '/concepto-de-pago/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Duca',
        icon: IconPoint,
        href: '/duca',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Formas de Pago',
        icon: IconPoint,
        href: '/formasdepago/list',
      },
    
      {
        id: uniqueId(),
        title: 'Niveles Comerciales',
        icon: IconPoint,
        href: '/niveles-comerciales/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Marcas',
        icon: IconPoint,
        href: '/marcas/list',
        chipColor: 'primary',
      },
      {
        id: uniqueId(),
        title: 'Modos de Transporte',
        icon: IconPoint,
        href: '/modotransporte/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Tipos de Identificacion',
        icon: IconPoint,
        href: '/tiposidentificacion/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Tipo Intermediario',
        icon: IconPoint,
        href: '/tipointermediario/list',
        chipColor: 'secondary',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Produccion',
    icon: IconBuildingFactory2,
    href: '/apps/blog/',
    children: [
      {
        id: uniqueId(),
        title: 'Categorias',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/categorias/list',
      },
      {
        id: uniqueId(),
        title: 'Marcas Maquinas',
        icon: IconPoint,
        href: '/marcasmaquinas/list',
        chipColor: 'primary',
      },
      {
        id: uniqueId(),
        title: 'Tipo Embalaje',
        icon: IconPoint,
        href: '/tipoembalaje/list',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
    
        title: 'Tallas',
        icon: IconPoint,
        href: '/tallas/list',
        chipColor: 'primary',
      },
      {
        id: uniqueId(),
        title: 'Sub Categorias',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/subCategorias/list',
      },
      {
        id: uniqueId(),
        title: 'Orden Compra',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/ordenCompra',
      },
      {
        id: uniqueId(),
        title: 'Orden Compra Detalle',
        icon: IconPoint,
        chipColor: 'secondary',
        href: '/ordenCompraDetalle/list',
      },
     
    ],
  },
  
];

export default Menuitems;
