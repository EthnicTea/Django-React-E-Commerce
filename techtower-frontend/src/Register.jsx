import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';

export function Register() {
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');

  // Enviar el formulario
  const submitRegistration = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Validar que los campos obligatorios no estén vacíos
    if (!name || !lastname || !rut || !email || !password) {
      alert('Por favor, llena todos los campos obligatorios.');
      return;
    }

    try {
      // Realizar la solicitud POST al backend
      const response = await axios.post('/api/register', {
        name,
        lastname,
        rut,
        email,
        telephone,
        password,
        region: selectedRegion,
        comuna: selectedComuna,
        address_number: addressNumber,
        apartment_number: apartmentNumber,
      });

      console.log('Registro exitoso:', response.data);
      alert('Registro exitoso.');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      alert('Hubo un error al registrarte.');
    }
  };

  return (
    <div className="form">
      <div className="form-register">
        <h5>Registro</h5>
        <form onSubmit={submitRegistration}>
          <label>
            Nombre:
            <input
              className="controls"
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Apellido:
            <input
              className="controls"
              type="text"
              placeholder="Apellido"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </label>
          <label>
            RUT:
            <input
              className="controls"
              type="text"
              placeholder="RUT"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </label>
          <label>
            E-mail:
            <input
              className="controls"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Teléfono:
            <input
              className="controls"
              type="tel"
              placeholder="Teléfono"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </label>
          <label>
            Contraseña:
            <input
              className="controls"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            Confirmar Contraseña:
            <input
              className="controls"
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <h5>Dirección de envío (Opcional)</h5>
          <label>
            Región:
            <select
              className="controls"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">Seleccionar Región</option>
              <option value="Region1">Arica y Parinacota</option>
              <option value="Region2">Tarapacá</option>
              <option value="Region3">Antofagasta</option>
              <option value="Region4">Coquimbo</option>
              <option value="Region5">Valparaíso</option>
              <option value="Region6">Metropolitana</option>
              <option value="Region7">O'Higgins</option>
              <option value="Region8">Maule</option>
              <option value="Region9">Ñuble</option>
              <option value="Region10">Biobío</option>
              <option value="Region11">Araucanía</option>
              <option value="Region12">Los Ríos</option>
              <option value="Region13">Los Lagos</option>
              <option value="Region14">Aysén</option>
              <option value="Region15">Magallanes</option>
            </select>
          </label>
          <label>
            Comuna:
            <select
              className="controls"
              value={selectedComuna}
              onChange={(e) => setSelectedComuna(e.target.value)}
            >
              <option value="">Seleccionar Comuna</option>
              <option value="Comuna1">Comuna 1</option>
              <option value="Comuna2">Comuna 2</option>
              {/* Agrega más comunas aquí */}
            </select>
          </label>
          <label>
            Número (Casa):
            <input
              className="controls"
              type="text"
              placeholder="Número de casa"
              value={addressNumber}
              onChange={(e) => setAddressNumber(e.target.value)}
            />
          </label>
          <label>
            N° de Departamento/Oficina:
            <input
              className="controls"
              type="text"
              placeholder="N° de Departamento/Oficina (opcional)"
              value={apartmentNumber}
              onChange={(e) => setApartmentNumber(e.target.value)}
            />
          </label>
          <input className="buttons" type="submit" value="Registrarse" />
        </form>
        <p>
          <a href="#">¿Tienes cuenta? Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}
