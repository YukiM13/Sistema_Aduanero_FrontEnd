import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
} from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { Stack } from '@mui/system';
import DucaTab2Component from './DucaTab2';
import DucaTab1Component from './DucaTab1';
import DucaTab3Component from './DucaTab3';
import DucaTab4Component from './DucaTab4';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon   from '@mui/icons-material/ArrowBack'; 

const steps = ['Asignar DEVAS a la DUCA', 'Identificación de la declaracion', 'Declarante, Transportista y Conductor', 'Mercancia y Documentos de soporte'];
const DucaCreateComponent = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const ducaTab1Ref = React.useRef();
    const ducaTab2Ref = React.useRef();
    const ducaTab3Ref = React.useRef();
    const ducaTab4Ref = React.useRef();

    const isStepSkipped = (step) => skipped.has(step);
  
    const handleNext = async() => {
      // if (activeStep === 0 && ducaTab1Ref.current) {
      //   const exito = await ducaTab1Ref.current.submit();
      //   if (!exito) {
      //     // Detenemos el avance
      //     return;
      //   }
      // }
      if (activeStep === 1 && ducaTab2Ref.current) {
        const exito = await ducaTab2Ref.current.submit();
        if (!exito) {
          // Detenemos el avance
          return;
        }
      }

      if (activeStep === 2 && ducaTab3Ref.current) {
        const exito = await ducaTab3Ref.current.submit();
        if (!exito) {
          // Detenemos el avance
          return;
        }
      }
      if (activeStep === 3 && ducaTab4Ref.current) {
        const exito = await ducaTab4Ref.current.submit();
        if (exito) {
          localStorage.removeItem('ducaId'); 
          localStorage.removeItem('edit'); 
        }
        else{
        
          return;
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
  
    
  
    // eslint-disable-next-line consistent-return
    const handleSteps = (step) => {
      switch (step) {
        case 0:
          return (
            <DucaTab1Component ref={ducaTab1Ref}/>
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
      setActiveStep(0);
    };
    return (
      <PageContainer>
        <Breadcrumb title="DUCA" description="this is Form Wizard page" />
        <ParentCard >
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
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                >
                  Atrás
                </Button>

                <Button
                  onClick={handleNext}
                  variant="contained"
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
        </ParentCard>
      </PageContainer>
    );
  };

export default DucaCreateComponent;
