import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControlLabel,
  Alert,
} from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import ParentCard from '../../../components/shared/ParentCard';
import { Stack } from '@mui/system';
import DucaTab2Component from './DucaTab2';
import DucaTab1Component from './DucaTab1';

const steps = ['Asignar DEVAS a la DUCA', 'Identificación de la declaracion', 'Declarante, Transportista y Conductor', 'Mercancia y Documentos de soporte'];
const DucaCreateComponent = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const ducaTab1Ref = React.useRef();
    const ducaTab2Ref = React.useRef();
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
            <Box pt={3}>
              <Typography variant="h5">Terms and condition</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Sard about this site or you have been to it, but you cannot figure out what it is or
                what it can do. MTA web directory isSard about this site or you have been to it, but
                you cannot figure out what it is or what it can do. MTA web directory is
              </Typography>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Agree with terms?"
              />
            </Box>
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
                <Stack spacing={2} mt={3}>
                  <Alert severity='success' mt={2}>All steps completed - you&apos;re finished</Alert>
  
                  <Box textAlign="right">
                    <Button onClick={handleReset} variant="contained" color="error">
                      Reset
                    </Button>
                  </Box>
                </Stack>
              </>
            ) : (
              <>
                <Box>{handleSteps(activeStep)}</Box>
  
                <Box display="flex" flexDirection="row" mt={3}>
                  <Button
                    color="inherit"
                    variant="contained"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  
  
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                  >
                    {activeStep === steps.length - 1 ? 'Finalizar' : 'siguiente'}
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
