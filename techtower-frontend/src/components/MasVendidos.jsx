import React from 'react';
import './MasVendidos.css';

const BestSellers = () => {
  // Aquí puedes agregar tus productos más vendidos
  const bestSellingProducts = [
    { id: 12, name: 'Teclado Mecánico Razer RGB', brand: 'Razer', category: 'Teclado', price: '$80.000 Transferencia', price2: '$100.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/vqczuwsv_e8307d49_thumbnail_512.png' },
    { id: 1, name: 'Monitor Plano ASUS VA24EHF Eye Care', brand: 'Asus', category: 'Monitor', price: '$99.990 Transferencia', price2: '$105.000 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/q0txzqxy_c4b644f0_thumbnail_512.png' },
    { id: 25, name: 'Tarjeta de Video MSI Nvidia GeForce RTX 3060 VENTUS 2X 12G OC, 12GB GDDR6, 192-bit', brand: 'MSI', category: 'Tarjeta Grafica', price: '$299.990 Transferencia', price2: '$313.495 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/scpkheea_557a8ffc_thumbnail_512.jpg' },
    { id: 18, name: 'Mouse Gamer Razer Deathadder V3, Black, 59g Ultra-lightweight Ergonomic Esports Mouse, 30K Optical', brand: 'Razer', category: 'Mouse', price: '$69.990 Transferencia', price2: '$73.145 Otro metodo de pago', image: 'https://media.spdigital.cl/thumbnails/products/714zzdnd_ffeba0c7_thumbnail_512.png' }
  ];

  return (
    <div className="best-sellers">
      <h2>Más Vendidos</h2>
      <div className="product-list">
        {bestSellingProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <p className="product-price">{product.price2}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
