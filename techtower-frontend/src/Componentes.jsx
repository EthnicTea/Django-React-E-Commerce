import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Componentes.css'; 
import { useCart } from './services/useCart';

const Componentes = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart, loadingCart } = useCart();
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/api/products/?categoria=Componentes') //fetch('http://127.0.0.1:8000/api/products/?categoria=Componentes');
    
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
        return <div className="computacion-container"><h2>Cargando productos de Componentes...</h2></div>;
    }
    
    if (error) {
        return <div className="computacion-container"><h2>Error al cargar productos: {error}</h2></div>;
    }

    return (
        <div className="computacion-container"> 
            <h2 className="titulo-seccion">Explora la Sección de Componentes</h2>
            <p className="subtitulo-seccion">
                Encuentra todos los componentes que necesites para optimizar tu experiencia: desde Gabinetes hasta las últimas Tarjetas Gráficas.
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

            <div className="productos-grid">
                {filteredProducts.map((p) => (
                    <div key={p.producto_id} className="card-producto">
                        <div className="imagen-container">
                            {/* Lógica de falta de Imágen */}
                            {/* https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg */}
                            <img src={p.imagen} alt={p.nombre_producto} className="imagen-producto" />
                            {/* Lógica de DESCUENTO, aquí se pone la etiqueta de descuento, más abajo se hace la comparación */}
                            {p.descuento > 0 && <span className="badge-descuento">{p.descuento}% DCTO</span>}
                        </div>
                        <h3 className="nombre-producto">{p.nombre_producto}</h3>
                        <p className="marca">{p.marca_producto}</p>
                        {p.descuento > 0 ? (
                            <p className="precio">
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
                        <div className="botones">
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

export default Componentes;