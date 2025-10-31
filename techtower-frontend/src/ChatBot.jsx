import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const BotAvatar = () => (
    <svg className="avatar bot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3.5 4c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
    </svg>
);

const UserAvatar = () => (
    <svg className="avatar user" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

async function getBotResponse(userMessage) {
    try {
        // Llama a tu endpoint de Django
        const response = await fetch('http://127.0.0.1:8000/api/chat/', { // <-- ESTA ES LA CORRECCIÓN
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si usas CSRF, necesitarás añadir el token aquí
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            // Maneja errores del servidor
            const errorData = await response.json();
            return {
                from: 'bot',
                text: `Error del servidor: ${errorData.error || 'No se pudo conectar.'}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        }

        // Obtiene la respuesta JSON de Django (que vino de Gemini)
        const data = await response.json();
        
        // Devuelve el objeto de mensaje, incluyendo la acción
        return {
            from: 'bot',
            text: data.text, // El texto para mostrar
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: data.action,     // La acción a ejecutar (ej: "setComponent")
            payload: data.payload   // Los datos para la acción (ej: {type: 'cpu', id: 'cpu3'})
        };

    } catch (error) {
        // Maneja errores de red
        return {
            from: 'bot',
            text: `Error de red: No se pudo conectar al servidor. ¿Está Django corriendo?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }
}
function Chatbot({ onBotAction }) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: "¡Hola! Soy Peki, tu asistente virtual. ¿Cómo te puedo ayudar?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            options: null
        }
    ]);
    
    const chatBodyRef = useRef(null);
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSend = async (textToSend) => {
        if (!textToSend.trim()) return;

        const userMsg = {
            from: 'user',
            text: textToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // 1. Obtiene la respuesta de la API (que ahora es un objeto)
        const botMsg = await getBotResponse(textToSend);
        
        // 2. Añade la parte de TEXTO del bot al chat
        setMessages(prev => [...prev, {
            from: 'bot',
            text: botMsg.text,
            timestamp: botMsg.timestamp,
            // (La lógica de 'options' se puede manejar aquí si Gemini la devuelve)
        }]);

        // 3. ¡EJECUTA LA ACCIÓN!
        // Si la IA devolvió una acción (ej: "setComponent")...
        if (botMsg.action && botMsg.action === "setComponent" && botMsg.payload) {
            // ...llama a la función 'onBotAction' que te pasó PcBuilder.jsx
            onBotAction(botMsg.payload.type, botMsg.payload.id);
        }
    };

    const handleOptionClick = (option) => {
        handleSend(option.text);
        if (option.action !== option.text) {
            setTimeout(() => {
                 const botMsg = getBotResponse(option.action, onBotAction);
                 setMessages(prev => [...prev, botMsg]);
            }, 500);
        }
    };
    
    if (!isOpen) {
        return (
            <button className="chat-bubble-light" onClick={() => setIsOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 12H5v-2h14v2zm0-3H5V9h14v2zm0-3H5V6h14v2z"/>
                </svg>
            </button>
        );
    }
    const lastMessage = messages[messages.length - 1];
    const showOptions = lastMessage.from === 'bot' && lastMessage.options;

    return (
        <div className="chat-window-light">
            <div className="chat-header-light">
                Asistente Virtual
                <button onClick={() => setIsOpen(false)} className="close-btn">—</button>
            </div>
            
            <div className="chat-body-light" ref={chatBodyRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message-wrapper ${msg.from}`}>
                        {msg.from === 'bot' && <BotAvatar />}
                        <div className="message-content-wrapper">
                            <div className="message-content">
                                {msg.text}
                            </div>
                            <span className="timestamp">{msg.timestamp}</span>
                        </div>
                        {msg.from === 'user' && <UserAvatar />}
                    </div>
                ))}
            </div>

            {showOptions && (
                <div className="chat-options">
                    {lastMessage.options.map((opt, i) => (
                        <button 
                            key={i} 
                            className={`option-btn ${opt.text.toLowerCase()}`}
                            onClick={() => handleOptionClick(opt)}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
            )}
            
            <form className="chat-input-form-light" onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <button type="button" className="icon-btn">📎</button>
                <button type="submit" className="icon-btn send">➢</button>
            </form>
        </div>
    );
}

export default Chatbot;