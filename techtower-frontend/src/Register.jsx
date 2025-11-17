import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. DATA DE REGIONES Y COMUNAS DE CHILE
// Fuente: Adaptado de datos públicos chilenos para lógica de frontend.
const CHILE_GEODATA = [
  { region: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { region: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'] },
  { region: 'Antofagasta', comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'] },
  { region: 'Atacama', comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'] },
  { region: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca'] },
  { region: 'Valparaíso', comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llay-Llay', 'Panquehue', 'Putaendo', 'Santa María', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar'] },
  { region: 'Metropolitana', comunas: ['Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Santiago', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'] },
  { region: 'O\'Higgins', comunas: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchigüe', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'] },
  { region: 'Maule', comunas: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'] },
  { region: 'Ñuble', comunas: ['Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Quirihue', 'Ránquil', 'Treguaco', 'Bulnes', 'Chillán Viejo', 'Chillán', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay', 'San Carlos', 'Coihueco', 'San Fabián', 'San Nicolás'] },
  { region: 'Biobío', comunas: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'] },
  { region: 'Araucanía', comunas: ['Temuco', 'Carahue', 'Cholchol', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'] },
  { region: 'Los Ríos', comunas: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'] },
  { region: 'Los Lagos', comunas: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao'] },
  { region: 'Aysén', comunas: ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Chile Chico', 'Río Ibáñez', 'Cochrane', 'O\'Higgins', 'Tortel'] },
  { region: 'Magallanes', comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'] }
];


export function Register() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para manejo de Comunas
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availableComunas, setAvailableComunas] = useState([]); // Comunas filtradas
  const [selectedComuna, setSelectedComuna] = useState('');
  
  const [addressNumber, setAddressNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  
  // Estado para mensajes de éxito o error
  const [message, setMessage] = useState(null); 

  const navigate = useNavigate();
  
  // Función para manejar el cambio de región y actualizar comunas
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedComuna(''); // Resetear comuna al cambiar la región
    
    if (region) {
        const selectedGeoData = CHILE_GEODATA.find(data => data.region === region);
        setAvailableComunas(selectedGeoData ? selectedGeoData.comunas : []);
    } else {
        setAvailableComunas([]);
    }
  };


  const submitRegistration = async (e) => {
    e.preventDefault();
    setMessage(null); // Limpiar mensajes anteriores

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden. Por favor, revísalas.' });
      return;
    }

    // Validación simplificada, asume que los campos obligatorios son manejados por 'required'
    if (!name || !lastname || !rut || !email || !password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Debes completar todos los campos obligatorios (*).' });
      return;
    }

    const userData = {
      password,
      email,
      rut,
      nombre: name,
      apellido: lastname,
      telefono: telephone,
      region: selectedRegion,
      comuna: selectedComuna,
      direccion: addressNumber,
      data_departamento: apartmentNumber,
    };

    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + '/api/register/', userData); //axios.post('http://127.0.0.1:8000/api/register/', userData);
        
        // Verificamos la respuesta del backend
        if (response.status !== 201) {
            throw new Error('Error en el registro. Código de estado: ' + response.status);
        }
        setMessage({ type: 'success', text: '¡Registro exitoso! Redirigiendo...' });
        
        setTimeout(() => {
            navigate('/login');
        }, 2000); 

    } catch (error) {
        console.error('Error en el registro:', error.response?.data || error.message);
        
        // Esto es opcional pero recomendado, da un error específico
        let errorMessage = 'Hubo un error al registrarte. Intenta más tarde.';
        if (error.response?.data) {
            // Si el serializer de Django devuelve un error (ej: "email ya existe")
            // Lo mostramos.
            errorMessage = Object.values(error.response.data).join(' ');
        }
        
        setMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <div className="register-page">
      <div className="form-register">
        {/* Título de Marca (TechTower) */}
        <h1 className="brand-title">
            <span className="brand-highlight">Tech</span>Tower
        </h1>
        
        <h5 className="register-heading">Crear Cuenta</h5>
        
        {/* Mensaje de Feedback (Error o Éxito) */}
        {message && (
            <div className={`form-message ${message.type}`}>
                {message.text}
            </div>
        )}
        
        <form onSubmit={submitRegistration}>
          
          <h5 className="section-heading">Datos Personales y de Contacto</h5>
          
          <div className="form-grid">
            {/* Nombre */}
            <div className="input-group">
                <label htmlFor="name-input">Nombre:</label>
                <input
                    id="name-input"
                    className="controls"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            
            {/* Apellido */}
            <div className="input-group">
                <label htmlFor="lastname-input">Apellido:</label>
                <input
                    id="lastname-input"
                    className="controls"
                    type="text"
                    placeholder="Apellido"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                />
            </div>
            
            {/* RUT */}
            <div className="input-group">
                <label htmlFor="rut-input">RUT:</label>
                <input
                    id="rut-input"
                    className="controls"
                    type="text"
                    placeholder="RUT"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    required
                />
            </div>
            
            {/* E-mail */}
            <div className="input-group">
                <label htmlFor="email-input">E-mail:</label>
                <input
                    id="email-input"
                    className="controls"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            
            {/* Teléfono */}
            <div className="input-group full-width">
                <label htmlFor="tel-input">Teléfono (Opcional):</label>
                <input
                    id="tel-input"
                    className="controls"
                    type="tel"
                    placeholder="Teléfono (Ej: +569...)"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                />
            </div>
          </div>
          
          <h5 className="section-heading">Seguridad de la Cuenta</h5>

          <div className="form-grid">
            {/* Contraseña */}
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
            
            {/* Confirmar Contraseña */}
            <div className="input-group">
                <label htmlFor="confirm-password-input">Confirmar Contraseña:</label>
                <input
                    id="confirm-password-input"
                    className="controls"
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
          </div>

          <h5 className="section-heading">Dirección de Envío (Opcional)</h5>
          
          <div className="form-grid">
            {/* Región */}
            <div className="input-group">
                <label htmlFor="region-select">Región:</label>
                <select
                    id="region-select"
                    className="controls"
                    value={selectedRegion}
                    onChange={handleRegionChange} // Usa la nueva función de manejo
                >
                    <option value="">Seleccionar Región</option>
                    {/* Mapea todas las regiones disponibles */}
                    {CHILE_GEODATA.map((data) => (
                        <option key={data.region} value={data.region}>
                            {data.region}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Comuna */}
            <div className="input-group">
                <label htmlFor="comuna-select">Comuna:</label>
                <select
                    id="comuna-select"
                    className="controls"
                    value={selectedComuna}
                    onChange={(e) => setSelectedComuna(e.target.value)}
                    disabled={!selectedRegion} // Deshabilitar si no hay región seleccionada
                >
                    <option value="">Seleccionar Comuna</option>
                    {/* Mapea solo las comunas disponibles para la región seleccionada */}
                    {availableComunas.map((comuna) => (
                        <option key={comuna} value={comuna}>
                            {comuna}
                        </option>
                    ))}
                </select>
            </div>

            {/* Número (Casa) */}
            <div className="input-group">
                <label htmlFor="address-input">Calle y Número:</label>
                <input
                    id="address-input"
                    className="controls"
                    type="text"
                    placeholder="Ej: Avenida Siempre Viva 742"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                />
            </div>
            
            {/* N° de Departamento/Oficina */}
            <div className="input-group">
                <label htmlFor="apartment-input">Departamento/Oficina (Opcional):</label>
                <input
                    id="apartment-input"
                    className="controls"
                    type="text"
                    placeholder="N° de Departamento/Oficina"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                />
            </div>
          </div>
          
          <input className="buttons" type="submit" value="Registrarse" />
          
        </form>
        
        <p className="login-link">
          <Link to="/login">¿Ya tienes una cuenta? Inicia sesión aquí</Link>
        </p>
        
      </div>
    </div>
  );
}
