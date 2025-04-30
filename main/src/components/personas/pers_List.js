import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PersonasComponent = () => {
  const [personas, setPersonas] = useState([]); // Estado para guardar la respuesta

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    console.log(apiUrl);
    axios.get(`${apiUrl}/api/Personas/Listar`, {
      headers: {
        'x-api-key': apiKey
      }
    })
    .then(response => {
      setPersonas(response.data); // Guardás la data en el estado
    })
    .catch(error => {
      console.error('Error al obtener las personas:', error);
    });
  }, []);

  return (
    <div>
      <h2>Lista de Personas</h2>
      <ul>
        {personas.map(persona => (
          <li key={persona.pers_RTN}>{persona.pers_Nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default PersonasComponent;