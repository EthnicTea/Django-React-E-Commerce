import React, { useState } from 'react';
import { useAuth } from './services/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loginUser } from "./App.jsx";
import axios from 'axios';
import "./Login.css";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { loginAction } = useAuth(); // <-- Obtiene la función de login del Context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpia errores antiguos

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // ¡ÉXITO!!!!! gr!
                console.log('Login exitoso:', data);
                // Llama a la acción del Context para guardar el token -_-
                loginAction(data); 
                // Redirige 
                navigate('/');
            } else {
                // Manejar error (ej. contraseña incorrecta)
                setError(data.detail || 'Email o contraseña incorrectos.');
            }
        } catch (err) {
            setError('Error de conexión. Inténtalo más tarde.');
            console.error('Error de red:', err);
        }
    };

  return (
    <div className="login-page">
      <div className="form-login">
        <h1 className="brand-title">
            <span className="brand-highlight">Tech</span>Tower
        </h1>

        <h5 className="login-heading">Inicia Sesión</h5>
        <form onSubmit={handleSubmit}>
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

        <div className="secondary-links">
            <p><a href="#">¿Olvidaste tu Contraseña?</a></p>
            <p><Link to="/register">¿No tienes cuenta? ¡Regístrate!</Link></p>
        </div>
      </div>
    </div>
  );
}
