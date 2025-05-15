import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Loadable from '../layouts/full/shared/loadable/Loadable';
import PersonaJuridica from 'src/models/PersonaJuridicaModel';
// import OrdenCompraDetallesCreateComponent from '../components/ordenCompraDetalle/OrdenCompraDetalleCreate';
import { es } from 'date-fns/locale';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));

/* ****Apps***** */
const Chats = Loadable(lazy(() => import('../views/apps/chat/Chat')));
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Calendar = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));
const Email = Loadable(lazy(() => import('../views/apps/email/Email')));
const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogPost')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts')));
const Ecommerce = Loadable(lazy(() => import('../views/apps/eCommerce/Ecommerce')));
const EcommerceDetail = Loadable(lazy(() => import('../views/apps/eCommerce/EcommerceDetail')));
const EcomProductList = Loadable(lazy(() => import('../views/apps/eCommerce/EcomProductList')));
const EcomProductCheckout = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceCheckout')),
);
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
const Followers = Loadable(lazy(() => import('../views/apps/user-profile/Followers')));
const Friends = Loadable(lazy(() => import('../views/apps/user-profile/Friends')));
const Gallery = Loadable(lazy(() => import('../views/apps/user-profile/Gallery')));

// Pages
const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL')));
const Treeview = Loadable(lazy(() => import('../views/pages/treeview/Treeview')));
const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(lazy(() => import('../views/pages/account-setting/AccountSetting')),
);
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq')));

// widget
const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards')));
const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners')));
const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts')));

// form elements
const MuiAutoComplete = Loadable(
  lazy(() => import('../views/forms/form-elements/MuiAutoComplete')),
);
const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton')));
const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox')));
const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio')));
const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider')));
const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime')));
const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch')));

// form layout
const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts')));
const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom')));
const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard')));
const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation')));
const QuillEditor = Loadable(lazy(() => import('../views/forms/quill-editor/QuillEditor')));
const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal')));
const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical')));

// tables
const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable')));
const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable')));
const EnhancedTable = Loadable(lazy(() => import('../views/tables/EnhancedTable')));
const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable')));
const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable')));
const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable')));

// chart
const LineChart = Loadable(lazy(() => import('../views/charts/LineChart')));
const GredientChart = Loadable(lazy(() => import('../views/charts/GredientChart')));
const DoughnutChart = Loadable(lazy(() => import('../views/charts/DoughnutChart')));
const AreaChart = Loadable(lazy(() => import('../views/charts/AreaChart')));
const ColumnChart = Loadable(lazy(() => import('../views/charts/ColumnChart')));
const CandlestickChart = Loadable(lazy(() => import('../views/charts/CandlestickChart')));
const RadialbarChart = Loadable(lazy(() => import('../views/charts/RadialbarChart')));





// Aduana

const DeclaracionValor = Loadable(lazy(() => import('../components/aduanas/declaracion-valor/declaracion-valor-impresion')));
const CostosMaterialesNoBrindados = Loadable(lazy(() => import('../components/aduanas/CostosMaterialesNoBrindados/CostosMaterialesNoBrindados-pdf')));

const Persona  = Loadable(lazy(() => import('../components/aduanas/personas/pers_List')));
const PersonaNatural = Loadable(lazy(() => import('../components/aduanas/PersonaNatural/PersonaNaturalForm')));
const PersonaJuridica2222 = Loadable(lazy(() => import('../components/aduanas/PersonaJuridica/PersonaJuridicaForm')));
const Aduana  = Loadable(lazy(() => import('../components/aduanas/aduanas/AduanasList')));
const FormasPago  = Loadable(lazy(() => import('../components/aduanas/FormasPago/FormasPagoList')));
const ConceptoDePago  = Loadable(lazy(() => import('../components/aduanas/concepto-de-pago/ConceptosDePagoList')));
const NivelComercial  = Loadable(lazy(() => import('../components/aduanas/niveles-comerciales/NivelesComercialesList')));
const Marcas = Loadable(lazy(() => import('../components/aduanas/marcas/MarcasList')));
const TipoIntermediario = Loadable(lazy(() => import('../components/aduanas/tipointermediario/tipointermediario')));
const ModoTransporte = Loadable(lazy(() => import('../components/aduanas/modoTransporte/ModoTransporte')));
const TiposIdentificacion = Loadable(lazy(() => import('../components/aduanas/tiposIdentificacion/TiposIdentificacion')));
const DevasPendientes = Loadable(lazy(() => import('../components/aduanas/devaspendientes/devaspendientes')));
const PlanificacionPO = Loadable(lazy(() => import('../components/aduanas/PlanificacionPO/PlanificacionPO-pdf')));


