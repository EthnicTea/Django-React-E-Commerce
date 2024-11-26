import React, { useState } from "react";
import './AddProduct.css';
import api from "../services/axiosConfig";

export default function AddProduct() {
    const [product, setProduct] = useState({
        NomProducto: "",
        MarcaProducto: "",
        CategoriaProducto: "",
        DescripcionProducto: "",
        PrecioTransferencia: "",
        PrecioOtroMetodo: "",
        StockProducto: "",
        ImagenProducto: "",
    });
    const [success, setSuccess] = useState(false);
    const [err, setError] = useState(""); 

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/products/create", product);
            console.log("Producto guardado:", response.data);
            setSuccess(true); // Muestra mensaje de éxito
            setError("");     
            setProduct({       // Limpia el formulario
                NomProducto: "",
                MarcaProducto: "",
                CategoriaProducto: "",
                DescripcionProducto: "",
                PrecioTransferencia: "",
                PrecioOtroMetodo: "",
                StockProducto: "",
                ImagenProducto: "",
            });
            // Oculta el mensaje después de 3 segundos
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Error al guardar el producto:", err);
            setError("Hubo un problema al guardar el producto.");
            alert("Hubo un problema al guardar el producto.");
        }
    };

    return (
        <div className="container">
            <h2>Añadir nuevos productos</h2> 
            <form onSubmit={handleSubmit} className="form-box-crud">
                <span className="crudspan">Nombre del producto</span>
                <input className="crudinput" type="text" placeholder="Teclado Mecánico Razer RGB" name="NomProducto" value={product.NomProducto} onChange={handleChange} required/>
                <span className="crudspan">Marca del Producto</span>
                <input className="crudinput" type="text" placeholder="Razer" name="MarcaProducto" value={product.MarcaProducto} onChange={handleChange} required/>
                <span className="crudspan">Categoria del Producto</span>
                <input className="crudinput" type="text" placeholder="Teclado" name="CategoriaProducto" value={product.CategoriaProducto} onChange={handleChange} required/>
                <span className="crudspan">Descripción del Producto</span>
                <input className="crudinput" type="text" placeholder="Teclado mecánico con switches mecánicos..." name="DescripcionProducto" value={product.DescripcionProducto} onChange={handleChange} required/>
                <span className="crudspan">Precio Transferencia</span>
                <input className="crudinput" type="text" placeholder="70000" name="PrecioTransferencia" value={product.PrecioTransferencia} onChange={handleChange} required/>
                <span className="crudspan">Precio por otro Metodo de Pago</span>
                <input className="crudinput" type="text" placeholder="90000" name="PrecioOtroMetodo" value={product.PrecioOtroMetodo} onChange={handleChange} required/>
                <span className="crudspan">Stock Producto</span>
                <input className="crudinput" type="text" placeholder="25" name="StockProducto" value={product.StockProducto} onChange={handleChange} required/>
                <span className="crudspan">Imagen del Producto</span>
                <input className="crudinput" type="text" placeholder="URL de la imágen" name="ImagenProducto" value={product.ImagenProducto} onChange={handleChange} required/>
                <button className="submitproduct" type="submit">Agregar Producto</button>
            </form>
            {success && <p className="success-message">Producto ingresado con éxito</p>}
            {err && <p className="error-message">{err}</p>}
        </div>
    );
}
