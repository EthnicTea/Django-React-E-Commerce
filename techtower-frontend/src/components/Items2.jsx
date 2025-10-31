// Items2.jsx
import './Items2.css';

const Items2 = ({ name, desc, pnormal, price, price2, image }) => {
    return (
        <div className="items2-card">
            <img src={image} alt={name} className="items2-image"/>
            <h2 className="items2-name">{name}</h2>
            <h3 className="items2-desc">{desc}</h3>
            <p className="items2-pnormal">{pnormal}</p>
            <p className="items2-price">{price}</p>
            <p className="items2-price2">{price2}</p>
            <div className="items2-buttons">
                <button className="items2-button items2-button-add">Agregar</button>
                <button className="items2-button items2-button-view">Ver</button>
            </div>
        </div>
    );
};

export default Items2;