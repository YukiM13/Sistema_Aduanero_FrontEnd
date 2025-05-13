import React, {useEffect} from 'react';
import axios from 'axios';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  Snackbar,
   Typography,
    Divider,
    Chip,
    Paper

} from '@mui/material';
import PageContainer from '../../container/PageContainer';
import { Stack } from '@mui/system';
import DucaTab2Component from './DucaTab2';
import DucaTab1Component from './DucaTab1';
import DucaTab3Component from './DucaTab3';
import DucaTab4Component from './DucaTab4';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 
import VerifiedIcon from '@mui/icons-material/Verified';
import Logo from 'src/assets/images/logos/LOGO.svg';
const steps = ['Asignar DEVAS a la DUCA', 'Identificación de la declaracion', 'Declarante, Transportista y Conductor', 'Mercancia y Documentos de soporte'];
const DucaCreateComponent = ({onCancelar}) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [openSnackbar, setOpenSnackbar] = React.useState(false); 
    const [deva, setDeva] = React.useState([]);
    const ducaTab1Ref = React.useRef();
    const ducaTab2Ref = React.useRef();
    const ducaTab3Ref = React.useRef();
    const ducaTab4Ref = React.useRef();
    const isStepSkipped = (step) => skipped.has(step);
  const localStorageData = localStorage.getItem('DataUsuario');
    const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
     
    const admin = parsedData ? parsedData.usua_EsAdmin : false;
    const handleNext = async() => {
       if (activeStep === 0 && ducaTab1Ref.current) {
          const exito = await ducaTab1Ref.current.submit();
          if (!exito) {
            setOpenSnackbar(true);
            return;
         }
       }
      if (activeStep === 1 && ducaTab2Ref.current) {
        const exito = await ducaTab2Ref.current.submit();
        if (!exito) {
          // Detenemos el avance
          setOpenSnackbar(true);
          return;
        }
      }

      if (activeStep === 2 && ducaTab3Ref.current) {
        const exito = await ducaTab3Ref.current.submit();
        if (!exito) {
          setOpenSnackbar(true);
          return;
        }
      }
      if (activeStep === 3 && ducaTab4Ref.current) {
        const exito = await ducaTab4Ref.current.submit();
        if (!exito) {
          setOpenSnackbar(true);
          return
        }
        
      }
     
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
  
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    
    const listarDevas = () => {
      axios.get(`${apiUrl}/api/Duca/ListaDevaNoDuca`, {
          headers: {
              'XApiKey': apiKey
          }
  
      })
      .then(response => {
          setDeva(response.data.data);
          console.log("React E10", response.data.data)
      })
      .catch(error => {
          console.error('Error al obtener los datos del país:', error);
      });
  } 
    // eslint-disable-next-line consistent-return
    const handleSteps = (step) => {
      switch (step) {
        case 0:
          return (
            <DucaTab1Component    ref={ducaTab1Ref}/>
          );
        case 1:
          return (
            <DucaTab2Component ref={ducaTab2Ref}/>
           
          );
        case 2:
          return (
            <DucaTab3Component ref={ducaTab3Ref}/>
          );
          case 3:
            return (
              <DucaTab4Component ref={ducaTab4Ref}/>
            );
        default:
          break;
      }
    };
  
    const handleReset = () => {
      localStorage.removeItem('ducaId'); 
      localStorage.removeItem('edit');
      localStorage.removeItem('devaDuca');
      localStorage.removeItem('Devas');
      setActiveStep(0);

    };
     useEffect(() => {
            listarDevas();
            
            
    }, []);
          
    return (
      <PageContainer>
                  <Paper
                    elevation={6}
                    sx={{
                      padding: 4,
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      maxWidth: '100%',
                      margin: 'auto',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: '1px solid #ccc',
                    }}
                  >
                  <Box
            sx={{
              background: 'linear-gradient(to bottom,rgb(4, 61, 114),rgb(17, 102, 172))',
              color: '#fff',
              p: 4,
              mb: 4,
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Chip
            label="Uso Oficial"
            icon={<VerifiedIcon sx={{ color: '#fff', fontSize: '16px' }} />}
            sx={{
              position: 'absolute',
              top: 12,
              left: 16,
              fontSize: '11px',
              fontWeight: 'bold',
              backgroundColor: '#daeefb', // Rojo oscuro elegante
              color: 'navy',
  
              borderRadius: '4px',
              px: 1.5,
              py: 0.5,
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              '& .MuiChip-icon': {
                marginLeft: 0,
                marginRight: '4px',
              }
            }}
          />

            <img
              src={Logo}
              alt="Logo Institucional"
              style={{ height: '50px', marginBottom: '1rem' }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                letterSpacing: 1
              }}
            >
              Dirección General de Aduanas
            </Typography>


            <Divider
                sx={{
                  width: '30%',
                  mx: 'auto',
                  borderColor: '#bbdefb',
                  borderBottomWidth: '2px',
                  my: 1,
                }}
              />

            <Typography
              variant="h6"
              sx={{
                color: '#e3f2fd',
                mb: 1,
                fontStyle: 'italic'
              }}
            >
              Formulario de Declaración Unica Centroamericana (DUCA)
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: '#bbdefb', mb: 2 }}
            >
              Conforme al Acuerdo de Valor del GATT – Artículo 17
            </Typography>

            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 16,
                fontSize: '12px',
                color: '#bbdefb',
                textAlign: 'right'
              }}
            >
              <Typography variant="body2">Código del Formulario: DUCA-001</Typography>
              <Typography variant="body2">Revisión: 03 | Vigencia: 2025</Typography>
            </Box>
          </Box>
    
          <Box width="100%">
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
               
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <>
                <Stack spacing={2} >
                  <Alert severity='success' mt={2}>DUCA insertada exitosamente</Alert>
  
                  <Box textAlign="right">
                    <Button onClick={handleReset} variant="contained" color="error">
                      Regresar
                    </Button>
                  </Box>
                </Stack>
              </>
            ) : (
              <>
                <Box>{handleSteps(activeStep)}</Box>
  
                <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={!admin && activeStep === 0}
                  onClick={admin && activeStep === 0 ? onCancelar : handleBack}
                  startIcon={<ArrowBackIcon />}
                >
                  {admin && activeStep === 0 ? 'Cancelar' : 'Atrás'}
                 
                </Button>

                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={activeStep === 0 && deva.length ===0 && !localStorage.getItem('devaDuca')}
                  color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                  endIcon={
                    activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />
                  }
                >
                  {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </Box>
              </>
            )}
          </Box>
        </Paper>
         <Snackbar
                open={openSnackbar}
                autoHideDuration={3000} // Duración de la alerta
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert
                  onClose={() => setOpenSnackbar(false)}
                  severity="error"
                  sx={{ width: '100%' }}
                >
                  Hubo un error intente de vuelta.
                </Alert>
              </Snackbar>   
        
      </PageContainer>
    );
  };

export default DucaCreateComponent;
