import React, { useState, useEffect } from 'react'; // <-- 1. Importamos useEffect
import './Gaming.css';

const Gaming = () => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);     

    // Filtros hardcodeados
    const brands = ['Corsair', 'Razer', 'HyperX', 'Redragon'];
    const categories = ['Silla', 'Teclado', 'Microfono', 'Mouse', 'Audifonos'];

    // Fetch
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Endpoint
                const response = await fetch('http://127.0.0.1:8000/api/products/?categoria=Gaming');

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data); 

            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchProducts(); 
    }, []);
    
    // --- Lógica de Filtros ---
    const filteredProducts = products.filter((product) => {
        // **IMPORTANTE:** Esto asumía que product.brand era un string ('Corsair').
        // Si tu API devuelve un objeto (ej: product.marca_producto.nombre_marca),
        // tendrás que ajustar esta lógica de filtro más adelante.
        // Por ahora, lo dejamos para que veas el patrón. -atte gemini
        return (
            (selectedBrand === '' || product.brand === selectedBrand) &&
            (selectedCategory === '' || product.category === selectedCategory)
        );
    });

    if (loading) {
        return <div className="gaming-container"><h2>Cargando productos...</h2></div>;
    }

    if (error) {
        return <div className="gaming-container"><h2>Error al cargar productos: {error}</h2></div>;
    }

    return (
        <div className="gaming-container">
            <h2 className="gaming-title">Explora el Mundo del Gaming</h2>
            <p className="gaming-description">
                Encuentra todo lo que necesitas para mejorar tu experiencia gaming: desde Sillas hasta los últimos Teclados.
            </p>
            
            {/* 
            Lógica de la barra de filtros se rompió con el fetch.
            Se debe crear un nuevo endpoint que se encargue de traer esos datos
            */}


            <div className="filter-bar-modern">
                {/*<div className="filter-group-modern">
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
                </div> /*}
            </div>

            <div className="gaming-products">
                {/* ¡Aquí usamos los datos de la API! */}
                {filteredProducts.map((p) => (
                    <div key={p.producto_id} className="card-gaming"> {/* <-- Usamos el ID real de la DB */}
                        <div className="imagen-container">
                            {/* <-- Usamos el campo 'imagen' de la DB */}
                            <img src={p.imagen} alt={p.nombre_producto} className="imagen-gaming" />
                        </div>
                        {/* <-- Usamos 'nombre_producto' */}
                        <h3 className="nombre-gaming">{p.nombre_producto}</h3>
                        
                        {/* <-- Usamos 'marca_producto' (Asumiendo que es un string, 
                                si es un objeto sería p.marca_producto.nombre_marca) */}
                        <p className="marca-gaming">{p.marca_producto}</p> 
                        
                        <p className="precio-gaming">
                            {/* <-- Usamos 'precio_transferencia' y 'precio_otro' */}
                            <span className="precio-transferencia">${p.precio_transferencia.toLocaleString('es-CL')} Transferencia</span>
                            <span className="precio-normal">${p.precio_otro.toLocaleString('es-CL')} Otro medio de pago</span>
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
