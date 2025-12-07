import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para refrescar los datos del usuario
    const fetchUser = async () => {
        if (authToken) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    console.log("DATOS DEL USUARIO RECIBIDOS:", userData);
                    setUser(userData.user);
                    return true; // Éxito
                } else {
                    console.error('Token inválido, cerrando sesión.');
                    logoutAction();
                    return false; // Falló
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                logoutAction();
                return false; //  Falló
            }
        } else {
            setUser(null);
            return false; //  No hay token
        }
    };

    // Cada vez que el 'authToken' cambie (login/logout), este efecto se dispara
    useEffect(() => {
        const loadUser = async () => {
            await fetchUser();
            setLoading(false); // Terminamos de cargar
        };

        loadUser();
    }, [authToken]);

    const loginAction = (tokenData) => {
        localStorage.setItem('authToken', tokenData.access);
        setAuthToken(tokenData.access);
    };

    const logoutAction = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);

        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };

    //  Función pública para refrescar el usuario manualmente
    const refreshUser = async () => {
        console.log("🔄 Refrescando datos del usuario...");
        return await fetchUser();
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            authToken, 
            user, 
            loginAction, 
            logoutAction,
            refreshUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};