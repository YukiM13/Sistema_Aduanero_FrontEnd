import React, { useEffect, useState } from "react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import Header from "src/layouts/full/vertical/header/Header";
const EstadosCiviles = () => {
    const [estadosCiviles, setEstadosCiviles] = useState([]);

useEffect(() => {
    axios.get('https://localhost:44380/api/EstadosCiviles/Listar?escv_EsAduana=true',{
        headers:{
            'XApiKey':'4b567cb1c6b24b51ab55248f8e66e5cc'
        }
    }).then(response => {
        setCiudad (response.data);
        console.log(response.data);
    })
    .catch(error =>{
        console.log('Error al obtener los datos:', error);
    })
}, []);
}

return (
    <div className="container">
        <Header title="Estados Civiles" />
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Es Aduana</th>
                </tr>
            </thead>
            <tbody>
                {estadosCiviles.map((estadoCivil) => (
                    <tr>
                        <td>{estadoCivil.escv_Id}</td>
                        <td>{estadoCivil.escv_Nombre}</td>
                        <td>{estadoCivil.escv_EsAduana ? "Sí" : "No"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)
