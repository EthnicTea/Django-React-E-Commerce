import React, { useState } from 'react';
import './Computacion.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Computacion = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 1, name: 'Monitor Plano ASUS VA24EHF Eye Care', brand: 'Asus', category: 'Monitor', price: '$99.990 Transferencia', price2: '$105.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/q0txzqxy_c4b644f0_thumbnail_512.png' },
        { id: 2, name: 'Adaptador Conversor de Video DisplayPort a HDMI', brand: 'STARTECH.COM', category: 'Adaptador', price: '$10.000 Transferencia', price2: '$15.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/8kwt_kf4_58344fa0_thumbnail_512.jpg' },
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
        <section className="computacion-section">
            <h1 className="computacion-title">Explora el Apartado de Computación</h1>
            <p className="computacion-description">Encuentra todo lo que necesitas para mejorar tu experiencia en el mundo digital: desde accesorios hasta los ultimos monitores!.</p>
            
            {/* Filtro de productos */}
            <Filtro onFilter={handleFilterChange} />

            <div className="computacion-products">
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

export default Computacion;
