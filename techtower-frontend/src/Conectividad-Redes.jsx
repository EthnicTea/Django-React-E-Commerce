import React, { useState } from 'react';
import './Conectividad-Redes.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 31, name: 'Cable de Alimentación C14 Macho a C13 Hembra', brand: 'TRIPP LITE', category: 'Conector', price: '$1.310 Transferencia', price2: '$2.410 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/c2zlalo0_0ec8bf20_thumbnail_512.jpg' },
        { id: 32, name: 'Cable Xtech USB 2.0 con conector Macho A a Macho B 1.8mts', brand: 'XTECH', category: 'Conector', price: '$2.000 Transferencia', price2: '$3.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/o_sma1in_52d2f6ad_thumbnail_512.jpg' },
        { id: 33, name: 'Access Point de Pared Omada EAP235, Gigabit, WiFi, MU-MIMO, AC1200', brand: 'TP-LINK', category: 'Access Point', price: '$67.990 Transferencia', price2: '$71.045 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/vp9gblsx_a39cdb5f_thumbnail_512.jpg' },
        { id: 34, name: 'Access Point Inalámbrico Wi-Fi 4 Montaje en Techo TP-Link EAP115 , 300 Mbps', brand: 'TP-LINK', category: 'Access Point', price: '$29.990 Transferencia', price2: '$31.345 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/7iw6mh1__34c8d8f1_thumbnail_512.jpg' },
        { id: 35, name: 'Adaptador anfitrión micro-USB macho a USB-A hembra Xtech XTC-360, 28AWG, 13,5cm', brand: 'XTECH', category: 'Adaptador', price: '$2.190 Transferencia', price2: '$2.298 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/_eo5jcfv_643aed2f_thumbnail_512.jpg' },
        { id: 36, name: 'Adaptador de Red Ethernet a USB-C Startech.com, 2.5GbE, Thunderbolt 3', brand: 'STARTECH.COM', category: 'Adaptador', price: '$51.520 Transferencia', price2: '$53.843 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/7z4oj2xz_d1885f8a_thumbnail_512.jpg' },
        { id: 37, name: 'Adaptador de red USB AC600 Nano Wi-Fi Bluetooth 4.2 TP-Link Archer T2UB Nano, Doble banda', brand: 'TP-LINK', category: 'Adaptador', price: '$10.900 Transferencia', price2: '$11.390 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/0_xgfty0_84e9ae5b_thumbnail_512.jpg' },
        { id: 38, name: 'Adaptador de red USB Wi-Fi 6 con 2 antenas AX1800 TP-Link Archer TX20U,Tecnología MU-MIMO', brand: 'TP-LINK', category: 'Adaptador', price: '$16.280 Transferencia', price2: '$17.023 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/os9gvbbr_77803a78_thumbnail_512.jpg' },
        { id: 39, name: 'Adaptador de red Wifi TP-Link TL-WN851ND PCI Express Inalámbrico N a 300 Mbps', brand: 'TP-LINK', category: 'Adaptador', price: '$12.990 Transferencia', price2: '$13.580 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/4wtbz00y_ab9a9e26_thumbnail_512.jpg' },
        { id: 40, name: 'Adaptador Mini PCI TP-Link TL-WN360G 54Mbps Wireless Mini PCI Adapter', brand: 'TP-LINK', category: 'Adaptador', price: '$3.880 Transferencia', price2: '$4.062 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/gdmj1kd3_52ad7f53_thumbnail_512.jpg' },
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
