import React, { useState } from 'react';
import './Gaming.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Ofertas = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 51, name: 'Micrófono para Streaming Boya, IOS, Android, Mac, Windows, Triple Capsula', brand: 'BOYA', category: 'Microfono',pnormal:'$179.990 Precio normal',desc:'65% DCTO',price: '$62.490 Transferencia', price2: '$65.307 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/1kz2lrr__8da730fa_thumbnail_512.jpg' },
        { id: 52, name: 'Mousepad Azio Retro Classic Nude Vegetable-Tanned', brand: 'AZIO', category: 'MousePad',pnormal:'$39.990 Precio normal',desc:'66% DCTO',price: '$13.490 Transferencia', price2: '$14.102 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/_ykame3e_a3791198_thumbnail_512.jpg' },
        { id: 54, name: 'Audífonos Gamer Genius HS-G560, Alámbrico, 2 Metros, 3.5mm, Negro', brand: 'GENIUS', category: 'Audifonos',pnormal:'$18.990 Precio normal',desc:'47% DCTO',price: '$9.990 Transferencia', price2: '$10.440 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/6sq8mgan_ec792e1e_thumbnail_512.jpg' },
        { id: 55, name: 'Gabinete Gamer Aerocool Shard , Vidrio Templado, Mid-Tower, ATX, m-ATX', brand: 'Aerocool', category: 'Gabinete',pnormal:'$92.000 Precio normal',desc:'3% DCTO',price: '$87.490 Transferencia', price2: '$91.432 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/_wq4_3_m_0d4a84e2_thumbnail_512.jpg' },
        { id: 56, name: 'Mouse Gamer Genius Gaming Ammox X1-400 Negro USB 400-3200 (DPI)', brand: 'GENIUS', category: 'Mouse',pnormal:'$20.990 Precio normal',desc:'38% DCTO',price: '$12.990 Transferencia', price2: '$13.575 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/whoxva_s_a4255beb_thumbnail_512.jpg'},
        { id: 57, name: 'Teclado Gamer Genius Gaming K9, USB 7 colores, 14 Macro, Color Negro', brand: 'GENIUS', category: 'Teclado',pnormal:'$29.990 Precio normal',desc:'53% DCTO',price: '$13.990 Transferencia', price2: '$14.625 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/82pvl860_29f8f045_thumbnail_512.jpg' },
        { id: 58, name: 'Adaptador de Video Externo USB a VGA -Tarjeta de Video Externa Cable - 1440x900', brand: 'STARTECH.COM', category: 'Adaptador',pnormal:'$67.410 Precio normal',desc:'20% DCTO',price: '$57.370 Transferencia', price2: '$59.967 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/ow_hbwh2_c1eea110_thumbnail_512.jpg' },
        { id: 59, name: 'Audífonos Gamer Inalámbrico HyperX Cirro Buds Pro, ANC, Bluetooth 5.2, Negro', brand: 'HyperX', category: 'Audifonos',pnormal:'$105.990 Precio normal',desc:'47% DCTO',price: '$55.990 Transferencia', price2: '$58.515 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/fprbet3y_7f06a463_thumbnail_512.jpg' },
        { id: 60, name: 'Teclado Gamer Genius Scorpion K220, RGB Programable, Alámbrico, USB 2.0, Color Negro', brand: 'GENIUS', category: 'Teclado',pnormal:'$15.990 Precio normal',desc:'50% DCTO',price: '$7.990 Transferencia', price2: '$8.355 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/hphshph7_00004dfa_thumbnail_512.jpg' },
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
            <h1 className="gaming-title">Explora las Mejores Ofetas</h1>
            <p className="gaming-description">Encuentra las mejores ofertas del año: desde periféricos esenciales hasta tecnología de última generación.</p>
            
            {/* Filtro de productos */}
            <Filtro onFilter={handleFilterChange} />

            <div className="gaming-products">
                {filteredProducts.map((product) => (
                    <Items2 
                        key={product.id} 
                        name={product.name}
                        pnormal={product.pnormal}
                        desc={product.desc}
                        price={product.price}
                        price2={product.price2}
                        image={product.image}
                    />
                ))}
            </div>
        </section>
    );
};

export default Ofertas;