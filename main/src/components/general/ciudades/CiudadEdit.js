
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import Ciudad from 'src/models/ciudad';
// import { Snackbar, Alert } from '@mui/material';
// import {
//     Button,
//     Grid
//   } from '@mui/material';
//   import SaveIcon from '@mui/icons-material/Save';
//   import CancelIcon from '@mui/icons-material/Cancel';
// import CustomTextField from '../../forms/theme-elements/CustomTextField';
// import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

// const validationSchema = yup.object({
//   ciud_Nombre: yup.string().required('El nombre es requerido'),
//   pvin_Id: yup.number().required('La provincia es requerida')
//   .moreThan(0,'La provincia es requerida'),
// });


   
// const CiudadesEditComponent = ({ onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
//   const [provincias, setProvincias] = useState([]);
// const [openSnackbar, setOpenSnackbar] = useState(false); 
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const apiKey = process.env.REACT_APP_API_KEY;
//   const listarProvincias = () => {
//       axios.get(`${apiUrl}/api/Provincias/Listar?pvin_EsAduana=true`, {
//         headers: {
//           'XApiKey': apiKey
//         }
//       })
//       .then(response => {
//         if (response.data && Array.isArray(response.data.data)) {
//           setProvincias(response.data.data);
//         }
//       })
//       .catch(error => {
//         if (error.response) {
//           console.error("Respuesta con error de la API:", error.response.data);
//         } else if (error.request) {
//           console.error("No hubo respuesta de la API. Petición enviada:", error.request);
//         } else {
//           console.error("Error en la configuración de Axios:", error.message);
//         }
//       });
      
//   }  


//   const formik = useFormik({
        
//         initialValues: Ciudad,
//         validationSchema,
//         onSubmit: (values) => {

//             console.log("Enviando datos al backend:", values); 

//             if (Object.keys(formik.errors).length > 0) {
//                 setOpenSnackbar(true);
//                 return; // 👈 detiene el envío si hay errores
//               }

//         const datosParaEnviar = {
//             ciud_Id: values.ciud_Id,
//             ciud_Nombre: values.ciud_Nombre,
//             pvin_Id: values.pvin_Id,
//             ciud_esAduana: true,
//             usua_UsuarioCreacion: 1,
//             ciud_FechaCreacion: new Date()
//           };
          
//           console.log("Datos que se enviarán al backend:", datosParaEnviar);
          
//           axios.post(`${apiUrl}/api/Ciudades/Editar`, datosParaEnviar, {
//             headers: { 'XApiKey': apiKey }
//           })
//           .then(() => {
//             if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
//           })
//           .catch(error => {
//             console.error('Error al insertar la ciudad:', error);
//           });
          
//         },
//       });
//       useEffect(() => {
//         listarProvincias(); //Aca llamamos
    
//         if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
//           setOpenSnackbar(true);
//         }
//       }, [formik.errors, formik.submitCount]);
//     return (
//     <div>
      
      
//         <form onSubmit={formik.handleSubmit}>
//             <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}
                
//                 <Grid item lg={6} md={12} sm={12}>
                   
//                         <CustomFormLabel>Nombre</CustomFormLabel>
//                         <CustomTextField
//                             fullWidth
//                             id="ciud_Nombre"
//                             name="ciud_Nombre"
//                             type="text"
//                             value={formik.values.ciud_Nombre}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             error={formik.touched.ciud_Nombre && Boolean(formik.errors.ciud_Nombre)}
//                             helperText={formik.touched.ciud_Nombre && formik.errors.ciud_Nombre}
//                         />
                  
//                 </Grid>

//                 <Grid item lg={6} md={12} sm={12}>
                   
//                 <CustomFormLabel>Provincia</CustomFormLabel>
//                 <CustomTextField
//                   select
//                   fullWidth
//                   id="pvin_Id"
//                   name="pvin_Id"
//                   value={formik.values.pvin_Id}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.pvin_Id && Boolean(formik.errors.pvin_Id)}
//                   helperText={formik.touched.pvin_Id && formik.errors.pvin_Id}
//                 >
//                   {provincias.map((provincia) => (
//                     <MenuItem key={provincia.pvin_Id} value={provincia.pvin_Id}>
//                       {provincia.pvin_Nombre}
//                     </MenuItem>
//                   ))}
//                 </CustomTextField>
                  
//                 </Grid>


//             </Grid>
//             <Grid container justifyContent="flex-end" spacing={2} mt={2}>
//                 <Grid item>
//                     <Button variant="contained" color="error" onClick={onCancelar}
//                          startIcon={<CancelIcon />}
//                     >
//                     Cancelar
//                     </Button>
//                 </Grid>
//                 <Grid item>
//                     <Button variant="contained" type="submit"
//                          startIcon={<SaveIcon />}
//                     >
//                     Guardar
//                     </Button>
//                 </Grid>
//             </Grid>
           
