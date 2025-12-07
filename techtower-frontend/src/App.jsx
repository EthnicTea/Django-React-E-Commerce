import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Foot } from './components/Foot.jsx';
import { Login } from './Login.jsx';
import { Register } from './Register.jsx';
import { useEffect } from 'react';
import { getCsrfToken } from './services/getcsrftoken';
import Gaming from './Gaming.jsx';
import Computacion from './Computacion.jsx';
import Componentes from './Componentes.jsx';
import ConectividadRedes from './Conectividad-Redes.jsx';
import AudioVideo from './Audio-Video.jsx';
import Ofertas from './Ofertas.jsx';
import Terminos from './Terminos.jsx';
import MasVendidos from './components/MasVendidos.jsx';
import Carrito from './Carrito.jsx';
import axios from 'axios';
import { Crud } from './Crud.jsx';
import PcBuilder from './PcBuilder.jsx';
import PerfilUsuario from './PerfilUsuario.jsx';
import Pasarela from './Pasarela.jsx';
import MiCuenta from './MiCuenta.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PanelEmpleado from './PanelEmpleado.jsx';
import Busqueda from './Busqueda.jsx';
import PanelOrdenes from './PanelOrdenes.jsx';
import Dashboard from './Dashboard.jsx';
import { ProductoDetalle } from './components/ProductoDetalle.jsx';
import GraciasCompra from './GraciasCompra.jsx';
import ScrollToTop from './components/ScrollToTop.jsx'; 

// Configuración global de Axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const loginUser = async (email, password) => {
  try {
    const response = await client.post("/api/login", {
      email: email,
      password: password
    });
    console.log("Datos enviados con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al enviar los datos:", error.response?.data || error.message);
    throw error;
  }
};

// ========================================
// COMPONENTE INTERNO PARA DETECTAR RUTA
// ========================================
function AppContent() {
  const location = useLocation();

  const rutasSinLayout = [
    '/Pasarela',
    '/gracias-por-tu-compra'
  ];

  // Detectar si la ruta actual debe mostrar layout
  const mostrarLayout = !rutasSinLayout.some(ruta => 
    location.pathname === ruta || location.pathname.startsWith(ruta)
  );

  return (
    <article>
      <ScrollToTop />
      {/* Solo mostrar header si no es una ruta sin layout */}
      {mostrarLayout && (
        <header>
          <Navbar />
        </header>
      )}

      <Routes>
        <Route path="/" element={<> <Hero /> <div className="items-container"> <MasVendidos /> </div> </> } />
        <Route path="/computacion" element={<Computacion />} />
        <Route path="/gaming" element={<Gaming />} />
        <Route path="/componentes" element={<Componentes />} />
        <Route path="/conectividad" element={<ConectividadRedes />} />
        <Route path="/audiovideo" element={<AudioVideo />} />
        <Route path="/PcBuilder" element={<PcBuilder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/masvendidos" element={<MasVendidos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/PerfilUsuario" element={<PerfilUsuario />} />
        <Route path="/Pasarela" element={<Pasarela />} />
        <Route path="/MiCuenta" element={<MiCuenta />} />
        <Route path="busqueda" element={<Busqueda />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/gracias-por-tu-compra/:orden_id" element={<GraciasCompra />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/PanelEmpleado" element={<PanelEmpleado />} /> 
          <Route path="/crud" element={<Crud />} />
          <Route path="/panel-ordenes" element={<PanelOrdenes />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>

      {/* Solo mostrar footer si no es una ruta sin layout */}
      {mostrarLayout && (
        <footer>
          <Foot />
        </footer>
      )}
    </article>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
export function App() {
  useEffect(() => {
    getCsrfToken();
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}