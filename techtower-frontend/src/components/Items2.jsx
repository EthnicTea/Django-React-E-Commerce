// Items2.jsx
import './Items2.css';

const Items2 = ({ name,desc,pnormal, price, price2, image }) => {
    return (
        <div className="product-card">
            <img src={image} alt={name} className="product-image"/>
            <h2 className="product-name">{name}</h2>
            <h3 className="product-desc">{desc}</h3>
            <p className="product-pnormal">{pnormal}</p>
            <p className="product-price">{price}</p>
            <p className="product-price2">{price2}</p>
            <button className="product-button">Comprar Ahora</button>
        </div>
    );
};

export default Items2;
