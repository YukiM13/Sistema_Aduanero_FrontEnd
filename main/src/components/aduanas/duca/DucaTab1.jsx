
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import itemDevaPorDucaModel from 'src/models/itemDevaPorDucaModel';
import { Snackbar, Alert } from '@mui/material';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Checkbox
    

  } from '@mui/material';
  import  'src/layouts/config/StylePhone.css';
  import 'react-intl-tel-input/dist/main.css';



const validationSchema = yup.object({
    seleccionados: yup.array().required('La declaracion de valores es requerida'),
    
  
});


   
const DucaTab1Component = forwardRef(({ onCancelar, onGuardadoExitoso }, ref) => { //esto es lo que manda para saber cuando cerrar el crear
const [deva, setDeva] = useState([]);

const [openSnackbar, setOpenSnackbar] = useState(false); 
const itemPorDuca =  itemDevaPorDucaModel;
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  
  const listarDevas = () => {
    axios.get(`${apiUrl}/api/Duca/ListaDevaNoDuca`, {
        headers: {
            'XApiKey': apiKey
        }

    })
    .then(response => {
        
        console.log("Devas", response.data.data)
        localStorage.setItem('Devas',JSON.stringify(response.data.data));
    })
    .catch(error => {
        console.error('Error al obtener los datos del país:', error);
    });
} 




  const formik = useFormik({
        
        initialValues: {
            seleccionados: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
              // Paso 1: Obtener el ID de la DUCA si no existe aún
              if (localStorage.getItem('ducaId') == null) {
                const response = await axios.post(`${apiUrl}/api/Duca/PreInsertar`, null, {
                  headers: {
                    'XApiKey': apiKey
                  }
                });
                const ducaId = response.data.data.messageStatus;
                console.log("ID de la DUCA:", ducaId);
                localStorage.setItem('ducaId', ducaId);
              }
              if(localStorage.getItem('devaDuca'))
              {
                  axios.post(`${apiUrl}/api/ItemsDEVAxDUCA/LiberarDevasPorDucaId?duca_Id=${parseInt(localStorage.getItem('ducaId'))}`,null, {
                    headers: {
                      'XApiKey': apiKey
                    } 
                  })
                  .then(response => {
                    console.log(response.data.data)
                  })
                  
              }
              itemPorDuca.usua_UsuarioCreacion = 1;
              itemPorDuca.duca_Id = parseInt(localStorage.getItem('ducaId'));
          
              let todosExitosos = true;
              localStorage.setItem('devaDuca', JSON.stringify(values.seleccionados))
              console.log('arreglo en localstorage', localStorage.getItem('devaDuca'));
              for (let item of values.seleccionados) {
                itemPorDuca.deva_Id = item.deva_Id;
                
                const response = await axios.post(`${apiUrl}/api/ItemsDEVAxDUCA/Insertar`, itemPorDuca, {
                  headers: {
                    'XApiKey': apiKey
                  }
                });
          
                if (response.data.data.messageStatus !== '1') {
                  todosExitosos = false;
                  console.error(`Error al insertar el item ${item}:`, response.data.data);
                  break; // detén el bucle si hay error
                }
              }
          
              if (todosExitosos) {
                localStorage.removeItem('Devas');
                if (onGuardadoExitoso) onGuardadoExitoso();
              } else {
                setOpenSnackbar(true);
              }
          
            } catch (error) {
              console.error('Error en la operación:', error);
              setOpenSnackbar(true);
            }
        }
  });
    
      // Expone el método 'submit' al padre
      useImperativeHandle(ref, () => ({
        async submit() {
          const errors = await formik.validateForm();
          if (Object.keys(errors).length === 0) {
            try {
              await formik.submitForm(); // Espera a que termine el submit real
              return true;
            } catch (e) {
              return false;
            }
          } else {
            formik.setTouched(
              Object.keys(errors).reduce((acc, key) => {
                acc[key] = true;
                return acc;
              }, {}),
              true
            );
            setOpenSnackbar(true); // Esto es tu alerta
            return false;
          }
        },
      }));
      useEffect(() => {
        listarDevas();
        const cargarDevas =  () => {
            const localDevas = localStorage.getItem('devaDuca') ;
            
            console.log(localStorage.getItem('Devas'));
            if (localDevas && localStorage.getItem('Devas')) {
             const parsedLocal = JSON.parse(localDevas);
             const devasDesdeApi = JSON.parse(localStorage.getItem('Devas'));
            console.log(devasDesdeApi);
             const nuevos = devasDesdeApi.filter(apiDeva =>
              !parsedLocal.some(localDeva => localDeva.deva_Id === apiDeva.deva_Id)
             );
          
             const combinado = [...parsedLocal, ...nuevos];
             setDeva(combinado);
             formik.setFieldValue('seleccionados', parsedLocal);
            } else if(localDevas)
            {
              const parsedLocal = JSON.parse(localDevas);
              setDeva(parsedLocal);
             formik.setFieldValue('seleccionados', parsedLocal);
            }
            else if (localStorage.getItem('Devas')) {
              const devasDesdeApi = JSON.parse(localStorage.getItem('Devas'));
             setDeva(devasDesdeApi);
            }
            else {
              setDeva([]);
            }
           };
          
          cargarDevas();
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
          setOpenSnackbar(true);
        }
        
        
      }, [formik.errors, formik.submitCount]);
      
      
    

      const handleSeleccion = (item) => {
         const current = formik.values.seleccionados;
         const exists = current.some(i => i.deva_Id === item.deva_Id);
         const updated = exists
          ? current.filter(i => i.deva_Id !== item.deva_Id)
          : [...current, item];
        
         formik.setFieldValue('seleccionados', updated);
        };
    useEffect(() => {
        console.log("IDs seleccionados:", formik.values.seleccionados);
      }, [formik.values.seleccionados]);
    return (
    <div>
      
      
        <form onSubmit={formik.handleSubmit}>
           
        <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Seleccionar</TableCell>
              <TableCell >Codigo</TableCell>
              <TableCell >Pais</TableCell>
              <TableCell >Nombre</TableCell>
              <TableCell >Fecha aprovacion</TableCell>
              <TableCell >Conversion a Dolares</TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
        {deva.length > 0 ? (
            deva.map((fila) => (
              <TableRow key={fila.deva_Id}>
                <TableCell>
                <Checkbox
                checked={formik.values.seleccionados.some((i) => i.deva_Id === fila.deva_Id)}
                onChange={() => handleSeleccion(fila)}
                />
                </TableCell>
                <TableCell>{fila.regi_Codigo}</TableCell>
                <TableCell>{fila.pais_Nombre}</TableCell>
                <TableCell>{fila.regi_Descripcion}</TableCell>
                <TableCell>{fila.deva_FechaAceptacion}</TableCell>
                <TableCell>{fila.deva_ConversionDolares}</TableCell> 
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay DEVAS disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
           
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
         Debe seleccionar al menos una declaracion de valores.
        </Alert>
      </Snackbar>                  

     
    </div>
  );
});

export default DucaTab1Component;
