import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import './ProductoDetalle.css';
import { useCart } from '../services/useCart.jsx'; 
import { useAuth } from '../services/AuthContext.jsx';

export function ProductoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- Hooks ---
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    
    const { addToCart, loadingCart } = useCart(); 
    const { authToken } = useAuth(); 

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);
                
                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                
                const data = await response.json();
                setProducto(data);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]); // Se ejecuta cada vez que el ID de la URL cambie

    const handleAgregarCarrito = () => {
        if (!authToken) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            navigate('/login');
            return;
        }
        // Llama a la función del hook con el ID y la cantidad
        addToCart(producto.producto_id, cantidad);
        alert(`${cantidad} ${producto.nombre_producto} agregado(s) al carrito`);
    };

   const incrementarCantidad = () => {
        // Usamos el nombre de campo correcto 'stock_producto'
        if (cantidad < producto.stock_producto) {
            setCantidad(cantidad + 1);
        }
    };

    const decrementarCantidad = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    };
    
    if (loading) {
        return (
            <div className="producto-detalle-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="producto-detalle-container">
                <div className="error-container">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)} className="btn-volver">
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="producto-detalle-container">
                <div className="error-container">
                    <h2>Producto no encontrado</h2>
                    <button onClick={() => navigate(-1)} className="btn-volver">
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="producto-detalle-container">
            <div className="producto-detalle-wrapper">
                
                <button onClick={() => navigate(-1)} className="btn-volver-top">
                    ← Volver
                </button>

                <div className="producto-detalle-content">
                    
                    <div className="producto-imagen-section">
                        <div className="imagen-principal-container">
                            <img 
                                src={producto.imagen} 
                                alt={producto.nombre_producto} 
                                className="imagen-principal"
                            />
                        </div>
                    </div>

                    <div className="producto-info-section">
                        
                        <div className="producto-meta">
                            <span className="producto-marca">{producto.marca_producto}</span>
                            <span className="producto-separador">|</span>
                            {/* Mostramos el nombre de la categoría (si tu serializer lo anida) */}
                            <span className="producto-categoria">
                                {producto.categoria?.nombre_categoria || 'Categoría'}
                            </span>
                        </div>

                        <h1 className="producto-titulo">{producto.nombre_producto}</h1>

                        <div className="producto-stock">
                            {producto.stock_producto > 0 ? (
                                <span className="stock-disponible">
                                    ✓ Stock disponible: {producto.stock_producto} unidades
                                </span>
                            ) : (
                                <span className="stock-agotado">
                                    ✗ Sin stock
                                </span>
                            )}
                        </div>

                        {/* Precios con descuento (si existen) */}
                        <div className="producto-precios">
                            {producto.descuento > 0 && (
                                <div className="precio-secundario">
                                    <span className="precio-label">Precio Normal:</span>
                                    <span className="precio-valor-secundario" style={{textDecoration: 'line-through'}}>
                                        ${producto.precio_otro.toLocaleString('es-CL')}
                                    </span>
                                </div>
                            )}
                            <div className="precio-principal">
                                <span className="precio-label">Precio Transferencia:</span>
                                <span className="precio-valor">
                                    ${producto.precio_final_transferencia.toLocaleString('es-CL')}
                                </span>
                            </div>
                        </div>

                        <div className="producto-descripcion">
                            <h3>Descripción</h3>
                            {/* Usamos 'dangerouslySetInnerHTML' si la descripción es HTML, o solo <p> si es texto plano */}
                            <p>{producto.descripcion_producto}</p>
                        </div>
                        
                        {/* (Puedes añadir la 'Ficha Técnica' aquí en el futuro) */}

                        {producto.stock_producto > 0 ? (
                            <div className="producto-acciones">
                                <div className="cantidad-selector">
                                    <button 
                                        onClick={decrementarCantidad}
                                        className="btn-cantidad"
                                        disabled={cantidad <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="cantidad-valor">{cantidad}</span>
                                    <button 
                                        onClick={incrementarCantidad}
                                        className="btn-cantidad"
                                        disabled={cantidad >= producto.stock_producto}
                                    >
                                        +
                                    </button>
                                </div>
                                <button 
                                    onClick={handleAgregarCarrito}
                                    className="btn-agregar-carrito"
                                    disabled={loadingCart} // Deshabilita mientras se añade
                                >
                                    {loadingCart ? 'Agregando...' : 'Agregar al Carrito'}
                                </button>
                            </div>
                        ) : (
                            <p>Producto no disponible.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}