const PedidoOrdenModel ={

    /* Encabezado */
      peor_Id: 0,
      peor_Codigo: '',
      prov_Id: 0,
      prov_NombreCompania: '',
      peor_finalizacion: true,
      ciud_Id: 0,
      ciud_Nombre: '',
      duca_No_Duca: '',
      peor_Impuestos: 0,
      peor_DireccionExacta: '',
      peor_FechaEntrada: new Date(),
      peor_Obsevaciones: '',
      usua_UsuarioCreacion: 0,
      peor_FechaCreacion: new Date(),
      usua_UsuarioModificacion: 0,
      peor_FechaModificacion: new Date(),
      peor_Estado: true,
      duca_Id: 0,
    //   pais_Id": 248,
    //   pais_Codigo": "HN",
    //   pais_Nombre": "HONDURAS",
    //   pvin_Id": 82,
    //   pvin_Codigo": "18",
    //   pvin_Nombre": "Yoro",
      //   total": 0,
    //   empl_Creador": "Angie Yahaira Campos Arias",
    //   lote_Stock": null,
    //   prov_Telefono": "+504 5874-5652",
    //   mate_Descripcion": null,
    //   mate_Id": null,
    //   prod_Precio": 0,
    //   prod_Cantidad": 0,
    //   prov_NombreContacto": "Javier Lopez",
    //   prov_Ciudad": 0,
    //   usuarioCreacionNombre": "angie",
    //   usuarioModificacionNombre": "angie",
    //   dadoCliente": "NO",
    //   detalles": null,
    //   fechaInicio": null,
    //   fechaFin": null


    /* Detalle */
    prod_Id: 0,
    pedi_Id: 0,
    mate_Id: 0,
    prod_Cantidad: 0,
    prod_Precio: 0,
    mate_Descripcion: '',
    usuarioCreacionNombre: '',
    prod_FechaCreacion: new Date(),
    usuarioModificacionNombre: '',
    prod_FechaModificacion: new Date(),
    prod_Estado: true
    // item_Id": null
  }
  
  export default PedidoOrdenModel;
  