//         </form >
//         <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000} // Duración de la alerta
//         onClose={() => setOpenSnackbar(false)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setOpenSnackbar(false)}
//           severity="error"
//           sx={{ width: '100%' }}
//         >
//           No puede haber campos vacios.
//         </Alert>
//       </Snackbar>                  

     
//     </div>
//   );
// };

// export default CiudadesEditComponent;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Snackbar, Alert } from '@mui/material';
import {
    Button,
    Grid,
    MenuItem

  } from '@mui/material';
  import SaveIcon from '@mui/icons-material/Save';
  import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const validationSchema = yup.object({
ciud_Nombre: yup.string().required('El nombre es requerido'),
  pvin_Id: yup.number().required('La provincia es requerida')
  .moreThan(0,'La provincia es requerida'),

});


   
const CiudadesEditComponent = ({ciudad, onCancelar, onGuardadoExitoso }) => { //esto es lo que manda para saber cuando cerrar el crear
  const [provincias, setProvincias] = useState([]);

const [openSnackbar, setOpenSnackbar] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const listarProvincias = () => {
          axios.get(`${apiUrl}/api/Provincias/Listar?pvin_EsAduana=true`, {
            headers: {
              'XApiKey': apiKey
            }
          })
          .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
              setProvincias(response.data.data);
            }
          })
          .catch(error => {
            if (error.response) {
              console.error("Respuesta con error de la API:", error.response.data);
            } else if (error.request) {
              console.error("No hubo respuesta de la API. Petición enviada:", error.request);
            } else {
              console.error("Error en la configuración de Axios:", error.message);
            }
          });
          
      }  
  
  const formik = useFormik({
        
        initialValues: ciudad,
        validationSchema,
        onSubmit: (values) => {
        //   values.pers_FechaModificacion = new Date();
        //   values.usua_UsuarioModificacion = 1;
        //   values.pers_RTN.replace(/\?/g, '');
        //   values.pers_FormaRepresentacion = Boolean(values.pers_FormaRepresentacion);
        //   console.log("Valores antes de enviar:", values);
        //   axios.post(`${apiUrl}/api/Ciudades/Editar`, values, {
        //     headers: { 'XApiKey': apiKey }
        //   })
        const datosParaEnviar = {
        ciud_Id: values.ciud_Id,
        ciud_Nombre: values.ciud_Nombre,
        pvin_Id: values.pvin_Id,
        ciud_esAduana: true,
        usua_UsuarioModificacion: 1,
        ciud_FechaModificacion: new Date()
        };
                  
        console.log("Datos que se enviarán al backend:", datosParaEnviar);
        
        axios.post(`${apiUrl}/api/Ciudades/Editar`, datosParaEnviar, {
        headers: { 
            'XApiKey': apiKey }
        })
        .then(() => {
            if (onGuardadoExitoso) onGuardadoExitoso(); // Solo se ejecuta al completarse correctamente
          })
          .catch(error => {
            console.error('Error al editar la ciudad:', error);
          });
          
        },
      });
      useEffect(() => {
        listarProvincias(); //Aca llamamos
    
        console.log("Provincias cargadas:", provincias);
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
      }, [formik.errors, formik.submitCount]);
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mb={3}>  {/* Esto es como el div con class row */}

                <Grid item lg={6} md={12} sm={12}>
                   
                        <CustomFormLabel>Nombre</CustomFormLabel>
                        <CustomTextField
                            fullWidth
                            id="ciud_Nombre"
                            name="ciud_Nombre"
                            type="text"
                            value={formik.values.ciud_Nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ciud_Nombre && Boolean(formik.errors.ciud_Nombre)}
                            helperText={formik.touched.ciud_Nombre && formik.errors.ciud_Nombre}
                        />
                  
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                   
                <CustomFormLabel>Provincia</CustomFormLabel>
                    <CustomTextField
                    select
                    fullWidth
                    id="pvin_Id"
                    name="pvin_Id"
                    value={formik.values.pvin_Id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pvin_Id && Boolean(formik.errors.pvin_Id)}
                    helperText={formik.touched.pvin_Id && formik.errors.pvin_Id}
                    >
                    {provincias.map((provincia) => (
                        <MenuItem key={provincia.pvin_Id} value={provincia.pvin_Id}>
                        {provincia.escv_Nombre}
                        </MenuItem>
                    ))}
                    </CustomTextField>
                    
                </Grid>

            </Grid>
            <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                <Grid item>
                    <Button variant="contained" color="error" onClick={onCancelar}
                         startIcon={<CancelIcon />}
                    >
                    Cancelar
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" type="submit"
                         startIcon={<SaveIcon />}
                    >
                    Guardar
                    </Button>
                </Grid>
            </Grid>
           
        </form >
        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Duración de la alerta
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          No puede haber campos vacios.
        </Alert>
      </Snackbar>                  

     
    </div>
  );
};

export default CiudadesEditComponent;
