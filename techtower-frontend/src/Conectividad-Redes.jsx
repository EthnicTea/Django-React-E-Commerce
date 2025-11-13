import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Conectividad-Redes.css';
import { useCart } from './services/useCart';

const ConectividadRedes = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart, loadingCart } = useCart();
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/products/?categoria=Conectividad Y Redes');
    
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
    
                const data = await response.json();
                setProducts(data);
                
                const marcasUnicas = [...new Set(data.map(p => p.marca_producto))];
                setBrands(marcasUnicas.sort());
    
            } catch (err) {
                console.error("Error al hacer fetch(￣ε(#￣):", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts(); 
    }, []);
        
    const handleBrandChange = (e) => {
        setSelectedBrand(e.target.value);
    };
    
    const filteredProducts = products.filter((product) => {
        return (selectedBrand === '' || product.marca_producto === selectedBrand);
    });
    
    if (loading) {
        return <div className="conectividad-container"><h2>Cargando productos de Conectividad...</h2></div>;
    }
    
    if (error) {
        return <div className="conectividad-container"><h2>Error al cargar productos: {error}</h2></div>;
    }

    return (
        <div className="conectividad-container">
            <h2 className="conectividad-title">Explora el Rincón de las Conexiones</h2>
            <p className="conectividad-description">
                Encuentra todo lo que necesitas para mejorar o agregar Conexiones: desde Cables de Alimentación hasta todo tipo de USB's.
            </p>
            
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
            </div>

            <div className="conectividad-products">
                {filteredProducts.map((p) => (
                    <div key={p.producto_id} className="card-conectividad">
                        <div className="imagen-container">
                            <img src={p.imagen} alt={p.nombre_producto} className="imagen-conectividad" />
                            {p.descuento > 0 && <span className="badge-descuento">{p.descuento}% DCTO</span>}
                        </div>
                        <h3 className="nombre-conectividad">{p.nombre_producto}</h3>
                        <p className="marca-conectividad">{p.marca_producto}</p>
                        {p.descuento > 0 ? (
                            <p className="precio-conectividad">
                                <span className="precio-normal-tachado">
                                    ${p.precio_otro.toLocaleString('es-CL')}
                                </span>
                                <span className="precio-transferencia">
                                    ${p.precio_final_transferencia.toLocaleString('es-CL')} Transferencia
                                </span>
                            </p>
                        ) : (
                            <p className="precio-gaming">
                                <span className="precio-transferencia">
                                    ${p.precio_transferencia.toLocaleString('es-CL')} Transferencia
                                </span>
                                <span className="precio-normal">
                                    ${p.precio_otro.toLocaleString('es-CL')} Otro medio de pago
                                </span>
                            </p>
                        )}
                        <div className="botones-conectividad">
                            <button 
                                className="btn-agregar"
                                onClick={() => addToCart(p.producto_id)}
                                disabled={loadingCart} 
                            >
                                {loadingCart ? 'Agregando...' : 'Agregar'}
                            </button>
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

export default ConectividadRedes;