const SubCategoriaModel = {
  subc_Id: 0,
  subc_Descripcion: "",
  cate_Id: 0,
  cate_Descripcion: "",
  usua_UsuarioCreacion: 0,
  usuarioCreacionNombre: "",
  subc_FechaCreacion: new Date().toISOString(),
  usua_UsuarioModificacion: 0,
  usuarioModificacionNombre: "",
  subc_FechaModificacion: new Date().toISOString(),
  usua_UsuarioEliminacion: 0,
  usuarioEliminacionNombre: "",
  subc_FechaEliminacion: new Date().toISOString(),
  subc_Estado: true
};

export default SubCategoriaModel;
