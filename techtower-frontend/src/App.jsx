import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { Items } from './components/Items.jsx'
import { Foot } from './components/Foot.jsx'
import { Login } from './Login.jsx' // Importa la página de login
import Gaming from './Gaming.jsx';
import Computacion from './Computacion.jsx';
import Componentes from './Componentes.jsx';
import ConectividadRedes from './Conectividad-Redes.jsx';
import AudioVideo from './Audio-Video.jsx';

export function App() {
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
              <Items />
              <Items />
              <Items />
              <Items />
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
    </Routes>
    <footer>
      <Foot />
    </footer>
  </article>
</Router>
  )
}
