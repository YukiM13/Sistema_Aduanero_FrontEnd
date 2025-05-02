const Proveedor = {
    prov_Id: 0,
    prov_NombreCompania: '',
    prov_NombreContacto: '',
    prov_Telefono: '',
    prov_CodigoPostal: '',
    prov_Ciudad: 0,
    ciud_Nombre: '',
    pvin_Id: 0,
    pvin_Nombre: '',
    pais_Nombre: '',
    pais_Codigo: '',
    pais_Id: 0,
    prov_DireccionExacta: '',
    prov_CorreoElectronico: '',
    prov_Fax: '',
    usuarioCreacionNombre: '',
    usua_UsuarioCreacion: 0,
    prov_FechaCreacion: new Date().toISOString(),
    usuarioModificadorNombre: '',
    usua_UsuarioModificacion: 0,
    prov_FechaModificacion: new Date().toISOString(),
    usuarioEliminacionNombre: null,
    usua_UsuarioEliminacion: null,
    prov_FechaEliminacion: null,
    prov_Estado: true
}

    
    export default Proveedor;