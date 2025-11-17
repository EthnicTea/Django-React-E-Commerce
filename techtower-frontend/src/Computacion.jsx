import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "./Computacion.css";
import { useCart } from './services/useCart';

export default function Computacion() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, loadingCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/products/?categoria=Computación') //fetch('http://127.0.0.1:8000/api/products/?categoria=Computación');

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
    // USAR LA CLASE QUE CORRESPONDA
    return <div className="computacion-container"><h2>Cargando productos de Computación...</h2></div>;
  }

  if (error) {
    // USAR LA CLASE QUE CORRESPONDA
    return <div className="computacion-container"><h2>Error al cargar productos: {error}</h2></div>;
  }

  return (
    <div className="computacion-container">
      <h2 className="titulo-seccion">Explora el Apartado de Computación</h2>
      <p className="subtitulo-seccion">
        Encuentra todo lo que necesitas para mejorar tu experiencia en el mundo digital: desde accesorios hasta los ultimos monitores!.
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
              <img src={p.imagen} alt={p.nombre_producto} className="imagen-producto" />
              {p.descuento > 0 && <span className="badge-descuento">{p.descuento}% DCTO</span>}
            </div>
            <h3 className="nombre-producto">{p.nombre_producto}</h3>
            <p className="marca">{p.marca_producto}</p>
            {p.descuento > 0 ? (
                // Si SÍ hay descuento
                <p className="precio">
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
                <p className="precio">
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
                // Llama a la función del hook con el ID del producto
                onClick={() => addToCart(p.producto_id)}
                // Deshabilita el botón si ya está agregando algo
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
}