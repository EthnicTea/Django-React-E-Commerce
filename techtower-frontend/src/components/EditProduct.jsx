import React, { useState } from "react";
import "./EditProduct.css";

export default function EditProduct({ productData, onSubmit }) {
    // Estado para los datos del producto
    const [product, setProduct] = useState(productData);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product);
        console.log("Producto actualizado: ", product);
    };

    return (
        <div className="edit-product-container">
            <h2>Editar Producto</h2>
            <form onSubmit={handleSubmit} className="edit-product-form">
                <label>
                    Nombre del Producto
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="Nombre del producto"
                        required
                    />
                </label>
                <label>
                    Marca del Producto
                    <input
                        type="text"
                        name="brand"
                        value={product.brand}
                        onChange={handleChange}
                        placeholder="Marca del producto"
                        required
                    />
                </label>
                <label>
                    Categoría
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        placeholder="Categoría"
                    />
                </label>
                <label>
                    Descripción
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Descripción del producto"
                    />
                </label>
                <label>
                    Precio de Transferencia
                    <input
                        type="number"
                        name="transferPrice"
                        value={product.transferPrice}
                        onChange={handleChange}
                        placeholder="Precio"
                    />
                </label>
                <label>
                    Precio por Otro Método
                    <input
                        type="number"
                        name="otherPrice"
                        value={product.otherPrice}
                        onChange={handleChange}
                        placeholder="Precio"
                    />
                </label>
                <label>
                    Stock
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        placeholder="Cantidad en stock"
                    />
                </label>
                <label>
                    URL de Imagen
                    <input
                        type="text"
                        name="image"
                        value={product.image}
                        onChange={handleChange}
                        placeholder="URL de la imagen"
                    />
                </label>
                <button type="submit" className="save-button">
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}
