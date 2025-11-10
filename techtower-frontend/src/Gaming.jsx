import React, { useState, useEffect } from 'react';
import './Gaming.css';
import { useCart } from './services/useCart';

const Gaming = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart, loadingCart } = useCart();

    // fetch de los productos!
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Se traen solo los productos de la categoría que se necesita... muy importante!
                const response = await fetch('http://127.0.0.1:8000/api/products/?categoria=Streaming y Gaming');

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data);
                
                // Se generan las marcas de forma automática!
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
    }, []); // El array vacío [] asegura que se ejecute solo una vez (?)

    
    const handleBrandChange = (e) => {
        setSelectedBrand(e.target.value);
    };

    const filteredProducts = products.filter((product) => {
        // Aqui se filtra por marca, ya que la categoría ya está fija en Gaming
        return (selectedBrand === '' || product.marca_producto === selectedBrand);
    });

    if (loading) {
        return <div className="gaming-container"><h2>Cargando productos de Gaming...</h2></div>;
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

                {/* De momento solo serán filtrados por marca, al menos aliviana la carga inicial*/}
                
            </div>

            <div className="gaming-products">
                {filteredProducts.map((p) => ( 
                    <div key={p.producto_id} className="card-gaming"> {/* Ouyea! aquí se muestran los productos*/}
                        <div className="imagen-container">
                            <img src={p.imagen} alt={p.nombre_producto} className="imagen-gaming" />
                            {p.descuento > 0 && <span className="badge-descuento">{p.descuento}% DCTO</span>}
                        </div>
                        <h3 className="nombre-gaming">{p.nombre_producto}</h3>
                        <p className="marca-gaming">{p.marca_producto}</p>
                        {p.descuento > 0 ? (
                            // Si SÍ hay descuento
                            <p className="precio-gaming">
                                {/* Mostramos el precio normal tachado */}
                                <span className="precio-normal-tachado">
                                    ${p.precio_otro.toLocaleString('es-CL')}
                                </span>
                                {/* Mostramos el precio final de transferencia */}
                                <span className="precio-transferencia">
                                    ${p.precio_final_transferencia.toLocaleString('es-CL')} Transferencia
                                </span>
                            </p>
                        ) : (
                            // Si NO hay descuento (el código original)
                            <p className="precio-gaming">
                                <span className="precio-transferencia">
                                    ${p.precio_transferencia.toLocaleString('es-CL')} Transferencia
                                </span>
                                <span className="precio-normal">
                                    ${p.precio_otro.toLocaleString('es-CL')} Otro medio de pago
                                </span>
                            </p>
                        )}
                        <div className="botones-gaming">
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

export default Gaming;