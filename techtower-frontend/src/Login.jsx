import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que se recargue la página al enviar el formulario
    try {
      // Envía una petición POST al backend para hacer login
      const response = await axios.post('/api/login', { 
        email, 
        password 
      });
      console.log('Login exitoso:', response.data);
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="form-login">
      <h5>Inicia Sesión</h5>
      <form onSubmit={handleLogin}>
        <label>
          Usuario:
          <input 
            className="controls" 
            type="text" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado `username`
          />
        </label>
        <label>
          Contraseña:
          <input 
            className="controls" 
            type="password" 
            placeholder='Contraseña' 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado `password`
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
