

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AlignHorizontalRight, Margin, PrintSharp } from "@mui/icons-material";
import Box from "@mui/material/Box";

import { storage } from '../../../layouts/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';

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


        const generate1PDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const element = document.getElementById("html-content");
  const reverso = document.getElementById("html-reverso");
  
  
  
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

// const generatePDF = () => {
//   const doc = new jsPDF({
//     orientation: 'portrait',
//     unit: 'mm',
//     format: 'a4'
//   });

//   const element = document.getElementById("html-content");
//   const reverso = document.getElementById("html-reverso");

//   // Render the first page (html-content)
//   html2canvas(element, {
//     scale: 2,
//     useCORS: true,
//     logging: false
//   }).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     doc.addImage(imgData, 'PNG', 10, 10, 190, 270);

//     // Add a new page for the second element (html-reverso)
//     doc.addPage();
//     html2canvas(reverso, {
//       scale: 2,
//       useCORS: true,
//       logging: false
//     }).then(canvas2 => {
//       const imgData2 = canvas2.toDataURL('image/png');
//       doc.addImage(imgData2, 'PNG', 10, 10, 190, 270);

//       // Save the PDF
//       doc.save("DUCA-document.pdf");
//     });
//   });
// };


const generatePDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const element = document.getElementById("html-content");
  const reverso = document.getElementById("html-reverso");

  // Define the fixed dimensions for the PDF
  const pdfWidth = 190; // Width in mm
  const pdfHeight = 270; // Height in mm

  // Render the first page (html-content)
  html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);

    // Add a new page for the second element (html-reverso)
    doc.addPage();
    html2canvas(reverso, {
      scale: 2,
      useCORS: true,
      logging: false
    }).then(canvas2 => {
      const imgData2 = canvas2.toDataURL('image/png');

      // Ensure the second page uses the same dimensions
      doc.addImage(imgData2, 'PNG', 10, 10, pdfWidth, pdfHeight);

      // Save the PDF
      doc.save("DUCA-document.pdf");
    });
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
                    <br/> -- IMPRESA --</strong></p>
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
                    gridTemplateRows: '34mm 34mm 24mm 24mm 34mm 34mm 48mm 26mm 48mm', // Custom row heights
                    // gridTemplateRows: 'repeat(9, 1fr)',
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
                            // position: 'relative',
                            position: 'sticky',
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
                                fontSize: '12px' // Making text smaller to fit better
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
                    // height: '68mm',
                    height: '48mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '24mm'}}>
                        <Grid container spacing={0} sx={{  padding: '8px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>6.1. Código</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>6.2. No. Identificación</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>6.3. Nombre o Razón Social</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>6.4. Domicilio Fiscal</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            

                        </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '24mm'}}>
                        <Grid container spacing={0} sx={{  padding: '8px', fontSize: "9px" }}>
                        <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>19.1. Código</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>20. Modo de Transporte</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>19.2. Nombre</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            

                        </Grid>
                        </Grid>

                        
                        

                    </Grid>


                    <Grid item xs={7} sx={{
                        border: '1px solid #000', padding: '0%',
                        height: '48mm',
                        margin: "0%",
                        
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '48mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>



                              <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>15. País Procedencia</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>

                              <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>16. País Exportación</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 17. País Destino</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>18. Depósito Aduanero / Zona Franca</p>
                              <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                              </Grid>
                              <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>21. Lugar de Embarque</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>

                              <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>22. Lugar de Desembarque</p>
                              <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                              </Grid>
                              <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}><strong> ** Manifiesto: 230011MATI004625C **</strong></p>
                              
                              </Grid>

                              <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}><strong> ** Título: 0011HN20220110 **</strong></p>
                              
                              </Grid>

                          


                        </Grid>
                        </Grid>


                    </Grid>


                    {/* Conductor */}
                    <Grid item xs={5} sx={{ padding: '0%',
                    height: '34mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>23.1. No. Identificación</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>23.2. No. Licencia de Conducir</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>23.3. País Expedición</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>23.4. Nombres y Apellidos </p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            

                        </Grid>
                        </Grid>

                    </Grid>


                    <Grid item xs={7} sx={{
                        border: '1px solid #000', padding: '0%',
                        height: '34mm',
                        margin: "0%",
                        
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '1px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>



                              <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.1. Id Unidad Transporte</p>
                              
                              </Grid>

                              <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.2. País de Registro</p>
                              
                              </Grid>
                              <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 24.3. Marca</p>
                              
                              </Grid>

                              <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.4. Chasis/Vin</p>
                              
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.5. Identificación del Remolque o Semirremolque</p>
                              
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.6. Cantidad de Unidades Carga (remolque y semirremolque)</p>
                              
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.7. Número de Dispositivo Seguridad(precintos o marchamos)</p>
                              
                              </Grid>

                              <Grid item xs={2} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.8. Equipamiento </p>
                              
                              </Grid>

                              <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.9. Tamaño del Equipamiento</p>
                              
                              </Grid>

                              <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.10. Tipo de Carga</p>
                              
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>24.11. Número/Números de Identificación de Contenedor/es</p>
                              
                              </Grid>



                          


                        </Grid>
                        </Grid>


                    </Grid>

                    {/* valores Totales*/}

                    <Grid item xs={6} sx={{ padding: '0%',
                    height: '34mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>25. Valor de Transacción</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 26. Gastos de Transporte</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%" }} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 27. Gastos de Seguro</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} style={{ textAlign: "right" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 28. Otros Gastos</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>29. Valor en Aduana Total</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 30. Incoterm</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 31. Tasa de Cambio</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>



                            

                        </Grid>
                        </Grid>

                    </Grid>

                    <Grid item xs={2} sx={{ padding: '0%',
                    height: '34mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>32. Peso Bruto Total</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>33. Peso Neto Total</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                             

                            

                        </Grid>
                        </Grid>

                    </Grid>


                    <Grid item xs={4} sx={{
                        border: '1px solid #000', padding: '0%',
                        height: '34mm',
                        margin: "0%",
                        
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '34mm'}}>
                        <Grid container spacing={0} sx={{  padding: '1px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={12} sx={{height: '7mm', marginBottom: "0%", marginTop: "0%"  }}>
                                <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign: "center"}}>Liquidacion General</p>
                                
                            </Grid>

                              <Grid item xs={4} sx={{height: '20mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', marginTop:  '0%', lineHeight: "1.2rem",  paddingTop: '0%'}}>34.1. Tipo de Tributo</p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', marginTop:  '0%', lineHeight: "1.2rem", paddingTop: '0%' }}>34.1. Tipo de Tributo</p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%',  marginTop: '0%', lineHeight: "1.2rem", paddingTop: '0%'}}>34.1. Tipo de Tributo</p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', marginTop:  '0%', lineHeight: "1.2rem", paddingTop: '0%'}}>34.1. Tipo de Tributo</p>
                              
                              
                              </Grid>

                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>34.2. Total por Tributo</p>
                              
                              </Grid>
                              <Grid item xs={4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 34.3. Modalidad Pago</p>
                              
                              </Grid>

                              <Grid item xs={12} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', fontSize: "11px"}}><strong>34.4. Total General</strong></p>
                              
                              </Grid>   




                              
                        </Grid>
                        </Grid>


                    </Grid>

                    {/* Mercancias */}

                    <Grid item xs={7} sx={{ padding: '0%',
                    height: '42mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '42mm'}}>
                        <Grid container spacing={0} sx={{  padding: '5px', lineHeight: '0.7rem', fontSize: "9px", 
                            marginBottom: "0%", marginTop: "0%", textAlign: 'center' }}>

                            <Grid item xs={2.4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>35. Cantidad Bultos</p>   
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>36. Clase de Bultos</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>37. Peso Neto</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>38. Peso Bruto </p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>39. Cuota Contingente</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            {/* sec row */}

                            <Grid item xs={2.4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>40. Número Línea</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>41. País Origen</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>42. Unidad Medida</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>43. Cantidad </p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>44. Acuerdo</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            {/* 3 row */}

                            <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>45. Clasificación Arancelaria</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>46. Descripción de las Mercancías</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>47.1. Criterio para Certificar Origen</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>47.2. Reglas Accesorias </p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>
                            

                            {/* 4 row */}

                            <Grid item xs={2.4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>48. Valor de Transacción</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>49. Gastos de Transporte</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>50. Seguro</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>51. Otros Gastos </p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>
                            <Grid item xs={2.4} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>52. Valor en Aduana</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                        </Grid>
                        </Grid>

                    </Grid>


                    <Grid item xs={5} sx={{
                        border: '1px solid #000', padding: '0%',
                        height: '42mm',
                        margin: "0%",
                        
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '42mm'}}>
                        <Grid container spacing={0} sx={{  padding: '1px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={12} sx={{height: '5mm', marginBottom: "0%", marginTop: "0%"  }}>
                                <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign: "center"}}>Liquidacion Por Linea</p>
                                
                            </Grid>


                              <Grid item xs={3}  sx={{height: '30mm', marginBottom: "0%", marginTop: "0%", textAlign: "center" }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', lineHeight: '1.1rem' }}>53.1. Tipo</p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', lineHeight: '1.1rem' }}>
                                <strong>----</strong></p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', lineHeight: '1.1rem' }}>
                                <strong>----</strong></p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', lineHeight: '1.1rem' }}>
                                <strong>----</strong></p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', lineHeight: '1.1rem' }}>
                                <strong>----</strong></p>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', lineHeight: '1.1rem' }}>
                                <strong>----</strong></p>
                              
                              </Grid>

                              <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%",  }}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>53.2. Alícuota</p>
                              
                              </Grid>
                              <Grid item xs={3} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>53.3. Total</p>
                              
                              </Grid>

                              <Grid item xs={3} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                              <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>53.4. MP</p>
                              
                              </Grid>

                              

                              <Grid item xs={12} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%", paddingLeft: '10px'}} >
                              <p style={{ marginBottom: "0%", paddingBottom: '0%', fontSize: '11px'}}><strong>53.5. Total General</strong></p>
                              
                              </Grid>



                          


                        </Grid>
                        </Grid>


                    </Grid>

                    <Grid item xs={12} sx={{
                        border: '1px solid #000', padding: '0%',
                        height: '6mm',
                        margin: "0%",
                        
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '6mm'}}>
                        <Grid container spacing={0} sx={{  padding: '1px', fontSize: "9px", 
                            marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={12} sx={{height: '5mm', marginBottom: "0%", marginTop: "0%"  }}>
                                <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign: "left"}}>
                                    Datos Complementarios: <strong>---, </strong> Observaciones:</p>
                                
                            </Grid>

                        </Grid>
                        </Grid>


                    </Grid>

                    {/* Docs soporte */}

                    <Grid item xs={12} sx={{ padding: '0%',
                    height: '26mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '26mm'}}>
                        <Grid container spacing={0} sx={{  padding: '10px', fontSize: "9px", 
                            marginBottom: "0%", marginTop: "0%", textAlign:'center', lineHeight: '0.8rem' }}>

                            <Grid item xs={1.5} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>54.1. Código del Tipo Documento</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={1.5} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>54.2. Número de Documento</p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={1.5} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%" }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 54.3. F. Emisión Documento</p>
                            <p style={{marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={1.5} sx={{height: '10mm' , marginBottom: "0%", marginTop: "0%"}}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 54.4. Fecha de Vencimiento</p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            <p style={{ marginBottom: "0%", marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={1.5} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>54.5. País de Emisión</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}>{Duca.duca_Id}</p>
                            </Grid>
                            <Grid item xs={1.5} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 54.6. Línea (al que aplica el documento)</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={1.5} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 54.7. Autoridad o Entidad que Emitió Doc.</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            <Grid item xs={1.5} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}> 54.8. Monto</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>---</strong></p>
                            </Grid>

                            

                        </Grid>
                        </Grid>

                    </Grid>

                    {/* observaciones y firmas */}

                    <Grid item xs={4} sx={{ padding: '0%',
                    height: '48mm',
                    margin: "0%",
                    }}>

                        {/* columnas dentro */}
                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '18mm'}}>
                        <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>55. Observaciones</p>
                            <p style={{ marginTop: "0%" , paddingTop: '0%'}}><strong>** Canal Asignado: VERDE **</strong></p>
                            </Grid>
                            
                        </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '6mm'}}>
                        <Grid container spacing={0} sx={{  padding: '0', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={12} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>56. Valido hasta: <strong>---</strong></p>
                            </Grid>
                            
                        </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '24mm'}}>
                        <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", lineHeight: '0.8rem', marginBottom: "0%", marginTop: "0%" }}>

                        <Grid item xs={12} sx={{height: '14mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>60. Firma del Declarante</p>
                            
                        </Grid>
                            <Grid item xs={12} sx={{height: '8mm', marginBottom: "0%", marginTop: "0%"}} >
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>Representado por: <strong>---</strong> </p>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>Lugar y Fecha: <strong>---</strong></p>
                            </Grid>

                            
                            

                        </Grid>
                        </Grid>


                    </Grid>


                    <Grid item xs={4} sx={{ padding: '0%',
                    height: '48mm',
                    margin: "0%",
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '5mm'}}>
                        <Grid container spacing={0} sx={{  padding: '0%', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={12} sx={{height: '5mm', marginBottom: "0%", marginTop: "0%", paddingTop:'0%'  }}>
                            <p style={{ marginBottom: "0%", marginTop: '0%', paddingBottom: '0%', textAlign:'center'}}><strong>Uso de Aduanas</strong></p>
                            </Grid>
                            
                        </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '19mm', lineHeight: '0.8rem'}}>
                        <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={12} sx={{height: '13mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>57. Firma, fecha y sello del funcionario autorizado por la Dirección General de Aduanas o de la Aduana de Salida</p>
                            
                            </Grid>
                            <Grid item xs={12} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign:'center'}}><strong>Firma</strong></p>
                            
                            </Grid>
                            
                        </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '24mm', lineHeight: '0.8rem'}}>
                        <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={12} sx={{height: '18mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>
                                61. El suscrito declara bajo fe de juramento que las mercancías arriba detalladas son originarias de: </p>
                            
                            </Grid>
                            <Grid item xs={12} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign:'center'}}><strong>Firma</strong></p>
                            
                            </Grid>
                            
                        </Grid>
                        </Grid>

                        


                    </Grid>

                    <Grid item xs={4} sx={{ padding: '0%',
                    height: '48mm',
                    margin: "0%",
                    }}>

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '5mm'}}>
                        <Grid container spacing={0} sx={{  padding: '0%', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                            <Grid item xs={12} sx={{height: '5mm', marginBottom: "0%", marginTop: "0%", paddingTop:'0%'  }}>
                            <p style={{ marginBottom: "0%", marginTop: '0%', paddingBottom: '0%', textAlign:'center'}}><strong>Uso de Ventanilla Única</strong></p>
                            </Grid>
                            
                        </Grid>
                        </Grid>




                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '19mm'}}>
                        <Grid container spacing={0} sx={{  padding: '0%', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '19mm', lineHeight: '0.8rem'}}>
                            <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                                <Grid item xs={12} sx={{height: '13mm', marginBottom: "0%", marginTop: "0%"  }}>
                                <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>58. Firma o Autorización de Ventanilla Única</p>
                                
                                </Grid>
                                <Grid item xs={12} sx={{height: '10mm', marginBottom: "0%", marginTop: "0%"  }}>
                                <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign:'center'}}><strong>Firma</strong></p>
                                
                                </Grid>
                                
                            </Grid>
                            </Grid>

                            <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '19mm', lineHeight: '0.8rem'}}>
                            <Grid container spacing={0} sx={{  padding: '0%', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                                {/*  */}
                                <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '10mm', lineHeight: '0.8rem'}}>
                                <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                                    <Grid item xs={12} sx={{height: '4mm', marginBottom: "0%", marginTop: "0%"  }}>
                                    <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>59. Código de Exportador</p>
                                    
                                    </Grid>
                                    <Grid item xs={12} sx={{height: '4mm', marginBottom: "0%", marginTop: "0%"  }}>
                                    <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign:'center'}}><strong>---</strong></p>
                                    
                                    </Grid>
                                    
                                </Grid>
                                </Grid>

                                <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '9mm', lineHeight: '0.8rem'}}>
                                <Grid container spacing={0} sx={{  padding: '5px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>
                                    <Grid item xs={12} sx={{height: '9mm', marginBottom: "0%", marginTop: "0%"  }}>
                                    <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign: 'center'}}>---</p>
                                    
                                    </Grid>
                                    
                                </Grid>
                                </Grid>
                                
                                
                                

                                
                                
                            </Grid>
                            </Grid>



                        </Grid>
                        </Grid>

                        

                        

                        <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '24mm', lineHeight: '0.8rem'}}>
                        <Grid container spacing={0} sx={{  padding: '1px', fontSize: "9px", marginBottom: "0%", marginTop: "0%" }}>

                            <Grid item xs={12} sx={{height: '14mm', marginBottom: "0%", marginTop: "0%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%'}}>
                                62. El suscrito certifica bajo fe de juramento que las mercancías
                                arriba detalladas son originarias de __________________ y que los
                                valores, gastos de transporte, seguro y demás datos consignados
                                en este formulario son verdaderos.
                            </p>
                            
                            </Grid>

                            <Grid item xs={6} sx={{height: '4mm', marginBottom: "0%", marginTop: "0%", lineHeight: '0.7rem'  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%' }}><strong>Nombre  ---</strong></p>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%' }}><strong>Empresa  ---</strong></p>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%' }}><strong>Cargo  ---</strong></p>
                            
                            </Grid>

                            <Grid item xs={6} sx={{height: '10mm', marginBottom: "0%", marginTop: "7%"  }}>
                            <p style={{ marginBottom: "0%", paddingBottom: '0%', textAlign:'center' }}><strong>Firma</strong></p>
                            
                            </Grid>
                            
                        </Grid>
                        </Grid>

                        


                    </Grid>
                    


                </Grid>
                </Grid>








            </Grid>

            </div>

        </div>

        <hr/>
        <h5 className="text-center">Reverso</h5>
        <hr/>

        <div id="html-reverso" style={{ padding: "0%", marginBottom: "20px" }}>


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
                    <br/> -- Reverso --</strong></p>
                    </Grid>
                    <Grid item xs={1}>
                        <img src={DucaLogo} alt="DUCA Logo" width={"100%"} />
                    </Grid>
                </Grid>


                </Grid>

                {/* 306 */}
                <Grid item xs={12} sx={{ border: '1px solid #000', padding: '0%', height: '306mm'}}>
                <Grid container spacing={0}>
                    

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '72mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                <Grid item xs={12}>
                                    <h6>ADUANA DE PARTIDA</h6>
                                </Grid>
                                <hr/>

                                <Grid item xs={4}>
                                    <p>1. Aduana de Partida</p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p>2. Código</p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p>3. País</p>
                                </Grid>

                                <Grid item xs={6}>
                                    <p>4. Dispositivo de Seguridad</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>5. Ruta a Seguir</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>6. Fecha y Hora </p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>7. Plazo en Horas</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>8. Nombre, firma y sello del funcionario de aduana</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '72mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                <Grid item xs={12}>
                                    <h6>ADUANA DE PASO</h6>
                                </Grid>
                                <hr/>

                                <Grid item xs={6}>
                                    <p>10. Aduana de Paso</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>11. Código</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>12. Numero de dispositivo de seguridad nuevo</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>13. Fecha y Hora</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>14. Nombre, firma y sello del funcionario de aduana</p>
                                </Grid>
                                


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '30mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                
                                <Grid item xs={12}>
                                    <p>9. Observaciones</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '30mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                
                                <Grid item xs={12}>
                                    <p>9. Observaciones</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>



                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '72mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                <Grid item xs={12}>
                                    <h6>ADUANA DE PARTIDA</h6>
                                </Grid>
                                <hr/>

                                <Grid item xs={4}>
                                    <p>1. Aduana de Partida</p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p>2. Código</p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p>3. País</p>
                                </Grid>

                                <Grid item xs={6}>
                                    <p>4. Dispositivo de Seguridad</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>5. Ruta a Seguir</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>6. Fecha y Hora </p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>7. Plazo en Horas</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>8. Nombre, firma y sello del funcionario de aduana</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '72mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                <Grid item xs={12}>
                                    <h6>ADUANA DE PASO</h6>
                                </Grid>
                                <hr/>

                                <Grid item xs={6}>
                                    <p>10. Aduana de Paso</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>11. Código</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>12. Numero de dispositivo de seguridad nuevo</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>13. Fecha y Hora</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>14. Nombre, firma y sello del funcionario de aduana</p>
                                </Grid>
                                


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '30mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                
                                <Grid item xs={12}>
                                    <p>9. Observaciones</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '30mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                
                                <Grid item xs={12}>
                                    <p>9. Observaciones</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>



                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '72mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                <Grid item xs={12}>
                                    <h6>ADUANA DE PARTIDA</h6>
                                </Grid>
                                <hr/>

                                <Grid item xs={4}>
                                    <p>1. Aduana de Partida</p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p>2. Código</p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p>3. País</p>
                                </Grid>

                                <Grid item xs={6}>
                                    <p>4. Dispositivo de Seguridad</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>5. Ruta a Seguir</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>6. Fecha y Hora </p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>7. Plazo en Horas</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>8. Nombre, firma y sello del funcionario de aduana</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '72mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                <Grid item xs={12}>
                                    <h6>ADUANA DE PASO</h6>
                                </Grid>
                                <hr/>

                                <Grid item xs={6}>
                                    <p>10. Aduana de Paso</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>11. Código</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>12. Numero de dispositivo de seguridad nuevo</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>13. Fecha y Hora</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <p>14. Nombre, firma y sello del funcionario de aduana</p>
                                </Grid>
                                


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '30mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                
                                <Grid item xs={12}>
                                    <p>9. Observaciones</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>

                    <Grid item xs={6} sx={{ border: '1px solid #000', padding: '0%', height: '30mm'}}>

                            <Grid container spacing={0} sx={{  padding: '10px', marginBottom: "0%", marginTop: "0%" }}>

                                
                                <Grid item xs={12}>
                                    <p>9. Observaciones</p>
                                </Grid>


                                

                            </Grid>
                    </Grid>





                    
                    



                    
                    

                    
                
                </Grid>
                </Grid>
                {/* 306 */}
                
                
                

                
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