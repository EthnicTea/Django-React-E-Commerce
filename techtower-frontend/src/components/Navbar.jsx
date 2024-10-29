import './Navbar.css'
import { BsFillCartFill } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { Link } from 'react-router-dom';
export function Navbar() {
    return (
        <>
            {/* Primera navbar */}
            <nav className="navbar">
                {/* Sección superior con mensaje */}
                <div className="navbar-top-message">
                    <span>
                        ¡Recuerda que siempre será gratis el retiro de los productos! Además de la variedad de productos con despacho gratis, vea más&nbsp;
                        <a href="https://youtu.be/ZvdY-E6jvJs?si=M_j_BsxeIgIXR9lX">AQUÍ</a>
                    </span>
                </div>

                {/* Sección principal */}
                <div className="navbar-main">
                    <div className="navbar-logo">
                        <a href="/">TechTower</a>
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
                                    <circle cx="14.75" cy="14.75" r="8.75" stroke-width="2"></circle>
                                    <path d="M26 26L21 21" stroke-width="2" stroke-linecap="round"></path>
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
                                <Link to="/login" className='navbar-link'>Iniciar Sesión</Link>
                                <Link to="#" className='navbar-link'>Registrarse</Link>
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
                    <li className="category-item"><a href="#">Computación</a></li>
                    <li className="category-item"><a href="#">Gaming y Streaming</a></li>
                    <li className="category-item"><a href="#">Componentes</a></li>
                    <li className="category-item"><a href="#">Conectividad y Redes</a></li>
                    <li className="category-item"><a href="#">Equipos de audio y video</a></li>
                </ul>
            </nav>
        </>
    );
}
