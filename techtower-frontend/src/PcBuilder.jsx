import React, { useState, useEffect } from 'react';
import './PcBuilder.css';
import Chatbot from './ChatBot';
import { useCart } from './services/useCart';
import { useNavigate } from 'react-router-dom';

function PcBuilder() {

    const [cpuProducts, setCpuProducts] = useState([]);
    const [moboProducts, setMoboProducts] = useState([]);
    const [gpuProducts, setGpuProducts] = useState([]);
    const [ramProducts, setRamProducts] = useState([]);
    const [ssdProducts, setSsdProducts] = useState([]);
    const [psuProducts, setPsuProducts] = useState([]);
    const [gabineteProducts, setGabineteProducts] = useState([]);
    const [osProducts, setOsProducts] = useState([]);
    const [monitorProducts, setMonitorProducts] = useState([]);
    const [mouseProducts, setMouseProducts] = useState([]);
    const [softwareProducts, setSoftwareProducts] = useState([]);

    const [selectedCpu, setSelectedCpu] = useState(null);
    const [selectedMobo, setSelectedMobo] = useState(null);
    const [selectedGpu, setSelectedGpu] = useState(null);
    const [selectedRam, setSelectedRam] = useState(null);
    const [selectedSsd, setSelectedSsd] = useState(null);
    const [selectedPsu, setSelectedPsu] = useState(null);
    const [selectedGabinete, setSelectedGabinete] = useState(null);
    const [selectedOs, setSelectedOs] = useState(null);
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const [selectedMouse, setSelectedMouse] = useState(null);
    const [selectedSoftware, setSelectedSoftware] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalWatts, setTotalWatts] = useState(0);
    const [psuRecommendation, setPsuRecommendation] = useState(0);
    // const [compatibilityErrors, setCompatibilityErrors] = useState([]);

    // Esto es un ID de un prodcuto de la base de datos. Si se elimina o se cambia el producto, se debe cambiar aquí.
    // Es especificamente el servicio de armado de PC, irá automaticamente en el carrito del usuario
    const ID_SERVICIO_ARMADO = 66;

    const { addToCart, loadingCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                // TRAEMOS TODO SI TODO GRRR dame un gr!
                const response = await fetch('http://127.0.0.1:8000/api/products/');
                const data = await response.json();
                // MISMOS PRODUCTOS DE LA TABLA TIPO PRODUCTO gr
                setCpuProducts(data.filter(p => p.tipo === 1));
                setMoboProducts(data.filter(p => p.tipo === 15));
                setGpuProducts(data.filter(p => p.tipo === 5));
                setRamProducts(data.filter(p => p.tipo === 2));
                setSsdProducts(data.filter(p => p.tipo === 12));
                setPsuProducts(data.filter(p => p.tipo === 13));
                setGabineteProducts(data.filter(p => p.tipo === 14));
                setMonitorProducts(data.filter(p => p.tipo === 3));
                setMouseProducts(data.filter(p => p.tipo === 6));
                setOsProducts(data.filter(p => p.tipo === 20)); // ID del tipo "Servicio"
                setSoftwareProducts(data.filter(p => p.tipo === 19));
                
                console.log("Productos reales cargados:", data);
            } catch (error) {
                console.error("Error cargando productos reales:", error);
            }
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        let price = 0;
        let watts = 0;
        const errors = [];
        if (selectedCpu) { price += selectedCpu.precio_final_transferencia; watts += selectedCpu.watts; }
        if (selectedMobo) { price += selectedMobo.precio_final_transferencia; watts += 30; }
        if (selectedGpu) { price += selectedGpu.precio_final_transferencia; watts += selectedGpu.watts; }
        if (selectedRam) { price += selectedRam.precio_final_transferencia; watts += selectedRam.watts; }
        if (selectedSsd) { price += selectedSsd.precio_final_transferencia; watts += selectedSsd.watts; }
        if (selectedPsu) { price += selectedPsu.precio_final_transferencia;}
        if (selectedGabinete) { price += selectedGabinete.precio_final_transferencia;}
        if (selectedOs) { price += selectedOs.precio_final_transferencia;}
        if (selectedMonitor) { price += selectedMonitor.precio_final_transferencia;}
        if (selectedMouse) { price += selectedMouse.precio_final_transferencia;}
        if (selectedSoftware) { price += selectedSoftware.precio_final_transferencia;}

        const recommendedWatts = Math.ceil((watts * 1.3) / 50) * 50;
        setPsuRecommendation(recommendedWatts);

        if (selectedPsu && selectedPsu.watts < watts) {
            errors.push(`Potencia: La fuente (${selectedPsu.watts}W) es insuficiente para el consumo total (${watts}W).`);
        }

        setTotalPrice(price);
        setTotalWatts(watts);
    }, [selectedCpu, selectedMobo, selectedGpu, selectedRam, selectedSsd, 
        selectedPsu, selectedGabinete, selectedOs, selectedMonitor, selectedMouse, selectedSoftware]);

    // Arreglar esto en base a una ficha técnica u otro tipo de dato que complemente esta lógica.

    // Al menos se agregó la utilidad de ver el consumo

    //     if (selectedCpu && selectedMobo) {
    //         if (selectedCpu.socket !== selectedMobo.socket) {
    //             errors.push(`Compatibilidad: El CPU (${selectedCpu.socket}) no es compatible con la placa (${selectedMobo.socket}).`);
    //         }
    //     } else if (selectedCpu || selectedMobo) {
    //         errors.push("Compatibilidad: Selecciona CPU y placa madre.");
    //     }

    //     if (selectedRam && selectedMobo) {
    //         if (selectedRam.type !== selectedMobo.ram) {
    //             errors.push(`Compatibilidad: La RAM (${selectedRam.type}) no es compatible con la placa (${selectedMobo.ram}).`);
    //         }
    //     }

    //     const recommendedWatts = Math.ceil((watts * 1.3) / 50) * 50;
    //     setPsuRecommendation(recommendedWatts);

    //     if (selectedPsu && selectedPsu.watts < watts) {
    //         errors.push(`Potencia: La fuente (${selectedPsu.watts}W) es insuficiente para el consumo total (${watts}W).`);
    //     }
        
    //     setTotalPrice(price);
    //     setTotalWatts(watts);
    //     setCompatibilityErrors(errors);

    // }, [selectedCpu, selectedMobo, selectedGpu, selectedRam, selectedSsd, selectedPsu]);

    const setComponent = (type, productId) => {
        if (!productId) {
            if (type === 'cpu') setSelectedCpu(null);
            if (type === 'motherboard') setSelectedMobo(null);
            if (type === 'gpu') setSelectedGpu(null);
            if (type === 'ram') setSelectedRam(null);
            if (type === 'ssd') setSelectedSsd(null);
            if (type === 'psu') setSelectedPsu(null);
            if (type === 'gabinete') setSelectedGabinete(null);
            if (type === 'os') setSelectedOs(null);
            if (type === 'monitor') setSelectedMonitor(null);
            if (type === 'mouse') setSelectedMouse(null);
            if (type === 'software') setSelectedSoftware(null);
            return;
        }

        let product;
        if (type === 'cpu') product = cpuProducts.find(item => item.producto_id == productId);
        if (type === 'motherboard') product = moboProducts.find(item => item.producto_id == productId);
        if (type === 'gpu') product = gpuProducts.find(item => item.producto_id == productId);
        if (type === 'ram') product = ramProducts.find(item => item.producto_id == productId);
        if (type === 'ssd') product = ssdProducts.find(item => item.producto_id == productId);
        if (type === 'psu') product = psuProducts.find(item => item.producto_id == productId);
        if (type === 'gabinete') product = gabineteProducts.find(item => item.producto_id == productId);
        if (type === 'os') product = osProducts.find(item => item.producto_id == productId);
        if (type === 'monitor') product = monitorProducts.find(item => item.producto_id == productId);
        if (type === 'mouse') product = mouseProducts.find(item => item.producto_id == productId);
        if (type === 'software') product = softwareProducts.find(item => item.producto_id == productId);

        if (!product) return;
        if (type === 'cpu') setSelectedCpu(product);
        if (type === 'motherboard') setSelectedMobo(product);
        if (type === 'gpu') setSelectedGpu(product);
        if (type === 'ram') setSelectedRam(product);
        if (type === 'ssd') setSelectedSsd(product);
        if (type === 'psu') setSelectedPsu(product);
        if (type === 'gabinete') setSelectedGabinete(product);
        if (type === 'os') setSelectedOs(product);
        if (type === 'monitor') setSelectedMonitor(product);
        if (type === 'mouse') setSelectedMouse(product);
        if (type === 'software') setSelectedSoftware(product);
    };
    const handleSelectChange = (e) => {
        const { name, value } = e.target; 
        setComponent(name, value || null);
    };

    const handleAddBuildToCart = async () => {
        if (!selectedCpu || !selectedMobo || !selectedRam || !selectedSsd || !selectedPsu || !selectedGabinete || !selectedOs) {
            alert("Faltan componentes obligatorios. Por favor, revisa la lista.");
            return;
        }
        
        const buildProducts = [
            selectedCpu, selectedMobo, selectedGpu, selectedRam,
            selectedSsd, selectedPsu, selectedGabinete, selectedOs,
            selectedMonitor, selectedMouse, selectedSoftware
        ].filter(p => p !== null); // Filtra los nulos

        // Crear una lista 
        const promises = buildProducts.map(product => {
            return addToCart(product.producto_id, 1, { silent: true });
        });
        
        promises.push(addToCart(ID_SERVICIO_ARMADO, 1, { silent: true }));
        
        alert(`Añadiendo ${promises.length} productos a tu carrito. Serás redirigido al finalizar.`);

        try {
            await Promise.all(promises);
            
            navigate('/carrito');

        } catch (error) {
            // Errores de las promesas (listas)
            console.error("Error al añadir el armado al carrito:", error);
            alert(`Hubo un error al añadir los productos: ${error.message}`);
        }
    };
    return (
        <div className="container">
            <header>
                <div className="logo">TT</div>
                <div>
                    <h1>Armado de PC — Prototipo TechTower</h1>
                    <p>Selecciona componentes, comprueba compatibilidades y genera una cotización rápida.</p>
                </div>
            </header>

            <main className="builder-layout">
                
                <section className="builder-form">
                    
                    <div className="form-group">
                        <label htmlFor="cpu">Procesador (CPU)</label>
                        <select id="cpu" name="cpu" onChange={handleSelectChange} value={selectedCpu?.producto_id || ''}>
                            <option value="">— seleccionar CPU —</option>
                            {cpuProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="motherboard">Placa Madre (Motherboard)</label>
                        <select id="motherboard" name="motherboard" onChange={handleSelectChange} value={selectedMobo?.producto_id || ''}>
                            <option value="">— seleccionar placa —</option>
                            {moboProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gpu">Tarjeta Gráfica (GPU)</label>
                        <select id="gpu" name="gpu" onChange={handleSelectChange} value={selectedGpu?.producto_id || ''}>
                            <option value="">— seleccionar GPU —</option>
                            {gpuProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="ram">Memoria RAM</label>
                        <select id="ram" name="ram" onChange={handleSelectChange} value={selectedRam?.producto_id || ''}>
                            <option value="">— seleccionar RAM —</option>
                            {ramProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="ssd">Almacenamiento</label>
                        <select id="ssd" name="ssd" onChange={handleSelectChange} value={selectedSsd?.producto_id || ''}>
                            <option value="">— seleccionar SSD —</option>
                            {ssdProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="psu">Fuente (PSU) sugerida</label>
                        <select id="psu" name="psu" onChange={handleSelectChange} value={selectedPsu?.producto_id || ''}>
                            <option value="">— seleccionar PSU —</option>
                            {psuProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* --- COMPONENTES MANDATORIOS --- */}

                    <div className="form-group mandatory">
                        <label htmlFor="gabinete">Gabinete</label>
                        <select id="gabinete" name="gabinete" onChange={handleSelectChange} value={selectedGabinete?.producto_id || ''}>
                            <option value="">— seleccionar Gabinete —</option>
                            {gabineteProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mandatory">
                        <label htmlFor="os">Sistema Operativo (Servicio)</label>
                        <select id="os" name="os" onChange={handleSelectChange} value={selectedOs?.producto_id || ''}>
                            <option value="">— seleccionar S.O. —</option>
                            {osProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* --- COMPONENTES OPCIONALES --- */}
                    <h3 className="optional-title">Componentes Opcionales</h3>

                    <div className="form-group">
                        <label htmlFor="monitor">Monitor</label>
                        <select id="monitor" name="monitor" onChange={handleSelectChange} value={selectedMonitor?.producto_id || ''}>
                            <option value="">— seleccionar Monitor (Opcional) —</option>
                            {monitorProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="mouse">Mouse</label>
                        <select id="mouse" name="mouse" onChange={handleSelectChange} value={selectedMouse?.producto_id || ''}>
                            <option value="">— seleccionar Mouse (Opcional) —</option>
                            {mouseProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="software">Software Adicional (Office, etc.)</label>
                        <select id="software" name="software" onChange={handleSelectChange} value={selectedSoftware?.producto_id || ''}>
                            <option value="">— seleccionar Software (Opcional) —</option>
                            {softwareProducts.map(item => (
                                <option key={item.producto_id} value={item.producto_id}>
                                    {item.nombre_producto} (${item.precio_final_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* <div className={`compatibility-box ${compatibilityErrors.length === 0 ? 'hidden' : ''}`}>
                        {compatibilityErrors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div> */}
                     <div className="recommendation-box">
                        <p>Consumo total: <strong>{totalWatts}W</strong>. | Recomendación de PSU: <strong>{psuRecommendation}W</strong>.</p>
                    </div>


                    {/* Botones sin uso */}
                    {/* <div className="form-actions">
                        <button className="btn btn-primary" onClick={() => alert("¡Actualizado!")}>Actualizar resumen</button>
                        <button className="btn btn-secondary" onClick={() => alert("Copiado al portapapeles")}>Copiar resumen</button>
                    </div> */}

                </section>

                <aside className="summary-card">
                    <h3>Resumen / Cotización</h3>
                    
                    <div className="summary-list">
                        <div className="summary-item">
                            <span className="name">CPU</span>
                            <span className="value">{selectedCpu?.nombre_producto || '—'}</span>
                            <span className="price">${selectedCpu?.precio_final_transferencia || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">Motherboard</span>
                            <span className="value">{selectedMobo?.nombre_producto || '—'}</span>
                            <span className="price">${selectedMobo?.precio_final_transferencia || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">GPU</span>
                            <span className="value">{selectedGpu?.nombre_producto || '—'}</span>
                            <span className="price">${selectedGpu?.precio_final_transferencia || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">RAM</span>
                            <span className="value">{selectedRam?.nombre_producto || '—'}</span>
                            <span className="price">${selectedRam?.precio_final_transferencia || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">Almacenamiento</span>
                            <span className="value">{selectedSsd?.nombre_producto || '—'}</span>
                            <span className="price">${selectedSsd?.precio_final_transferencia || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">PSU sugerida</span>
                            <span className="value">{selectedPsu?.nombre_producto || '—'}</span>
                            <span className="price">${selectedPsu?.precio_final_transferencia || 0}</span>
                        </div>

                        <div className="summary-item">
                            <span className="name">Gabinete</span>
                            <span className="value">{selectedGabinete?.nombre_producto || '—'}</span>
                            <span className="price">${(selectedGabinete?.precio_final_transferencia || 0).toLocaleString('es-CL')}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">Sistema Operativo</span>
                            <span className="value">{selectedOs?.nombre_producto || '—'}</span>
                            <span className="price">${(selectedOs?.precio_final_transferencia || 0).toLocaleString('es-CL')}</span>
                        </div>
                        
                        {/* Opcionales (solo se muestran si se seleccionan) */}
                        {selectedMonitor && (
                            <div className="summary-item optional">
                                <span className="name">Monitor</span>
                                <span className="value">{selectedMonitor.nombre_producto}</span>
                                <span className="price">${selectedMonitor.precio_final_transferencia.toLocaleString('es-CL')}</span>
                            </div>
                        )}
                        {selectedMouse && (
                            <div className="summary-item optional">
                                <span className="name">Mouse</span>
                                <span className="value">{selectedMouse.nombre_producto}</span>
                                <span className="price">${selectedMouse.precio_final_transferencia.toLocaleString('es-CL')}</span>
                            </div>
                        )}
                        {selectedSoftware && (
                            <div className="summary-item optional">
                                <span className="name">Software</span>
                                <span className="value">{selectedSoftware.nombre_producto}</span>
                                <span className="price">${selectedSoftware.precio_final_transferencia.toLocaleString('es-CL')}</span>
                            </div>
                        )}
                    </div>

                    <div className="summary-total">
                        <span className="total-label">Total aproximado</span>
                        <div className="total-value">${totalPrice}</div>
                        <div className="total-note">Estimación rápida sin costos de envío ni impuestos. &nbsp;</div>
                        <div className="total-note">Recuerda que el servicio de armado del pc viene incluido al agregar al carrito con un valor de $50000</div>
                    </div>

                     <div className="summary-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={handleAddBuildToCart}
                            disabled={loadingCart} 
                        >
                            {loadingCart ? 'Añadiendo...' : 'Añadir a carrito'}
                        </button>
                    </div>
                </aside>

            </main>
            <Chatbot 
                onBotAction={setComponent} 
                selectedComponents={{
                    cpu: selectedCpu,
                    mobo: selectedMobo,
                    gpu: selectedGpu,
                    ram: selectedRam,
                    ssd: selectedSsd,
                    psu: selectedPsu,
                    gab: selectedGabinete
                }} 
            />
            
        </div>
    );
}

export default PcBuilder;