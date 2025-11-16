import { useState } from 'react';
import { useAuth } from '../services/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export const useCart = () => {
    const { authToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://127.0.0.1:8000/api';

    // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
    // Añadimos un 3er parámetro 'options'
    const addToCart = async (productoId, cantidad = 1, options = {}) => {
        
        // Por defecto, NO es silencioso.
        // Solo será silencioso si le pasamos { silent: true }
        const isSilent = options.silent || false;

        if (!authToken) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            navigate('/login');
            throw new Error('Usuario no autenticado.'); 
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/cart/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    producto: productoId,
                    cantidad: cantidad
                })
            });

            if (response.ok) {
                // ¡AHORA PREGUNTAMOS!
                // Si NO es silencioso, mostramos la alerta.
                if (!isSilent) {
                    alert('¡Producto agregado al carrito!');
                }
            } else {
                const errorData = await response.json();
                // Si NO es silencioso, mostramos el error.
                if (!isSilent) {
                    alert(`Error: ${errorData.error || 'No se pudo agregar el producto.'}`);
                }
                // Pero SIEMPRE lanzamos el error para que Promise.all falle
                throw new Error(errorData.error || 'No se pudo agregar el producto.');
            }

        } catch (err) {
            console.error("Error en addToCart:", err);
            // Si es un error de red, SÍ mostramos la alerta
            if (!isSilent) {
                alert('Error de conexión. No se pudo conectar con el servidor.');
            }
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    return { addToCart, loadingCart: loading };
};