const Duca =  Loadable(lazy(() => import('../components/aduanas/duca/DucaContenedor')));
const DucasList =  Loadable(lazy(() => import('../components/aduanas/duca/DucaList')));
const DeclaracionDeValor =  Loadable(lazy(() => import('../components/aduanas/declaraciondevalor/DevaContenedor')));
const ComercianteIndividualCreate = Loadable(lazy(() => import('../components/aduanas/comercianteindividual/ComercianteIndividualCreate')));

// General
const Pais = Loadable(lazy(() => import('../components/general/paises/PaisesList')));
const Provincia = Loadable(lazy(() => import('../components/general/provincias/ProvinciasList')));
const ProvinciaCrear =  Loadable(lazy(() => import('../components/general/provincias/ProvinciasCreate')));
const Ciudad = Loadable(lazy(() => import('../components/general/ciudades/CiudadList')));
const Moneda = Loadable(lazy(() => import('../components/general/monedas/MonedasList')));
const UnidadesMedidas  = Loadable(lazy(() => import('../components/general/unidadesmedidas/unidadesmedidas')));
const EstadosCivilesList = Loadable(lazy(() => import('../components/general/estadosciviles/EstadosCivilesList')));
const Oficinas = Loadable(lazy(() => import('../components/general/oficinas/oficinasList')));
const Cargo = Loadable(lazy(() => import('../components/general/cargos/CargosList')));
const Empleado = Loadable(lazy(() => import('../components/general/empleados/EmpleadosList')));
const Proveedor = Loadable(lazy(() => import('../components/general/proveedores/ProveedoresList')));
const OficioProfesiones = Loadable(lazy(() => import('../components/general/oficioProfesion/OficioProfesionList')));
const EstadosCivilesCreate = Loadable(lazy(() => import('../components/general/estadosciviles/EstadosCivilesCreate')));
const CiudadCrear =  Loadable(lazy(() => import('../components/general/ciudades/CiudadCreate')));
const CiudadEditar =  Loadable(lazy(() => import('../components/general/ciudades/CiudadEdit')));
const FormasEnvioCreate = Loadable(lazy(() => import('../components/general/formasenvio/FormasEnvioCreate')));

const FormasEnvio = Loadable(lazy(() => import('../components/general/formasenvio/FormasEnvioList')));

const Aldea = Loadable(lazy(() => import('../components/general/aldeas/AldeasList')));

const Colonias = Loadable(lazy(() => import('../components/general/colonias/ColoniasList')));



// Acceso
const Usuarios = Loadable(lazy(() => import('../components/acceso/usuarios/UsuariosList')));
const Roles = Loadable(lazy(() => import('../components/acceso/roles/rolesList')));

// Produccion
const TipoEmbalaje  = Loadable(lazy(() => import('../components/produccion/tipoembalaje/tipoembalaje')));
const Categorias  = Loadable(lazy(() => import('../components/produccion/categorias/CategoriasList')));
const MarcasMaquinas = Loadable(lazy(() => import('../components/produccion/marcasMaquinas/marcasMaquinas')));
const Tallas = Loadable(lazy(() => import('../components/produccion/tallas/TallasList')));
const SubCategorias   = Loadable(lazy(() => import('../components/produccion/subCategorias/subCategoriasList')));
const OrdenCompraList =  Loadable(lazy(() => import('../components/produccion/ordenCompra/OrdenCompraListar')));
const OrdenCompraCrear = Loadable(lazy(() => import('../components/produccion/ordenCompra/OrdenCompraCrear')));
const OrdenCompraDetalleList =  Loadable(lazy(() => import('../components/produccion/ordenCompraDetalle/OrdenCompraDetalleList')));
const OrdenCompraDetalleCrear = Loadable(lazy(() => import('../components/produccion/ordenCompraDetalle/OrdenCompraDetalleCreate')));
const OrdenCompraDetalleEditar = Loadable(lazy(() => import('../components/produccion/ordenCompraDetalle/OrdenCompraDetalleEdit')));

const PedidoOrdenList =  Loadable(lazy(() => import('../components/produccion/pedidoOrden/PedidoOrdenList')));

// ui
const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert')));
const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion')));
const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar')));
const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip')));
const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog')));
const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList')));
const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover')));
const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating')));
const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs')));
const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip')));
const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList')));
const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));

const localStorageData = localStorage.getItem('PantallasPermitidas');
const pantallasPermitidas = localStorageData ? JSON.parse(localStorageData) : [];
const localStorageDatas = localStorage.getItem('DataUsuario');
const parsedData = localStorageDatas ? JSON.parse(localStorageDatas) : null;
const esAdmin = parsedData ? parsedData.usua_EsAdmin : false;

