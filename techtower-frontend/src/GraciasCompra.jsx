import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './GraciasCompra.css'; 

export default function GraciasCompra() {
    const { orden_id } = useParams(); 
    const navigate = useNavigate();
    const [segundos, setSegundos] = useState(5); 

    useEffect(() => {
        // 1. El temporizador para la cuenta regresiva visual
        const intervalo = setInterval(() => {
            setSegundos((prev) => prev - 1);
        }, 1000);

        // 2. El temporizador para la redirección
        const timeout = setTimeout(() => {
            navigate('/'); // Redirige al Home
        }, 5000); // 5 segundos

        // Limpieza al desmontar el componente
        return () => {
            clearInterval(intervalo);
            clearTimeout(timeout);
        };
    }, [navigate]);

    return (
        <div className="gracias-container">
            <div className="gracias-card">
                <div className="icono-exito">🎉</div>
                <h1>¡Gracias por tu compra!</h1>
                
                <p className="mensaje-principal">
                    Tu pedido ha sido recibido y procesado exitosamente.
                </p>
                
                <div className="detalle-orden">
                    <span>Nº de Orden:</span>
                    <strong>#{orden_id}</strong>
                </div>

                <p className="mensaje-secundario">
                    Te hemos enviado un correo con los detalles. <br />
                    Serás redirigido a la página principal en <strong>{segundos}</strong> segundos...
                </p>

                <Link to="/" className="btn-volver-inicio">
                    Volver al Inicio ahora
                </Link>
            </div>
        </div>
    );
}