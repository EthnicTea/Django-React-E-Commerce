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

const getBotResponse = (userMessage, onBotAction) => {
    const message = userMessage.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (message.includes('hola') || message.includes('ayuda')) {
        return {
            from: 'bot',
            text: "¡Hola! Soy Peki, tu asistente virtual. ¿En qué te puedo ayudar?",
            timestamp: timestamp,
            options: null
        };
    }

    if (message.includes('olvidé mi contraseña') || message.includes('password')) {
        return {
            from: 'bot',
            text: "Entiendo lo que necesitas. ¿Quieres que enviemos un enlace a tu email para reestablecer tu contraseña?",
            timestamp: timestamp,
            options: [
                { text: 'YES', action: 'reset_password_yes' },
                { text: 'NO', action: 'reset_password_no' }
            ]
        };
    }
    if (message === 'reset_password_yes') {
         return { from: 'bot', text: "¡Perfecto! Revisa tu correo electrónico (bandeja de entrada y spam) en los próximos minutos.", timestamp: timestamp };
    }
    if (message === 'reset_password_no') {
         return { from: 'bot', text: "Entendido. ¿Hay algo más en lo que te pueda ayudar?", timestamp: timestamp };
    }
    if (message.includes('gaming') || message.includes('gamer')) {
        onBotAction('cpu', 'cpu3');
        onBotAction('gpu', 'gpu1');
        onBotAction('ram', 'ram2');
        return { from: 'bot', text: "¡Listo! Te he seleccionado una configuración 'gamer' de alta gama. Revisa el formulario.", timestamp: timestamp };
    }
    if (message.includes('limpiar')) {
        onBotAction('cpu', null);
        onBotAction('motherboard', null);
        return { from: 'bot', text: "He limpiado la selección. ¿Empezamos de nuevo?", timestamp: timestamp };
    }
    return {
        from: 'bot',
        text: "No entendí esa solicitud. Prueba pidiendo una configuración para 'gaming' o 'diseño'.",
        timestamp: timestamp,
        options: null
    };
};
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
        setTimeout(() => {
            const botMsg = getBotResponse(textToSend, onBotAction);
            setMessages(prev => [...prev, botMsg]);
        }, 500);
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