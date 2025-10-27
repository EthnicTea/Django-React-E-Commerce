import React, { useState } from 'react';
import './PerfilUsuario.css';

const CHILE_GEODATA = [ // grr
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

function PerfilUsuario() {

    const [selectedRegion, setSelectedRegion] = useState('');
    const [availableComunas, setAvailableComunas] = useState([]);
    const [selectedComuna, setSelectedComuna] = useState('');

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


    const [profileData, setProfileData] = useState({ // Hace falta traer los datos reales del usuario
        email: 'correo@ejemplo.com',
        nombre: 'Test',
        apellido: '123',
        telefono: '+56912345678',
        direccion: 'Av. Siempre Viva 742',
        region: 'Metropolitana',
        comuna: 'Recoleta',
        departamento: 'Departamento 5A'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData, // Mantenemos los datos que no cambiaron
            [name]: value  // Actualizamos el campo que sí cambió
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del perfil a enviar:', profileData); // Debug en consola, luego se usará fetch
        alert('Perfil actualizado (revisa la consola)');
    };

    return (
        <div className="profile-container">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="profile-form">
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email" 
                        value={profileData.email} 
                        readOnly 
                        className="disabled-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input 
                        type="text" 
                        id="nombre"
                        name="nombre" 
                        value={profileData.nombre} 
                        onChange={handleChange} 
                        placeholder='John'
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input 
                        type="text" 
                        id="apellido"
                        name="apellido" 
                        value={profileData.apellido} 
                        onChange={handleChange}
                        placeholder='Doe' 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input 
                        type="tel" 
                        id="telefono"
                        name="telefono" 
                        value={profileData.telefono} 
                        onChange={handleChange}
                        placeholder='+569...' 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="direccion">Dirección</label>
                    <input 
                        type="text" 
                        id="direccion"
                        name="direccion" 
                        value={profileData.direccion} 
                        onChange={handleChange}
                        placeholder='Pasaje el manzano 123' 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="region">Región</label>
                    <select
                        id="region"
                        className="controls"
                        value={selectedRegion}
                        onChange={handleRegionChange}
                    >
                        <option value="">Seleccionar Región</option>
                        {CHILE_GEODATA.map((data) => (
                            <option key={data.region} value={data.region}>
                                {data.region}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="comuna">Comuna:</label>
                    <select
                        id="comuna"
                        className="controls"
                        value={selectedComuna}
                        onChange={(e) => setSelectedComuna(e.target.value)}
                        disabled={!selectedRegion}
                    >
                        <option value="">Seleccionar Comuna</option>
                        {availableComunas.map((comuna) => (
                            <option key={comuna} value={comuna}>
                                {comuna}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="departamento">Departamento/Oficina (Opcional):</label>
                    <input
                        id="departamento"
                        className="controls"
                        type="text"
                        placeholder="N° de Departamento/Oficina"
                        value={profileData.departamento} 
                        onChange={handleChange} 
                    />
                </div>

                <button type="submit" className="save-button">
                    Guardar Cambios
                </button>

            </form>
        </div>
    );
}

export default PerfilUsuario;