import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const Talla = () => {

    const [tallas, setTalla] = useState([]);

    useEffect(() => {

        axios.get('https:localhost:44380/api/Tallas/Listar', {

            headers: {
                'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc'
            }

        })
        .then(response => {
            setTalla(response.data.data);
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
               <Breadcrumb title="Tallas" subtitle="Listar" />
              <ParentCard>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Codigo</TableCell>
                        <TableCell>Nombre</TableCell>
                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tallas.map((talla) => (
                        <TableRow key={talla.tall_Id}>
                          <TableCell>{talla.tall_Id}</TableCell>
                          <TableCell>{talla.tall_Codigo}</TableCell>
                          <TableCell>{talla.tall_Nombre}</TableCell>
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ParentCard>
             
            </div>


    );





};

export default Talla;