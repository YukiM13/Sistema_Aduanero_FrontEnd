import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const MarcasMaquinas = () => {

    const [marcasMaquinas, setMarcasMaquinas] = useState([]);

    useEffect(() => {

        axios.get('https:localhost:44380/api/MarcasMaquinas/Listar', {

            headers: {
                'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc'
            }

        })
        .then(response => {
            setMarcasMaquinas(response.data.data);
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
               <Breadcrumb title="Marcas Maquinas" subtitle="Listar" />
              <ParentCard>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        
                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {marcasMaquinas.map((item) => (
                        <TableRow key={item.marq_Id}>
                          <TableCell>{item.marq_Id}</TableCell>
                          <TableCell>{item.marq_Nombre}</TableCell>
                          
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ParentCard>
             
            </div>


    );





};

export default MarcasMaquinas;