import React, { useState } from 'react';
import { loginUser } from "./App.jsx";
import axios from 'axios';
import "./Login.css"

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

      console.log(response.data); // Verifica qué datos llegan

      if (response.data) {
        localStorage.setItem('userEmail', response.data.email || '');
        localStorage.setItem('isStaff', response.data.is_staff ? 'true' : 'false');
        window.location.href = '/'; 
      } else {
        setError('No se pudieron obtener los datos del usuario.');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Error al iniciar sesión, intente nuevamente.');
    }
  };

  return (
    <div className="form-login">
      <h5>Inicia Sesión</h5>
      <form onSubmit={handleLogin}>
        <label>
          Correo Electrónico:
          <input 
            className="controls" 
            type="email" 
            placeholder="ejemplo@correo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
        <label>
          Contraseña:
          <input 
            className="controls" 
            type="password" 
            placeholder='Contraseña' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input className="buttons" type="submit" value="Ingresar"/>
      </form>
      {error && <p className="error">{error}</p>}
      <p><a href="#">¿Olvidaste tu Contraseña?</a></p>
      <p><a href="#">¿No tienes cuenta? ¡Regístrate!</a></p>
    </div>
  );
}
