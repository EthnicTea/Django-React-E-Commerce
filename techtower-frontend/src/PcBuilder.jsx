import React, { useState, useEffect } from 'react';

const PRODUCT_DATABASE = {
    cpu: [
        { id: 'cpu1', name: 'AMD Ryzen 5 5600X', price: 220, socket: 'AM4', watts: 150 },
        { id: 'cpu2', name: 'Intel i5-13600K', price: 300, socket: 'LGA1700', watts: 200 },
        { id: 'cpu3', name: 'AMD Ryzen 7 7800X3D', price: 450, socket: 'AM5', watts: 180 },
    ],
    motherboard: [
        { id: 'mobo1', name: 'ASUS B550-F', price: 180, socket: 'AM4', ram: 'DDR4' },
        { id: 'mobo2', name: 'Gigabyte Z790', price: 250, socket: 'LGA1700', ram: 'DDR5' },
        { id: 'mobo3', name: 'MSI B650 Tomahawk', price: 220, socket: 'AM5', ram: 'DDR5' },
    ],
    gpu: [
        { id: 'gpu1', name: 'NVIDIA RTX 4070', price: 600, watts: 250 },
        { id: 'gpu2', name: 'AMD RX 6700XT', price: 350, watts: 230 },
        { id: 'gpu3', name: 'NVIDIA RTX 4090', price: 1600, watts: 450 },
    ],
    ram: [
        { id: 'ram1', name: '16GB (2x8) DDR4 3200', price: 60, type: 'DDR4', watts: 10 },
        { id: 'ram2', name: '32GB (2x16) DDR5 6000', price: 120, type: 'DDR5', watts: 15 },
    ],
    ssd: [
        { id: 'ssd1', name: 'SSD 500GB SATA', price: 40, watts: 5 },
        { id: 'ssd2', name: 'SSD 1TB NVMe Gen4', price: 80, watts: 10 },
    ],
    psu: [
        { id: 'psu1', name: '650W 80+ Gold', price: 100, watts: 650 },
        { id: 'psu2', name: '850W 80+ Gold', price: 150, watts: 850 },
        { id: 'psu3', name: '1000W 80+ Gold', price: 220, watts: 1000 },
    ],
};

function PcBuilder() {

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
        let price = 0;
        let watts = 0;
        const errors = [];
        if (selectedCpu) { price += selectedCpu.price; watts += selectedCpu.watts; }
        if (selectedMobo) { price += selectedMobo.price; watts += 30; }
        if (selectedGpu) { price += selectedGpu.price; watts += selectedGpu.watts; }
        if (selectedRam) { price += selectedRam.price; watts += selectedRam.watts; }
        if (selectedSsd) { price += selectedSsd.price; watts += selectedSsd.watts; }
        if (selectedPsu) { price += selectedPsu.price; }

        if (selectedCpu && selectedMobo) {
            if (selectedCpu.socket !== selectedMobo.socket) {
                errors.push(`Compatibilidad: El CPU (${selectedCpu.socket}) no es compatible con la placa (${selectedMobo.socket}).`);
            }
        } else if (selectedCpu || selectedMobo) {
            errors.push("Compatibilidad: Selecciona CPU y placa madre.");
        }

        if (selectedRam && selectedMobo) {
            if (selectedRam.type !== selectedMobo.ram) {
                errors.push(`Compatibilidad: La RAM (${selectedRam.type}) no es compatible con la placa (${selectedMobo.ram}).`);
            }
        }

        const recommendedWatts = Math.ceil((watts * 1.3) / 50) * 50;
        setPsuRecommendation(recommendedWatts);

        if (selectedPsu && selectedPsu.watts < watts) {
            errors.push(`Potencia: La fuente (${selectedPsu.watts}W) es insuficiente para el consumo total (${watts}W).`);
        }
        
        setTotalPrice(price);
        setTotalWatts(watts);
        setCompatibilityErrors(errors);

    }, [selectedCpu, selectedMobo, selectedGpu, selectedRam, selectedSsd, selectedPsu]);

    const handleSelectChange = (e) => {
        const { name, value } = e.target; 

        if (value === "") {
            if (name === 'cpu') setSelectedCpu(null);
            if (name === 'motherboard') setSelectedMobo(null);
            if (name === 'gpu') setSelectedGpu(null);
            if (name === 'ram') setSelectedRam(null);
            if (name === 'ssd') setSelectedSsd(null);
            if (name === 'psu') setSelectedPsu(null);
            return;
        }

        const product = PRODUCT_DATABASE[name].find(item => item.id === value);

        if (name === 'cpu') setSelectedCpu(product);
        if (name === 'motherboard') setSelectedMobo(product);
        if (name === 'gpu') setSelectedGpu(product);
        if (name === 'ram') setSelectedRam(product);
        if (name === 'ssd') setSelectedSsd(product);
        if (name === 'psu') setSelectedPsu(product);
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
                        <select id="cpu" name="cpu" onChange={handleSelectChange}>
                            <option value="">— seleccionar CPU —</option>
                            {PRODUCT_DATABASE.cpu.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (${item.price})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="motherboard">Placa Madre (Motherboard)</label>
                        <select id="motherboard" name="motherboard" onChange={handleSelectChange}>
                            <option value="">— seleccionar placa —</option>
                            {PRODUCT_DATABASE.motherboard.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (${item.price})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gpu">Tarjeta Gráfica (GPU)</label>
                        <select id="gpu" name="gpu" onChange={handleSelectChange}>
                            <option value="">— seleccionar GPU —</option>
                            {PRODUCT_DATABASE.gpu.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (${item.price})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="ram">Memoria RAM</label>
                        <select id="ram" name="ram" onChange={handleSelectChange}>
                            <option value="">— seleccionar RAM —</option>
                            {PRODUCT_DATABASE.ram.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (${item.price})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="ssd">Almacenamiento</label>
                        <select id="ssd" name="ssd" onChange={handleSelectChange}>
                            <option value="">— seleccionar SSD —</option>
                            {PRODUCT_DATABASE.ssd.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (${item.price})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="psu">Fuente (PSU) sugerida</label>
                        <select id="psu" name="psu" onChange={handleSelectChange}>
                            <option value="">— seleccionar PSU —</option>
                            {PRODUCT_DATABASE.psu.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (${item.price})
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
        </div>
    );
}

export default PcBuilder;