import React, { useState } from 'react';
import './Audio-Video.css';
import Items2 from './components/Items2.jsx';
import Filtro from './components/Filtro.jsx';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

    // Lista de productos
    const products = [
        { id: 41, name: 'Audífonos Inalámbricos JBL Wave Buds, TWS, In Ear, Bluetooth 5.2, Color Negro', brand: 'JBL', category: 'Audifonos', price: '$50.000 Transferencia', price2: '$52.260 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/298ynsi0_34010889_thumbnail_512.jpg' },
        { id: 42, name: 'Audífonos Inalámbricos Logitech Zone Vibe 100, Over-Ear, Wireless Bluetooth', brand: 'Logitech', category: 'Audífonos', price: '$110.170 Transferencia', price2: '$115.130 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/5qsxnirn_26a97526_thumbnail_512.jpg' },
        { id: 43, name: 'Parlante Portail JBL Go 3, Bluetooth, IP67, Color Negro', brand: 'JBL', category: 'Parlante', price: '$42.990 Transferencia', price2: '$44.920 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/26bb6pix_386bdef3_thumbnail_512.jpg' },
        { id: 44, name: 'Parlante Portátil JBL Go Essential, Bluetooth 4.2, IPX7, Rojo', brand: 'JBL', category: 'Parlante', price: '$32.780 Transferencia', price2: '$34.263 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/e6uliphe_9a2f6967_thumbnail_512.png' },
        { id: 45, name: 'Audifono con Microfono Genius HS-M505X Full Side', brand: 'GENIUS', category: 'Audifonos', price: '$5.490 Transferencia', price2: '$5.742 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/wjejebja_2d72f5b0_thumbnail_512.jpg' },
        { id: 46, name: 'Cable Recto Ultra, Plug a Plug, 3.5st, 1.8 metros', brand: 'ULTRA', category: 'Conector', price: '$880 Transferencia', price2: '$930 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/4o_0vysd_c2f13756_thumbnail_512.jpg' },
        { id: 47, name: 'Adaptador 3.5mm Mini Jack a XLR Boya 35C-XLR PRO, con Conversor de Poder', brand: 'BOYA', category: 'Adaptador', price: '$14.900 Transferencia', price2: '$15.570 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/lpgwj0ew_17c4c4be_thumbnail_512.jpg' },
        { id: 48, name: 'Adaptador de Audio HP USB-C a Jack 3,5, Color Blanco', brand: 'HP', category: 'Adaptador', price: '$3.280 Transferencia', price2: '$3.435 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/d0wqlnxz_ef7ba5e5_thumbnail_512.png' },
        { id: 49, name: 'Adaptador de Auriculares con Micrófono Mini-Jack 3,5mm 4 pines, M a 2xH Blanco', brand: 'STARTECH.COM', category: 'Adaptador', price: '$9.620 Transferencia', price2: '$10.052 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/xtdzl_qr_137dc981_thumbnail_512.jpg' },
        { id: 50, name: 'Micrófono Inalámbrico de 4 Canales Boya BY-W4, 4 Micrófonos, 1 Receptor', brand: 'BOYA', category: 'Microfono', price: '$255.690 Transferencia', price2: '$267.192 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/3t5y6x_2_0e22369d_thumbnail_512.jpg' },
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
