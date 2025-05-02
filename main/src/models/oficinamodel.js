const OficinaModel = {
  ofic_Id: 0,
  ofic_Nombre: "",
  usua_UsuarioCreacion: 0,
  usuarioCreacionNombre: "",
  ofic_FechaCreacion: new Date().toISOString(),
  usua_UsuarioModificacion: 0,
  usuarioModificacionNombre: "",
  ofic_FechaModificacion: new Date().toISOString(),
  usua_UsuarioEliminacion: 0,
  usuarioEliminacionNombre: "",
  ofic_FechaEliminacion: new Date().toISOString(),
  ofic_Estado: true
};

export default OficinaModel;
