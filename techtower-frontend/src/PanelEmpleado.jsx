import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './services/AuthContext';
import './PanelEmpleado.css';

export default function PanelEmpleado() {
    const { user } = useAuth();

    return (
        <div className="panel-container">
            <header className="panel-header">
                <h1>Panel de Administración</h1>
                <p>Bienvenido, {user ? user.nombre : 'Empleado'}.</p>
            </header>

            <div className="panel-grid">
                
                {/* Tarjeta para el CRUD de Productos */}
                <Link to="/crud" className="panel-card">
                    <div className="card-icon">📦</div>
                    <h2>Administrar Productos</h2>
                    <p>Crear, editar, actualizar y eliminar productos del inventario.</p>
                </Link>

                {/* Tarjeta para ver Órdenes (A futuro) */}
                <Link to="/panel-ordenes" className="panel-card disabled-card">
                    <div className="card-icon">📋</div>
                    <h2>Ver Órdenes de Clientes</h2>
                    <p>Revisar el historial de pedidos pendientes y completados. (Próximamente)</p>
                </Link>
                
                {/* (Puedes añadir más tarjetas aquí) */}
                
            </div>
        </div>
    );
}