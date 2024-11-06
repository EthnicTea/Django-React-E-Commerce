import React, { useState } from 'react';
import './Audio-Video.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 9, name: 'Audífonos Inalámbricos JBL Wave Buds, TWS, In Ear, Bluetooth 5.2, Color Negro', brand: 'JBL', category: 'Audífonos', price: '$50.000 Transferencia', price2: '$52.260 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/298ynsi0_34010889_thumbnail_512.jpg' },
        { id: 10, name: 'Audífonos Inalámbricos Logitech Zone Vibe 100, Over-Ear, Wireless Bluetooth', brand: 'Logitech', category: 'Audífonos', price: '$110.170 Transferencia', price2: '$115.130 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/5qsxnirn_26a97526_thumbnail_512.jpg' },
        // Añadir más productos con sus propiedades
    ];

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const filteredProducts = products.filter((product) => {
        return (
            (filters.brand === '' || product.brand === filters.brand) &&
            (filters.category === '' || product.category === filters.category)
        );
    });

    return (
        <section className="gaming-section">
            <h1 className="gaming-title">Explora la Zona del Sonido y Video</h1>
            <p className="gaming-description">Encuentra todo lo que necesitas para mejorar tu experiencia audiovisual : desde Audifonós de alta gama hasta Videocamaras.</p>
            
            {/* Filtro de productos */}
            <Filtro onFilter={handleFilterChange} />

            <div className="gaming-products">
                {filteredProducts.map((product) => (
                    <Items2 
                        key={product.id} 
                        name={product.name}
                        price={product.price}
                        price2={product.price2}
                        image={product.image}
                    />
                ))}
            </div>
        </section>
    );
};

export default Gaming;
