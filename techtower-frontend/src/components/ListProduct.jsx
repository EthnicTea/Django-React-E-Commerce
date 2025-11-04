import React, { useState, useEffect } from 'react';
import api from "../services/axiosConfig";
import "./ListProduct.css";

// Recibimos la prop 'onEditProduct' del padre (Crud.jsx)
export default function ListProduct({ onEditProduct }) {
    
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    // Función para cargar los productos
    const fetchProducts = async () => {
        try {
            const response = await api.get("/products/"); // Usamos la URL base
            setProducts(response.data);
        } catch (err) {
            setError("Hubo un error al obtener los productos.");
            console.error(err);
        }
    };

    // Cargar productos al montar el componente
    useEffect(() => {
        fetchProducts();
    }, []);
    
    // Función para manejar el clic de borrado
    const handleDeleteClick = async (productId) => {
        const isConfirmed = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
        
        if (isConfirmed) {
            try {
                // Usamos la URL correcta del API (ej: /api/products/17/)
                await api.delete(`/products/${productId}/`);
                // Recargamos la lista para mostrar los cambios
                fetchProducts(); 
            } catch (err) {
                console.error("Error al eliminar el producto", err);
                setError("No se pudo eliminar el producto.");
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
                    <tbody>
                        {products.map((product) => (
                            // ¡Usamos los nombres de campo correctos de la BD!
                            <tr key={product.producto_id}>
                                <td>{product.producto_id}</td>
                                <td>{product.nombre_producto}</td>
                                <td>{product.marca_producto}</td>
                                <td>{product.categoria}</td> {/* Esto mostrará el ID de la categoría */}
                                <td>${product.precio_transferencia.toLocaleString('es-CL')}</td>
                                <td>{product.stock_producto}</td>
                                <td>
                                    {/* ¡Conectamos onEditProduct con la prop del padre! */}
                                    <button className="btn-edit" onClick={() => onEditProduct(product)}>Editar</button>
                                    <button className="btn-delete" onClick={() => handleDeleteClick(product.producto_id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}