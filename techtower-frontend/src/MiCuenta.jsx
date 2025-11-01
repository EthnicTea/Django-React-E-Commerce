import React from 'react';
import { useAuth } from './services/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './MiCuenta.css';

export default function MiCuenta() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading || !user) {
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

            {/* --- Mockup, para más adelante --- */}
            <div className="mi-cuenta-seccion">
                <h2>Mis Pedidos</h2>
                 <div className="pedido-mockup"> {/*Cambiar clases??? */}
                    <p>Orden #12345 - <strong>Enviado</strong></p>
                    <span>Fecha: 28/10/2025</span>
                    <p className="pedido-items">Monitor ASUS VA24EHF, Teclado Mecánico Razer...</p>
                </div>
                <div className="pedido-mockup">
                    <p>Orden #12344 - <strong>Entregado</strong></p>
                    <span>Fecha: 15/10/2025</span>
                    <p className="pedido-items">Mouse Gamer Redragon...</p>
                </div>
            </div>
        </div>
    );
}