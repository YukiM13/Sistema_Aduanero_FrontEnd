import { uniqueId } from 'lodash';
import axios from 'axios';
import {
  IconPoint,
  IconUser,
  IconWorld,
  IconBuildingFactory2,
  IconPackgeExport,
  IconFileText,
  IconFileCertificate,
  IconHome,
  IconFileCode
} from '@tabler/icons';

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const localStorageData = localStorage.getItem('DataUsuario');
const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
const esAdmin = parsedData ? parsedData.usua_EsAdmin : false;
const roleId = parsedData ? parsedData.role_Id : null;

const obtenerPantallasPermitidas = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/RolesPorPantallas/DibujarMenu?role_Id=${roleId}`,
      {
        headers: {
          'XApiKey': apiKey,
        },
      }
    );

    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data.map(item => item.pant_Nombre);
    } else {
      console.error('Error al obtener los datos de las pantallas:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    return [];
  }
};

if (localStorage.getItem('DataUsuario') === null) {
  window.location.href = '/auth/login';
}

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Inicio',
    icon: IconHome,
    href: '/dashboards/modern',
  }
];

export const generarMenu = async () => {
  let nombresDePantalla = [];
  
  if (!esAdmin && roleId) {
    nombresDePantalla = await obtenerPantallasPermitidas();
  }

  if (esAdmin || nombresDePantalla.includes('Usuarios') || nombresDePantalla.includes('Roles')) {
    const acceso = {
      id: uniqueId(),
      title: 'Acceso',
      icon: IconUser,
      href: '/apps/blog/',
      children: []
    };
    
    if (esAdmin || nombresDePantalla.includes('Usuarios')) {
      acceso.children.push({
        id: uniqueId(),
        title: 'Usuarios',
        icon: IconPoint,
        href: '/usuarios/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Roles')) {
      acceso.children.push({
        id: uniqueId(),
        title: 'Roles',
        icon: IconPoint,
        href: '/roles/list',
        chipColor: 'secondary',
      });
    }
    
    if (acceso.children.length > 0) {
      Menuitems.push(acceso);
    }
  }
  
  if (esAdmin || 
      nombresDePantalla.some(nombre => [
        'Aldea', 'Cargos', 'Colonias', 'Ciudades', 'Estados Civiles',
        'Empleados', 'Oficinas', 'Oficio Profesiones', 'Formas de Envio',
        'Monedas', 'Paises', 'Provincias', 'Proveedores', 'Unidades de Medida'
      ].includes(nombre))) {
    
    const general = {
      id: uniqueId(),
      title: 'General',
      icon: IconWorld,
      href: '/apps/blog/',
      children: []
    };
    
    if (esAdmin || nombresDePantalla.includes('Aldea')) {
      general.children.push({
        id: uniqueId(),
        title: 'Aldea',
        icon: IconPoint,
        href: '/Aldeas/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Cargos')) {
      general.children.push({
        id: uniqueId(),
        title: 'Cargos',
        icon: IconPoint,
        href: '/cargos/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Colonias')) {
      general.children.push({
        id: uniqueId(),
        title: 'Colonias',
        icon: IconPoint,
        href: '/Colonias/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Ciudades')) {
      general.children.push({
        id: uniqueId(),
        title: 'Ciudades',
        icon: IconPoint,
        href: '/ciudades/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Estados Civiles')) {
      general.children.push({
        id: uniqueId(),
        title: 'Estados Civiles',
        icon: IconPoint,
        href: '/estadosciviles/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Empleados')) {
      general.children.push({
        id: uniqueId(),
        title: 'Empleados',
        icon: IconPoint,
        href: '/empleado/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Oficinas')) {
      general.children.push({
        id: uniqueId(),
        title: 'Oficinas',
        icon: IconPoint,
        href: '/oficinas/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Oficio Profesiones')) {
      general.children.push({
        id: uniqueId(),
        title: 'Oficio Profesiones',
        icon: IconPoint,
        href: '/oficioProfesiones/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Formas de Envio')) {
      general.children.push({
        id: uniqueId(),
        title: 'Formas de Envío',
        icon: IconPoint,
        href: '/formasenvio/list',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Monedas')) {
      general.children.push({
        id: uniqueId(),
        title: 'Monedas',
        icon: IconPoint,
        href: '/moneda/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Paises')) {
      general.children.push({
        id: uniqueId(),
        title: 'Paises',
        icon: IconPoint,
        href: '/paises/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Provincias')) {
      general.children.push({
        id: uniqueId(),
        title: 'Provincias',
        icon: IconPoint,
        href: '/provincias/list',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Proveedores')) {
      general.children.push({
        id: uniqueId(),
        title: 'Proveedores',
        icon: IconPoint,
        href: '/proveedores/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Unidades de Medida')) {
      general.children.push({
        id: uniqueId(),
        title: 'Unidades de Medida',
        icon: IconPoint,
        href: '/unidadesmedidas/list',
        chipColor: 'secondary',
      });
    }
    
    if (general.children.length > 0) {
      Menuitems.push(general);
    }
  }
  
  if (esAdmin || 
      nombresDePantalla.some(nombre => [
        'Aduanas', 'Personas', 'Persona Natural', 'Persona Juridica', 
        'Concepto de Pago', 'Impresion Duca', 'Formas de Pago',
        'Comerciante Individual', 'Niveles Comerciales', 'Impresion Declaracion de Valor',
        'Marcas', 'Modos de Transporte', 'Tipo de Identificacion', 'Tipo Intermediario'
      ].includes(nombre))) {
    
    const aduana = {
      id: uniqueId(),
      title: 'Aduanas',
      icon: IconPackgeExport,
      href: '/apps/blog/',
      children: []
    };
    
    if (esAdmin || nombresDePantalla.includes('Aduanas')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Aduanas',
        icon: IconPoint,
        href: '/aduanas/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Personas')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Personas',
        icon: IconPoint,
        href: '/personas/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Persona Natural')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Persona Natural',
        icon: IconPoint,
        href: '/PersonaNatural/PersonaNaturalForm',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Persona Juridica')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Persona Jurídica',
        icon: IconPoint,
        href: '/PersonaJuridica/PersonaJuridicaForm',
        chipColor: 'secondary',
      });
    }
    
     if (esAdmin || nombresDePantalla.includes('planificacion PO')) {
// Planificacion PO pendiente
      aduana.children.push({
        id: uniqueId(),
        title: 'Planificacion PO',
        icon: IconPoint,
        href: '/PlanificacionPO',
        chipColor: 'secondary',
      });
          }
  // Planificacion PO pendiente

    if (esAdmin || nombresDePantalla.includes('Concepto de Pago')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Concepto de Pago',
        icon: IconPoint,
        href: '/concepto-de-pago/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Formas de Pago')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Formas de Pago',
        icon: IconPoint,
        href: '/formasdepago/list',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Comerciante Individual')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Comerciante Individual',
        icon: IconPoint,
        href: '/comercianteindividual/create',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Niveles Comerciales')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Niveles Comerciales',
        icon: IconPoint,
        href: '/niveles-comerciales/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Marcas')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Marcas',
        icon: IconPoint,
        href: '/marcas/list',
        chipColor: 'primary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Modos de Transporte')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Modos de Transporte',
        icon: IconPoint,
        href: '/modotransporte/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Tipo de Identificacion')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Tipos de Identificacion',
        icon: IconPoint,
        href: '/tiposidentificacion/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Tipo Intermediario')) {
      aduana.children.push({
        id: uniqueId(),
        title: 'Tipo Intermediario',
        icon: IconPoint,
        href: '/tipointermediario/list',
        chipColor: 'secondary',
      });
    }
    
    if (aduana.children.length > 0) {
      Menuitems.push(aduana);
    }
  }
  
  if (esAdmin || 
      nombresDePantalla.some(nombre => [
        'Categorias', 'Marcas Maquinas', 'Tipo Embalaje', 
        'Tallas', 'Sub Categorias', 'Orden Compra', 'Pedido Orden'
      ].includes(nombre))) {
    
    const produccion = {
      id: uniqueId(),
      title: 'Produccion',
      icon: IconBuildingFactory2,
      href: '/apps/blog/',
      children: []
    };
    
    if (esAdmin || nombresDePantalla.includes('Categorias')) {
      produccion.children.push({
        id: uniqueId(),
        title: 'Categorias',
        icon: IconPoint,
        href: '/categorias/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Marcas Maquinas')) {
      produccion.children.push({
        id: uniqueId(),
        title: 'Marcas Maquinas',
        icon: IconPoint,
        href: '/marcasmaquinas/list',
        chipColor: 'primary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Tipo Embalaje')) {
      produccion.children.push({
        id: uniqueId(),
        title: 'Tipo Embalaje',
        icon: IconPoint,
        href: '/tipoembalaje/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Tallas')) {
      produccion.children.push({
        id: uniqueId(),
        title: 'Tallas',
        icon: IconPoint,
        href: '/tallas/list',
        chipColor: 'primary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Sub Categorias')) {
      produccion.children.push({
        id: uniqueId(),
        title: 'Sub Categorias',
        icon: IconPoint,
        href: '/subCategorias/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Orden Compra')) {
      produccion.children.push({
        id: uniqueId(),
        title: 'Orden de Compra',
        icon: IconPoint,
        href: '/ordenCompra',
        chipColor: 'secondary',
      });
    }

    if (esAdmin || nombresDePantalla.includes('Pedido Orden')) {
      produccion.children.push({
        id: uniqueId(),
        title: 'Pedido Orden',
        icon: IconPoint,
        href: '/pedidoOrden',
        chipColor: 'secondary',
      });
    }
    
    if (produccion.children.length > 0) {
      Menuitems.push(produccion);
    }
  }

  if (esAdmin || 
    nombresDePantalla.some(nombre => [
      'Impresion Declaracion de Valor', 'Impresion Duca', 'Impresion Devas Pendientes'
    ].includes(nombre))) {
    
    const impresion = {
      id: uniqueId(),
      title: 'Reportes',
      icon: IconFileText,
      href: '/apps/blog/',
      children: []
    };

    if (esAdmin || nombresDePantalla.includes('Impresion Declaracion de Valor')) {
      impresion.children.push({
        id: uniqueId(),
        title: 'I. Declaracion de Valor',
        icon: IconPoint,
        href: '/declaracionValor/list',
        chipColor: 'secondary',
      });
    }

    if (esAdmin || nombresDePantalla.includes('Impresion Duca')) {
      impresion.children.push({
        id: uniqueId(),
        title: 'I. Duca',
        icon: IconPoint,
        href: '/ducas/list',
        chipColor: 'secondary',
      });
    }

    if (esAdmin || nombresDePantalla.includes('Impresion Devas Pendientes')) {
      impresion.children.push({
        id: uniqueId(),
        title: 'Devas Pendientes',
        icon: IconPoint,
        href: '/devaspendientes/list',
        chipColor: 'secondary',
      });
    }
    
    if (esAdmin || nombresDePantalla.includes('Costos Materiales No Brindados')) {
      impresion.children.push({
        id: uniqueId(),
        title: 'III. Costos Materiales No Brindados',
        icon: IconPoint,
        href: '/CostosMaterialesNoBrindados',
        chipColor: 'secondary',
      });
    }

    if (esAdmin || nombresDePantalla.includes('I. Materiales Ingresos')) {
      impresion.children.push({
        id: uniqueId(),
        title: 'I. Materiales Ingresos',
        icon: IconPoint,
        href: '/MaterialesIngresos',
        chipColor: 'secondary',
      });
    }

    if (esAdmin || nombresDePantalla.includes('I. Produccion Areas')) {
      impresion.children.push({
        id: uniqueId(),
        title: 'I. Produccion Areas',
        icon: IconPoint,
        href: '/ProduccionAreas',
        chipColor: 'secondary',
      });
    }

    if (impresion.children.length > 0) {
      Menuitems.push(impresion);
    }
  }
  
//deb
  if (esAdmin || nombresDePantalla.includes('Declaracion de Valor')) {
    Menuitems.push({
      id: uniqueId(),
      title: 'Declaración de valor',
      icon: IconFileCode,
      href: '/declaracion-de-valor',
      chipColor: 'secondary',
    });
  }
  //deb

  if (esAdmin || nombresDePantalla.includes('Ducas')) {
    Menuitems.push({
      id: uniqueId(),
      title: 'Ducas',
      icon: IconFileCertificate,
      href: '/duca',
      chipColor: 'secondary',
    });
  }
  
  return Menuitems;
};

export default Menuitems;