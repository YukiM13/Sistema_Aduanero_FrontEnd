import React from 'react';
import { Grid, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import breadcrumbImg from 'src/assets/images/breadcrumb/breadcrumb.png';
import { IconCircle } from '@tabler/icons';

const Breadcrumb = ({ subtitle, items, title, children }) => (
  <Grid
    container
    sx={{
      backgroundColor: '#13567d',
      borderRadius: (theme) => theme.shape.borderRadius / 4,
      p: '30px 25px 20px',
      marginBottom: '30px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        right: '-150px',
        top: '0px',
        width: '110%',
        height: '200%',
        transform: 'rotate(-12deg)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.25,
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1440 490" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path 
          d="M 0,500 L 0,93 C 111.55023923444975,76.17703349282296 223.1004784688995,59.354066985645915 325,73 C 426.8995215311005,86.64593301435409 519.1483253588517,130.76076555023926 615,134 C 710.8516746411483,137.23923444976074 810.3062200956939,99.60287081339712 898,87 C 985.6937799043061,74.39712918660288 1061.6267942583731,86.82775119617226 1150,92 C 1238.3732057416269,97.17224880382774 1339.1866028708134,95.08612440191388 1440,93 L 1440,500 L 0,500 Z" 
          stroke="none" 
          strokeWidth="0" 
          fill="#ffffff" 
          fillOpacity="0.45"
        />
        <path 
          d="M 0,500 L 0,218 C 81.28229665071768,220.48803827751198 162.56459330143537,222.97607655502392 260,213 C 357.43540669856463,203.02392344497608 471.02392344497616,180.58373205741626 580,194 C 688.9760765550238,207.41626794258374 793.3397129186601,256.688995215311 899,252 C 1004.6602870813399,247.31100478468898 1111.617224880383,188.66028708133973 1202,174 C 1292.382775119617,159.33971291866027 1366.1913875598084,188.66985645933013 1440,218 L 1440,500 L 0,500 Z" 
          stroke="none" 
          strokeWidth="0" 
          fill="#ffffff" 
          fillOpacity="0.58"
        />
        <path 
          d="M 0,500 L 0,343 C 72.35406698564591,319.5454545454545 144.70813397129183,296.09090909090907 240,310 C 335.29186602870817,323.90909090909093 453.52153110047857,375.1818181818182 567,380 C 680.4784688995214,384.8181818181818 789.2057416267942,343.1818181818182 896,332 C 1002.7942583732058,320.8181818181818 1107.6555023923445,340.0909090909091 1198,347 C 1288.3444976076555,353.9090909090909 1364.1722488038276,348.45454545454544 1440,343 L 1440,500 L 0,500 Z" 
          stroke="none" 
          strokeWidth="0" 
          fill="#ffffff" 
          fillOpacity="0.82"
        />
      </svg>
    </Box>
    <Grid item xs={12} sm={6} lg={8} mb={1}>
      <Typography variant="h4" color={'white'}>{title}</Typography>
      <Typography color="white" variant="h6" fontWeight={400} mt={0.8} mb={0}>
      <Typography
      component="a"
      href="/"
      variant="h6" fontWeight={400} mt={0.8} mb={0}   
      sx={{
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'none',
        },
      }}
    >
    Inicioㅤ
    </Typography> 
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle" width="5" height="5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="textSecondary" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0.6" >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="12" cy="12" r="9"></circle>
      </svg>ㅤ{title}
    </Typography>
      <Breadcrumbs
        separator={
          <IconCircle
            size="5"
            fill="textSecondary"
            fillOpacity={'0.6'}
            style={{ margin: '0 5px' }}
          />
        }
        sx={{ alignItems: 'center', mt: items ? '10px' : '' }}
        aria-label="breadcrumb"
      >
        {items
          ? items.map((item) => (
              <div key={item.title}>
                {item.to ? (
                  <Link underline="none" color="inherit" component={NavLink} to={item.to}>
                    {item.title}
                  </Link>
                ) : (
                  <Typography color="textPrimary">{item.title}</Typography>
                )}
              </div>
            ))
          : ''}
      </Breadcrumbs>
    </Grid>
    <Grid item xs={12} sm={6} lg={4} display="flex" alignItems="flex-end">
      
    </Grid>
  </Grid>
);

export default Breadcrumb;
