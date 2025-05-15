import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControlLabel,
  Divider,
  Snackbar,
  Chip,
  Alert,
  Paper
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import VerifiedIcon from '@mui/icons-material/Verified';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';
import { Stack } from '@mui/system';
import Tab1 from './DeclaracionTab1';
import Tab2 from './DeclaracionTab2';
import Tab3 from './DeclaracionTab3';
import Logo from 'src/assets/images/logos/LOGO.svg';

const steps = ['Información del importador', 'Informacion del proveedor e intermediario', 'Transacción'];

const DeclaracionValor = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [openSnackbar, setOpenSnackbar] = React.useState(false); 

  const devaTab1Ref = React.useRef();
  const devaTab2Ref = React.useRef();
  const devaTab3Ref = React.useRef();


  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = async() => {
    if (activeStep === 0 && devaTab1Ref.current) {
      const exito = await devaTab1Ref.current.submit();
      if (exito) {
        // Mostramos los valores del formulario al hacer submit exitoso
        console.log("Datos del paso 1 enviados:", devaTab1Ref.current.getValues?.());
  
        // Continuar al siguiente paso
      } else {
        setOpenSnackbar(true);
        return;
      }
    }
   if (activeStep === 1 && devaTab2Ref.current) {
     const exito = await devaTab2Ref.current.submit();
     if (!exito) {
       // Detenemos el avance
       setOpenSnackbar(true);
       return;
     }
   }

   if (activeStep === 2 && devaTab3Ref.current) {
     const exito = await devaTab3Ref.current.submit();
     if (!exito) {
       setOpenSnackbar(true);
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

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // eslint-disable-next-line consistent-return
  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          <Tab1 ref={devaTab1Ref}/>
        );
      case 1:
        return (
          <Tab2 ref={devaTab2Ref}/>
        );
      case 2:
        return (
          <Tab3 ref={devaTab3Ref}/>
        );
      default:
        break;
    }
  };

  const handleReset = () => {
    localStorage.removeItem('devaId');
    setActiveStep(0);
  };
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
    fontWeight: 'bold',
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
    Formulario de Declaración de Valor en Aduana
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
    <Typography variant="body2">Código del Formulario: DVA-001</Typography>
    <Typography variant="body2">Revisión: 03 | Vigencia: 2025</Typography>
  </Box>
</Box>

        <Box width="100%">
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption"></Typography>;
              }
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
                <Alert severity='success' mt={2}>Todos los datos se han completado</Alert>

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
                <Box flex="1 1 auto" />
                
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color={activeStep === steps.length - 1 ? 'success' : 'secondary'}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default DeclaracionValor;
