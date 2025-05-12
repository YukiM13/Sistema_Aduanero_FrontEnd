import React from "react";
import { useEffect, useState } from "react";
import DucaCreateComponent from "./DucaCreate";
const DucaContenedor = () => {
    const [mostarLista, setMostarLista] = useState([]);
    const localStorageData = localStorage.getItem('DataUsuario');
    const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
    const admin = parsedData ? parsedData.usua_EsAdmin : false;
    useEffect(() => {
    console.log("Admin:", parsedData);
       if(admin === true) {
            setMostarLista(true);
        }
        else {
            setMostarLista(false);
        }
    }, []);

    return (
        <>
            {mostarLista ? (
               <div>
                    <h1>Aqui va el listar</h1>
                
                </div>
            ) : (
                 <DucaCreateComponent />
                
            )}
        </>
    );
}

export default DucaContenedor;