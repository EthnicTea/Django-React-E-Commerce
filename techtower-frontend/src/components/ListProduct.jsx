import React, { useState, useEffect } from 'react';
import api from "../services/axiosConfig";
import "./ListProduct.css";

// Recibimos la prop 'onEditProduct' del padre (Crud.jsx)
export default function ListProduct({ products, onEditProduct, onDeleteSuccess }) {
    
    const [error, setError] = useState(null);
    
    const handleDeleteClick = async (productId) => {
        const isConfirmed = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
        setError(null);
        
        if (isConfirmed) {
            try {
                await api.delete(`/products/${productId}/`);
                onDeleteSuccess(); 
            } catch (err) {
                console.error("Error al eliminar el producto", err);
                alert("No se pudo eliminar el producto.");
            }
        }
    };
    
    return (
        <div className="list-products">
            <h2 className="listtitle">Listado de Productos</h2>
            {error && <p className="error">{error}</p>}
            <p className="infotitle">No todos los datos se ven en la tabla</p>
            <div className="table-responsive">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Categoría (ID)</th>
                            <th>Precio (Transf.)</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>{products.map((product) => (
                        <tr key={product.producto_id}>
                            <td>{product.producto_id}</td>
                            <td>{product.nombre_producto}</td>
                            <td>{product.marca_producto}</td>
                            {/* Esto fallará si 'categoria' es un objeto.
                                Debería ser 'product.categoria.nombre_categoria'
                                o simplemente 'product.categoria' si es el ID */}
                            <td>{product.categoria}</td> 
                            <td>{product.precio_transferencia}</td>
                            <td>{product.stock_producto}</td>
                            <td>
                                <button className="btn-edit" onClick={() => onEditProduct(product)}>Editar</button>
                                <button className="btn-delete" onClick={() => handleDeleteClick(product.producto_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
}