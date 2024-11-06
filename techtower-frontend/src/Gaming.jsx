import React, { useState } from 'react';
import './Gaming.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 3, name: 'Silla Gaming Ergonomica Corsair', brand: 'Corsair', category: 'Silla', price: '$137.650 Transferencia', price2: '$180.000 Otro metodo de pago', image: 'https://cdn2.spider.cl/16922-large_default/silla-corsair-tc60-gaming-black-grey.jpg' },
        { id: 4, name: 'Teclado Mecánico Razer RGB', brand: 'Razer', category: 'Teclado', price: '$80.000 Transferencia', price2: '$100.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/vqczuwsv_e8307d49_thumbnail_512.png' },
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
            <p className="gaming-description">Encuentra todo lo que necesitas para mejorar tu experiencia gaming: desde Sillas hasta los últimos Teclados.</p>
            
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
