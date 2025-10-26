import React, { useState } from 'react';
import './Componentes.css';

const Componentes = () => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Lista de productos
    const products = [
        { id: 21, name: 'Unidad SSD Kingston NV2, 500GB', brand: 'Kingston', category: 'SSD', price: '$59.990 Transferencia', price2: '$62.690 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/y2qb2v_n_cc9779c9_thumbnail_512.jpg' },
        { id: 22, name: 'Gabinete Gamer Aerocool Designer G V2 ARGB, Color Negro', brand: 'Aerocool', category: 'Gabinete', price: '$49.990 Transferencia', price2: '$52.240 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/v32yidd0_a9b07e6a_thumbnail_512.png' },
        { id: 23, name: 'Placa Madre ASUS Prime B550M-A AC, AMD AM4, 4xDIMM DDR4, VGA, DVI-D, HDMI, Wifi, Micro-ATX', brand: 'Asus', category: 'Placa Madre', price: '$114.990 Transferencia', price2: '$120.170 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/pv4k50ly_912465e6_thumbnail_512.png' },
        { id: 24, name: 'Memoria RAM DDR4 16GB 3200MHz Kingston FURY Beast, CL16, DIMM, 1.35V', brand: 'Kingston', category: 'Ram', price: '$33.890 Transferencia', price2: '$35.421 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/_xiag1e3_7be5c2ae_thumbnail_512.jpg' },
        { id: 25, name: 'Tarjeta de Video MSI Nvidia GeForce RTX 3060 VENTUS 2X 12G OC, 12GB GDDR6, 192-bit', brand: 'MSI', category: 'Tarjeta Grafica', price: '$299.990 Transferencia', price2: '$313.495 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/scpkheea_557a8ffc_thumbnail_512.jpg' },
        { id: 26, name: 'Tarjeta de Video ASUS Dual Nvidia GeForce RTX 3050 OC Edition, 6GB GDDR6, 96-bit, PCI-e 4.0', brand: 'Asus', category: 'Tarjeta Grafica', price: '$199.990 Transferencia', price2: '$208.995 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/1760964295111-a2_c6bc4af3_b7192c2c_thumbnail_512.png' },
        { id: 27, name: 'Gabinete Gamer Corsair 4000D Airflow, Mid-Tower, EATX, ATX, MicroATX, Mini-ITX, Vidrio templado', brand: 'Corsair', category: 'Gabinete', price: '$74.990 Transferencia', price2: '$78.370 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/rglx7bsp_f46b374c_thumbnail_512.jpg' },
        { id: 28, name: 'Fuente de Poder 750W Corsair CX750, Certificada 80+ PLUS Bronze, ATX', brand: 'Corsair', category: 'Fuente de Poder', price: '$69.990 Transferencia', price2: '$73.145 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/2ocr7807_e4c079a9_thumbnail_512.jpg' },
        { id: 29, name: 'Unidad SSD Kingston Fury Renegade, 2TB, M.2 2280, NVMe PCIe 4.0 x4, Lec. 7300MB/s Esc. 7000MB/s', brand: 'Kingston', category: 'SSD', price: '$163.590 Transferencia', price2: '$170.957 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/ffidolkq_8bb8241e_thumbnail_512.jpg' },
        { id: 30, name: 'Refrigeración Líquida Cougar Poseidon Elite ARGB 360, 360mm, Intel/AMD, Color Negro', brand: 'Cougar', category: 'Cooler', price: '$74.990 Transferencia', price2: '$78.370 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/rtqgorjz_37c8893d_thumbnail_512.jpg' },
    ];

    const brands = ['Kingston', 'Aerocool', 'Asus', 'MSI', 'Corsair', 'Cougar'];
    const categories = ['SSD', 'Gabinete', 'Placa Madre', 'Ram', 'Tarjeta Grafica', 'Fuente de Poder', 'Cooler'];

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
        <div className="componentes-container">
            <h2 className="componentes-title">Explora la Sección del Update</h2>
            <p className="componentes-description">
                Encuentra todos los componentes que necesites para optimizar tu experiencia: desde Gabinetes hasta las últimas Tarjetas Graficas.
            </p>
            
            {/* Filtro de productos */}
            <div className="filter-bar-modern">
                <div className="filter-group-modern">
                    <label htmlFor="brand-filter-componentes">Marca:</label>
                    <select id="brand-filter-componentes" value={selectedBrand} onChange={handleBrandChange}>
                        <option value="">Todas las marcas</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group-modern">
                    <label htmlFor="category-filter-componentes">Categoría:</label>
                    <select id="category-filter-componentes" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="componentes-products">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="card-componente">
                        <div className="imagen-container">
                            <img src={p.image} alt={p.name} className="imagen-componente" />
                        </div>
                        <h3 className="nombre-componente">{p.name}</h3>
                        <p className="marca-componente">{p.brand}</p>
                        <p className="precio-componente">
                            <span className="precio-transferencia">{p.price}</span>
                            <span className="precio-normal">{p.price2}</span>
                        </p>
                        <div className="botones-componente">
                            <button className="btn-agregar">Agregar</button>
                            <button className="btn-ver">Ver</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Componentes;