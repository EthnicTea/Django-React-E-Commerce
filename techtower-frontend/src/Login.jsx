import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Evitamos que se recargue la página al enviar el formulario
    try {
      // Envía una petición POST al backend para hacer login
      const response = await axios.post('/api/login', { 
        email, 
        password 
      });

      if (response.data && response.data.email) { 
        localStorage.setItem('userEmail', response.data.email); // Guarda el email
        window.location.href = '/'; // Redirige al home
    } else {
        console.error('La respuesta no contiene el email');
    }
    } catch (error) {
        console.error('Error en el login:', error);
        setError('Error al iniciar sesión, intente nuevamente');
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
            placeholder="pepito@gmail.com" 
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
