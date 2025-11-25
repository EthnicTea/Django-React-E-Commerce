import React, { useState } from 'react';
import './Navbar.css';
import { BsFillCartFill } from "react-icons/bs";
import { FiUser, FiMenu, FiX } from "react-icons/fi"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';
import { useClickOutside } from '../services/useClickOutside.jsx';

export function Navbar() {
    const { authToken, user, logoutAction } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    // ÚNICO CAMBIO: Estado para el menú móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dropdownRef = useClickOutside(() => {
        setIsDropdownOpen(false);
    });
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/busqueda?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
        }
    };

    return (
        <>
            {/* Primera navbar */}
            <nav className="navbar">
                <div className="navbar-top-message">
                    <span>
                        ¡Recuerda que siempre será gratis el retiro de los productos! Además de la variedad de productos con despacho gratis, vea más&nbsp;
                        <Link to="/terminos">Aquí</Link>
                    </span>
                </div>

                <div className={`navbar-main ${isMobileMenuOpen ? 'menu-open' : ''}`}>
                    {/* Logo */}
                    <div className="navbar-logo">
                        <Link to="/">
                            <span className="tech-highlight">Tech</span>Tower
                        </Link>
                    </div>

                    {/* Buscador */}
                    <div className="navbar-search">
                        <form className="navbar-search-form" onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                placeholder="Busca lo mejor para ti..." 
                                className="navbar-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="navbar-search-button">
                                <svg stroke="currentColor" fill="none" viewBox="0 0 32 32" height="20" width="20">
                                    <circle cx="14.75" cy="14.75" r="8.75" strokeWidth="2"></circle>
                                    <path d="M26 26L21 21" strokeWidth="2" strokeLinecap="round"></path>
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Iconos */}
                    <div className="navbar-icons">
                        <div className="navbar-icon dropdown" ref={dropdownRef}> 
                            <button className='dropbtn' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <FiUser className='icon-user'/>
                            </button>

                            <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                                {authToken ? (
                                    <>
                                        <span className="navbar-link-user">
                                            Bienvenido, {user ? user.email : 'Cargando...'}
                                        </span>
                                        
                                        {user && (user.is_staff || user.isStaff) ? (
                                            <Link to="/PanelEmpleado" className="navbar-link" onClick={() => setIsDropdownOpen(false)}>Panel de Empleado</Link>
                                        ) : (
                                            <Link to="/MiCuenta" className="navbar-link" onClick={() => setIsDropdownOpen(false)}>Mi Cuenta y Pedidos</Link>
                                        )}

                                        <button onClick={() => { logoutAction(); setIsDropdownOpen(false); }} className='navbar-link-user' role="logout">Cerrar Sesión</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className='navbar-link' onClick={() => setIsDropdownOpen(false)}>Iniciar Sesión</Link>
                                        <Link to="/register" className='navbar-link' onClick={() => setIsDropdownOpen(false)}>Registrarse</Link>
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

                    {/* NUEVO: Botón hamburguesa (solo visible en móvil) */}
                    <div className="navbar-hamburger">
                        <button className="hamburger-button" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Segunda navbar: categorías */}
            <nav className={`navbar-categories ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <ul className="categories-list">
                    <li className="category-item"><Link to="/Computacion" onClick={closeMobileMenu}>Computación</Link></li>
                    <li className="category-item"><Link to="/Gaming" onClick={closeMobileMenu}>Streaming y Gaming</Link></li>
                    <li className="category-item"><Link to="/Componentes" onClick={closeMobileMenu}>Componentes</Link></li>
                    <li className="category-item"><Link to="/Conectividad" onClick={closeMobileMenu}>Conectividad y Redes</Link></li>
                    <li className="category-item"><Link to="/AudioVideo" onClick={closeMobileMenu}>Equipos de Audio y Video</Link></li>
                    <li className="category-item"><Link to="/PcBuilder" onClick={closeMobileMenu}>Armado de Pc</Link></li>
                </ul>
            </nav>
        </>
    );
}