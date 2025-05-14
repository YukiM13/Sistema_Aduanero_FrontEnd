import React from "react";
import { useEffect, useState } from "react";
import DeclaracionValor from "./DeclaracionValor";
import DevaCards from "./DevaCards";
import Deva from "src/models/devaModel";

const DevaContenedor = () => {
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
           
                    <DevaCards />
              
                </div>
            ) : (
                 <DeclaracionValor />
                
            )}
        </>
    );
}

export default DevaContenedor;