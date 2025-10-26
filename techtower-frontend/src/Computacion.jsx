import React, { useState } from "react";
import "./Computacion.css";

const productos = [
  { id: 1, name: 'Monitor Plano ASUS VA24EHF Eye Care', brand: 'Asus', category: 'Monitor', price: '$99.990 Transferencia', price2: '$105.000 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/q0txzqxy_c4b644f0_thumbnail_512.png' },
  { id: 2, name: 'Adaptador Conversor de Video DisplayPort a HDMI', brand: 'STARTECH.COM', category: 'Adaptador', price: '$10.000 Transferencia', price2: '$15.000 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/8kwt_kf4_58344fa0_thumbnail_512.jpg' },
  { id: 3, name: 'Mouse Azio MS530, USB, Antimicrobios, 3 botones, Negro', brand: 'AZIO', category: 'Mouse', price: '$7.990 Transferencia', price2: '$8.355 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/rbpsz8yj_6349f8e1_thumbnail_512.jpg' },
  { id: 4, name: 'Cámara Web Logitech Brio 500, Full HD 1080p, Micrófono Integrado, USB-C, Rosa', brand: 'Logitech', category: 'WebCam', price: '$126.370 Transferencia', price2: '$132.060 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/4bfvabmi_ad2dd23c_thumbnail_512.jpg' },
  { id: 5, name: 'Notebook HP 255 G10 AMD Ryzen 3 7330U, LED 15.6", RAM 8GB, SSD 512GB, W11', brand: 'HP', category: 'Notebook', price: '$461.020 Transferencia', price2: '$481.780 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/lymnzz4c_af0637e0_thumbnail_512.png' },
  { id: 6, name: 'Pendrive Hikvision E304C, 16GB, Convertible USB Type-C / USB 3.2 Type-A', brand: 'HIKVISION', category: 'Pendrive', price: '$3.680 Transferencia', price2: '$3.852 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/hnnbh_ym_43b794bc_thumbnail_512.png' },
  { id: 7, name: 'Alfombrilla de gel para mouse Xtech XTA-526', brand: 'XTECH', category: 'MousePad', price: '$4.990 Transferencia', price2: '$5.217 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/4ac03ncp_16c25762_thumbnail_512.jpg' },
  { id: 8, name: 'Base para Notebook Kensington Easy Riser Go SmartFit', brand: 'KENSINGTON', category: 'Base para Notebook', price: '$21.680 Transferencia', price2: '$22.664 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/faq9nk9v_bfdb51ae_thumbnail_512.jpg' },
  { id: 9, name: 'Cámara Web Genius 1000X HD V2', brand: 'GENIUS', category: 'WebCam', price: '$12.380 Transferencia', price2: '$12.941 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/fb6eg23d_142d27f0_thumbnail_512.png' },
  { id: 10, name: 'Mini Teclado Multimedia ULTRA, USB, Slim, Español', brand: 'ULTRA', category: 'Teclado', price: '$4.680 Transferencia', price2: '$4.896 Otro método de pago', image: 'https://media.spdigital.cl/thumbnails/products/47mq580g_21204029_thumbnail_512.jpg' },
];

const brands = ['Asus', 'STARTECH.COM', 'AZIO', 'Logitech', 'HP', 'HIKVISION', 'XTECH', 'KENSINGTON', 'GENIUS', 'ULTRA'];
const categories = ['Monitor', 'Adaptador', 'Mouse', 'WebCam', 'Notebook', 'Pendrive', 'MousePad', 'Base para Notebook', 'Teclado'];

export default function Computacion() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = productos.filter((product) => {
    return (
      (selectedBrand === '' || product.brand === selectedBrand) &&
      (selectedCategory === '' || product.category === selectedCategory)
    );
  });

  return (
    <div className="computacion-container">
      <h2 className="titulo-seccion">Explora el Apartado de Computación</h2>
      <p className="subtitulo-seccion">
        Encuentra todo lo que necesitas para mejorar tu experiencia en el mundo digital: desde accesorios hasta los ultimos monitores!.
      </p>

      {/* Barra de Filtros */}
      <div className="filter-bar-modern">
        <div className="filter-group-modern">
          <label htmlFor="brand-filter">Marca:</label>
          <select id="brand-filter" value={selectedBrand} onChange={handleBrandChange}>
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group-modern">
          <label htmlFor="category-filter">Categoría:</label>
          <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="productos-grid">
        {filteredProducts.map((p) => (
          <div key={p.id} className="card-producto">
            <div className="imagen-container">
              <img src={p.image} alt={p.name} className="imagen-producto" />
            </div>
            <h3 className="nombre-producto">{p.name}</h3>
            <p className="marca">{p.brand}</p>
            <p className="precio">
              <span className="precio-transferencia">{p.price}</span>
              <span className="precio-normal">{p.price2}</span>
            </p>
            <div className="botones">
              <button className="btn-agregar">Agregar</button>
              <button className="btn-ver">Ver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}