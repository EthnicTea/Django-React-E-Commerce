import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductoDetalle.css';

export function ProductoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        // Fetch del producto desde Django
        const fetchProducto = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/productos/${id}/`); // Ajusta la URL de tu API
                
                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                
                const data = await response.json();
                setProducto(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    const handleAgregarCarrito = () => {
        // Lógica para agregar al carrito (implementar según tu sistema)
        console.log(`Agregando ${cantidad} unidad(es) del producto ${producto.name}`);
        alert(`${cantidad} ${producto.name} agregado(s) al carrito`);
    };

    const incrementarCantidad = () => {
        if (cantidad < producto.stock) {
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
                
                {/* Botón volver */}
                <button onClick={() => navigate(-1)} className="btn-volver-top">
                    ← Volver
                </button>

                <div className="producto-detalle-content">
                    
                    {/* Columna izquierda: Imagen */}
                    <div className="producto-imagen-section">
                        <div className="imagen-principal-container">
                            <img 
                                src={producto.image} 
                                alt={producto.name} 
                                className="imagen-principal"
                            />
                        </div>
                    </div>

                    {/* Columna derecha: Información */}
                    <div className="producto-info-section">
                        
                        {/* Marca y categoría */}
                        <div className="producto-meta">
                            <span className="producto-marca">{producto.brand}</span>
                            <span className="producto-separador">|</span>
                            <span className="producto-categoria">{producto.category}</span>
                        </div>

                        {/* Nombre del producto */}
                        <h1 className="producto-titulo">{producto.name}</h1>

                        {/* Stock */}
                        <div className="producto-stock">
                            {producto.stock > 0 ? (
                                <span className="stock-disponible">
                                    ✓ Stock disponible: {producto.stock} unidades
                                </span>
                            ) : (
                                <span className="stock-agotado">
                                    ✗ Sin stock
                                </span>
                            )}
                        </div>

                        {/* Precios */}
                        <div className="producto-precios">
                            <div className="precio-principal">
                                <span className="precio-label">Precio Transferencia:</span>
                                <span className="precio-valor">{producto.price}</span>
                            </div>
                            <div className="precio-secundario">
                                <span className="precio-label">Otro método de pago:</span>
                                <span className="precio-valor-secundario">{producto.price2}</span>
                            </div>
                        </div>

                        {/* Descripción */}
                        {producto.descripcion && (
                            <div className="producto-descripcion">
                                <h3>Descripción</h3>
                                <p>{producto.descripcion}</p>
                            </div>
                        )}

                        {/* Especificaciones técnicas */}
                        {producto.especificaciones && producto.especificaciones.length > 0 && (
                            <div className="producto-especificaciones">
                                <h3>Especificaciones Técnicas</h3>
                                <ul>
                                    {producto.especificaciones.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Selector de cantidad y botón agregar */}
                        {producto.stock > 0 && (
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
                                        disabled={cantidad >= producto.stock}
                                    >
                                        +
                                    </button>
                                </div>
                                <button 
                                    onClick={handleAgregarCarrito}
                                    className="btn-agregar-carrito"
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}