import React, { useState } from 'react';
import './Gaming.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 1, name: 'Silla Gaming Ergonomica', brand: 'Logitech', category: 'Silla', price: '$150.000 Transferencia', price2: '$180.000 Otro metodo de pago', image: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/114328608_01/w=1500,h=1500,fit=pad' },
        { id: 2, name: 'Teclado Mecánico RGB', brand: 'Razer', category: 'Teclado', price: '$80.000 Transferencia', price2: '$100.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/vqczuwsv_e8307d49_thumbnail_512.png' },
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
            <h1 className="gaming-title">Explora el Mundo del Gaming</h1>
            <p className="gaming-description">Encuentra todo lo que necesitas para mejorar tu experiencia gaming: desde accesorios hasta las últimas consolas y juegos.</p>
            
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
