import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const localStorageData = localStorage.getItem('DataUsuario');
    const isAuthenticated = localStorageData ? true : false;

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" />;
    }
    return children;
};

export default PrivateRoute;