const todasLasRutas = [
  { path: '/dashboards/modern', element: <ModernDash/> },
  { path: '/usuarios/list', element: <Usuarios/>, pantalla:'Usuarios' },
  { path: '/roles/list', element: <Roles/>, pantalla:'Roles' },
  { path: '/aldeas/list', element: <Aldea/>, pantalla:'Aldea'  },
  { path: '/cargos/list', element: <Cargo/>, pantalla:'Cargos'  },
  { path: '/colonias/list', element: <Colonias/>, pantalla:'Colonias' },
  { path: '/ciudades/list', element: <Ciudad/>, pantalla:'Ciudades' },
  { path: '/estadosciviles/list', element: <EstadosCivilesList/>, pantalla:'Estados Civiles' },
  { path: '/empleado/list', element: <Empleado/>, pantalla:'Empleados' },
  { path: '/oficinas/list', element: <Oficinas/>, pantalla:'Oficinas' },
  { path: '/oficioProfesiones/list', element: <OficioProfesiones/>, pantalla:'Oficio Profesiones' },
  { path: '/formasenvio/list', element: <FormasEnvio/>, pantalla:'Formas de Envio' },
  { path: '/moneda/list', element: <Moneda/>, pantalla:'Monedas' },
  { path: '/paises/list', element: <Pais/>, pantalla:'Paises' },
  { path: '/provincias/list', element: <Provincia/>, pantalla:'Provincias' },
  { path: '/proveedores/list', element: <Proveedor/>, pantalla:'Proveedores' },
  { path: '/unidadesmedidas/list', element: <UnidadesMedidas/>, pantalla:'Unidades de Medida' },
  { path: '/aduanas/list', element: <Aduana/>, pantalla:'Aduanas' },
  { path: '/personas/list', element: <Persona/>, pantalla:'Personas' },
  { path: '/PersonaNatural/PersonaNaturalForm', element: <PersonaNatural/>, pantalla:'Persona Natural' },
  { path: '/PersonaJuridica/PersonaJuridicaForm', element: <PersonaJuridica2222/>, pantalla:'Persona Juridica' },
   { path: '/PlanificacionPO', element: <PlanificacionPO/>, pantalla:'Planificacion PO' },
  { path: '/concepto-de-pago/list', element: <ConceptoDePago/>, pantalla:'Concepto de Pago' },
  { path: '/formasdepago/list', element: <FormasPago/>, pantalla:'Formas de Pago' },
  { path: '/comercianteindividual/create', element: <ComercianteIndividualCreate/>, pantalla:'Comerciante Individual' },
  { path: '/niveles-comerciales/list', element: <NivelComercial/>, pantalla:'Niveles Comerciales' },
  { path: '/marcas/list', element: <Marcas/>, pantalla:'Marcas' },
  { path: '/modotransporte/list', element: <ModoTransporte/>, pantalla:'Modo Transporte' },
  { path: '/tiposidentificacion/list', element: <TiposIdentificacion/>, pantalla:'Tipos de Identificacion' },
  { path: '/tipointermediario/list', element: <TipoIntermediario/>, pantalla:'Tipo Intermediario' },
  { path: '/categorias/list', element: <Categorias/>, pantalla:'Categorias' },
  { path: '/marcasmaquinas/list', element: <MarcasMaquinas/>, pantalla:'Marcas Maquinas' },
  { path: '/tipoembalaje/list', element: <TipoEmbalaje/>, pantalla:'Tipo Embalaje' },
  { path: '/tallas/list', element: <Tallas/>, pantalla:'Tallas' },
  { path: '/subCategorias/list', element: <SubCategorias/>, pantalla:'Sub Categorias' },
  { path: '/ordenCompra', element: <OrdenCompraList/>, pantalla:'Orden Compra' },
  { path: '/declaracionValor/list', element: <DeclaracionValor/>, pantalla:'Impresion Declaracion de Valor' },
  { path: '/ducas/list', element: <DucasList/>, pantalla:'Ducas' },
  { path: '/declaracion-de-valor', element: <DeclaracionDeValor/>, pantalla:'Declaracion de Valor' },
  { path: '/duca', element: <Duca/>, pantalla:'Impresion Duca' },
  { path: '/devaspendientes/list', element: <DevasPendientes/>, pantalla:'Devas Pendientes'},
  { path: '/pedidoOrden', element: <PedidoOrdenList  /> , pantalla:'Pedido Orden' },
  { path: '/CostosMaterialesNoBrindados', element: <CostosMaterialesNoBrindados/>, pantalla:'Costos Materiales No Brindados'},
]

const rutasFiltradas = todasLasRutas.filter((ruta) =>
  esAdmin || pantallasPermitidas.includes(ruta.pantalla) || ruta.path === '/dashboards/modern'
);

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboards/modern" /> },
        { path: '/user-profile', element: <UserProfile /> },
      ...rutasFiltradas.map((ruta) => ({
        ...ruta,
        element: <PrivateRoute>{ruta.element}</PrivateRoute>,
      })),
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;