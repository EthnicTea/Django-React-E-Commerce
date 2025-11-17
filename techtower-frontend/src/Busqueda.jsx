import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from './services/useCart';
import './Computacion.css'; // Simplemente reutiliza el CSS de Computación

export default function Busqueda() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart, loadingCart } = useCart();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            
            setLoading(true);
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + `/api/products/?search=${encodeURIComponent(query)}`) //fetch(`http://127.0.0.1:8000/api/products/?search=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Error en la búsqueda');
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]); // Se ejecuta cada vez que cambia la búsqueda

    if (loading) return <div className="computacion-container"><h2>Buscando...</h2></div>;
    if (error) return <div className="computacion-container"><h2>Error: {error}</h2></div>;

    return (
        <div className="computacion-container">
            <h2 className="titulo-seccion">Resultados para: "{query}"</h2>
            
            {products.length === 0 ? (
                <p className="subtitulo-seccion">No encontramos productos con ese nombre.</p>
            ) : (
                <div className="productos-grid">
                    {/* Reusa la misma estructura de card que en Computacion.jsx */}
                    {products.map((p) => (
                        <div key={p.producto_id} className="card-producto">
                             <div className="imagen-container">
                                <img src={p.imagen} alt={p.nombre_producto} className="imagen-producto" />
                            </div>
                            <h3 className="nombre-producto">{p.nombre_producto}</h3>
                            <p className="marca">{p.marca_producto}</p>
                            <p className="precio">
                                <span className="precio-transferencia">${p.precio_transferencia.toLocaleString('es-CL')}</span>
                                <span className="precio-normal">${p.precio_otro.toLocaleString('es-CL')}</span>
                            </p>
                            <div className="botones">
                                <button className="btn-agregar" onClick={() => addToCart(p.producto_id)} disabled={loadingCart}>
                                    Agregar
                                </button>
                                <button className="btn-ver">Ver</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}