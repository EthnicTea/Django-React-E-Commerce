import './Navbar.css';
import { BsFillCartFill } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export function Navbar() {
    const [userEmail, setUserEmail] = useState(null); // Estado para manejar el correo del usuario

    // Efecto para cargar el correo del usuario desde el localStorage al montar el componente
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail'); // Obtén el correo guardado
        if (storedEmail) {
            setUserEmail(storedEmail); // Actualiza el estado con el correo del usuario
        }
    }, []);

    // Función para manejar el logout
    const handleLogout = async () => {
        try {
            await axios.post('/api/logout'); // Llamamos a la API de logout
            localStorage.removeItem('userEmail'); // Eliminamos el correo del localStorage
            setUserEmail(null); // Limpiamos el estado de correo
            window.location.href = '/'; // Redirigimos al home o a la página de login
        } catch (error) {
            console.error('Error en el logout:', error);
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

                <div className="navbar-main">
                    <div className="navbar-logo">
                        <Link to="/">TechTower</Link>
                    </div>

                    <div className="navbar-search">
                        <form className="navbar-search-form">
                            <input 
                                type="text" 
                                placeholder="Busca lo mejor para ti..." 
                                className="navbar-search-input"
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
                            <button className='dropbtn'>
                                <FiUser className='icon-user'/>
                            </button>
                            <div className="dropdown-content">
                                {userEmail ? (
                                    <>
                                        <span className="navbar-link">Bienvenido, {userEmail}</span> {/* Mostrar correo del usuario */}
                                        <button onClick={handleLogout} className='navbar-link'>Cerrar Sesión</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className='navbar-link'>Iniciar Sesión</Link>
                                        <Link to="/register" className='navbar-link'>Registrarse</Link>
                                    </>
                                )}
                            </div> 
                        </div>
                        <div className="navbar-icon">
                            <button className='dropbtn'>
                                <BsFillCartFill className='icon-cart'/>
                            </button>
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
                </ul>
            </nav>
        </>
    );
}
