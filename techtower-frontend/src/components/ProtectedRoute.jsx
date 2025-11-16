import React from 'react';
import { useAuth } from '../services/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // Muestra "Cargando..." mientras se verifica el usuario
        return <div>Verificando permisos...</div>;
    }

    if (!user || !(user.is_staff || user.isStaff)) {
        // Si no hay usuario o NO es staff, redirige al inicio
        return <Navigate to="/" replace />;
    }

    // Si es staff, muestra la página que está protegiendo (PanelEmpleado)
    return <Outlet />;
};

export default ProtectedRoute;