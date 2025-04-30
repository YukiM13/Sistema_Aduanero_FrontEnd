import React, {useEffect, useState} from 'react';
import axios from 'axios';

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

        <div>

            <h2>Listado de Ciudades</h2>
            <ul>

                {tallas.map(talla => (
                    <li>
                        {talla.tall_Id} - {talla.tall_Nombre}
                    </li>
                ))}
            </ul>



        </div>


    );





};

export default Talla;