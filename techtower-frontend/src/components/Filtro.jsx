// FilterBar.jsx
import React, { useState } from 'react';
import './Filtro.css';

const Filtro = ({ onFilter }) => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const brands = ['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'HyperX'];
    const categories = ['Teclado', 'Audífono', 'Mouse', 'Monitor', 'Silla'];

    const handleBrandChange = (e) => {
        setSelectedBrand(e.target.value);
        onFilter({ brand: e.target.value, category: selectedCategory });
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        onFilter({ brand: selectedBrand, category: e.target.value });
    };

    return (
        <div className="filter-bar">
            <h2>Filtrar Productos</h2>
            <div className="filter-group">
                <label htmlFor="brand-filter">Marca:</label>
                <select id="brand-filter" value={selectedBrand} onChange={handleBrandChange}>
                    <option value="">Todas las marcas</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>
            <div className="filter-group">
                <label htmlFor="category-filter">Categoría:</label>
                <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Filtro;
