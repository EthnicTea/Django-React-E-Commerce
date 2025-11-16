import React, { useState, useEffect } from "react";
import { useAuth } from './services/AuthContext';
import './Carrito.css';
import { useNavigate, Link } from 'react-router-dom';

const ShoppingCart = () => {
    const { authToken } = useAuth();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://127.0.0.1:8000/api';

    // Aquí se carga el carrito! osi
    const fetchCartItems = async () => {
        if (!authToken) { // Si no hay token, le avisa que se loguee -_- sino q no ande chingando
            setError(<>Debes iniciar sesión o registrarte para ver tu carrito. Regístrate <Link to="/register" className="span-error">aquí</Link></>);
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/cart/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('No se pudo cargar tu carrito.');
            }
            const data = await response.json();
            
            // Productos aninados -_-
            setCartItems(data.items || []); 
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [authToken]);

    // Importante, estas funciones manejan cambios en cantidad y eliminación!

    const handleQuantityChange = async (itemId, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            // Si es 0 se va! chaolin
            handleRemoveItem(itemId);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/cart/`, { 
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ item_id: itemId, cantidad: nuevaCantidad })
            });

            if (!response.ok) { // Hay que hacer otro manejo de error, en donde el backend diga "no hay stock" o algo así
                throw new Error('No se pudo actualizar la cantidad.');
            }
            
            // aquí el backend dice "si ok entiendo, toma"
            const data = await response.json();
            setCartItems(data.items || []);

        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await fetch(`${API_URL}/cart/`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ item_id: itemId })
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el producto.');
            }
            
            // Si el backend responde "si ok entiendo, ya borro la cuenta -_-" y se actualiza el estado local
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            alert(err.message);
        }
    };

    // CALCULOS!!!!!
    const subtotal = cartItems.reduce(
        (acc, item) => acc + (item.producto.precio_transferencia * item.cantidad),
        0
    );
    const shipping = 0;
    const total = subtotal + shipping;

    const formatter = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
    });

    // Render extras
    if (loading) { /* blabla, quizá nunca se vea este */ }
    if (error) { /* blabla! */ }

    return (
        <div className="cart-container">
            <h1>Tu Carrito</h1>
            
            <div className="cart-main">
                <div className="cart-items-list">
                    {cartItems.length === 0 ? (
                        <p className="cart-no-item">Tu carrito está vacío...</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item-row" key={item.id}>
                                <img
                                    src={item.producto.imagen}
                                    alt={item.producto.nombre_producto}
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <p className="item-name">{item.producto.nombre_producto}</p>
                                    <p className="item-price">{formatter.format(item.producto.precio_transferencia)}</p>
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)} 
                                        className="item-remove-btn"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                <div className="item-quantity">
                                    <button onClick={() => handleQuantityChange(item.id, item.cantidad - 1)} 
                                    disabled={item.cantidad < 1}>-</button>
                                    <span>{item.cantidad}</span>
                                    <button onClick={() => handleQuantityChange(item.id, item.cantidad + 1)} 
                                    disabled={item.cantidad >= item.producto.stock_producto}>+</button>
                                </div>
                                <div className="item-total-price">
                                    {formatter.format(item.producto.precio_transferencia * item.cantidad)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                  <div className="cart-summary">
                      <h2>Resumen</h2>
                      
                      <div className="summary-row">
                          <span>Subtotal</span>
                          <span>{formatter.format(subtotal)}</span>
                      </div>
                      <div className="summary-row">
                          <span>Envío</span>
                          <span>{shipping === 0 ? 'Gratis' : formatter.format(shipping)}</span>
                      </div>
                      <div className="summary-divider"></div>
                      <div className="summary-row total">
                          <span>Total</span>
                          <span>{formatter.format(total)}</span>
                      </div>
                      <button 
                          className="checkout-button"
                          onClick={() => setTimeout(() => navigate('/Pasarela', { state: { totalAPagar: total } }), 2000)}
                      >
                          Ir a Pagar
                      </button>
                  </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;