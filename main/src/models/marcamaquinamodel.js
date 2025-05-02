class MarcaMaquinaModel {

    marq_Id = 0;
    marq_Nombre = "";

    marq_Estado = true;
    usua_UsuarioCreacion = 0;
    marq_FechaCreacion = new Date();
    usua_UsuarioModificacion = 0;
    marq_FechaModificacion = new Date();
    
    usua_UsuarioEliminacion = 0;
    marq_FechaEliminacion = new Date();

    usuarioCreacion = "";
    usuarioModificador = "";
    usuarioEliminacion = "";


     MarcaMaquinaModel(){

     }
    // constructor() {
        
    // }
  }
  
  export default MarcaMaquinaModel;
  