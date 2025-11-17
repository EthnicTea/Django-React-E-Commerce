import React, { useState, useEffect } from 'react';
import './Ofertas.css';
import { useCart } from './services/useCart';
import { Link } from 'react-router-dom';

const Ofertas = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const { addToCart, loadingCart } = useCart();

    useEffect(() => {
        const fetchOfertas = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/api/products/?en_oferta=true'); //fetch('http://127.0.0.1:8000/api/products/?en_oferta=true');
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data); 
                
                const marcasUnicas = [...new Set(data.map(p => p.marca_producto))];
                const categoriasUnicas = [...new Set(data.map(p => p.categoria.nombre_categoria))]; // Asumiendo que 'categoria' es un objeto
                
                setBrands(marcasUnicas.sort());
                setCategories(categoriasUnicas.sort());

            } catch (err) {
                console.error("Error al cargar ofertas:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOfertas();
    }, []); 

    const handleBrandChange = (e) => {
        setSelectedBrand(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const filteredProducts = products.filter((product) => {
        return (
            (selectedBrand === '' || product.marca_producto === selectedBrand) &&
            (selectedCategory === '' || product.categoria.nombre_categoria === selectedCategory)
        );
    });

    // --- Renderizado ---
    if (loading) return <div className="ofertas-container"><h2>Cargando Ofertas...</h2></div>;
    if (error) return <div className="ofertas-container"><h2>Error al cargar: {error}</h2></div>;

    return (
        <div className="ofertas-container">
            <h2 className="ofertas-title">Explora las Mejores Ofertas</h2>
            <p className="ofertas-description">
                Encuentra las mejores ofertas del año: desde periféricos esenciales hasta tecnología de última generación.
            </p>
            
            <div className="filter-bar-modern">
                <div className="filter-group-modern">
                    <label htmlFor="brand-filter-gaming">Marca:</label>
                    <select id="brand-filter-gaming" value={selectedBrand} onChange={handleBrandChange}>
                        <option value="">Todas las marcas</option>
                        
                        {/* bum! dropdown dinámico papu */}
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>           
            </div>

            <div className="ofertas-products">
                {filteredProducts.map((p) => (
                    <div key={p.producto_id} className="card-oferta">
                        <div className="imagen-container">
                            <img src={p.imagen} alt={p.nombre_producto} className="imagen-oferta" />
                            {/* Descuento Real */}
                            {p.descuento > 0 && <span className="badge-descuento">{p.descuento}% DCTO</span>}
                        </div>
                        <h3 className="nombre-oferta">{p.nombre_producto}</h3>
                        <p className="marca-oferta">{p.marca_producto}</p>
                        
                        {/* Precio normal (calculado si hay descuento) */}
                        <p className="precio-normal-tachado">
                            ${p.precio_otro.toLocaleString('es-CL')}
                        </p>
                        
                        <p className="precio-oferta">
                            <span className="precio-transferencia">
                                ${p.precio_final_transferencia.toLocaleString('es-CL')} Transferencia
                            </span>
                            {/* Se puede ocultar el 'precio-normal' */}
                        </p>
                        
                        <div className="botones-oferta">
                            <button className="btn-agregar" onClick={() => addToCart(p.producto_id)} disabled={loadingCart}>
                                {loadingCart ? '...' : 'Agregar'}
                            </button>
                            {/* Link ver aun no funciona */}
                            <Link to={`/producto/${p.producto_id}`} className="btn-ver">
                                Ver
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ofertas;