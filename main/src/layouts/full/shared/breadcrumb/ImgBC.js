import React from 'react';
import UsersImage from 'src/assets/images/imagenes/imgsBreadcrumb/usuarios.png';
import DefaultImage from 'src/assets/images/breadcrumb/breadcrumb.png';

const ImgBC = () => {
    const currentPath = window.location.pathname;

    const imageMap = {
        '/usuarios/list': UsersImage,
    };

    const breadcrumbImage = imageMap[currentPath] || DefaultImage;

    return (
        <div>
            <img src={breadcrumbImage} alt="Breadcrumb" style={{ width: '100%', height: 'auto' }} />
        </div>
    );
};

export default ImgBC;