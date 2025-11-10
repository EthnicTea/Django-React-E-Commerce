import React, { useState, useEffect } from 'react';
import './Audio-Video.css';
import { useCart } from './services/useCart';

const AudioVideo = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart, loadingCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/products/?categoria=Equipos de Audio y Video');
    
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
        return <div className="audiovideo-container"><h2>Cargando productos de Conectividad...</h2></div>;
    }
    
    if (error) {
        return <div className="audiovideo-container"><h2>Error al cargar productos: {error}</h2></div>;
    }

    return (
        <div className="audiovideo-container">
            <h2 className="audiovideo-title">Explora la Zona del Sonido y Video</h2>
            <p className="audiovideo-description">
                Encuentra todo lo que necesitas para mejorar tu experiencia audiovisual: desde Audífonos de alta gama hasta Videocámaras.
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

            <div className="audiovideo-products">
                {filteredProducts.map((p) => (
                    <div key={p.producto_id} className="card-audiovideo">
                        <div className="imagen-container">
                            <img src={p.imagen} alt={p.nombre_producto} className="imagen-audiovideo" />
                            {p.descuento > 0 && <span className="badge-descuento">{p.descuento}% DCTO</span>}
                        </div>
                        <h3 className="nombre-audiovideo">{p.nombre_producto}</h3>
                        <p className="marca-audiovideo">{p.marca_producto}</p>
                        {p.descuento > 0 ? (
                            <p className="precio-audiovideo">
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
                        <div className="botones-audiovideo">
                            <button 
                                className="btn-agregar"
                                // Llama a la función del hook con el ID del producto
                                onClick={() => addToCart(p.producto_id)}
                                // Deshabilita el botón si ya está agregando algo
                                disabled={loadingCart} 
                            >
                                {loadingCart ? 'Agregando...' : 'Agregar'}
                            </button>
                            <button className="btn-ver">Ver</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AudioVideo;