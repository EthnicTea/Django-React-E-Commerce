import React, { useState, useEffect } from 'react';
import { useAuth } from './services/AuthContext.jsx';
import { Link } from 'react-router-dom';
import './MiCuenta.css';

export default function MiCuenta() {
    const { user, authToken } = useAuth();
    
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return; 

        const fetchMisOrdenes = async () => {
            setLoading(true);
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/api/mi-ordenes/', { // fetch('http://127.0.0.1:8000/api/mi-ordenes/',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}` // ¡La autenticación!
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudieron cargar tus pedidos.');
                }
                const data = await response.json();
                setOrdenes(data); // Guardamos los pedidos en el estado

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMisOrdenes();
    }, [user, authToken]);
    if (!user) {
        return <div className="mi-cuenta-container">Cargando...</div>;
    }

    return (
        <div className="mi-cuenta-container">
            <h1>Tu Cuenta</h1>
            <p className="mi-cuenta-saludo">
                Hola, {user.nombre || user.email}. Aquí puedes ver tus datos y pedidos.
            </p>

            <div className="mi-cuenta-seccion">
                <h2>Mis Datos</h2>
                <div className="datos-grid">
                    <div className="dato-item">
                        <strong>Nombre:</strong>
                        <span>{user.nombre || 'No ingresado'}</span>
                    </div>
                    <div className="dato-item">
                        <strong>Apellido:</strong>
                        <span>{user.apellido || 'No ingresado'}</span>
                    </div>
                    <div className="dato-item">
                        <strong>Email:</strong>
                        <span>{user.email}</span>
                    </div>
                    <div className="dato-item">
                        <strong>Teléfono:</strong>
                        <span>{user.telefono || 'No ingresado'}</span>
                    </div>
                    <div className="dato-item full-width">
                        <strong>Dirección:</strong>
                        <span>{user.direccion || 'No ingresada'}</span>
                    </div>
                    <div className="dato-item">
                        <strong>Región:</strong>
                        <span>{user.region || 'No ingresada'}</span>
                    </div>
                    <div className="dato-item">
                        <strong>Comuna:</strong>
                        <span>{user.comuna || 'No ingresada'}</span>
                    </div>
                </div>
                <Link to="/PerfilUsuario" className="mi-cuenta-boton">
                    Editar mis Datos
                </Link>
            </div>

            <div className="mi-cuenta-seccion">
                <h2>Mis Pedidos</h2>
                
                {loading && <p>Cargando pedidos...</p>}
                {error && <p className="error-texto">{error}</p>}
                
                {!loading && !error && (
                    <div className="lista-pedidos">
                        {ordenes.length === 0 ? (
                            <p>Aún no has realizado ningún pedido.</p>
                        ) : (
                            ordenes.map(orden => (
                                <div key={orden.orden_id} className="pedido-item">
                                    <div className="pedido-header">
                                        <h3>Pedido #{orden.orden_id}</h3>
                                        <span className={`estado-pedido ${orden.estado_orden.toLowerCase()}`}>
                                            {orden.estado_orden}
                                        </span>
                                    </div>
                                    <div className="pedido-info">
                                        <span>Fecha: {orden.fecha_orden}</span>
                                        <span>Total: ${orden.total_orden.toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="pedido-items-list">
                                        <strong>Items:</strong>
                                        {/* SE MAPEA LOS PRODUCTOS DENTRO DE LA ORDEEEEN */}
                                        {orden.items.map(item => (
                                            <div key={item.producto.producto_id} className="pedido-sub-item">
                                                <img src={item.producto.imagen} alt={item.producto.nombre_producto} />
                                                <span>{item.producto.nombre_producto} (x{item.cantidad})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}