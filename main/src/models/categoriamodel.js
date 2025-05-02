const CategoriaModel = {
  cate_Id: 0,
  cate_Descripcion: "",
  usua_UsuarioCreacion: 0,
  usuarioCreacionNombre: "",
  cate_FechaCreacion: new Date().toISOString(),
  usua_UsuarioModificacion: 0,
  usuarioModificacionNombre: "",
  cate_FechaModificacion: new Date().toISOString(),
  usua_UsuarioEliminacion: 0,
  usuarioEliminacionNombre: "",
  cate_FechaEliminacion: new Date().toISOString(),
  cate_Estado: true
};

export default CategoriaModel;
