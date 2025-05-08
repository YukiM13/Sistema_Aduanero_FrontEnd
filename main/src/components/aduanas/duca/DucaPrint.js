

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AlignHorizontalRight, Margin, PrintSharp } from "@mui/icons-material";
import Box from "@mui/material/Box";

import DucaLogo from "../../../assets/images/imagenes/DUCALOGO.png";
import { duration } from "@mui/material";

// Default export is a4 paper, portrait, using millimeters for units
// const doc = new jsPDF();

// doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");



{/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h1>DUCA Print</h1>
        <button onClick={() => doc.save("duca.pdf")}>Download DUCA</button> */}


        // const generatePDF = () => {

        //     const doc2 = new jsPDF();

        //     // Select the HTML element you want to render
        //     const element = document.getElementById("html-content");


        //     doc2.addPage().html(element, {
        //         callback: function (doc2) {
        //         doc2.save("document.pdf");
        //         },
        //         x: 10, // Horizontal margin
        //         y: 10, // Vertical margin
        //         width: 190, // Width of the content in the PDF
        //         windowWidth: element.scrollWidth, // Use the full width of the HTML content
        //     });

        //     // // Use the `html` method to render the HTML content into the PDF
        //     // doc2.html(element, {
        //     //     callback: function (doc2) {
        //     //     doc2.save("document.pdf");
        //     //     },
        //     //     x: 10, // Horizontal margin
        //     //     y: 10, // Vertical margin
        //     //     width: 190, // Width of the content in the PDF
        //     //     windowWidth: element.scrollWidth, // Use the full width of the HTML content
        //     // });
        //   };


        const generatePDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const element = document.getElementById("html-content");
  
  const sidebarLabels = [
    "Exportador/Proveedor", 
    "Importador/Destinatario", 
    "Declarante", 
    "Transportista", 
    "Conductor", 
    "Valores Totales", 
    "Mercancias", 
    "Documentos de Soporte", 
    "Observaciones y Firma"
  ];
  
  html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10, 190, 270);
    
    // Simple approach - write text rotated using the angle option
    const startX = 15; 
    const startY = 50;
    const sectionHeight = 30;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    
    // Add each label with simple rotation
    // sidebarLabels.forEach((text, i) => {
    //   const y = startY + (i * sectionHeight);
      
    //   // Use the correct text rotation method based on your jsPDF version
    //   doc.text(text, startX, y, { 
    //     angle: 270  // This is -90 degrees (use 270 instead of -90)
    //   });
    // });
    
    doc.save("DUCA-document.pdf");
  });
};


