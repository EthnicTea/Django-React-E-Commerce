import { useState } from 'react';
import { useAuth } from '../services/AuthContext.jsx';

export const useCart = () => {
    const { authToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://127.0.0.1:8000/api';

    /**
     * Llama al endpoint POST /api/cart/ para agregar un producto.
     * Esta versión es 'silenciosa' (no usa 'alert') y 'lanza' (throws) errores.
     */
    const addToCart = async (productoId, cantidad = 1) => { // Aceptamos cantidad
        if (!authToken) {
            // Si no hay token, lanzamos un error para que el componente lo maneje
            throw new Error('Usuario no autenticado.');
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/cart/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    producto: productoId,
                    cantidad: cantidad // Usamos la cantidad
                })
            });

            if (response.ok) {
                console.log(`Producto ${productoId} agregado.`);
            } else {
                // Si el backend falla (ej. sin stock), lanzamos un error
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo agregar el producto.');
            }

        } catch (err) {
            setError(err.message);
            // Re-lanzamos el error para que Promise.all lo capture
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    // (Aquí podrías agregar 'removeFromCart', 'updateQuantity' en el futuro)

    return { addToCart, loadingCart: loading, errorCart: error };
};