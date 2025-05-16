import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/404.png';

const Error = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <img src={ErrorImg} alt="404" width={400} height={400} />
      <Typography align="center" variant="h1" mb={4}>
        Opps!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        La pagina que buscas no se encuentra o no tienes acceso a ella.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        component={Link}
        to="/dashboards/modern"
        disableElevation
      >
        Ir al inicio
      </Button>
    </Container>
  </Box>
);

export default Error;
