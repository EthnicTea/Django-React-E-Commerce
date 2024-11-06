import React, { useState } from 'react';
import './Register.css';

export function Register() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    // Aquí se puede algo con el cambio de región, como cargar las comunas correspondientes bla bla
  };

  return (
    <div className='form'>
      <div className="form-register">
        <h5>Registro</h5>
        <form>
          <label>
            Nombre:
            <input className="controls" type="text" name="name" placeholder="Nombre" required />
          </label>
          <label>
            Apellido:
            <input className="controls" type="text" name="lastname" placeholder="Apellido" required />
          </label>
          <label>
            RUT:
            <input className="controls" type="text" name="rut" placeholder="RUT" required />
          </label>
          <label>
            E-mail:
            <input className="controls" type="email" name="email" placeholder="Correo electrónico" required />
          </label>
          <label>
            Teléfono:
            <input className="controls" type="tel" name="phone" placeholder="Teléfono" required />
          </label>
          <label>
            Contraseña:
            <input className="controls" type="password" name="password" placeholder="Contraseña" required />
          </label>
          <label>
            Confirmar Contraseña:
            <input className="controls" type="password" name="confirmPassword" placeholder="Confirmar Contraseña" required />
          </label>
          <input className="buttons" type="submit" value="Registrarse" />
        </form>
        <p><a href="#">¿Tienes cuenta? Inicia sesión aquí</a></p>
      </div>

      <div className='form-direction'>
        <h5>Dirección de envío (opcional)</h5>
        <form>
          <label>
            Región:
            <select className="controls" value={selectedRegion} onChange={handleRegionChange} required>
              <option value="">Seleccionar Región</option>
              <option value="Region1">Región 1</option>
              <option value="Region2">Región 2</option>
              {/* Agrega más regiones según sea necesario */}
            </select>
          </label>

          <label>
            Comuna:
            <select className="controls" value={selectedComuna} onChange={(e) => setSelectedComuna(e.target.value)} required>
              <option value="">Seleccionar Comuna</option>
              {/* Aquí podrías agregar las comunas dependiendo de la región seleccionada */}
              <option value="Comuna1">Comuna 1</option>
              <option value="Comuna2">Comuna 2</option>
            </select>
          </label>

          <label>
            Número (Casa):
            <input className="controls" type="text" name="addressNumber" placeholder="Número de casa" required />
          </label>
          <label>
            N° de Departamento/Oficina:
            <input className="controls" type="text" name="apartmentNumber" placeholder="N° de Departamento/Oficina (opcional)" />
          </label>
          <input className="buttons" type="submit" value="Guardar Dirección" />
        </form>
        <p><a href="#">¿Olvidaste tu Contraseña?</a></p>
        <p><a href="#">¿No tienes cuenta? ¡Regístrate!</a></p>
      </div>
    </div>
  );
}
