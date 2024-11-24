import React from "react";
import './Crud.css';
export function Crud() {
    return(
        <div class="container">
            <h2>Crud para usuarios</h2>
            <form action="" class="form-box-crud">
                    <input class="controls" type="text" placeholder="Nombre del Producto"/>
                    <input class="controls" type="text" placeholder="Marca del Producto"/>
                    <input class="controls" type="text" placeholder="Categoria del Producto"/>
                    <input class="controls" type="text" placeholder="Descripción del Producto"/>
                    <input class="controls" type="text" placeholder="Precio Transferencia"/>
                    <input class="controls" type="text" placeholder="Precio por otro Metodo de Pago"/>
                    <input class="controls" type="text" placeholder="Stock Producto"/>
                    <input class="controls" type="text" placeholder="Imagen del Producto"/>
                    <button class="btn-1" type="submit">Agregar Producto</button>
                    <button class="btn-2" type="submit">Eliminar Producto</button>
                    <button class="btn-3" type="submit">Editar Producto</button>
            </form>
        </div>
    )
} 