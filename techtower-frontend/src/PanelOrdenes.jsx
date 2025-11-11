// src/pages/PanelOrdenes.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './services/AuthContext.jsx';
import './PanelOrdenes.css'; // ¡CSS nuevo!

export default function PanelOrdenes() {
    const { authToken } = useAuth(); // Para autenticar la petición
    
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para filtros (¡para el futuro!)
    const [filtroEstado, setFiltroEstado] = useState('todas'); // ej: 'todas', 'aprobado', 'pendiente'

    useEffect(() => {
        const fetchTodasLasOrdenes = async () => {
            setLoading(true);
            try {
                // 1. Llamamos al endpoint de ADMIN
                const response = await fetch('http://127.0.0.1:8000/api/admin/ordenes/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}` // Token de empleado
                    }
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('No tienes permisos para ver esta página.');
                    }
                    throw new Error('No se pudieron cargar las órdenes.');
                }
                const data = await response.json();
                setOrdenes(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTodasLasOrdenes();
    }, [authToken]); // Se carga al inicio

    // Lógica simple de filtrado (se puede mejorar)
    const ordenesFiltradas = ordenes.filter(orden => {
        if (filtroEstado === 'todas') return true;
        return orden.estado_orden.toLowerCase() === filtroEstado;
    });

    if (loading) return <div className="panel-ordenes-container"><h2>Cargando Órdenes...</h2></div>;
    if (error) return <div className="panel-ordenes-container"><h2 className="error-texto">{error}</h2></div>;

    return (
        <div className="panel-ordenes-container">
            <header className="panel-ordenes-header">
                <h1>Panel de Órdenes</h1>
                <p>Aquí puedes ver y administrar todas las órdenes de los clientes.</p>
            </header>

            {/* Barra de Filtros (simple) */}
            <div className="order-filter-bar">
                <label htmlFor="filtro-estado">Filtrar por estado:</label>
                <select id="filtro-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                    <option value="todas">Todas</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="rechazado">Rechazado</option>
                </select>
            </div>

            {/* Tabla de Órdenes */}
            <div className="order-table-container">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>Cliente (Email)</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenesFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>No hay órdenes que coincidan con el filtro.</td>
                            </tr>
                        ) : (
                            ordenesFiltradas.map(orden => (
                                <tr key={orden.orden_id}>
                                    <td><strong>#{orden.orden_id}</strong></td>
                                    <td>{orden.usuario_orden}</td>
                                    <td>{orden.fecha_orden}</td>
                                    <td>
                                        <span className={`estado-badge ${orden.estado_orden.toLowerCase()}`}>
                                            {orden.estado_orden}
                                        </span>
                                    </td>
                                    <td>${orden.total_orden.toLocaleString('es-CL')}</td>
                                    <td className="order-items-cell">
                                        {orden.items.map(item => (
                                            <div key={item.producto.producto_id} className="order-item-detail">
                                                <img src={item.producto.imagen} alt={item.producto.nombre_producto} />
                                                <span>{item.producto.nombre_producto} (x{item.cantidad})</span>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}