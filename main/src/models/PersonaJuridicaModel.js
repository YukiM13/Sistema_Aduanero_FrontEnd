const PersonaJuridica = {
    // Tab 1 - Datos generales
    peju_Id: 0,
    pers_Id: 0,
    pers_RTN: '',
    ofic_Id: 0,
    ofic_Nombre: '',
    escv_Id: 0,
    escv_Nombre: '',
    ofpr_Id: 0,
    ofpr_Nombre: '',

    // Tab 2 - Ubicación de la empresa
    colo_Id: 0,
    ColiniaEmpresa: '',
    ciud_Id: 0,
    CiudadEmpresa: '',
    alde_Id: 0,
    AldeaEmpresa: '',
    pvin_Id: 0,
    ProvinciaEmpresa: '',
    peju_PuntoReferencia: '',

    // Tab 3 - Ubicación del representante
    peju_ColoniaRepresentante: 0,
    ColoniaRepresentante: '',
    peju_CiudadIdRepresentante: 0,
    CiudadRepresentante: '',
    peju_AldeaIdRepresentante: 0,
    AldeaRepresentante: '',
    ProvinciaIdRepresentante: 0,
    ProvinciaRepresentante: '',
    peju_NumeroLocalRepresentante: '',
    peju_PuntoReferenciaRepresentante: '',

    // Tab 4 - Contacto
    peju_TelefonoEmpresa: '',
    peju_TelefonoFijoRepresentanteLegal: '',
    peju_TelefonoRepresentanteLegal: '',
    peju_CorreoElectronico: '',
    peju_CorreoElectronicoAlternativo: '',

    // Tab 5 - Documentación
    doco_URLImagen: '',
    doco_NombreImagen: '',
    doco_Numero_O_Referencia: '',
    doco_TipoDocumento: '',
    peju_ContratoFinalizado: false,
    peju_NumeroLocalApart: '',
    usua_UsuarioCreacion: 0,
    usuarioCreacionNombre: '',
    peju_FechaCreacion: '',

    usua_UsuarioModificacion: 0,
    usuarioModificaNombre: '',
    peju_FechaModificacion: '',
    peju_Estado: true,

    // Otros datos
    peju_CiudadRepresentanteNombre: '',
    peju_ColoniaRepresentanteNombre: '',
    peju_AldeaRepresentanteNombre: '',
    pers_Nombre: '',
    ciud_Nombre: '',
    colo_Nombre: '',
    alde_Nombre: '',
};

export default PersonaJuridica;