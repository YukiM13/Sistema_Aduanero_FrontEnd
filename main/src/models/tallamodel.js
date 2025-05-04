class TallaModel {

    talla_Id = 0;
    talla_Codigo = "";
    talla_Nombre = "";

    talla_Estado = true;
    usua_UsuarioCreacion = 0;
    talla_FechaCreacion = new Date();
    usua_UsuarioModificacion = 0;
    talla_FechaModificacion = new Date();
    
    usua_UsuarioEliminacion = 0;
    talla_FechaEliminacion = new Date();

    usuarioCreacion = "";
    usuarioModificacion = "";
    usuarioEliminacion = "";


     TallaModel(){

     }
    // constructor() {
        
    // }
  }
  
  export default TallaModel;
  