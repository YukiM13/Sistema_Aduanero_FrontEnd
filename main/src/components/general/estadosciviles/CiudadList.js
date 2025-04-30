import React, { useEffect, useState } from 'react';	
import axios from 'axios';

const CiudadList = () => {
    const [ciudades, setCiudades] = useState([]);

 useEffect(( ) => {
    axios.get('http://localhost:44380/api/Ciudades/Listar', {
        headers: {
            'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc"/json',
        }

    })
    .then(response => {
        setCiudades(response.data.data);
        console.log("React E10", response.data.data)
    })
    .catch(error => {
        console.error('Error al obtener los datos de Ciudad:', error);
    });

}, []); // El
//  array vacío asegura que el efecto se ejecute solo una vez al montar el componente
    return(
        <div>
            <h2> Listado de Ciudades </h2>
            <ul>
                {ciudades.map(ciudad => (
                    <li>
                        {ciudad.ciud_Id} - {ciudad.ciud_Nombre}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CiudadList;