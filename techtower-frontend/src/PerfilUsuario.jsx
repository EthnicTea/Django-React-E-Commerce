import React, { useState, useEffect } from 'react';
import './PerfilUsuario.css';
import { CHILE_GEODATA } from './services/geodata.jsx'; // Asumiendo que moviste el archivo
import { useAuth } from './services/AuthContext.jsx'; // ¡Para traer los datos reales!
import { useNavigate } from 'react-router-dom';

function PerfilUsuario() {
    const { user, authToken, logoutAction } = useAuth();
    const navigate = useNavigate();

    console.log("PerfilUsuario RENDERIZADO. El objeto 'user' es:", user); // Debugging!!

    // --- Estados del Formulario ---
    const [profileData, setProfileData] = useState({
        email: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        region: '',
        comuna: '',
        departamento: ''
    });
    
    // --- Estados de los Selects 
    const [selectedRegion, setSelectedRegion] = useState('');
    const [availableComunas, setAvailableComunas] = useState([]);
    const [selectedComuna, setSelectedComuna] = useState('');

    const [passwordConfirm, setPasswordConfirm] = useState('');

    useEffect(() => {
        console.log("PerfilUsuario useEffect SE DISPARÓ."); // Debugging!!!!
        if (user) {
            console.log("PerfilUsuario useEffect: ¡'user' existe! Llenando formulario..."); // Más debugging...
            setProfileData({
                email: user.email || '',
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                telefono: user.telefono || '',
                direccion: user.direccion || '',
                region: user.region || '',
                comuna: user.comuna || '',
                departamento: user.data_departamento || ''
            });

            // Pre-seleccionamos los dropdowns si los datos existen
            if (user.region) {
                setSelectedRegion(user.region);
                const geoData = CHILE_GEODATA.find(data => data.region === user.region);
                setAvailableComunas(geoData ? geoData.comunas : []);
                setSelectedComuna(user.comuna || '');
            }
        } else {
            console.log("PerfilUsuario useEffect: 'user' NO existe aún."); // Y MÁS Debugging...
        }
    }, [user]); // Este efecto se ejecuta cada vez que el 'user' (del context) se cargue

    
    const handleRegionChange = (e) => {
        const region = e.target.value;
        setSelectedRegion(region);
        setSelectedComuna('');
        // Sincroniza también el estado principal del formulario
        setProfileData(prev => ({ ...prev, region: region, comuna: '' }));
        
        if (region) {
            const selectedGeoData = CHILE_GEODATA.find(data => data.region === region);
            setAvailableComunas(selectedGeoData ? selectedGeoData.comunas : []);
        } else {
            setAvailableComunas([]);
        }
    };

    const handleComunaChange = (e) => {
        const comuna = e.target.value;
        setSelectedComuna(comuna);
        // Sincroniza el estado principal
        setProfileData(prev => ({ ...prev, comuna: comuna }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // --- Lógica de Submit  ---
    // Explicación:
    // async y await: Hacen que la función espere a que la llamada fetch termine antes de continuar.
    // luego con patch por que ya existe un endpoint que maneje usuarios (POST) y otro para actualizar (PATCH).
    // envia el authToken, que es necesario para autenticar la solicitud.
    // envia el body del formulario... y listo
    const handleSubmit = async (e) => { 
    e.preventDefault();

    if (!authToken) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        return;
    }
    const { email, departamento, ...Perfil } = profileData;

    const datosParaActualizar = {
            ...Perfil, // nombre, apellido, etc.
            "data_departamento": departamento // No saben CUANTO me costó saber por que cresta no se enviaba el departamento...
        };
    console.log('Datos del perfil a ENVIAR:', datosParaActualizar);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/user/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(datosParaActualizar)
        });

        if (response.ok) {
            const updatedUserData = await response.json();
            console.log('Perfil actualizado en el backend:', updatedUserData);
            alert('¡Perfil actualizado exitosamente!');
            
            // Opcional: aquí se podría actualizar el 'user' en tu AuthContext 
            // pero se actualizará solo al recargar la página de todos modos, eso creo... :P

        } else {
            // Validaciones, etc etc...
            const errorData = await response.json();
            console.error('Error al actualizar:', errorData);
            alert(`Error al guardar los cambios: ${JSON.stringify(errorData)}`);
        }
    } catch (err) {
        console.error('Error de red:', err);
        alert('Error de conexión. No se pudo guardar el perfil.');
    }
};

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        
        if (passwordConfirm === '') {
            alert('Por favor, ingresa tu contraseña para confirmar.');
            return;
        }

        if (!window.confirm('¿Estás SEGURO de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            return; // Si el usuario cancela, no hacemos nada
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/delete/', { // <-- 3. URL con barra al final
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ password: passwordConfirm })
            });

            // Manejo de la respuesta
            if (response.status === 204) {
                // Bien, exito.
                alert('Tu cuenta ha sido eliminada permanentemente.');
                logoutAction(); // Limpiamos el token
                navigate('/');    // Redirigimos al inicio
            
            } else if (response.ok) {
                // Exito con mensaje (200)... 
                const data = await response.json();
                alert(data.message || 'Cuenta eliminada.');
                logoutAction();
                navigate('/');

            } else {
                // Errores 
                const errorData = await response.json();
                console.error('Error al borrar:', errorData);
                alert(`Error: ${errorData.error || 'No se pudo eliminar la cuenta.'}`);
            }

        } catch (err) {
            // Error de red 
            console.error('Error de red:', err);
            alert('Error de conexión. No se pudo conectar con el servidor.');
        }
    };


    return (
        <div className="profile-container">
            
            <form onSubmit={handleSubmit} className="profile-form">
                <h2>Tu perfil</h2>
                <p className='p-datos'>Aquí puedes editar tus datos de envio</p>
                <fieldset>
                    <legend>Información Personal</legend>
                    <div className="form-group">
                        <label htmlFor="email">Tu correo</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            value={profileData.email} 
                            readOnly 
                            className="disabled-input"
                        />
                    </div>
                    
                    {/* (Tus campos: nombre, apellido, telefono) */}
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input name="nombre" value={profileData.nombre} onChange={handleChange} placeholder='John'/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido</label>
                        <input name="apellido" value={profileData.apellido} onChange={handleChange} placeholder='Doe'/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input name="telefono" value={profileData.telefono} onChange={handleChange} placeholder='+569...'/>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Dirección de Envío</legend>
                    {/* (Tus campos de dirección) */}
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input name="direccion" value={profileData.direccion} onChange={handleChange} placeholder='Pasaje el manzano 123'/>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="region">Región</label>
                        <select id="region" value={selectedRegion} onChange={handleRegionChange}>
                            <option value="">Seleccionar Región</option>
                            {CHILE_GEODATA.map((data) => (
                                <option key={data.region} value={data.region}>
                                    {data.region}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="comuna">Comuna</label>
                        <select id="comuna" value={selectedComuna} onChange={handleComunaChange} disabled={!selectedRegion}>
                            <option value="">Seleccionar Comuna</option>
                            {availableComunas.map((comuna) => (
                                <option key={comuna} value={comuna}>
                                    {comuna}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="departamento">Departamento (Opcional)</label>
                        <input name="departamento" value={profileData.departamento} onChange={handleChange} placeholder='N° de Departamento/Oficina'/>
                    </div>
                </fieldset>

                <button type="submit" className="save-button">
                    Guardar Cambios
                </button>
            </form>
            <div className="danger-zone">
                <h2>Eliminar Cuenta</h2>
                <p>Esta acción es permanente y eliminará todos tus datos, historial de pedidos y carrito.</p>
                <form onSubmit={handleDeleteAccount} className="delete-form">
                    <div className="form-group">
                        <label htmlFor="passwordConfirm">Ingresa tu contraseña para confirmar</label>
                        <input 
                            type="password"
                            id="passwordConfirm"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Tu contraseña"
                        />
                    </div>
                    <button type="submit" className="delete-button">
                        Eliminar mi cuenta permanentemente
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PerfilUsuario;