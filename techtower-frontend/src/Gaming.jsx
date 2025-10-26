import React, { useState } from 'react';
import './Gaming.css';

const Gaming = () => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Lista de productos
    const products = [
        { id: 11, name: 'Silla Gaming Ergonomica Corsair', brand: 'Corsair', category: 'Silla', price: '$137.650 Transferencia', price2: '$180.000 Otro metodo de pago', image: 'https://m.media-amazon.com/images/I/61q+ybPV2bL._AC_SL1500_.jpg' },
        { id: 12, name: 'Teclado Mecánico Razer RGB', brand: 'Razer', category: 'Teclado', price: '$80.000 Transferencia', price2: '$100.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/vqczuwsv_e8307d49_thumbnail_512.png' },
        { id: 13, name: 'Micrófono Gamer HyperX QuadCast 2 USB', brand: 'HyperX', category: 'Microfono', price: '$134.990 Transferencia', price2: '$141.070 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/b68sg6ez_8a7b439e_thumbnail_512.png' },
        { id: 14, name: 'Mouse Gamer Inalámbrico Redragon K1NG M916 PRO, 1000hz, Blanco', brand: 'Redragon', category: 'Mouse', price: '$47.990 Transferencia', price2: '$50.155 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/7sotxdzl_f26b2128_thumbnail_512.jpg' },
        { id: 15, name: 'Audifono Gamer Wireless HyperX Cloud III, Micrófono, 120 hrs batería, 3.5mm, USB-C USB-A, Black/Red', brand: 'HyperX', category: 'Audifonos', price: '$119.990 Transferencia', price2: '$125.395 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/hd0c8pv3_5cecd7cc_thumbnail_512.png' },
        { id: 16, name: 'Teclado Mecánico Gamer Redragon Fizz Pro, Wireless, 60%, Switch Redragon Red, Español, White/Grey, Blanco', brand: 'Redragon', category: 'Teclado', price: '$59.990 Transferencia', price2: '$62.690 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/gnmeyngk_ec1c199b_thumbnail_512.jpg' },
        { id: 17, name: 'Teclado Gamer Hyper X Alloy Origins, Mecánico, Iluminación RGB, Switch Red, USB, Negro, Español', brand: 'HyperX', category: 'Teclado', price: '$99.990 Transferencia', price2: '$104.490 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/cd4gmue8_14f86972_thumbnail_512.png' },
        { id: 18, name: 'Mouse Gamer Razer Deathadder V3, Black, 59g Ultra-lightweight Ergonomic Esports Mouse, 30K Optical', brand: 'Razer', category: 'Mouse', price: '$69.990 Transferencia', price2: '$73.145 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/714zzdnd_ffeba0c7_thumbnail_512.png' },
        { id: 19, name: 'Audifonos Gamer Inalámbrico Corsair Virtuoso Carbon Ultimate Premium Gaming', brand: 'Corsair', category: 'Audifonos', price: '$184.490 Transferencia', price2: '$192.806 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/rkw4q1vi_edbc4c7c_thumbnail_512.png' },
        { id: 20, name: 'Audífonos Gamer Razer Kraken Kitty V2, USB, Chroma RGB, Quartz', brand: 'Razer', category: 'Audifonos', price: '$124.990 Transferencia', price2: '$130.610 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/n80gd204_96a953de_thumbnail_512.jpg' },
    ];

    const brands = ['Corsair', 'Razer', 'HyperX', 'Redragon'];
    const categories = ['Silla', 'Teclado', 'Microfono', 'Mouse', 'Audifonos'];

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
        <div className="gaming-container">
            <h2 className="gaming-title">Explora el Mundo del Gaming</h2>
            <p className="gaming-description">
                Encuentra todo lo que necesitas para mejorar tu experiencia gaming: desde Sillas hasta los últimos Teclados.
            </p>
            
            {/* Filtro de productos */}
            <div className="filter-bar-modern">
                <div className="filter-group-modern">
                    <label htmlFor="brand-filter-gaming">Marca:</label>
                    <select id="brand-filter-gaming" value={selectedBrand} onChange={handleBrandChange}>
                        <option value="">Todas las marcas</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group-modern">
                    <label htmlFor="category-filter-gaming">Categoría:</label>
                    <select id="category-filter-gaming" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="gaming-products">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="card-gaming">
                        <div className="imagen-container">
                            <img src={p.image} alt={p.name} className="imagen-gaming" />
                        </div>
                        <h3 className="nombre-gaming">{p.name}</h3>
                        <p className="marca-gaming">{p.brand}</p>
                        <p className="precio-gaming">
                            <span className="precio-transferencia">{p.price}</span>
                            <span className="precio-normal">{p.price2}</span>
                        </p>
                        <div className="botones-gaming">
                            <button className="btn-agregar">Agregar</button>
                            <button className="btn-ver">Ver</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gaming;