const DucaPrintComponent = ({Duca, onCancelar }) => {

    return (

        <div> 

        <h1>DUCA Print</h1>
        {/* <button onClick={() => doc.save("duca.pdf")}>Download DUCA</button> */}

        <Button variant="contained" color="secondary" onClick={generatePDF}
                            startIcon={<PrintSharp />}>
                                Generar PDF
        </Button>
        
        <hr/>
        <h5 className="text-center">Vista Previa Del Documento</h5>
        <hr/>

        <div id="html-content" style={{ padding: "0%", marginBottom: "20px" }}>


        {/* Enabezado */}
        <Grid container spacing={2} sx={{ borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "20px" }}>
            <Grid item xs={6}>
            <p><strong>Fecha y Hora de Impresión:</strong> {new Date().toLocaleString()}</p>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
            <p><strong>ANEXO I DE LA RESOLUCIÓN No. 409-2018 (COMIECO-LXXXV)</strong></p>
            </Grid>
        </Grid>
            
            
            {/* <Grid container justifyContent="center" alignItems="center" sx={{ border: '1px solid #000', padding: '10px' }}> */}
            <div style={{ border: "1px solid #000", padding: "0%"}}>

            


            <Grid container padding={0} >

                <Grid item xs={12} sx={{ border: '1px solid #000', padding: '10px', paddingBottom: '0px', paddingTop: '0% ' }}>
                    
                <Grid container padding={0} >
                    <Grid item xs={11} sx={{paddingTop: '2%'}}>
                    <p className="text-center" style={{marginTop: "2px"}}><strong>DECLARACIÓN ÚNICA CENTROAMERICANA (DUCA)
                    <br/> --IMPRESA--</strong></p>
                    </Grid>
                    <Grid item xs={1}>
                        <img src={DucaLogo} alt="DUCA Logo" width={"100%"} />
                    </Grid>
                </Grid>


                </Grid>

                <Grid item xs={1} 
                    sx={{ border: '1px solid #000', padding: '10px', paddingBottom: '0px', 
                    paddingTop: '50% ', height: "306mm", textAlign:"center"}}>
                    
                    <Grid container padding={0} >
                        <Grid item xs={12} sx={{transform: "rotate(-90deg)", width: "100%", height: "100%" }} >
                        <p className="text-center"><strong>DUCA-D</strong></p>
                        </Grid>
                    </Grid>
                    

                </Grid>

                {/* <Grid item xs={1} 
                    sx={{ 
                        border: '1px solid #000',
                        height: '300mm',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        writingMode: 'vertical-rl', // Dirección vertical
                        textOrientation: 'mixed',   // Mantiene letras bien orientadas
                        fontWeight: 'bold'
                        // border: '1px solid #000', paddingLeft: "0%", paddingRight: "0%", 
                        // paddingBottom: '0%', paddingTop: '1% ', height: "300mm"
                        }}>
                    
                <Grid container >

                    <Grid item xs={1} sx={{ border: '1px solid #000'}} >
                    <p className="text-center"><strong>Exportador/Proveedor</strong></p>
                    </Grid>

                </Grid>
                    

                </Grid> */}

                    {/* ?????? */}

                    {/* <Grid item xs={1} sx={{ 
    border: '1px solid black',
    height: '306mm',
    display: 'grid',  // Using grid instead of flex
    gridTemplateRows: 'repeat(9, 1fr)', // 9 equal rows
    padding: 0
}}>
    {[
        "Exportador/Proveedor", 
        "Importador/Destinatario", 
        "Declarante", 
        "Transportista", 
        "Conductor", 
        "Valores Totales", 
        "Mercancias", 
        "Documentos de Soporte", 
        "Observaciones y Firma"
    ].map((text, index) => (
        <div key={index} style={{
            borderTop: index > 0 ? '1px solid black' : 'none',
            position: 'relative',
            height: '100%',
            width: '100%'
        }}>
            <div style={{
                position: 'absolute',
                top: '50%', 
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                fontWeight: 'bold'
            }}>
                {text}
            </div>
        </div>
    ))}
</Grid> */}

                <Grid item xs={1} sx={{ 
                    border: '1px solid black',
                    height: '306mm',
                    display: 'grid',
                    gridTemplateRows: 'repeat(9, 1fr)',
                    padding: 0
                }}>
                    {[
                        "Exportador/Proveedor", 
                        "Importador/Destinatario", 
                        "Declarante", 
                        "Transportista", 
                        "Conductor", 
                        "Valores Totales", 
                        "Mercancias", 
                        "Documentos de Soporte", 
                        "Observaciones y Firma"
                    ].map((text, index) => (
                        <div key={index} style={{
                            borderTop: index > 0 ? '1px solid black' : 'none',
                            position: 'relative',
                            height: '100%',
                            width: '100%'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%', 
                                left: '50%',
                                transform: 'translate(-50%, -50%) rotate(-90deg)',
                                width: '25mm', // Fixed height after rotation (appears as width)
                                // Remove whiteSpace: 'nowrap' to allow wrapping
                                textAlign: 'center',
                                fontWeight: 'bold',
                                lineHeight: '1.2',
                                fontSize: '9px' // Making text smaller to fit better
                            }}>
                                {text}
                            </div>
                        </div>
                    ))}
                </Grid>
                




                <Grid item xs={10} sx={{ border: '1px solid #000', padding: '0%',
                    height: '306mm',
                    
                 }}>
                <Grid container spacing={0} >

                    <Grid item xs={5} sx={{ padding: '0%',
                    height: '68mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.1 No. Identificacion</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.2 Tipo Identificacion</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.3 Pais Emision</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.4 Nombre o Razón Social</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p>4.5 Domicilio Fiscal</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            {/* // llenado para que tome dos */}
                            </Grid>

                        </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px" }}>
                        <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.1. No. Identificación</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.2. Tipo Identificación RTN</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.3. País Emisión</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.4. Nombre o Razón Social</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.5. Domicilio Fiscal</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            {/* // llenado para que tome dos */}
                            </Grid>

                        </Grid>
                        </Grid>

                        
                        

                    </Grid>

                    <Grid item xs={7} sx={{
                        border: '1px solid #000', padding: '0%',
                        height: '68mm',
                        margin: "0%",
                        
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '42mm'}}>
                        <Grid container spacing={0} sx={{  padding: '0%', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={12} sx={{ marginBottom: "0%", marginTop: "0%" , border: '1px solid #000' }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign: "center"}}>Identificación de la Declaración</p>
                            
                            </Grid>


                            <Grid item xs={12} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                                
                            <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>1. No. Correlativo o Referencia</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>2. No. de Duca</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 3. Fecha de Aceptación</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.3 Pais Emision</p>
                              <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>7. Aduana Registro / Inicio Tránsito</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>8. Aduana de Salida</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 9. Aduana de Ingreso</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>10. Aduana Destino</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                          </Grid>
                          </Grid>


                        </Grid>
                        </Grid>


                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '26mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            
                            <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>11. Régimen Aduanero</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>12. Modalidad</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 13. Clase</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 14. Fecha Vencimiento</p>
                              <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>

                        </Grid>
                        </Grid>


                    </Grid>


                    <Grid item xs={5} sx={{ padding: '0%',
                    height: '68mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.1 No. Identificacion</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.2 Tipo Identificacion</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.3 Pais Emision</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.4 Nombre o Razón Social</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p>4.5 Domicilio Fiscal</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            {/* // llenado para que tome dos */}
                            </Grid>

                        </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px" }}>
                        <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.1. No. Identificación</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.2. Tipo Identificación RTN</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.3. País Emisión</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.4. Nombre o Razón Social</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>5.5. Domicilio Fiscal</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            {/* // llenado para que tome dos */}
                            </Grid>

                        </Grid>
                        </Grid>

                        
                        

                    </Grid>


                    <Grid item xs={7} sx={{
                        border: '1px solid #000', padding: '0%',
                        height: '68mm',
                        margin: "0%",
                        
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '42mm'}}>
                        <Grid container spacing={0} sx={{  padding: '0%', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={12} sx={{ marginBottom: "0%", marginTop: "0%" , border: '1px solid #000' }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign: "center"}}>Identificación de la Declaración</p>
                            
                            </Grid>


                            <Grid item xs={12} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                                
                            <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>1. No. Correlativo o Referencia</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>2. No. de Duca</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 3. Fecha de Aceptación</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>4.3 Pais Emision</p>
                              <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>7. Aduana Registro / Inicio Tránsito</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>8. Aduana de Salida</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 9. Aduana de Ingreso</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>10. Aduana Destino</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                          </Grid>
                          </Grid>


                        </Grid>
                        </Grid>


                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '26mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            
                            <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>11. Régimen Aduanero</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>12. Modalidad</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 13. Clase</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 14. Fecha Vencimiento</p>
                              <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>

                        </Grid>
                        </Grid>


                    </Grid>

                    


                </Grid>
                </Grid>

                

                



                


                



                {/* <Grid item lg={4} md={12} sm={12} sx={{ border: '1px solid #000', padding: '10px' }}>
                    <label>DUCA:</label> <br/>
                    
                </Grid>
                <Grid item lg={4} md={12} sm={12} sx={{ border: '1px solid #000', padding: '10px' }}>
                    <label>Fecha:</label> <br/>
                    
                </Grid>
                <Grid item lg={4} md={12} sm={12} sx={{ border: '1px solid #000', padding: '10px' }}>
                    <label>Tipo de DUCA:</label> <br/>
                    
                </Grid>
                <Grid item lg={4} md={12} sm={12} sx={{ border: '1px solid #000', padding: '10px' }}>
                    <label>Tipo de Documento:</label> <br/>
                    
                </Grid> */}







































            </Grid>

            </div>

        </div>


        

        <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={onCancelar}
                            startIcon={<ArrowBackIcon />}>
                                Regresar
                            </Button>
                        </Grid>
                    </Grid>


        
        </div>
    );


}


export default DucaPrintComponent;