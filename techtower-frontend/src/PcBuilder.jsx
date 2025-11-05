import React, { useState, useEffect } from 'react';
import './PcBuilder.css';
import Chatbot from './ChatBot';

function PcBuilder() {

    const [cpuProducts, setCpuProducts] = useState([]);
    const [moboProducts, setMoboProducts] = useState([]);
    const [gpuProducts, setGpuProducts] = useState([]);
    const [ramProducts, setRamProducts] = useState([]);
    const [ssdProducts, setSsdProducts] = useState([]);
    const [psuProducts, setPsuProducts] = useState([]);

    const [selectedCpu, setSelectedCpu] = useState(null);
    const [selectedMobo, setSelectedMobo] = useState(null);
    const [selectedGpu, setSelectedGpu] = useState(null);
    const [selectedRam, setSelectedRam] = useState(null);
    const [selectedSsd, setSelectedSsd] = useState(null);
    const [selectedPsu, setSelectedPsu] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalWatts, setTotalWatts] = useState(0);
    const [psuRecommendation, setPsuRecommendation] = useState(0);
    const [compatibilityErrors, setCompatibilityErrors] = useState([]);

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
        if (selectedCpu) { price += selectedCpu.precio_transferencia;} // watts += selectedCpu.watts; } // Esto no existe, añadir más adelante... :(
        if (selectedMobo) { price += selectedMobo.precio_transferencia;} // watts += 30; }
        if (selectedGpu) { price += selectedGpu.precio_transferencia;} // watts += selectedGpu.watts; }
        if (selectedRam) { price += selectedRam.precio_transferencia;}// watts += selectedRam.watts; }
        if (selectedSsd) { price += selectedSsd.precio_transferencia;} // watts += selectedSsd.watts; }
        if (selectedPsu) { price += selectedPsu.precio_transferencia;} // }

        setTotalPrice(price);
    }, [selectedCpu, selectedMobo, selectedGpu, selectedRam, selectedSsd, selectedPsu]);

    // Arreglar esto en base a una ficha técnica u otro tipo de dato que complemente esta lógica.

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
            return;
        }

        let product;
        if (type === 'cpu') product = cpuProducts.find(item => item.producto_id == productId);
        if (type === 'motherboard') product = moboProducts.find(item => item.producto_id == productId);
        if (type === 'gpu') product = gpuProducts.find(item => item.producto_id == productId);
        if (type === 'ram') product = ramProducts.find(item => item.producto_id == productId);
        if (type === 'ssd') product = ssdProducts.find(item => item.producto_id == productId);
        if (type === 'psu') product = psuProducts.find(item => item.producto_id == productId);

        if (!product) return;
        if (type === 'cpu') setSelectedCpu(product);
        if (type === 'motherboard') setSelectedMobo(product);
        if (type === 'gpu') setSelectedGpu(product);
        if (type === 'ram') setSelectedRam(product);
        if (type === 'ssd') setSelectedSsd(product);
        if (type === 'psu') setSelectedPsu(product);
    };
    const handleSelectChange = (e) => {
        const { name, value } = e.target; 
        setComponent(name, value || null);
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
                                    {item.nombre_producto} (${item.precio_transferencia.toLocaleString('es-CL')})
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
                                    {item.nombre_producto} (${item.precio_transferencia.toLocaleString('es-CL')})
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
                                    {item.nombre_producto} (${item.precio_transferencia.toLocaleString('es-CL')})
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
                                    {item.nombre_producto} (${item.precio_transferencia.toLocaleString('es-CL')})
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
                                    {item.nombre_producto} (${item.precio_transferencia.toLocaleString('es-CL')})
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
                                    {item.nombre_producto} (${item.precio_transferencia.toLocaleString('es-CL')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={`compatibility-box ${compatibilityErrors.length === 0 ? 'hidden' : ''}`}>
                        {compatibilityErrors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                     <div className="recommendation-box">
                        <p>Consumo total: <strong>{totalWatts}W</strong>. | Recomendación de PSU: <strong>{psuRecommendation}W</strong>.</p>
                    </div>


                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={() => alert("¡Actualizado!")}>Actualizar resumen</button>
                        <button className="btn btn-secondary" onClick={() => alert("Copiado al portapapeles")}>Copiar resumen</button>
                    </div>
                </section>

                <aside className="summary-card">
                    <h3>Resumen / Cotización</h3>
                    
                    <div className="summary-list">
                        <div className="summary-item">
                            <span className="name">CPU</span>
                            <span className="value">{selectedCpu?.name || '—'}</span>
                            <span className="price">${selectedCpu?.price || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">Motherboard</span>
                            <span className="value">{selectedMobo?.name || '—'}</span>
                            <span className="price">${selectedMobo?.price || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">GPU</span>
                            <span className="value">{selectedGpu?.name || '—'}</span>
                            <span className="price">${selectedGpu?.price || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">RAM</span>
                            <span className="value">{selectedRam?.name || '—'}</span>
                            <span className="price">${selectedRam?.price || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">Almacenamiento</span>
                            <span className="value">{selectedSsd?.name || '—'}</span>
                            <span className="price">${selectedSsd?.price || 0}</span>
                        </div>
                        <div className="summary-item">
                            <span className="name">PSU sugerida</span>
                            <span className="value">{selectedPsu?.name || '—'}</span>
                            <span className="price">${selectedPsu?.price || 0}</span>
                        </div>
                    </div>

                    <div className="summary-total">
                        <span className="total-label">Total aproximado</span>
                        <div className="total-value">${totalPrice}</div>
                        <div className="total-note">Estimación rápida sin costos de envío ni impuestos</div>
                    </div>

                    <div className="summary-actions">
                        <button className="btn btn-primary">Añadir a carrito</button>
                        <button className="btn btn-success">Guardar configuración</button>
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
                    psu: selectedPsu
                }} 
            />
            
        </div>
    );
}

export default PcBuilder;