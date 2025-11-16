import { useState } from 'react';
import { useAuth } from '../services/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export const useCart = () => {
    const { authToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);

    const API_URL = 'http://127.0.0.1:8000/api';

    /**
     * Llama al endpoint POST /api/cart/ para agregar un producto.
     * Esta versión es 'silenciosa' (no usa 'alert') y 'lanza' (throws) errores.
     */
    const addToCart = async (productoId, cantidad = 1) => { 
        if (!authToken) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            navigate('/login');
            return;
        }

        setLoading(true);
        // setError(null);

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
                alert('¡Producto agregado al carrito!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || 'No se pudo agregar el producto.'}`);
            }

        } catch (err) {
            alert('Error de conexión. No se pudo conectar con el servidor.');
            console.error("Error en addToCart:", err);
        } finally {
            setLoading(false);
        }
    };

    return { addToCart, loadingCart: loading }; 
};