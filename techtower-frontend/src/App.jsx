import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { Items } from './components/Items.jsx'
import { Foot } from './components/Foot.jsx'
import { Login } from './Login.jsx' // Importa la página de login

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
          <Route path="/login" element={<Login />} />
        </Routes>
        <footer>
          <Foot />
        </footer>
      </article>
    </Router>
  )
}
