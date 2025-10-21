import React, { useState, useEffect } from 'react';
const ProductDatabase = {
  cpu: [
    { id: 'cpu1', name: 'Intel i5-13600K', price: 300, socket: 'LGA1700' },
    { id: 'cpu2', name: 'AMD Ryzen 5 7600X', price: 250, socket: 'AM5' },
  ],
  motherboard: [
    { id: 'mobo1', name: 'MSI PRO B760-P', price: 150, socket: 'LGA1700', ramType: 'DDR5' },
    { id: 'mobo2', name: 'Gigabyte B650 AORUS', price: 200, socket: 'AM5', ramType: 'DDR5' },
    { id: 'mobo3', name: 'ASRock Z690', price: 180, socket: 'LGA1700', ramType: 'DDR4' },
  ],
  ram: [
    { id: 'ram1', name: 'Corsair Vengeance 32GB DDR5', price: 100, type: 'DDR5' },
    { id: 'ram2', name: 'Kingston FURY 16GB DDR4', price: 50, type: 'DDR4' },
  ]
};

function PcBuilder() {
  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedMobo, setSelectedMobo] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [compatibilityErrors, setCompatibilityErrors] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const errors = [];
    if (selectedCpu && selectedMobo) {
      if (selectedCpu.socket !== selectedMobo.socket) {
        errors.push(`Error: El CPU (${selectedCpu.socket}) no es compatible con la placa madre (${selectedMobo.socket}).`);
      }
    }
    if (selectedRam && selectedMobo) {
      if (selectedRam.type !== selectedMobo.ramType) {
        errors.push(`Error: La RAM (${selectedRam.type}) no es compatible con la placa madre (${selectedMobo.ramType}).`);
      }
    }
    setCompatibilityErrors(errors);
    
    let total = 0;
    if (selectedCpu) total += selectedCpu.price;
    if (selectedMobo) total += selectedMobo.price;
    if (selectedRam) total += selectedRam.price;
    setTotalPrice(total);
    
  }, [selectedCpu, selectedMobo, selectedRam]); 

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    
    if (value === "") {
      if (name === 'cpu') setSelectedCpu(null);
      if (name === 'motherboard') setSelectedMobo(null);
      if (name === 'ram') setSelectedRam(null);
      return;
    }

    const product = ProductDatabase[name].find(item => item.id === value);
    
    if (name === 'cpu') setSelectedCpu(product);
    if (name === 'motherboard') setSelectedMobo(product);
    if (name === 'ram') setSelectedRam(product);
  };

  return (
    <div>
      <h2>Arma tu PC</h2>
      <p>Selecciona los componentes para tu cotización.</p>
      
      <div className="component-selector">
        <label>CPU:</label>
        <select name="cpu" onChange={handleSelectChange}>
          <option value="">-- Elige un CPU --</option>
          {ProductDatabase.cpu.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.price})
            </option>
          ))}
        </select>
      </div>

      <div className="component-selector">
        <label>Placa Madre:</label>
        <select name="motherboard" onChange={handleSelectChange}>
          <option value="">-- Elige una Placa Madre --</option>
          {ProductDatabase.motherboard.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.price})
            </option>
          ))}
        </select>
      </div>
      
      <div className="component-selector">
        <label>Memoria RAM:</label>
        <select name="ram" onChange={handleSelectChange}>
          <option value="">-- Elige RAM --</option>
          {ProductDatabase.ram.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.price})
            </option>
          ))}
        </select>
      </div>
      
      <div className="summary">
        <h3>Resumen de Cotización</h3>
        
        {compatibilityErrors.length > 0 && (
          <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
            <h4>¡Problemas de compatibilidad!</h4>
            {compatibilityErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        {compatibilityErrors.length === 0 && (
          <div style={{ color: 'green' }}>
            <p><strong>CPU:</strong> {selectedCpu?.name || 'N/A'}</p>
            <p><strong>Placa Madre:</strong> {selectedMobo?.name || 'N/A'}</p>
            <p><strong>RAM:</strong> {selectedRam?.name || 'N/A'}</p>
          </div>
        )}
        
        <h3 style={{marginTop: '20px'}}>Total: ${totalPrice}</h3>
      </div>
    </div>
  );
}

export default PcBuilder;