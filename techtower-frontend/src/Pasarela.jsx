import React, { useState } from 'react';
import './Pasarela.css';
import webpayLogo from './assets/logo-webpay.png'; 
import { useAuth } from './services/AuthContext'; 
import { useNavigate, useLocation } from 'react-router-dom'; 

function Pasarela({ onPaymentSuccess, onPaymentCancel }) {
    
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryError, setExpiryError] = useState('');
    
    const [isLoading, setIsLoading] = useState(false); 
    
    const { authToken } = useAuth(); 
    const navigate = useNavigate(); 
    const location = useLocation();
    const totalAmount = location.state?.totalAPagar || 0; // Si no hay monto, 0

    const handleExpiryChange = (e) => {
        let valorNuevo = e.target.value;

        // 1. Limpieza y formato (tu lógica actual)
        valorNuevo = valorNuevo.replace(/[^0-9/]/g, '');
        if (valorNuevo.length === 2 && expiryDate.length === 1) {
            valorNuevo = valorNuevo + '/';
        }
        if (valorNuevo === '/') {
            valorNuevo = '';
        }
        if (valorNuevo.length === 4 && !valorNuevo.includes('/')) {
            valorNuevo = valorNuevo.slice(0, 2) + '/' + valorNuevo.slice(2, 4);
        }
        
        // Limitamos a 5 caracteres (MM/AA)
        valorNuevo = valorNuevo.slice(0, 5);
        setExpiryDate(valorNuevo);

        // --- 2. VALIDACIÓN DE FECHA ---
        if (valorNuevo.length === 5) {
            const [mesStr, anoStr] = valorNuevo.split('/');
            const mes = parseInt(mesStr, 10);
            const ano = parseInt('20' + anoStr, 10); // Asumimos siglo 21 (20AA)
            
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth() + 1; // getMonth() devuelve 0-11
            const anoActual = fechaActual.getFullYear();

            // Validación de mes válido (01-12)
            if (mes < 1 || mes > 12) {
                setExpiryError('Mes inválido.');
                return;
            }

            // Validación de fecha futura
            if (ano < anoActual || (ano === anoActual && mes < mesActual)) {
                setExpiryError('La tarjeta ha expirado.');
            } else {
                setExpiryError(''); // Fecha válida
            }
        } else {
            setExpiryError(''); // Limpiamos error si aún está escribiendo
        }
    };

    const handleContinuePayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (expiryError) {
            alert('Por favor, corrige la fecha de vencimiento.');
            setIsLoading(false);
            return;
        }

        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            alert('Por favor, ingresa un número de tarjeta válido de 16 dígitos.');
            setIsLoading(false);
            return;
        }
        if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
            alert('Por favor, ingresa una fecha de vencimiento válida (MM/AA).');
            setIsLoading(false);
            return;
        }
        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            alert('Por favor, ingresa un CVV válido de 3 dígitos.');
            setIsLoading(false);
            return;
        }
        if (cardHolder.trim() === '') {
            alert('Por favor, ingresa el nombre del titular de la tarjeta.');
            setIsLoading(false);
            return;
        }

        try {
            if (!authToken) {
                alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                navigate('/login');
                return;
            }

            const delay = new Promise(resolve => setTimeout(resolve, 2000)); 

            const fetchPromise = fetch(import.meta.env.VITE_API_URL + '/api/checkout/create_order/', { //fetch('http://127.0.0.1:8000/api/checkout/create_order/');
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });
            const [_, response] = await Promise.all([delay, fetchPromise]);
            
            // ------------------------------------

            const data = await response.json();

            if (response.ok) { 
                alert('¡Pago Aprobado! Tu orden ha sido creada.');
                if (onPaymentSuccess) {
                    onPaymentSuccess({ status: 'approved', ordenData: data });
                }
                navigate(`/gracias-por-tu-compra/${data.orden_id}`); 

            } else {
                alert(`Error al procesar el pago: ${data.error || 'Intenta de nuevo.'}`);
                if (onPaymentCancel) {
                    onPaymentCancel({ status: 'rejected', reason: data.error });
                }
            }

        } catch (err) {
            console.error("Error de red en el pago:", err);
            alert("Error de conexión. No se pudo procesar el pago.");
            if (onPaymentCancel) {
                onPaymentCancel({ status: 'rejected', reason: 'Error de red' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (onPaymentCancel) {
            onPaymentCancel({ status: 'cancelled' });
        }
        // Opcional: redirigir al carrito
        navigate('/carrito');
    };
    
    return (
        <div className="webpay-mock-container">
            <header className="webpay-header">
                <img src={webpayLogo} alt="Webpay by Transbank" className="webpay-logo" />
            </header>

            <div className="webpay-card">
                <div className="webpay-card-header">
                    <p className="paying-text">Estás pagando en:</p>
                    <div className="merchant-info">
                        <span className="merchant-name">Tech</span>Tower
                    </div>
                    <div className="amount-info">
                        <p className="amount-label">Monto a pagar:</p>
                        <p className="amount-value">${totalAmount ? totalAmount.toLocaleString('es-CL') : '0'}</p>
                    </div>
                </div>

                <div className="webpay-card-body">
                    <div className="left-panel">
                        <div className="detail-toggle">
                            <span className="icon">+</span> Ver detalle de compra
                        </div>
                        <div className="info-box">
                            <i className="info-icon">i</i>
                            <p>Ahora Webpay detecta automáticamente si tu tarjeta es débito, crédito o prepago.</p>
                        </div>

                        <p className="payment-method-title">Selecciona tu medio de pago:</p>
                        <div className="payment-method-option selected">
                            <span className="icon-card">💳</span>
                            <div className="option-text">
                                <p>Tarjetas</p>
                                <p className="option-subtitle">Crédito, Débito, Prepago</p>
                            </div>
                        </div>
                        <div className="payment-method-option">
                            <img src="https://publico.transbank.cl/documents/20129/51192944/onepay-logo.jpg" alt="Onepay" className="onepay-logo-small" />
                            <div className="option-text">
                                <p>Onepay</p>
                                <p className="option-subtitle">y otras billeteras digitales</p>
                            </div>
                        </div>
                    </div>

                    <div className="right-panel">
                        <form onSubmit={handleContinuePayment} className="card-form">
                            <label className="input-label">Ingresa los datos de tu tarjeta:</label>
                            
                            <div className="mock-card-display">
                                {/* Simulación !!! */}
                                <div className="card-number-mock">{cardNumber.padEnd(16, 'X').replace(/(.{4})/g, '$1 ').trim()}</div>
                                <div className="expiry-cvv-mock">
                                    <span>{expiryDate.padEnd(5, 'X')}</span>
                                    <span>{cvv.padEnd(3, 'X')}</span>
                                </div>
                            </div>

                            <label htmlFor="cardNumber">Número de tarjeta</label>
                            <input
                                type="text"
                                id="cardNumber"
                                placeholder="XXXX XXXX XXXX XXXX"
                                maxLength="16"
                                inputMode="numeric"
                                pattern="\d*"
                                value={cardNumber}
                                onKeyDown={(e) => {
                                    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
                                    if (allowed.includes(e.key)) return;
                                    if (!/\d/.test(e.key)) e.preventDefault();
                                }}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 16);
                                    setCardNumber(pasted);
                                }}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    setCardNumber(value);
                                }}
                                required
                            />

                            <label htmlFor="cardHolder">Nombre del titular</label>
                            <input
                                type="text"
                                id="cardHolder"
                                placeholder="Nombre como aparece en la tarjeta"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                required
                            />

                            <div className="expiry-cvv-group">
                                <div className="form-group-small">
                                    <label htmlFor="expiryDate">Vencimiento (MM/AA)</label>
                                    <input
                                        type="text" 
                                        id="expiryDate"
                                        placeholder="MM/AA"
                                        maxLength="5"
                                        inputMode="numeric" 
                                        pattern="^(0[1-9]|1[0-2])\/\d{2}$" 
                                        title="Ingresa la fecha en formato MM/AA" 
                                        value={expiryDate}
                                        onChange={handleExpiryChange}
                                        className={expiryError ? 'input-error' : ''}
                                        required
                                    />
                                    {expiryError && <span className="error-text-small">{expiryError}</span>}
                                </div>
                                <div className="form-group-small">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        placeholder="XXX"
                                        maxLength="3"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        value={cvv}
                                        onKeyDown={(e) => {
                                            const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
                                            if (allowed.includes(e.key)) return;
                                            if (!/\d/.test(e.key)) e.preventDefault();
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 3);
                                            setCvv(pasted);
                                        }}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="continue-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Procesando...' : 'Continuar'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="webpay-card-footer">
                    <button onClick={handleCancel} className="cancel-button">Anular compra y volver</button>
                    <div className="card-logos">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/960px-Visa_Inc._logo.svg.png?20170118154621" 
                        alt="Visa" 
                        className="visa-logo"
                        />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/960px-Mastercard-logo.svg.png" 
                        alt="Mastercard"
                        className='mastercard-logo'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pasarela;