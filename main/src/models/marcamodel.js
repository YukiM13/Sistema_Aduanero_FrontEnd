class MarcaModel {

    marc_Id = 0;
    marc_Descripcion = "";

    marc_Estado = true;
    usua_UsuarioCreacion = 0;
    marc_FechaCreacion = new Date();
    usua_UsuarioModificacion = 0;
    marc_FechaModificacion = new Date();
    
    usua_UsuarioEliminacion = 0;
    marc_FechaEliminacion = new Date();

    usuarioCreacionNombre = "";
    usuarioModificacionNombre = "";
    usuarioEliminacionNombre = "";


    constructor() {
        
    }
  }
  
  export default MarcaModel;
  