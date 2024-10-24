import React from 'react';
import './Login.css'; // Opcional, si vas a ponerle estilos

export function Login() {
  return (
    <div className="form-login">
      <h5>Inicia Sesión</h5>
      <form>
        <label>
          Usuario:
          <input className="controls" type="text" name="email" placeholder="Correo electrónico"/>
        </label>
        <label>
          Contraseña:
          <input className="controls" type="password" name="password" placeholder='Contraseña'/>
        </label>
        <input className="buttons" type="submit" value="Ingresar"/>
      </form>
      <p><a href="#">¿Olvidaste tu Contraseña?</a></p>
      <p><a href="#">¿No tienes cuenta? ¡Regístrate!</a></p>
    </div>
  );
}