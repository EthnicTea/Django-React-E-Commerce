// Items2.jsx
import './Items2.css';

const Items2 = ({ name, price, price2, image }) => {
    return (
        <div className="product-card">
            <img src={image} alt={name} className="product-image"/>
            <h2 className="product-name">{name}</h2>
            <p className="product-price">{price}</p>
            <p className="product-price2">{price2}</p>
            <button className="product-button">Comprar Ahora</button>
        </div>
    );
};

export default Items2;
