import React, { useState } from 'react';
import Filtro from './Filtro';
import Gaming from './Gaming';

const Gaming = () => {
    const [filters, setFilters] = useState({ brand: '', category: '' });

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
        <div>
            <Filtro onFilter={handleFilterChange} />
            <Gaming products={filteredProducts} />
        </div>
    );
};

export default Gaming;
