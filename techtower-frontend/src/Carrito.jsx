import React, { useState } from "react";
import "./Carrito.css";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 12,
      name: 'Teclado Mecánico Razer RGB',
      brand: 'Razer',
      category: 'Teclado',
      desc:'65% DCTO',
      pnormal:'$120.990',
      price: '$80.000',
      price2: '$100.000',
      image: 'https://media.spdigital.cl/thumbnails/products/vqczuwsv_e8307d49_thumbnail_512.png',
      quantity: 1,
    },
    {
        id: 14,
        name: 'Mouse Gamer Inalámbrico Redragon K1NG M916 PRO, 1000hz, Blanco',
        brand: 'Redragon',
        category: 'Mouse',
        desc:'30% DCTO',
        pnormal:'$70.000',
        price: '$47.990',
        price2: '$50.155',
        image: 'https://media.spdigital.cl/thumbnails/products/7sotxdzl_f26b2128_thumbnail_512.jpg',
        quantity: 1,
      },

  ]);
  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity,
    0
  );

  const formatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });
  

  return (
    <section className="computacion-section">
      <h1 className="computacion-title">Tu Carrito de Compras</h1>
      <div className="computacion-products">
        {cartItems.map((item) => (
          <div className="product-card" key={item.id}>
            <img
              src={item.image}
              alt={item.name}
              className="product-image"
            />
            <h2 className="product-name">{item.name}</h2>
            <p className="product-desc">{item.desc}</p>
            <p className="product-pnormal">Precio Normal: {item.pnormal}</p>
            <p className="product-price">Oferta Transferencia: {item.price}</p>
            <p className="product-price2">Otro metodo de pago:{item.price2}</p>
            <div className="quantity-controls">
              <button
                className="product-button"
                onClick={() => handleQuantityChange(item.id, -1)}
                disabled={item.quantity === 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="product-button"
                onClick={() => handleQuantityChange(item.id, 1)}
              >
                +
              </button>
            </div>
            <button
              className="product-button"
              onClick={() => handleRemoveItem(item.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: ${total.toLocaleString("es-CL")}</h2>
        <button className="product-button">Proceder al Pago</button>
      </div>
    </section>
  );
};

export default ShoppingCart;
