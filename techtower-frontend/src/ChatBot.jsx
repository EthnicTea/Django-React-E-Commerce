import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // ¡Usará el CSS nuevo de abajo!

// (El avatar del bot se mantiene, es un buen detalle)
const BotAvatar = () => (
    <svg className="avatar bot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3.5 4c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
    </svg>
);

// ¡Componente principal rediseñado!
// Recibe los componentes seleccionados del PcBuilder
function Chatbot({ selectedComponents }) { 
    const [isOpen, setIsOpen] = useState(false);
    
    // --- Estados para la nueva lógica ---
    const [budgetInput, setBudgetInput] = useState(''); // El <input> del presupuesto
    const [profileInput, setProfileInput] = useState('Gaming'); // El <select> del perfil
    const [iaResponse, setIaResponse] = useState(
        "¡Hola! Soy Tu asistente virtual. ¿Quieres que verifique la compatibilidad de tu armado o que te genere un PC basado en tu presupuesto?"
    ); // La "pantalla" de respuesta
    const [isLoading, setIsLoading] = useState(false); // Para el spinner de carga
    
    const chatBodyRef = useRef(null); // Para el autoscroll de la respuesta

    const API_URL = 'http://127.0.0.1:8000/api/ia'; // URL base de la IA

    // Autoscroll cuando la respuesta de la IA cambia
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [iaResponse]);

    // --- Función para el Endpoint de PRESUPUESTO ---
    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        const presupuestoNum = parseInt(budgetInput);
        if (isNaN(presupuestoNum) || presupuestoNum <= 100000) {
            alert("Por favor, ingresa un presupuesto válido (mayor a $100.000).");
            return;
        }

        setIsLoading(true);
        setIaResponse("Generando la mejor configuración para tu presupuesto... 🤖 \nEsto puede tardar unos segundos."); 
        
        try {
            const response = await fetch(`${API_URL}/presupuesto/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    presupuesto: presupuestoNum,
                    perfil: profileInput
                })
            });
            const data = await response.json();
            
            if (data.status === 'success' && data.resultado_ia) { //.justificacion
                // Mostramos la justificación de la IA
                setIaResponse(data.resultado_ia); // .justificacion
            } else {
                setIaResponse(`Error: ${data.resultado_ia.error || 'No se pudo generar el presupuesto.'}`);
            }
        } catch (error) {
            setIaResponse("Error de conexión con el Servidor. Intente nuevamente, también revise si esta logeado, el tiempo de logeo pudo haberse acabado");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Función para el Endpoint de COMPATIBILIDAD ---
    const handleCompatibilityCheck = async () => {
        // 1. Recolectamos los IDs de los productos seleccionados en PcBuilder
        // 'selectedComponents' es la prop que pasamos desde PcBuilder
        const idsDeProductos = Object.values(selectedComponents)
            .filter(component => component !== null) // Filtramos los no seleccionados
            .map(component => component.producto_id); // Obtenemos sus IDs

        if (idsDeProductos.length < 2) {
            setIaResponse("Necesitas seleccionar al menos dos componentes (como CPU y Placa Madre) para verificar.");
            return;
        }

        setIsLoading(true);
        setIaResponse("Analizando la compatibilidad de tus componentes... 🤖");

        try {
            const response = await fetch(`${API_URL}/compatibilidad/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: idsDeProductos }) // Enviamos la lista de IDs
            });
            const data = await response.json();
            
            // Mostramos la respuesta de la IA
            setIaResponse(data.respuesta_ia); 

        } catch (error) {
            setIaResponse("Error de red. ¿El servidor de Django está corriendo?");
        } finally {
            setIsLoading(false);
        }
    };

    // --- JSX (Simplificado) ---
    
    if (!isOpen) {
        return (
            <button className="chat-bubble-light" onClick={() => setIsOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 12H5v-2h14v2zm0-3H5V9h14v2zm0-3H5V6h14v2z"/>
                </svg>
            </button>
        );
    }

    return (
        <div className="chat-window-light">
            <div className="chat-header-light">
                Asistente Virtual
                <button onClick={() => setIsOpen(false)} className="close-btn">—</button>
            </div>
            
            {/* 1. Área de respuesta (donde antes iba el chat) */}
            <div className="chat-body-light" ref={chatBodyRef}>
                <div className={`chat-message-wrapper bot ${isLoading ? 'loading' : ''}`}>
                    <BotAvatar />
                    <div className="message-content-wrapper">
                        <div className="message-content">
                            {isLoading ? (
                                <div className="spinner"></div> // Spinner de carga
                            ) : (
                                // Usamos <pre> para respetar los saltos de línea de la IA
                                <pre>{iaResponse}</pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Área de acciones (reemplaza el input de chat) */}
            <div className="chat-actions-light">
                {/* Formulario de Presupuesto */}
                <form className="ia-form" onSubmit={handleBudgetSubmit}>
                    <label>Generar PC por Presupuesto</label>
                    <div className="input-group-chatbot">
                        <input
                            type="number"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            placeholder="Ej: 1.000.000"
                        />
                        <select value={profileInput} onChange={(e) => setProfileInput(e.target.value)}>
                            <option value="Gaming">Gaming</option>
                            <option value="Diseño Gráfico">Diseño</option>
                            <option value="Oficina">Oficina</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Generando...' : 'Generar'}
                    </button>
                </form>
                
                <div className="divider"></div>

                {/* Botón de Compatibilidad */}
                <label>Verificar Armado Actual</label>
                <button 
                    className="btn-secondary"
                    onClick={handleCompatibilityCheck}
                    disabled={isLoading}
                >
                    {isLoading ? 'Analizando...' : 'Analizar Compatibilidad'}
                </button>
            </div>
        </div>
    );
}

export default Chatbot;