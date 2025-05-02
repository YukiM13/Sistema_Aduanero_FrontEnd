class EstadoCivilModel {
  constructor(nombre = '') {
    this.escv_Id = 0;
    this.escv_Nombre = nombre;
    this.escv_FechaCreacion = new Date().toISOString();
    this.escv_EsAduana = true;
    this.usua_UsuarioCreacion = 1; // Aquí irá la sesión UwU.
    this.usua_UsuarioEliminacion= 1; // Aquí irá la sesión UwU.
    this.escv_FechaEliminacion= new Date().toISOString();
    this.usua_UsuarioModificacion= 1; // Aquí irá la sesión UwU.
    this.escv_FechaModificacion= new Date().toISOString();
    //usuarioCreacionNombre
    //usuarioModificacionNombre
    //usuarioEliminacionNombre
  }
}

export default EstadoCivilModel;
