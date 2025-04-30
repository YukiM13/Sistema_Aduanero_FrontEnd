import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';


const ModoTransporte = () => {

    const [modoTransporte, setModoTransporte] = useState([]);

    useEffect(() => {

        axios.get('https:localhost:44380/api/ModoTransporte/Listar', {

            headers: {
                'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc'
            }

        })
        .then(response => {
            setModoTransporte(response.data.data);
            console.log('React E10', response.data.data);

        })
        .catch(error => {
            console.log('Error', error);
        });


    }, []);

    return (

        <div>
               <Breadcrumb title="Modos de Transporte" subtitle="Listar" />
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
                      {modoTransporte.map((item) => (
                        <TableRow key={item.marc_Id}>
                          <TableCell>{item.motr_Id}</TableCell>
                          <TableCell>{item.motr_Descripcion}</TableCell>
                          
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ParentCard>
             
            </div>


    );


};

export default ModoTransporte;