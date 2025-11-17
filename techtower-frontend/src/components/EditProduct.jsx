import React, { useState, useEffect } from "react";
import './EditProduct.css';
import api from "../services/axiosConfig";

export default function EditProduct({ productToEdit, onFinished }) {
    
    //ESTADOS PARA LOS DROPDOWNS
    const [categorias, setCategorias] = useState([]);
    const [tipos, setTipos] = useState([]);

    // --- Rellenamos el estado con los datos del producto ---
    // ¡OJO! Tu 'productToEdit.categoria' es un objeto anidado,
    // pero nuestro <select> solo necesita el ID.
    const [product, setProduct] = useState({
        nombre_producto: productToEdit.nombre_producto || "",
        marca_producto: productToEdit.marca_producto || "",
        // Extraemos solo el ID del objeto
        categoria: productToEdit.categoria?.categoria_id || "", 
        tipo: productToEdit.tipo?.tipo_id || "", 
        descripcion_producto: productToEdit.descripcion_producto || "",
        precio_transferencia: productToEdit.precio_transferencia || "",
        precio_otro: productToEdit.precio_otro || "",
        stock_producto: productToEdit.stock_producto || "",
        imagen: productToEdit.imagen || "",
        watts: productToEdit.watts || 0,
        es_destacado: productToEdit.es_destacado || false,
        descuento: productToEdit.descuento || 0,
    });
    
    const [error, setError] = useState("");

    // --- Cargar datos para los Dropdowns (Igual que AddProduct) ---
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await api.get("/categorias/");
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al cargar categorías", error);
            }
        };
        const fetchTipos = async () => {
            try {
                const response = await api.get("/tipos/");
                setTipos(response.data);
            } catch (error) {
                console.error("Error al cargar tipos", error);
            }
        };
        fetchCategorias();
        fetchTipos();
    }, []); // Se ejecuta solo una vez

    // --- Manejador de Cambios (Igual que AddProduct) ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- Manejador de Submit (¡Actualizado para PATCH!) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            // ¡Llamamos al endpoint PATCH con el ID del producto!
            await api.patch(`/products/${productToEdit.producto_id}/`, product);
            
            console.log("Producto actualizado: ", product);
            alert('¡Producto actualizado con éxito!');
            onFinished(); // Volvemos a la lista
            
        } catch (err) {
            console.error("Error al actualizar el producto:", err.response?.data || err.message);
            setError("No se pudo actualizar el producto. Revisa los campos.");
        }
    };

    return (
        <div className="edit-product-container"> {/* (Puedes renombrar a .add-product-form-container si usas el mismo CSS) */}
            <h2>Editar Producto (ID: {productToEdit.producto_id})</h2>
            <form onSubmit={handleSubmit} className="form-box-crud">
                
                {/* (Nombre y Marca) */}
                <span className="crudspan">Nombre del Producto</span>
                <input
                    className="crudinput"
                    type="text"
                    name="nombre_producto"
                    value={product.nombre_producto}
                    onChange={handleChange}
                    required
                />
                
                <span className="crudspan">Marca del Producto</span>
                <input
                    className="crudinput"
                    type="text"
                    name="marca_producto"
                    value={product.marca_producto}
                    onChange={handleChange}
                    required
                />

                {/* --- ¡DROPDOWNS! (Igual que AddProduct) --- */}
                <span className="crudspan">Categoría del Producto</span>
                <select name="categoria" value={product.categoria} onChange={handleChange} required className="crudinput">
                    <option value="">-- Selecciona una Categoría --</option>
                    {categorias.map(cat => (
                        <option key={cat.categoria_id} value={cat.categoria_id}>
                            {cat.nombre_categoria} (ID: {cat.categoria_id})
                        </option>
                    ))}
                </select>

                <span className="crudspan">Tipo de Producto</span>
                <select name="tipo" value={product.tipo} onChange={handleChange} required className="crudinput">
                    <option value="">-- Selecciona un Tipo --</option>
                    {tipos.map(tipo => (
                        <option key={tipo.tipo_id} value={tipo.tipo_id}>
                            {tipo.nombre_tipo} (ID: {tipo.tipo_id})
                        </option>
                    ))}
                </select>

                {/* (Descripción, Precios, Stock, Imagen) */}
                <span className="crudspan">Descripción</span>
                <textarea
                    className="crudinput"
                    name="descripcion_producto"
                    value={product.descripcion_producto}
                    onChange={handleChange}
                />
                
                <span className="crudspan">Precio de Transferencia</span>
                <input
                    className="crudinput"
                    type="number"
                    name="precio_transferencia"
                    value={product.precio_transferencia}
                    onChange={handleChange}
                />
                
                <span className="crudspan">Precio por Otro Método</span>
                <input
                    className="crudinput"
                    type="number"
                    name="precio_otro"
                    value={product.precio_otro}
                    onChange={handleChange}
                />
                
                <span className="crudspan">Stock</span>
                <input
                    className="crudinput"
                    type="number"
                    name="stock_producto"
                    value={product.stock_producto}
                    onChange={handleChange}
                />
                
                <span className="crudspan">URL de Imagen</span>
                <input
                    className="crudinput"
                    type="text"
                    name="imagen"
                    value={product.imagen}
                    onChange={handleChange}
                />

                {/* --- ¡CAMPOS NUEVOS! (Igual que AddProduct) --- */}
                <span className="crudspan">Watts (Consumo)</span>
                <input 
                    className="crudinput" 
                    type="number" 
                    name="watts" 
                    value={product.watts} 
                    onChange={handleChange} 
                />
                
                <span className="crudspan">Descuento (%)</span>
                <input 
                    className="crudinput" 
                    type="number" 
                    name="descuento" 
                    value={product.descuento} 
                    onChange={handleChange} 
                />

                <div className="checkbox-container">
                    <label htmlFor="es_destacado" className="crudspan">
                        ¿Es un producto destacado?
                    </label>
                    <input 
                        type="checkbox"
                        id="es_destacado"
                        name="es_destacado"
                        checked={product.es_destacado}
                        onChange={handleChange}
                        className="crud-checkbox"
                    />
                </div>
                
                {/* --- Botón de Guardar --- */}
                <button type="submit" className="save-button">
                    Guardar Cambios
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}