import React from 'react';
import './Terminos.css';
import './components/Foot.css';

const Terminos = () => {
  return (
    <div className="terms-container">
      <h2 className="terms-title">Términos y Condiciones - Despacho Gratuito</h2>
      <p className="terms-paragraph">
        El despacho gratuito es una promoción aplicable a pedidos realizados a través de nuestra tienda, 
        exclusivamente para aquellos que cumplan con los requisitos descritos a continuación.
      </p>
      <p className="terms-paragraph">
        <strong>Condiciones para aplicar al despacho gratuito:</strong>
      </p>
      <ul className="terms-list">
        <li>El despacho gratuito está disponible para compras que superen un valor de $50 CLP.</li>
        <li>Aplica únicamente para direcciones dentro del territorio nacional, excluyendo zonas de difícil acceso o rurales.</li>
        <li>El tiempo de entrega estimado puede variar dependiendo de la ubicación, siendo de 5 a 7 días hábiles.</li>
      </ul>
      <p className="terms-paragraph">
        Esta promoción no es acumulable con otras ofertas de despacho. Nos reservamos el derecho de modificar estas condiciones 
        sin previo aviso.
      </p>
    </div>
    
  );
};

export default Terminos;
