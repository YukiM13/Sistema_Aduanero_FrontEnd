import { Menu } from '@mui/material';
import {
  IconPoint,
  IconUser,
  IconShoppingCart,
  IconWorld,
  IconBuildingFactory2,
  IconPackgeExport,
  IconFileText,
  IconFileCertificate,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

if (localStorage.getItem('DataUsuario') === null) {
  window.location.href = '/auth/login';
}
const localStorageData = localStorage.getItem('DataUsuario');
const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
const esAdmin = parsedData ? parsedData.usua_EsAdmin : 'esAdmin';
const roleId = parsedData ? parsedData.role_Id : 'roleId';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
];
console.log('Entrando al menu de items');
if (!esAdmin) {
  console.log('No es admin');
  if (roleId === 9) {
    console.log('Es admin de ventas');
    Menuitems.push({
      id: uniqueId(),
      title: 'Acceso',
      icon: IconUser,
      href: '/apps/blog/',
      children: [
        {
          id: uniqueId(),
          title: 'Usuarios',
          icon: IconPoint,
          href: '/usuarios/list',
          chipColor: 'secondary',
        },
      ],
    });
  }
}

export default Menuitems;