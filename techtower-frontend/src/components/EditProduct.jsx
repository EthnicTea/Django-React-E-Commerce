import React, { useState, useEffect } from "react";
import './EditProduct.css';
import api from "../services/axiosConfig";

// Recibimos 'productData' (el producto a editar) y 'onDone' (para volver)
export default function EditProduct({ productData, onDone }) {
    
    // Rellenamos el estado con los datos del producto que recibimos
    const [product, setProduct] = useState(productData);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            // Extraemos los campos que queremos enviar
            const { 
                nombre_producto, marca_producto, categoria, tipo, 
                descripcion_producto, precio_transferencia, precio_otro, 
                stock_producto, imagen 
            } = product;
            
            const updatedData = { 
                nombre_producto, marca_producto, categoria, tipo, 
                descripcion_producto, precio_transferencia, precio_otro, 
                stock_producto, imagen 
            };
        
            // Llamamos al endpoint PATCH con el ID del producto
            await api.patch(`/products/${productData.producto_id}/`, updatedData);
            
            console.log("Producto actualizado: ", product);
            onDone(); // Volvemos a la lista
            
        } catch (err) {
            console.error("Error al actualizar el producto:", err);
            setError("No se pudo actualizar el producto.");
        }
    };

    return (
        <div className="edit-product-container">
            <h2>Editar Producto (ID: {product.producto_id})</h2>
            <form onSubmit={handleSubmit} className="edit-product-form">
                
                {/* ¡Usamos los nombres de campo correctos! */}
                
                <label>Nombre del Producto</label>
                <input
                    type="text"
                    name="nombre_producto"
                    value={product.nombre_producto}
                    onChange={handleChange}
                    required
                />
                
                <label>Marca del Producto</label>
                <input
                    type="text"
                    name="marca_producto"
                    value={product.marca_producto}
                    onChange={handleChange}
                    required
                />

                <label>ID de Categoría</label>
                <input
                    type="number"
                    name="categoria"
                    value={product.categoria}
                    onChange={handleChange}
                    required
                />
                
                <label>ID de Tipo</label>
                <input
                    type="number"
                    name="tipo"
                    value={product.tipo}
                    onChange={handleChange}
                    required
                />

                <label>Descripción</label>
                <textarea
                    name="descripcion_producto"
                    value={product.descripcion_producto}
                    onChange={handleChange}
                />
                
                <label>Precio de Transferencia</label>
                <input
                    type="number"
                    name="precio_transferencia"
                    value={product.precio_transferencia}
                    onChange={handleChange}
                />
                
                <label>Precio por Otro Método</label>
                <input
                    type="number"
                    name="precio_otro"
                    value={product.precio_otro}
                    onChange={handleChange}
                />
                
                <label>Stock</label>
                <input
                    type="number"
                    name="stock_producto"
                    value={product.stock_producto}
                    onChange={handleChange}
                />
                
                <label>URL de Imagen</label>
                <input
                    type="text"
                    name="imagen"
                    value={product.imagen}
                    onChange={handleChange}
                />
                
                <button type="submit" className="save-button">
                    Guardar Cambios
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}