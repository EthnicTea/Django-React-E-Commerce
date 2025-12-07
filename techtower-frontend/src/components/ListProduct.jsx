import React, { useState, useEffect } from 'react';
import api from "../services/axiosConfig";
import "./ListProduct.css";

// Recibimos 'products', 'onEditProduct', 'onDeleteSuccess'
export default function ListProduct({ products, onEditProduct, onDeleteSuccess }) {
    
    // --- ESTADOS ---
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [error, setError] = useState(null);

    // --- LÓGICA DE BÚSQUEDA MEJORADA ---
    const filteredProducts = products.filter((product) => {
        const searchLower = searchTerm.toLowerCase().trim();
        
        // Si está vacío, mostrar todos
        if (!searchLower) return true;
        
        // Búsqueda por nombre (parcial)
        const nombreMatch = product.nombre_producto.toLowerCase().includes(searchLower);
        
        // Búsqueda por ID exacto (solo si el search term es un número)
        const idExacto = !isNaN(searchLower) && product.producto_id === parseInt(searchLower);
        
        // Búsqueda por ID que empieza con (más intuitivo que includes)
        const idParcial = !isNaN(searchLower) && product.producto_id.toString().startsWith(searchLower);
        
        return nombreMatch || idExacto || idParcial;
    });

    // --- EFECTO: Resetear página cuando cambia el filtro ---
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, products.length]); // Se resetea al buscar o cuando cambia la lista

    // --- LÓGICA DE PAGINACIÓN ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Validación: Si estamos en una página que ya no existe después de filtrar
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // --- HANDLERS ---
    
    const handleDeleteClick = async (productId, productName) => {
        const isConfirmed = window.confirm(
            `¿Estás seguro de que quieres eliminar "${productName}"?`
        );
        
        if (!isConfirmed) return;

        setError(null);
        
        try {
            await api.delete(`/products/${productId}/`);
            onDeleteSuccess();
            
            // Si eliminamos el único producto de la página actual, volver a la anterior
            if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (err) {
            console.error("Error al eliminar", err);
            const errorMsg = err.response?.data?.message || "No se pudo eliminar el producto.";
            setError(errorMsg);
            
            // Auto-limpiar error después de 5 segundos
            setTimeout(() => setError(null), 5000);
        }
    };

    // Cambiar de página
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // --- HELPERS PARA PAGINACIÓN ---
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Máximo de números visibles

        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica inteligente: mostrar páginas cercanas a la actual
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, currentPage + 2);

            if (start > 1) pages.push(1, '...');
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (end < totalPages) pages.push('...', totalPages);
        }

        return pages;
    };

    return (
        <div className="list-products">
            <h2 className="listtitle">Listado de Productos</h2>
            <p className="infotitle">
                {filteredProducts.length} producto(s) encontrado(s)
            </p>
            
            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}
            
            {/* --- BARRA DE BÚSQUEDA --- */}
            <div className="admin-search-container">
                <input 
                    type="text" 
                    placeholder="🔍 Buscar por Nombre o ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm("")}
                        className="clear-search-btn"
                        title="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>

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
                        {currentItems.length > 0 ? (
                            currentItems.map((product) => (
                                <tr key={product.producto_id}>
                                    <td>{product.producto_id}</td>
                                    <td>{product.nombre_producto}</td>
                                    <td>{product.marca_producto || 'N/A'}</td>
                                    <td>{product.categoria}</td> 
                                    <td>${product.precio_transferencia.toLocaleString('es-CL')}</td>
                                    <td>
                                        <span className={product.stock_producto <= 0 ? 'stock-agotado' : ''}>
                                            {product.stock_producto}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-edit" 
                                            onClick={() => onEditProduct(product)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn-delete" 
                                            onClick={() => handleDeleteClick(product.producto_id, product.nombre_producto)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>
                                    {searchTerm ? (
                                        <>
                                            <p style={{fontSize: '1.2rem', marginBottom: '10px'}}>🔍</p>
                                            <p>No se encontraron productos con "{searchTerm}"</p>
                                            <button 
                                                onClick={() => setSearchTerm("")}
                                                className="btn-clear-search"
                                            >
                                                Limpiar búsqueda
                                            </button>
                                        </>
                                    ) : (
                                        <p>No hay productos registrados.</p>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- CONTROLES DE PAGINACIÓN --- */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="page-btn"
                        aria-label="Página anterior"
                    >
                        ← Anterior
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                aria-label={`Página ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="page-btn"
                        aria-label="Página siguiente"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}