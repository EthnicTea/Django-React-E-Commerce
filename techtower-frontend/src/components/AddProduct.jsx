import React, { useState } from "react";
import './AddProduct.css';
import api from "../services/axiosConfig";

// Recibimos la prop 'onDone' del padre (Crud.jsx)
export default function AddProduct({ onDone }) {
    
    // ¡Usamos los nombres de campo correctos de la API!
    const [product, setProduct] = useState({
        nombre_producto: "",
        marca_producto: "",
        categoria: "", // ID de la categoría
        tipo: "",       // ID del tipo
        descripcion_producto: "",
        precio_transferencia: "",
        precio_otro: "",
        stock_producto: "",
        imagen: "",
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(""); 

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos el objeto 'product' con los nombres correctos
            const response = await api.post("/products/create/", product); 
            console.log("Producto guardado:", response.data);
            setSuccess(true); 
            setError(""); 
            setProduct({ /* ... (limpiar formulario) ... */ });
            
            setTimeout(() => {
                setSuccess(false);
                onDone(); // ¡Llamamos a onDone para volver a la lista!
            }, 2000); // 2 segundos

        } catch (err) {
            console.error("Error al guardar el producto:", err);
            setError("Hubo un problema al guardar el producto.");
        }
    };

    return (
        <div className="add-product-form-container">
            <h2>Añadir nuevos productos</h2> 
            <form onSubmit={handleSubmit} className="form-box-crud">
                {/* ¡Actualizamos todos los 'name' de los inputs! */}
                <span className="crudspan">Nombre del producto</span>
                <input className="crudinput" type="text" placeholder="Teclado Mecánico Razer RGB" name="nombre_producto" value={product.nombre_producto} onChange={handleChange} required/>
                
                <span className="crudspan">Marca del Producto</span>
                <input className="crudinput" type="text" placeholder="Razer" name="marca_producto" value={product.marca_producto} onChange={handleChange} required/>
                
                <span className="crudspan">ID de Categoría</span>
                <input className="crudinput" type="number" placeholder="Ej: 1 (para Gaming)" name="categoria" value={product.categoria} onChange={handleChange} required/>
                
                <span className="crudspan">ID de Tipo de Producto</span>
                <input className="crudinput" type="number" placeholder="Ej: 1 (para Teclado)" name="tipo" value={product.tipo} onChange={handleChange} required/>

                <span className="crudspan">Descripción del Producto</span>
                <input className="crudinput" type="text" placeholder="Teclado mecánico con switches..." name="descripcion_producto" value={product.descripcion_producto} onChange={handleChange} required/>
                
                <span className="crudspan">Precio Transferencia</span>
                <input className="crudinput" type="number" placeholder="70000" name="precio_transferencia" value={product.precio_transferencia} onChange={handleChange} required/>
                
                <span className="crudspan">Precio por otro Metodo de Pago</span>
                <input className="crudinput" type="number" placeholder="90000" name="precio_otro" value={product.precio_otro} onChange={handleChange} required/>
                
                <span className="crudspan">Stock Producto</span>
                <input className="crudinput" type="number" placeholder="25" name="stock_producto" value={product.stock_producto} onChange={handleChange} required/>
                
                <span className="crudspan">Imagen del Producto</span>
                <input className="crudinput" type="text" placeholder="URL de la imágen" name="imagen" value={product.imagen} onChange={handleChange} required/>
                
                <button className="submitproduct" type="submit">Agregar Producto</button>
            </form>
            {success && <p className="success-message">Producto ingresado con éxito. Volviendo a la lista...</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}