import React, { useState, useEffect } from 'react';
import api from "../services/axiosConfig";
import "./ListProduct.css";
// import EditProduct from "./components/EditProduct.jsx";

export default function ListProduct() {
    
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    const handleDeleteClick = (IdProducto) => {
        // Confirmación antes de borrar
        const isConfirmed = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
        
        if (isConfirmed) {
          handleDelete(IdProducto);
        }
      };

    const handleDelete = async (IdProducto) => {
        try {
            await api.delete(`/products/delete/${IdProducto}`);
            setProducts(products.filter(product => product.IdProducto !== IdProducto));
        } catch (err) {
            console.error("Error al eliminar el producto", err);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (err) {
                setError("Hubo un error al obtener los productos.");
                console.error(err);
            }
        };

        fetchProducts();
    }, []);
    
    return (
        <div className="list-products">
            <h2 className="listtitle">Listado de Productos</h2>
            {error && <p className="error">{error}</p>}
            <p className="infotitle">No todos los datos se ven en la tabla</p>
            <div className="table-responsive">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Categoría</th>
                            <th>Precio (Transferencia)</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.IdProducto}>
                                <td>{product.NomProducto}</td>
                                <td>{product.MarcaProducto}</td>
                                <td>{product.Categoria}</td>
                                <td>{product.PrecioTransferencia}</td>
                                <td>{product.Stock}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleEditClick(product)}>Editar</button>
                                    <button className="btn-delete" onClick={() => handleDeleteClick(product.IdProducto)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
