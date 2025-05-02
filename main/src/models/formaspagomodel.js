import { t } from "i18next";

class FormaPagoModel {
    constructor(fopa_Descripcion) {
      this.fopa_Descripcion = fopa_Descripcion;
      this.usua_UsuarioCreacion = 1;
      this.fopa_FechaCreacion = new Date().toISOString();
      this.fopa_FechaModificacion = new Date().toISOString();
      this.usua_UsuarioModificacion = 1;
      this.usua_NombreCreacion = '';
      this.usua_NombreModificacion = '';



    }
  }
  
  export default FormaPagoModel;
  