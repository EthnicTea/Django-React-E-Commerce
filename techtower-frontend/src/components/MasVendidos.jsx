import React, { useState, useEffect } from 'react';
import './MasVendidos.css';
import { useCart } from '../services/useCart'; // Importamos el hook del carrito

const BestSellers = () => {
    // Usamos 'products' para guardar lo que nos dé la API
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Hook del carrito para el botón "Agregar"
    const { addToCart, loadingCart } = useCart();

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                // Llamamos a la API pidiendo SOLO los destacados
                const response = await fetch('http://127.0.0.1:8000/api/products/?destacado=true');
                
                if (!response.ok) {
                    throw new Error('Error al cargar los más vendidos');
                }
                
                const data = await response.json();
                // La API ya los filtró, así que los guardamos directamente
                setProducts(data);
                
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchBestSellers();
    }, []);

    if (loading) return <div className="best-sellers"><h2>Cargando ofertas...</h2></div>;
    if (error) return null; // O muestra un mensaje de error discreto

    return (
        <div className="best-sellers">
    <h2>Más Vendidos / Destacados</h2>
    <div className="product-list">
        {products.map(product => (
            <div key={product.producto_id} className="product-card-header-seller">
                {/* Imagen del producto */}
                <div className="imagen-container-seller">
                    <img src={product.imagen} alt={product.nombre_producto} className="product-image-seller" />
                </div>
                
                {/* Nombre del producto */}
                <h3 className="product-name-header-seller">{product.nombre_producto}</h3>
                
                {/* Precio (agrupado) */}
                <div className="precio-seller">
                    <span className="precio-transferencia-seller">
                        ${product.precio_transferencia.toLocaleString('es-CL')}
                    </span>
                    <span className="precio-normal-seller">
                        ${product.precio_otro.toLocaleString('es-CL')}
                    </span>
                </div>

                {/* --- ¡NUEVO! Contenedor de botones --- */}
                <div className="botones-seller">
                    <button 
                        className="btn-agregar-seller"
                        onClick={() => addToCart(product.producto_id)}
                        disabled={loadingCart}
                    >
                        Agregar
                    </button>
                    {/* El botón "Ver" que querías agregar */}
                    <button className="btn-ver-seller">
                        Ver
                    </button>
                </div>
                {/* ------------------------------------- */}

            </div>
        ))}
    </div>
</div>
    );
};

export default BestSellers;