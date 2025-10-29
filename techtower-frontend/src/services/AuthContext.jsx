import React, { createContext, useState, useContext, useEffect } from 'react';
// (Si prefieres axios, puedes usarlo aquí también)

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(null); // Aquí guardaremos { email, is_staff, ... }
    const [loading, setLoading] = useState(true); // Para saber si estamos cargando

    // ¡NUEVA FUNCIÓN!
    // Cada vez que el 'authToken' cambie (login/logout), este efecto se dispara
    useEffect(() => {
        const fetchUser = async () => {
            if (authToken) {
                try {
                    // 1. Usa el token para pedir los datos del usuario
                    const response = await fetch('http://127.0.0.1:8000/api/user/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        console.log("DATOS DEL USUARIO RECIBIDOS:", userData);
                        setUser(userData.user); // 2. Guarda los datos del usuario en el estado
                    } else {
                        // Si el token es inválido (expiró), lo borramos
                        console.error('Token inválido, cerrando sesión.');
                        logoutAction();
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // Podría ser un error de red, cerramos sesión por seguridad
                    logoutAction();
                }
            } else {
                // Si no hay token, no hay usuario
                setUser(null);
            }
            setLoading(false); // Terminamos de cargar
        };

        fetchUser();
    }, [authToken]); // Se ejecuta cada vez que 'authToken' cambia


    const loginAction = (tokenData) => {
        localStorage.setItem('authToken', tokenData.access);
        setAuthToken(tokenData.access);
        // No necesitamos 'setUser' aquí, el 'useEffect' de arriba se encargará
    };

    const logoutAction = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
        // (Aquí llamarías a /api/logout/ si es necesario)
    };

    // No mostramos la app hasta saber si estamos logeados o no
    if (loading) {
        return <div>Cargando...</div>; // O un spinner
    }

    return (
        <AuthContext.Provider value={{ authToken, user, loginAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};