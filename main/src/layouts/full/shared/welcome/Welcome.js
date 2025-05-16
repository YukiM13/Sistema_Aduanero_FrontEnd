import * as React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const Welcome = () => {
  const [open, setOpen] = React.useState(false);
  const localStorageData = localStorage.getItem('DataUsuario');
  const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
  const userName = parsedData ? parsedData.usua_Nombre : 'Usuario';

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClick();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: '100%', color: 'white' }}
        >
          <AlertTitle>Hola {userName}</AlertTitle>
          <strong>¡Bienvenido a Frontier Logistic!</strong>
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Welcome;
