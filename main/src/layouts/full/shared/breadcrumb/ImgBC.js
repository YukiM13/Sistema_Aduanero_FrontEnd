import React from 'react';
import UsuarioImg from 'src/assets/images/imagenes/imgsBreadcrumb/usuarios.png';
import RolesImg from 'src/assets/images/imagenes/imgsBreadcrumb/roles.png';
import AldeaImg from 'src/assets/images/imagenes/imgsBreadcrumb/aldea.png';
import CargoImg from 'src/assets/images/imagenes/imgsBreadcrumb/cargos.png';
import EstadoCivilImg from 'src/assets/images/imagenes/imgsBreadcrumb/estadosciviles.png';
import EmpleadoImg from 'src/assets/images/imagenes/imgsBreadcrumb/empleados.png';
import OficinasImg from 'src/assets/images/imagenes/imgsBreadcrumb/oficinas.png';
import OficiosPofesionesImg from 'src/assets/images/imagenes/imgsBreadcrumb/oficiosprofesionales.png';
import FormasDeEnvios from 'src/assets/images/imagenes/imgsBreadcrumb/formasdeenvio.png';
import MonedasImg from 'src/assets/images/imagenes/imgsBreadcrumb/monedas.png';
import PaisesImg from 'src/assets/images/imagenes/imgsBreadcrumb/paises.png';
import ProveedoresImg from 'src/assets/images/imagenes/imgsBreadcrumb/proveedores.png';
import UnidadesMedidasImg from 'src/assets/images/imagenes/imgsBreadcrumb/unidadesmedidas.png';
import ConceptoDePago from 'src/assets/images/imagenes/imgsBreadcrumb/conceptodepago.png';
import Marcas from 'src/assets/images/imagenes/imgsBreadcrumb/marcas.png';
import Reporte from 'src/assets/images/imagenes/imgsBreadcrumb/reportes.png';
import DefaultImage from 'src/assets/images/breadcrumb/breadcrumb.png';

const ImgBC = () => {
    const currentPath = window.location.pathname;

    const imageMap = {
        '/usuarios/list': UsuarioImg,
        '/roles/list': RolesImg,

        '/Aldeas/list': AldeaImg,
        '/cargos/list': CargoImg,
        '/Colonias/list': AldeaImg,
        '/ciudades/list': AldeaImg,
        '/estadosciviles/list': EstadoCivilImg,
        '/empleado/list': EmpleadoImg,
        '/oficinas/list': OficinasImg,
        '/oficioProfesiones/list': OficiosPofesionesImg,
        '/formasenvio/list': FormasDeEnvios,
        '/moneda/list': MonedasImg,
        '/paises/list': PaisesImg,
        '/provincias/list': PaisesImg,
        '/proveedores/list': ProveedoresImg,
        '/unidadesmedidas/list': UnidadesMedidasImg,
        '/aduanas/list': EmpleadoImg,
        '/personas/list': CargoImg,
        '/PersonaNatural/PersonaNaturalForm': CargoImg,
        '/PersonaJuridica/PersonaJuridicaForm': CargoImg,
        '/concepto-de-pago/list': ConceptoDePago,
        '/formasdepago/list': ConceptoDePago,
        '/niveles-comerciales/list': ConceptoDePago,
        '/marcas/list': Marcas,
        '/modotransporte/list': FormasDeEnvios,
        '/tiposidentificacion/list': CargoImg,
        '/tipointermediario/list': CargoImg,
        '/categorias/list': FormasDeEnvios,
        '/marcasmaquinas/list': ProveedoresImg,
        '/tipoembalaje/list': FormasDeEnvios,
        '/tallas/list': UnidadesMedidasImg,
        '/subCategorias/list': FormasDeEnvios,
        '/ordenCompra': ProveedoresImg,
        '/pedidoOrden': ProveedoresImg,

    };

    const breadcrumbImage = imageMap[currentPath] || DefaultImage;

    return (
        <div>
            <img src={breadcrumbImage} alt="Breadcrumb" style={{ width: '90%', height: 'auto' }} />
        </div>
    );
};

export default ImgBC;