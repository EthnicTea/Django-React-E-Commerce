import React, { useState } from 'react';
import './Audio-Video.css';

const AudioVideo = () => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Lista de productos
    const products = [
        { id: 41, name: 'Audífonos Inalámbricos JBL Wave Buds, TWS, In Ear, Bluetooth 5.2, Color Negro', brand: 'JBL', category: 'Audifonos', price: '$50.000 Transferencia', price2: '$52.260 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/298ynsi0_34010889_thumbnail_512.jpg' },
        { id: 42, name: 'Audífonos Inalámbricos Logitech Zone Vibe 100, Over-Ear, Wireless Bluetooth', brand: 'Logitech', category: 'Audifonos', price: '$110.170 Transferencia', price2: '$115.130 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/5qsxnirn_26a97526_thumbnail_512.jpg' },
        { id: 43, name: 'Parlante Portail JBL Go 3, Bluetooth, IP67, Color Negro', brand: 'JBL', category: 'Parlante', price: '$42.990 Transferencia', price2: '$44.920 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/26bb6pix_386bdef3_thumbnail_512.jpg' },
        { id: 44, name: 'Parlante Portátil JBL Go Essential, Bluetooth 4.2, IPX7, Rojo', brand: 'JBL', category: 'Parlante', price: '$32.780 Transferencia', price2: '$34.263 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/e6uliphe_9a2f6967_thumbnail_512.png' },
        { id: 45, name: 'Audifono con Microfono Genius HS-M505X Full Side', brand: 'GENIUS', category: 'Audifonos', price: '$5.490 Transferencia', price2: '$5.742 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/wjejebja_2d72f5b0_thumbnail_512.jpg' },
        { id: 46, name: 'Cable Recto Ultra, Plug a Plug, 3.5st, 1.8 metros', brand: 'ULTRA', category: 'Conector', price: '$880 Transferencia', price2: '$930 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/4o_0vysd_c2f13756_thumbnail_512.jpg' },
        { id: 47, name: 'Adaptador 3.5mm Mini Jack a XLR Boya 35C-XLR PRO, con Conversor de Poder', brand: 'BOYA', category: 'Adaptador', price: '$14.900 Transferencia', price2: '$15.570 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/lpgwj0ew_17c4c4be_thumbnail_512.jpg' },
        { id: 48, name: 'Adaptador de Audio HP USB-C a Jack 3,5, Color Blanco', brand: 'HP', category: 'Adaptador', price: '$3.280 Transferencia', price2: '$3.435 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/d0wqlnxz_ef7ba5e5_thumbnail_512.png' },
        { id: 49, name: 'Adaptador de Auriculares con Micrófono Mini-Jack 3,5mm 4 pines, M a 2xH Blanco', brand: 'STARTECH.COM', category: 'Adaptador', price: '$9.620 Transferencia', price2: '$10.052 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/xtdzl_qr_137dc981_thumbnail_512.jpg' },
        { id: 50, name: 'Micrófono Inalámbrico de 4 Canales Boya BY-W4, 4 Micrófonos, 1 Receptor', brand: 'BOYA', category: 'Microfono', price: '$255.690 Transferencia', price2: '$267.192 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/3t5y6x_2_0e22369d_thumbnail_512.jpg' },
    ];

    const brands = ['JBL', 'Logitech', 'GENIUS', 'ULTRA', 'BOYA', 'HP', 'STARTECH.COM'];
    const categories = ['Audifonos', 'Parlante', 'Conector', 'Adaptador', 'Microfono'];

    const handleBrandChange = (e) => {
        setSelectedBrand(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const filteredProducts = products.filter((product) => {
        return (
            (selectedBrand === '' || product.brand === selectedBrand) &&
            (selectedCategory === '' || product.category === selectedCategory)
        );
    });

    return (
        <div className="audiovideo-container">
            <h2 className="audiovideo-title">Explora la Zona del Sonido y Video</h2>
            <p className="audiovideo-description">
                Encuentra todo lo que necesitas para mejorar tu experiencia audiovisual: desde Audífonos de alta gama hasta Videocámaras.
            </p>
            
            {/* Filtro de productos */}
            <div className="filter-bar-modern">
                <div className="filter-group-modern">
                    <label htmlFor="brand-filter-audiovideo">Marca:</label>
                    <select id="brand-filter-audiovideo" value={selectedBrand} onChange={handleBrandChange}>
                        <option value="">Todas las marcas</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group-modern">
                    <label htmlFor="category-filter-audiovideo">Categoría:</label>
                    <select id="category-filter-audiovideo" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="audiovideo-products">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="card-audiovideo">
                        <div className="imagen-container">
                            <img src={p.image} alt={p.name} className="imagen-audiovideo" />
                        </div>
                        <h3 className="nombre-audiovideo">{p.name}</h3>
                        <p className="marca-audiovideo">{p.brand}</p>
                        <p className="precio-audiovideo">
                            <span className="precio-transferencia">{p.price}</span>
                            <span className="precio-normal">{p.price2}</span>
                        </p>
                        <div className="botones-audiovideo">
                            <button className="btn-agregar">Agregar</button>
                            <button className="btn-ver">Ver</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AudioVideo;