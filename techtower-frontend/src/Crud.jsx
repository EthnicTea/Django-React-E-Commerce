import React, { useState, useEffect } from "react";
import AddProduct from "./components/AddProduct.jsx";
import EditProduct from "./components/EditProduct.jsx";
import ListProducts from "./components/ListProduct.jsx";
import './Crud.css';
import { useAuth } from './services/AuthContext.jsx'; 
import api from "./services/axiosConfig";

export function Crud() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [view, setView] = useState("list"); // Vista por defecto
    const { user } = useAuth();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/products/");
            setProducts(response.data);
        } catch (err) {
            setError("Hubo un error al obtener los productos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Función para que ListProducts nos envíe el producto a editar
    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setView("edit");
    };

    // Función para que Add/Edit vuelvan a la lista
    const handleDone = () => {
        setSelectedProduct(null);
        setView("list");
    };

    const handleFinishAction = () => {
        setSelectedProduct(null);
        setView("list");
        fetchProducts(); 
    };

    const renderView = () => {
        if (loading) return <h2>Cargando productos...</h2>;
        if (error) return <h2 className="error-message">{error}</h2>;

        switch (view) {
            case "add":
                return <AddProduct onFinished={handleDone} />;
            case "edit":
                return <EditProduct productToEdit={selectedProduct} onFinished={handleFinishAction} />;
            default:
                return (
                    <ListProducts
                        products={products} 
                        onEditProduct={handleEditClick}
                        onDeleteSuccess={fetchProducts} 
                    />
                );
        }
    };

    return (
        <div className="crudbody">
            <div className="titlecontainer">
                <h1 className="titlecrud">Bienvenido empleado {user ? user.email : ''}</h1>
                <span>Aquí podrá añadir, modificar y borrar productos</span>
            </div>
            <div className="menu">
                <button className='crudbtn' onClick={() => setView("add")}>Añadir Producto</button>
                <button className='crudbtn' onClick={() => setView("list")}>Listar y editar Productos</button>
            </div>
            <div className="crud-content">
                {renderView()}
            </div>
        </div>
    );
}