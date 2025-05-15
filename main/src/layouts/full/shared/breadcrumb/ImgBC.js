import React from 'react';
import UsuarioImg from 'src/assets/images/imagenes/imgsBreadcrumb/usuarios.png';
import RolesImg from 'src/assets/images/imagenes/imgsBreadcrumb/roles.png';
import DefaultImage from 'src/assets/images/breadcrumb/breadcrumb.png';

const ImgBC = () => {
    const currentPath = window.location.pathname;

    const imageMap = {
        '/usuarios/list': UsuarioImg,
        '/roles/list': RolesImg,
    };

    const breadcrumbImage = imageMap[currentPath] || DefaultImage;

    return (
        <div>
            <img src={breadcrumbImage} alt="Breadcrumb" style={{ width: '90%', height: 'auto' }} />
        </div>
    );
};

export default ImgBC;