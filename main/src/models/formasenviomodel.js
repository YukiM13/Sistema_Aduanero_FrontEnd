class FormaEnvioModel {
  constructor(descripcion = '', codigo = '') {
    this.foen_Id = 0;
    this.foen_Codigo = codigo;  // Se agrega el código al modelo
    this.foen_Descripcion = descripcion;
    this.usua_usuarioCreacion = 1; // Aquí irá la sesión UwU.
    this.usuarioCreacionNombre = '';
    this.foen_fechaCreacion = new Date().toISOString();
    this.usua_usuarioModificacion = 1; // Aquí irá la sesión UwU.
    this.usuarioModificacionNombre = '';
    this.foen_fechaModificacion = new Date().toISOString();
    this.foen_Estado = true;
  }
}

export default FormaEnvioModel;
