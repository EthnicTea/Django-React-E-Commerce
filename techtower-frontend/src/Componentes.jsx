import React, { useState } from 'react';
import './Gaming.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 5, name: 'Unidad SSD Kingston NV2, 500GB', brand: 'Kingston', category: 'SSD', price: '$59.990 Transferencia', price2: '$62.690 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/y2qb2v_n_cc9779c9_thumbnail_512.jpg' },
        { id: 6, name: 'Gabinete Gamer Aerocool Designer G V2 ARGB, Color Negro', brand: 'Aerocool', category: 'Gabinete', price: '$49.990 Transferencia', price2: '$52.240 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/v32yidd0_a9b07e6a_thumbnail_512.png' },
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
            <h1 className="gaming-title">Explora la Sección del Update</h1>
            <p className="gaming-description">Encuentra todos los componentes que necesites para optimizar tu experiencia: desde Gabinetes hasta las últimas Tarjetas Graficas.</p>
            
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
