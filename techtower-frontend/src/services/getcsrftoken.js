import axios from 'axios';

export async function getCsrfToken() {
  try {
    // Esta solicitud a Django genera un nuevo token CSRF
    await axios.get('/api/csrf/');
    console.log("CSRF token obtenido y configurado en las cabeceras de Axios.");
  } catch (error) {
    console.error("Error obteniendo el CSRF token:", error);
  }
}
