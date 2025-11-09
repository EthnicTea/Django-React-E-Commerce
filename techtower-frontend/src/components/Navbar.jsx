import React, { useState } from 'react';
import './Navbar.css';
import { BsFillCartFill } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

export function Navbar() {

// --- LÓGICA con "context" ---
    // Se obtiene el estado y las funciones de nuestro AuthContext
    // 'user' tendrá los datos como {email, is_staff, ...}
    // 'logoutAction' es la función que borra el token
    // Agregar que se "recarge" la página al deslogearse
    const { authToken, user, logoutAction } = useAuth();
    
    // El estado del dropdown se mantiene igual
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        if (searchTerm.trim()) {
            // Redirige a la página de búsqueda con el query param
            navigate(`/busqueda?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm(''); // Limpia la barra (opcional)
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            {/* Primera navbar */}
            <nav className="navbar">
                <div className="navbar-top-message">
                    <span>
                        ¡Recuerda que siempre será gratis el retiro de los productos! Además de la variedad de productos con despacho gratis, vea más&nbsp;
                        <Link to="/terminos">Aquí</Link>
                        {/* <Link to="/Pasarela">Aquí</Link> */}
                        {/* <Link to="/crud">Aquí</Link> */}
                    </span>
                </div>

                <div className="navbar-main">
                    <div className="navbar-logo">
                        <Link to="/">
                            <span className="tech-highlight">Tech</span>Tower
                        </Link>
                    </div>

                    <div className="navbar-search">
                        <form className="navbar-search-form" onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                placeholder="Busca lo mejor para ti..." 
                                className="navbar-search-input"
                                value={searchTerm} // VALOR!
                                onChange={(e) => setSearchTerm(e.target.value)} // Busca el cambio
                            />
                            <button type="submit" className="navbar-search-button">
                                <svg stroke="currentColor" fill="none" viewBox="0 0 32 32" height="20" width="20">
                                    <circle cx="14.75" cy="14.75" r="8.75" strokeWidth="2"></circle>
                                    <path d="M26 26L21 21" strokeWidth="2" strokeLinecap="round"></path>
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div className="navbar-icons">
                        <div className="navbar-icon dropdown">
                            <button className='dropbtn' onClick={toggleDropdown}>
                                <FiUser className='icon-user'/>
                            </button>
                            <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                            
                            {authToken ? (
                                // --- 1. SI ESTÁ LOGEADO ---
                                <>
                                    {/* (a) Saludo (igual que antes) */}
                                    <span className="navbar-link-user">
                                        Bienvenido, {user ? user.email : 'Cargando...'}
                                    </span>
                                    
                                    {/* (b) Lógica de Roles */}
                                    {user && (user.is_staff || user.isStaff) ? (
                                        // SI ES EMPLEADO (is_staff = true)
                                        <Link to="/PanelEmpleado" className="navbar-link">Panel de Empleado</Link>
                                    ) : (
                                        // SI ES CLIENTE NORMAL (is_staff = false)
                                        <Link to="/MiCuenta" className="navbar-link">Mi Cuenta y Pedidos</Link>
                                    )}

                                    {/* (c) Botón de Logout (igual que antes) */}
                                    <button onClick={logoutAction} className='navbar-link-user' role="logout">Cerrar Sesión</button>
                                </>
                                
                            ) : (
                                // --- 2. SI NO ESTÁ LOGEADO (igual que antes) ---
                                <>
                                    <Link to="/login" className='navbar-link'>Iniciar Sesión</Link>
                                    <Link to="/register" className='navbar-link'>Registrarse</Link>
                                </>
                            )}
                        </div>
                        </div>
                        <div className="navbar-icon">
                            <Link to="/carrito">
                                <button className='dropbtn'>
                                    <BsFillCartFill className='icon-cart'/>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="navbar-hamburger">
                        <button className="hamburger-button">
                            <FiMenu />
                        </button>
                    </div>
                </div>
            </nav>
            {/* Segunda navbar: categorías */}
            <nav className="navbar-categories">
                <ul className="categories-list">
                    <li className="category-item"><Link to="/Computacion">Computación</Link></li>
                    <li className="category-item"><Link to="/Gaming">Streaming y Gaming</Link></li>
                    <li className="category-item"><Link to="/Componentes">Componentes</Link></li>
                    <li className="category-item"><Link to="/Conectividad">Conectividad y Redes</Link></li>
                    <li className="category-item"><Link to="/AudioVideo">Equipos de Audio y Video</Link></li>
                    <li className="category-item"><Link to="/PcBuilder">Armado de Pc</Link></li>
                </ul>
            </nav>
        </>
    );
}