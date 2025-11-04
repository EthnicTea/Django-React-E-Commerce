import React, { useState } from "react";
import AddProduct from "./components/AddProduct.jsx";
import EditProduct from "./components/EditProduct.jsx";
import ListProducts from "./components/ListProduct.jsx";
import './Crud.css';
import { useAuth } from './services/AuthContext.jsx'; 

export function Crud() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [view, setView] = useState("list"); // Vista por defecto
    const { user } = useAuth();

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

    const renderView = () => {
        switch (view) {
            case "add":
                return <AddProduct onDone={handleDone} />; // Le pasamos la prop onDone
            case "edit":
                return (
                    <EditProduct
                        productData={selectedProduct} // Le pasamos el producto
                        onDone={handleDone}         // Le pasamos la prop onDone
                    />
                );
            default: // "list"
                return (
                    <ListProducts
                        onEditProduct={handleEditClick} // Le pasamos la función de "editar"
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