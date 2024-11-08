import React, { useState } from 'react';
import './Gaming.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 21, name: 'Unidad SSD Kingston NV2, 500GB', brand: 'Kingston', category: 'SSD', price: '$59.990 Transferencia', price2: '$62.690 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/y2qb2v_n_cc9779c9_thumbnail_512.jpg' },
        { id: 22, name: 'Gabinete Gamer Aerocool Designer G V2 ARGB, Color Negro', brand: 'Aerocool', category: 'Gabinete', price: '$49.990 Transferencia', price2: '$52.240 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/v32yidd0_a9b07e6a_thumbnail_512.png' },
        { id: 23, name: 'Placa Madre ASUS Prime B550M-A AC, AMD AM4, 4xDIMM DDR4, VGA, DVI-D, HDMI, Wifi, Micro-ATX', brand: 'Asus', category: 'Placa Madre', price: '$114.990 Transferencia', price2: '$120.170 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/pv4k50ly_912465e6_thumbnail_512.png' },
        { id: 24, name: 'Memoria RAM DDR4 16GB 3200MHz Kingston FURY Beast, CL16, DIMM, 1.35V', brand: 'Kingston', category: 'Ram', price: '$33.890 Transferencia', price2: '$35.421 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/_xiag1e3_7be5c2ae_thumbnail_512.jpg' },
        { id: 25, name: 'Tarjeta de Video MSI Nvidia GeForce RTX 3060 VENTUS 2X 12G OC, 12GB GDDR6, 192-bit', brand: 'MSI', category: 'Tarjeta Grafica', price: '$299.990 Transferencia', price2: '$313.495 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/scpkheea_557a8ffc_thumbnail_512.jpg' },
        { id: 26, name: 'Tarjeta de Video ASUS Dual Nvidia GeForce RTX 3050 OC Edition, 6GB GDDR6, 96-bit, PCI-e 4.0', brand: 'Asus', category: 'Tarjeta Grafica', price: '$199.990 Transferencia', price2: '$208.995 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/bwh38hmg_32a10229_thumbnail_512.jpg' },
        { id: 27, name: 'Gabinete Gamer Corsair 4000D Airflow, Mid-Tower, EATX, ATX, MicroATX, Mini-ITX, Vidrio templado', brand: 'Corsair', category: 'Gabinete', price: '$74.990 Transferencia', price2: '$78.370 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/rglx7bsp_f46b374c_thumbnail_512.jpg' },
        { id: 28, name: 'Fuente de Poder 750W Corsair CX750, Certificada 80+ PLUS Bronze, ATX', brand: 'Corsair', category: 'Fuente de poder', price: '$69.990 Transferencia', price2: '$73.145 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/2ocr7807_e4c079a9_thumbnail_512.jpg' },
        { id: 29, name: 'Unidad SSD Kingston Fury Renegade, 2TB, M.2 2280, NVMe PCIe 4.0 x4, Lec. 7300MB/s Esc. 7000MB/s', brand: 'Kingston', category: 'SSD', price: '$163.590 Transferencia', price2: '$170.957 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/ffidolkq_8bb8241e_thumbnail_512.jpg' },
        { id: 30, name: 'Refrigeración Líquida Cougar Poseidon Elite ARGB 360, 360mm, Intel/AMD, Color Negro', brand: 'Cougar', category: 'Cooler', price: '$74.990 Transferencia', price2: '$78.370 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/rtqgorjz_37c8893d_thumbnail_512.jpg' },
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
