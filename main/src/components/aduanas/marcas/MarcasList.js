import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const Marca = () => {

    const [marcas, setMarca] = useState([]);

    useEffect(() => {

        axios.get('https:localhost:44380/api/Marcas/Listar', {

            headers: {
                'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc'
            }

        })
        .then(response => {
            setMarca(response.data.data);
            console.log('React E10', response.data.data);

        })
        .catch(error => {
            console.log('Error', error);
        });


    }, []);

    return (

        // <div>

        //     <h2>Listado de Tallas</h2>
        //     <ul>

        //         {tallas.map(talla => (
        //             <li>
        //                 {talla.tall_Id} - {talla.tall_Nombre}
        //             </li>
        //         ))}
        //     </ul>



        // </div>

        <div>
               <Breadcrumb title="Marcas" subtitle="Listar" />
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
                      {marcas.map((item) => (
                        <TableRow key={item.marc_Id}>
                          <TableCell>{item.marc_Id}</TableCell>
                          <TableCell>{item.marc_Descripcion}</TableCell>
                          
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ParentCard>
             
            </div>


    );





};

export default Marca;