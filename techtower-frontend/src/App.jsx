import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Items } from './components/Items.jsx';
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
import Ofertas   from './Ofertas.jsx';
import Terminos from './Terminos.jsx';
import MasVendidos  from './components/MasVendidos.jsx'
import axios from 'axios';
import { Crud } from './Crud.jsx'

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

client.post("/api/login", {
  email: "usuario@example.com",
  password: "contraseña123"
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error.response.data);
});

export function App() {

  useEffect(() => {
    getCsrfToken();
  }, []);

  return (
    <Router>
  <article>
    <header>
      <Navbar />
    </header>
    <Routes>
      <Route 
        path="/" 
        element={
          <>
            <Hero />
            <div className="items-container">
              <MasVendidos />
            </div>
          </>
        } 
      />
      <Route path="/computacion" element={<Computacion />} />
      <Route path="/gaming" element={<Gaming />} />
      <Route path="/componentes" element={<Componentes />} />
      <Route path="/conectividad" element={<ConectividadRedes />} />
      <Route path="/audiovideo" element={<AudioVideo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ofertas" element={<Ofertas />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/masvendidos" element={<MasVendidos />} />
      <Route path="/crud" element={<Crud />} />
    </Routes>
    <footer>
      <Foot />
    </footer>
  </article>
</Router>
  )
}
