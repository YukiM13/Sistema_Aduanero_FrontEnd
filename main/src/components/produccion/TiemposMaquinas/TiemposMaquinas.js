import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Grid, MenuItem } from '@mui/material';
import {
    Button, Stack, Select, FormControl
} from '@mui/material';
import { useFormik } from 'formik';
import ParentCard from '../../../components/shared/ParentCard';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import { Search } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { ReactComponent as LogoAzul } from 'src/assets/images/logos/LOGOAZUL.svg';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';

const TiemposMaquinasPdf = () =>  {
    const [tiemposmaquinaData, setTiemposMaquinasData]= useState(null);
    const [maquinasLista, setMaquinasLista]= useState([]);
    const contenidoRef = useRef();

    const formik = useFormik({
        initialValues:{
            maqu_Id:0
        },
        onSubmit:(values)=>{
            buscarMaquinas(values);
        }
    });

    useEffect(()=>{
        cargarMaquinas();
    },[]);

    const cargarMaquinas = async ()=>{
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        try{
            const response = await axios.get(`${apiUrl}/api/Maquinas/Listar`, {
                headers:{
                    'XApiKey': apiKey
                }
            });

            if (response.data && response.data.data){
                setMaquinasLista(response.data.data);
            }
        } catch(error){
            console.error('Error al cargar maquinas:', error);
        }
    }

    const buscarMaquinas = async (values)=>{
        const apiUrl = process.env.REACT_APP_API_URL;
        const apiKey = process.env.REACT_APP_API_KEY;

        if(values.maqu_Id===0){
            alert('Por favor seleccione un Maquinas');
            return;
        }

        try{
            const response = await axios.post(`${apiUrl}/api/Reportes/TiemposMaquinas`, values, {
                headers: {
                    'XApiKey': apiKey
                }
            });

            if(response.data && response.data.data){
                setTiemposMaquinasData(response.data.data);
            }
        } catch (error){
            console.error('Error al buscar Tiempos Maquinas', error);
        }
    }

    const convertToPdf = async()=>{
        const opt = {
            margin: 3,
            filename:'Tiempos-maquinas.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2pdf:{
                scale:1.5,
                useCORS:true,
                letterRendering:true
            },
            jsPDF:{
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        }

        html2pdf().from(contenidoRef.current).set(opt).save();
    }

    const obtenerNombreMaquina=()=>{
        const maquinaSeleccionada = maquinasLista.find(maquina => maquina.maqu_Id === formik.values.maqu_Id);
        return maquinaSeleccionada ? maquinaSeleccionada.mmaq_Nombre : 'Maquinas';
    }

    return(
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={2}>
                                <CustomFormLabel>Maquinas</CustomFormLabel>
                                <FormControl fullWidth>
                                    <Select
                                        value={formik.values.maqu_Id}
                                        name="maqu_Id"
                                        onChange={formik.handleChange}
                                        placeholder='Seleccione una Maquina'
                                        displayEmpty
                                    >
                                        <MenuItem value={0} disabled>
                                            Seleccione una maquina
                                        </MenuItem>
                                        {maquinasLista.map((maquina)=>(
                                            <MenuItem key={maquina.maqu_Id} value={maquina.maqu_Id}>
                                                {maquina.maqu_NumeroSerie} - {maquina.mmaq_Nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item style={{ marginTop: '5%' }}>
                                <Button
                                    style={{width:'300px', height:'40px'}}
                                    variant="outlined"
                                    type="submit"
                                    startIcon={<Search style={{ fontSize: '18px' }}/>}
                                >
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>

                {tiemposmaquinaData &&(
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} sx={{ mb:3 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon style={{ fontSize: '18px' }}/>}
                                onClick={()=> window.history.back()}
                            >
                                Volver
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon style={{ fontSize:'18px' }}/>}
                                onClick={convertToPdf}
                            >
                                Descargar PDF
                            </Button>
                        </Stack>
                        <ParentCard>
                            <h5 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px' }}> Previsualización Reporte de Tiempos de Maquina: {obtenerNombreMaquina()}</h5>
                            <div ref={contenidoRef} style={{position: 'relative'}}>
                                <p style={{ fontSize: '8pt', margin: '2px 0' }}>Fecha y hora de impresión: {new Date().toLocaleString()} </p>
                                <br />
                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt' }} border="3" cellPadding="2" cellSpacing="0">
                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ background: '#1797be', color: 'white', textAlign: 'center', fontSize: '14px', border: "1px solid black" }}>
                                            REPORTE DE TIEMPO DE MAQUINA <br /> <span style={{ fontSize: '12px' }}>-- IMPRESA --</span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th bgcolor="#f8f8f8">Fecha Inicio:</th>
                                        <td colSpan="3">{new Date(formik.values.fechaInicio).toLocaleDateString()}</td>
                                        <th bgcolor="#f8f8f8">Fecha Fin:</th>
                                        <td colSpan="4">{new Date(formik.values.fechaFin).toLocaleDateString()}</td>
                                    </tr>
                                    <tr bgcolor="#eeeeee">
                                        <th colSpan="9" style={{ border: "1px solid black", color: '#1797be', textAlign: 'center', fontSize: '14px' }}>LISTADO DE MATERIALES DE INGRESO</th>
                                    </tr>
                                </table>

                                <table style={{ width: '100%', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '7pt', marginTop: '10px' }} border="1" cellPadding="2" cellSpacing="0">
                                    <thead>
                                        <tr bgcolor="#eeeeee">
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Numero de Serie</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Nombre</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Dias Activa</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Dias Inactiva</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Dias Totales Inactiva</th>
                                            <th style={{ border: "1px solid black", background: '#1797be', color: 'white', textAlign: 'center' }}>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tiemposmaquinaData.map((item, index)=>(
                                            <tr>
                                                <td style={{ border: "1px solid black" }}>{item.maqu_NumeroSerie}</td>
                                                <td style={{ border: "1px solid black" }}>{item.marq_Nombre}</td>
                                                <td style={{ border: "1px solid black" }}>{item.diasActiva}</td>
                                                <td style={{ border: "1px solid black" }}>{item.diasInactiva}</td>
                                                <td style={{ border: "1px solid black" }}>{item.diasTotalesInactiva}</td>
                                                <td style={{ border: "1px solid black" }}>{item.mahi_Observaciones}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '100%',
                                        height: 'auto',
                                        opacity: 0.2,
                                        pointerEvents: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transform: 'scale(2)'
                                    }}
                                >
                                    <LogoAzul style={{maxWidth: '100%', maxHeight: '100%'}}/>
                                </div>
                                <div style={{ marginTop: '20px', fontSize: '9pt', textAlign: 'right' }}>
                                    <p><strong>Fecha de generación:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </ParentCard>
                    </Grid>
                )}
            </Grid>
        </>
    )
}

export default TiemposMaquinasPdf;