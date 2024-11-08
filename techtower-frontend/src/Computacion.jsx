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
        { id: 3, name: 'Mouse Azio MS530, USB, Antimicrobios, 3 botones, Negro', brand: 'AZIO', category: 'Mouse', price: '$7.990 Transferencia', price2: '$8.355 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/rbpsz8yj_6349f8e1_thumbnail_512.jpg' },
        { id: 4, name: 'Cámara Web Logitech Brio 500, Full HD 1080p, Micrófono Integrado, USB-C, Rosa', brand: 'Logitech', category: 'WebCam', price: '$126.370 Transferencia', price2: '$132.060 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/4bfvabmi_ad2dd23c_thumbnail_512.jpg' },
        { id: 5, name: 'Notebook HP 255 G10 AMD Ryzen 3 7330U, LED 15.6", RAM 8GB, SSD 512GB, W11', brand: 'HP', category: 'Notebook', price: '$461.020 Transferencia', price2: '$481.780 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/lymnzz4c_af0637e0_thumbnail_512.png' },
        { id: 6, name: 'Pendrive Hikvision E304C, 16GB, Convertible USB Type-C / USB 3.2 Type-A', brand: 'HIKVISION', category: 'Pendrive', price: '$3.680 Transferencia', price2: '$3.852 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/hnnbh_ym_43b794bc_thumbnail_512.png' },
        { id: 7, name: 'Alfombrilla de gel para mouse con apoyo para la muñeca Xtech XTA-526, Dimensiones: 22,5x19,5x2,2cm', brand: 'XTECH', category: 'MousePad', price: '$4.990 Transferencia', price2: '$5.217 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/4ac03ncp_16c25762_thumbnail_512.jpg' },
        { id: 8, name: 'Base para Notebook Kensington Easy Riser Go SmartFit, Tamaños de 17", Gris', brand: 'KENSINGTON', category: 'Base para Notebook', price: '$21.680 Transferencia', price2: '$22.664 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/faq9nk9v_bfdb51ae_thumbnail_512.jpg' },
        { id: 9, name: 'Cámara Web Genius 1000X HD V2, 1280x720 resolución, Negra, 1MP', brand: 'GENIUS', category: 'WebCam', price: '$12.380 Transferencia', price2: '$12.941 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/fb6eg23d_142d27f0_thumbnail_512.png' },
        { id: 10, name: 'Mini Teclado Multimedia ULTRA, USB, Slim, Español', brand: 'ULTRA', category: 'Teclado', price: '$4.680 Transferencia', price2: '$4.896 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/47mq580g_21204029_thumbnail_512.jpg' },
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
