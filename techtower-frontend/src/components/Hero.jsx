import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import BannerImage from '../assets/techtowerbanner.jpg'; // Cambia al nombre de tu imagen

export function Hero() {
    return (
        <div className="hero-container">
            {/* Banner horizontal arriba */}
            <div className="hero-banner">
                <img 
                    src={BannerImage}
                    alt="techtowerbanner" 
                    className="banner-image"
                />
            </div>

            {/* Texto debajo del banner */}
            <div className="hero-text-section">
                <h1 className="hero-title">Siempre calidad y ofertas todo el año</h1>
                <p className="hero-description">
                    Revisa nuestras mejores ofertas&nbsp;
                    <Link to="/ofertas" className='hero-link'>Aquí</Link>
                </p>
            </div>
        </div>
    );
}