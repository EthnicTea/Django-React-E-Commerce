import { useState } from 'react';
import { useAuth } from '../services/AuthContext.jsx';

// Este es un custom hook para manejar el carrito de compras
// Provee funciones para agregar productos al carrito
// Esto optimiza el código y evita repetir lógica en varios componentes, como en las páginas de productos!

export const useCart = () => {
    const { authToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://127.0.0.1:8000/api';

    /**
     * Llama al endpoint POST /api/cart/ para agregar un producto.
     */
    const addToCart = async (productoId) => {
        if (!authToken) {
            alert('Por favor, inicia sesión para agregar productos al carrito.');
            return;
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
                // Tu backend espera 'producto' (no 'producto_id') y 'cantidad'
                body: JSON.stringify({
                    producto: productoId,
                    cantidad: 1
                })
            });

            if (response.ok) {
                // ¡Éxito!
                alert('¡Producto agregado al carrito!');
            } else {
                // Manejamos errores específicos, como el stock
                const errorData = await response.json();
                if (response.status === 400) { // Bad Request
                    alert(`Error: ${errorData.error}`); // Ej: "Stock insuficiente"
                } else {
                    throw new Error(errorData.detail || 'No se pudo agregar el producto.');
                }
            }
        // hay que hacer un error especializado cuando el token expira para avisar al usuario de que se loguee otra vez
        } catch (err) {
            setError(err.message);
            alert('Ocurrió un error de red. Intenta de nuevo.'); 
        } finally {
            setLoading(false);
        }
    };

    // (Aquí podrías agregar 'removeFromCart', 'updateQuantity' en el futuro)

    // Devolvemos la función y los estados para que los componentes los usen
    return { addToCart, loadingCart: loading, errorCart: error };
};