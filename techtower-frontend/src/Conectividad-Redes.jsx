import React, { useState } from 'react';
import './Conectividad-Redes.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 7, name: 'Cable de Alimentación C14 Macho a C13 Hembra', brand: 'TRIPP LITE', category: 'Conector', price: '$1.310 Transferencia', price2: '$2.410 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/c2zlalo0_0ec8bf20_thumbnail_512.jpg' },
        { id: 8, name: 'Cable Xtech USB 2.0 con conector Macho A a Macho B 1.8mts', brand: 'XTECH', category: 'Conector', price: '$2.000 Transferencia', price2: '$3.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/o_sma1in_52d2f6ad_thumbnail_512.jpg' },
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
            <h1 className="gaming-title">Explora el Rincon de las Conexiones</h1>
            <p className="gaming-description">Encuentra todo lo que necesitas para mejorar o agregar Conexiones: desde Cables de Alimentación hasta todo tipo de usb's.</p>
            
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
