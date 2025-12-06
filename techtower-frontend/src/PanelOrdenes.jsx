// src/pages/PanelOrdenes.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './services/AuthContext.jsx';
import './PanelOrdenes.css';

// ========================================
// MODAL PARA EDITAR ITEMS
// ========================================
function EditarItemsModal({ orden, productos, onClose, onSave }) {
    const [itemsEditados, setItemsEditados] = useState(
        orden.items.map(item => ({
            producto_id: item.producto.producto_id,
            nombre_producto: item.producto.nombre_producto,
            cantidad: item.cantidad
        }))
    );

    const agregarItem = () => {
        setItemsEditados([...itemsEditados, { producto_id: '', cantidad: 1, nombre_producto: '' }]);
    };

    const eliminarItem = (index) => {
        setItemsEditados(itemsEditados.filter((_, i) => i !== index));
    };

    const actualizarItem = (index, campo, valor) => {
        const nuevosItems = [...itemsEditados];
        if (campo === 'producto_id') {
            const producto = productos.find(p => p.producto_id === parseInt(valor));
            nuevosItems[index].producto_id = parseInt(valor);
            nuevosItems[index].nombre_producto = producto?.nombre_producto || '';
        } else {
            nuevosItems[index][campo] = parseInt(valor);
        }
        setItemsEditados(nuevosItems);
    };

    const handleGuardar = () => {
        // Validar que todos los items tengan producto y cantidad > 0
        const itemsValidos = itemsEditados.filter(item => item.producto_id && item.cantidad > 0);
        if (itemsValidos.length === 0) {
            alert('❌ Debe haber al menos un item válido con cantidad mayor a 0');
            return;
        }
        // Enviamos solo producto_id y cantidad (como espera el backend)
        onSave(itemsValidos.map(item => ({ 
            producto_id: item.producto_id, 
            cantidad: item.cantidad 
        })));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>✏️ Editar Items - Orden #{orden.orden_id}</h2>
                    <button onClick={onClose} className="modal-close-btn">✕</button>
                </div>

                <div className="modal-body">
                    {itemsEditados.map((item, index) => (
                        <div key={index} className="modal-item-row">
                            <select
                                value={item.producto_id}
                                onChange={(e) => actualizarItem(index, 'producto_id', e.target.value)}
                                className="modal-producto-select"
                            >
                                <option value="">Seleccionar producto...</option>
                                {productos.map(p => (
                                    <option key={p.producto_id} value={p.producto_id}>
                                        {p.nombre_producto}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min="1"
                                value={item.cantidad}
                                onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
                                className="modal-cantidad-input"
                                placeholder="Cant."
                            />

                            <button 
                                onClick={() => eliminarItem(index)} 
                                className="modal-delete-btn"
                                title="Eliminar item"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}

                    <button onClick={agregarItem} className="modal-add-btn">
                        ➕ Agregar Item
                    </button>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="modal-cancel-btn">Cancelar</button>
                    <button onClick={handleGuardar} className="modal-save-btn">
                        💾 Guardar Items
                    </button>
                </div>
            </div>
        </div>
    );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
export default function PanelOrdenes() {
    const { authToken, user } = useAuth();
    
    const [ordenes, setOrdenes] = useState([]);
    const [productos, setProductos] = useState([]); // 🆕 Lista de productos disponibles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('todas');
    
    // 🆕 Estado para controlar qué orden está en modo edición
    const [ediciones, setEdiciones] = useState({});
    const [modalAbierto, setModalAbierto] = useState(null);

    // ========================================
    // CARGAR ÓRDENES Y PRODUCTOS AL INICIO
    // ========================================
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Cargar todas las órdenes
                const responseOrdenes = await fetch(import.meta.env.VITE_API_URL + '/api/admin/ordenes/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!responseOrdenes.ok) {
                    if (responseOrdenes.status === 403) {
                        throw new Error('No tienes permisos para ver esta página.');
                    }
                    throw new Error('No se pudieron cargar las órdenes.');
                }
                const dataOrdenes = await responseOrdenes.json();
                setOrdenes(dataOrdenes);

                // 2. Cargar lista de productos (para el modal)
                const responseProductos = await fetch(import.meta.env.VITE_API_URL + '/api/products/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (responseProductos.ok) {
                    const dataProductos = await responseProductos.json();
                    setProductos(dataProductos);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authToken]);

    // ========================================
    // FUNCIONES DE EDICIÓN
    // ========================================
    
    // Activar modo edición para una orden
    const iniciarEdicion = (ordenId) => {
        const orden = ordenes.find(o => o.orden_id === ordenId);
        setEdiciones({
            ...ediciones,
            [ordenId]: {
                estado_orden: orden.estado_orden,
                total_orden: orden.total_orden,
                items_editar: null // Solo se llena si se editan items en el modal
            }
        });
    };

    // Actualizar un campo específico de la edición
    const actualizarEdicion = (ordenId, campo, valor) => {
        setEdiciones({
            ...ediciones,
            [ordenId]: {
                ...ediciones[ordenId],
                [campo]: valor
            }
        });
    };

    // Cancelar edición (descartar cambios)
    const cancelarEdicion = (ordenId) => {
        const nuevasEdiciones = { ...ediciones };
        delete nuevasEdiciones[ordenId];
        setEdiciones(nuevasEdiciones);
    };

    // 🆕 GUARDAR TODOS LOS CAMBIOS DE UNA ORDEN
    const guardarCambios = async (ordenId) => {
        const cambios = ediciones[ordenId];
        if (!cambios) return;

        // Preparar el payload según lo que espera el backend
        const payload = {
            estado_orden: cambios.estado_orden,
            total_orden: parseFloat(cambios.total_orden)
        };

        // Solo incluir items_editar si se modificaron en el modal
        if (cambios.items_editar) {
            payload.items_editar = cambios.items_editar;
        }

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/api/admin/ordenes/${ordenId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la orden');
            }

            const data = await response.json();

            // Actualizar el estado local con la respuesta del servidor
            setOrdenes(prev => prev.map(o => 
                o.orden_id === ordenId ? data : o
            ));

            // Limpiar estado de edición
            cancelarEdicion(ordenId);

            alert(`✅ Orden #${ordenId} actualizada correctamente`);

        } catch (error) {
            console.error(error);
            alert('❌ Error al guardar cambios: ' + error.message);
        }
    };

    // Abrir modal para editar items
    const abrirModalItems = (ordenId) => {
        if (!ediciones[ordenId]) {
            iniciarEdicion(ordenId);
        }
        setModalAbierto(ordenId);
    };

    // Guardar items desde el modal
    const guardarItemsDesdeModal = (ordenId, itemsEditados) => {
        actualizarEdicion(ordenId, 'items_editar', itemsEditados);
        setModalAbierto(null);
        alert('✅ Items actualizados. Presiona "Guardar Cambios" para aplicar.');
    };

    // ========================================
    // LÓGICA DE FILTRADO
    // ========================================
    const ordenesFiltradas = ordenes.filter(orden => {
        if (filtroEstado === 'todas') return true;
        return orden.estado_orden.toLowerCase() === filtroEstado;
    });

    const estaEditando = (ordenId) => !!ediciones[ordenId];
    const esAdmin = user && user.is_superuser;
    const esGerente = user && (user.es_gerente || user.is_superuser);

    // ========================================
    // RENDERIZADO
    // ========================================
    if (loading) return <div className="panel-ordenes-container"><h2>Cargando Órdenes...</h2></div>;
    if (error) return <div className="panel-ordenes-container"><h2 className="error-texto">{error}</h2></div>;

    return (
        <div className="panel-ordenes-container">
            <header className="panel-ordenes-header">
                <h1>Panel de Órdenes</h1>
                <p>Aquí puedes ver y administrar todas las órdenes de los clientes.</p>
            </header>

            {/* Barra de Filtros */}
            <div className="order-filter-bar">
                <label htmlFor="filtro-estado">Filtrar por estado:</label>
                <select 
                    id="filtro-estado" 
                    value={filtroEstado} 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="todas">Todas</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="rechazado">Rechazado</option>
                </select>
            </div>

            {/* Tabla de Órdenes */}
            <div className="order-table-container">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>Cliente (Email)</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>Items</th>
                            {(esAdmin || esGerente) && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {ordenesFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={(esAdmin || esGerente) ? "7" : "6"} style={{ textAlign: 'center' }}>
                                    No hay órdenes que coincidan con el filtro.
                                </td>
                            </tr>
                        ) : (
                            ordenesFiltradas.map(orden => {
                                const editando = estaEditando(orden.orden_id);
                                const edicion = ediciones[orden.orden_id] || {};

                                return (
                                    <tr 
                                        key={orden.orden_id}
                                        className={editando ? 'row-editing' : ''}
                                    >
                                        <td><strong>#{orden.orden_id}</strong></td>
                                        <td>{orden.usuario_orden}</td>
                                        <td>{orden.fecha_orden}</td>
                                        
                                        {/* COLUMNA ESTADO */}
                                        <td>
                                            {(esAdmin || esGerente) && editando ? (
                                                <select 
                                                    value={edicion.estado_orden}
                                                    onChange={(e) => actualizarEdicion(orden.orden_id, 'estado_orden', e.target.value)}
                                                    className={`estado-select ${edicion.estado_orden.toLowerCase()}`}
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="aprobado">Aprobado</option>
                                                    <option value="enviado">Enviado</option>
                                                    <option value="entregado">Entregado</option>
                                                    <option value="rechazado">Rechazado</option>
                                                </select>
                                            ) : (
                                                <span className={`estado-badge ${orden.estado_orden.toLowerCase()}`}>
                                                    {orden.estado_orden}
                                                </span>
                                            )}
                                        </td>

                                        {/* COLUMNA TOTAL */}
                                        <td>
                                            {(esAdmin || esGerente) && editando ? (
                                                <input
                                                    type="number"
                                                    value={edicion.total_orden}
                                                    onChange={(e) => actualizarEdicion(orden.orden_id, 'total_orden', e.target.value)}
                                                    className="total-input-editable"
                                                    min="0"
                                                    step="100"
                                                />
                                            ) : (
                                                `$${orden.total_orden.toLocaleString('es-CL')}`
                                            )}
                                        </td>

                                        {/* COLUMNA ITEMS */}
                                        <td className="order-items-cell">
                                            {orden.items.map((item, idx) => (
                                                <div key={idx} className="order-item-detail">
                                                    <img 
                                                        src={item.producto.imagen} 
                                                        alt={item.producto.nombre_producto} 
                                                    />
                                                    <span>{item.producto.nombre_producto} (x{item.cantidad})</span>
                                                </div>
                                            ))}
                                            {(esAdmin || esGerente) && editando && (
                                                <button
                                                    onClick={() => abrirModalItems(orden.orden_id)}
                                                    className="edit-items-btn"
                                                >
                                                    ✏️ Editar Items
                                                </button>
                                            )}
                                        </td>

                                        {/* COLUMNA ACCIONES */}
                                        {(esAdmin || esGerente) && (
                                            <td>
                                                {editando ? (
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => guardarCambios(orden.orden_id)}
                                                            className="save-btn"
                                                        >
                                                            💾 Guardar
                                                        </button>
                                                        <button
                                                            onClick={() => cancelarEdicion(orden.orden_id)}
                                                            className="cancel-btn"
                                                        >
                                                            ❌ Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => iniciarEdicion(orden.orden_id)}
                                                        className="edit-btn"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de edición de items */}
            {modalAbierto && (
                <EditarItemsModal
                    orden={ordenes.find(o => o.orden_id === modalAbierto)}
                    productos={productos}
                    onClose={() => setModalAbierto(null)}
                    onSave={(items) => guardarItemsDesdeModal(modalAbierto, items)}
                />
            )}
        </div>
    );
}