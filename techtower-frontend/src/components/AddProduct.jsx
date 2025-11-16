import React, { useState, useEffect } from "react";
import './AddProduct.css';
import api from "../services/axiosConfig";

// Recibimos la prop 'onDone' del padre (Crud.jsx)
export default function AddProduct({ onDone }) {

    const [categorias, setCategorias] = useState([]);
    const [tipos, setTipos] = useState([]);
    
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

    useEffect(() => {
        // Función para cargar categorías
        const fetchCategorias = async () => {
            try {
                const response = await api.get("/categorias/");
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al cargar categorías", error);
            }
        };

        // Función para cargar tipos de producto
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
    }, []); // El array vacío [] significa que se ejecuta 1 sola vez

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ¡Validación! Asegurarse de que se haya seleccionado una categoría/tipo
        if (!product.categoria || !product.tipo) {
            setError("Por favor, selecciona una categoría y un tipo.");
            return;
        }
        
        try {
            // El endpoint correcto (como está en tu urls.py)
            const response = await api.post("/products/create/", product); 
            console.log("Producto guardado:", response.data);
            setSuccess(true); 
            setError(""); 
            setProduct({ /* ... (limpiar formulario) ... */ });
            
            setTimeout(() => {
                setSuccess(false);
                onDone(); 
            }, 2000);

        } catch (err) {
            console.error("Error al guardar el producto:", err.response.data);
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