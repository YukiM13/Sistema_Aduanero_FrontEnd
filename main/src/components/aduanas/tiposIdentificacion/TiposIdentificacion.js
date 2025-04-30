import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const TiposIdentificacion = () => {

    const [tiposIdentificacion, setTiposIdentificacion] = useState([]);

    useEffect(() => {

        axios.get('https:localhost:44380/api/TiposIdentificacion/Listar', {

            headers: {
                'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc'
            }

        })
        .then(response => {
            setTiposIdentificacion(response.data.data);
            console.log('React E10', response.data.data);

        })
        .catch(error => {
            console.log('Error', error);
        });


    }, []);

    return (

        <div>
               <Breadcrumb title="Tipos de Identificacion" subtitle="Listar" />
              <ParentCard>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Descripcion</TableCell>
                        
                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tiposIdentificacion.map((item) => (
                        <TableRow key={item.iden_Id}>
                          <TableCell>{item.iden_Id}</TableCell>
                          <TableCell>{item.iden_Descripcion}</TableCell>
                          
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ParentCard>
             
            </div>


    );


};

export default TiposIdentificacion;