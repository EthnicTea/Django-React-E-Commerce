import React, { useState } from "react";
import AddProduct from "./components/AddProduct.jsx";
import EditProduct from "./components/EditProduct.jsx";
// import DeleteProduct from "./components/DeleteProduct.jsx";
import ListProducts from "./components/ListProduct.jsx";
import './Crud.css';

export function Crud() {
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const [view, setView] = useState("list");

    const renderView = () => {
        switch (view) {
            case "add":
                return <AddProduct />;
            case "edit":
                return (
                    <EditProduct
                        productData={selectedProduct}
                        onSubmit={(updatedProduct) => {
                            // Aquí manejas la actualización del producto
                            console.log("Producto actualizado: ", updatedProduct);
                            setView("list"); // Regresar a la lista
                        }}
                    />
                );
            default:
                return <ListProducts />;
        }
    };

    return (
        <div className="crudbody">
            <div className="titlecontainer">
                <h1 className="titlecrud">Bienvenido empleado {} </h1>
                <span>Aquí podrá añadir, modificar y borrar productos</span>
            </div>
            <div className="menu">
                <button className='crudbtn' onClick={() => setView("add")}>Añadir Producto</button>
                {/*<button className='crudbtn' onClick={() => setView("edit")}>Editar Producto</button>
                <button className='crudbtn' onClick={() => setView("delete")}>Eliminar Producto</button>*/}
                <button className='crudbtn' onClick={() => setView("list")}>Listar y editar Productos</button>
            </div>
            <div className="crud-content">
                {renderView()}
            </div>
        </div>
    );
}
