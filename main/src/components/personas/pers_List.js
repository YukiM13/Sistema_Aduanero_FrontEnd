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
        'XApiKey': apiKey
      }
    })
    .then(response => {
      if (response.data && Array.isArray(response.data.data)) {
        setPersonas(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error al obtener las personas:', error);
    });
  }, []);

  return (
    <div>
    <h2>Lista de Personas</h2>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>RTN</th>
          <th>Nombre</th>
          <th>Oficina</th>
        </tr>
      </thead>
      <tbody>
        {personas.map((persona) => (
          <tr key={persona.pers_Id}>
            <td>{persona.pers_Id}</td>
            <td>{persona.pers_RTN}</td>
            <td>{persona.pers_Nombre}</td>
            <td>{persona.ofic_Nombre}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default PersonasComponent;