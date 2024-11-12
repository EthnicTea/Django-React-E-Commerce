import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link aquí
import './Hero.css';
import TechTower from '../assets/techtower.png';

export function Hero() {
    return (
        <div className="hero-flex-border">
            <img src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/137.png" alt="" className='porygonimg' />
            {/* Parte izquierda del componente */}
            <div className="inner-full-hero-border">
                <div className="inner-text-black">
                    <h1 className="h1-offer">Siempre calidad y ofertas todo el año</h1>
                    <div className="flex items">
                        <p className="base-text">Revisa nuestras mejores ofertas&nbsp;
                        <Link to="/ofertas" className='link-hero'>Aquí</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Parte derecha: imagen */}
            <div className="hero-image-container">
                <img 
                    src={ TechTower }
                    alt="Ofertas" 
                    className="hero-image"
                />
            </div>
        </div>
    );
}