import React, { useState } from 'react';
import { loginUser } from "./App.jsx"; // Manteniendo tu importación
import axios from 'axios';
import "./Login.css"; // Esta es la línea que fallaba por la ausencia del archivo.

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        email: email,
        password: password,
      });

      console.log(response.data); 

      if (response.data) {
        localStorage.setItem('userEmail', response.data.email || '');
        localStorage.setItem('isStaff', response.data.is_staff ? 'true' : 'false');
        
        window.location.href = '/'; 
      } else {
        setError('No se pudieron obtener los datos del usuario.');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Credenciales inválidas. Verifique su correo y contraseña e intente nuevamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="form-login">
        {/* Nuevo título con resalte de marca */}
        <h1 className="brand-title">
            <span className="brand-highlight">Tech</span>Tower
        </h1>

        <h5 className="login-heading">Inicia Sesión</h5>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email-input">Correo Electrónico:</label>
            <input 
              id="email-input"
              className="controls" 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password-input">Contraseña:</label>
            <input 
              id="password-input"
              className="controls" 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <input className="buttons" type="submit" value="Ingresar" />
        </form>

        {error && <p className="error">{error}</p>}

        {/* Enlaces secundarios */}
        <div className="secondary-links">
            <p><a href="#">¿Olvidaste tu Contraseña?</a></p>
            <p><a href="#">¿No tienes cuenta? ¡Regístrate!</a></p>
        </div>
      </div>
    </div>
  );
}
