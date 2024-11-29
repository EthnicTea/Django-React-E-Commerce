import './Foot.css'
// import { Link } from 'react-router-dom';
export function Foot() {
    return (
        <div className="fm-footer">
            {/* Medios de pago */}
            <div className="fm-footer-pay-container">
                <p className="fm-footer-pay">Medios de pago</p>
                <div className="fm-footer-pay-logos">
                    <img src="https://www.spdigital.cl/static/webpay_Desktop-ff7c3111a1a90b0727aa390ce2388d72.svg" alt="Payment Method 1" />
                    <img src="https://www.spdigital.cl/static/bancoEstado_Desktop-9cf3be47c2999e6e8ad49112ec375cbb.svg" alt="Payment Method 2" />
                    <img src="https://www.spdigital.cl/static/transferencia_Desktop-10ee7b098b9f6b7046af3361b00ddf5e.svg" alt="Payment Method 3" />
                </div>
            </div>

            {/* Redes sociales */}
            <div className="fm-footer-social">
                <p className="fm-footer-social-p">Síguenos en:</p>
                <div className="fm-footer-social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/600px-Facebook_logo_%28square%29.png" alt="Facebook" className="social-icon" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src="https://seeklogo.com/images/T/twitter-x-logo-101C7D2420-seeklogo.com.png" alt="Twitter" className="social-icon" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/600px-Instagram_logo_2022.svg.png" alt="Instagram" className="social-icon" />
                    </a>
                </div>
            </div>

            {/* Información final */}
            <div className="fm-footer-finalfooter">
                <p className="fm-footer-finalfooter-p">© 2024 | TechTower.cl Todos los derechos reservados | Desarrollado por el equipo maravilla dinamita alpha lobo</p>
            </div>  
        </div>
    );
}
