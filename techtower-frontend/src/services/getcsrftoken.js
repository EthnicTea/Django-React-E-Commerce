import axios from 'axios';

export async function getCsrfToken() {
  try {
    const response = await axios.get('/api/csrf/');
    const csrfToken = response.data.csrfToken;
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken; // Configura el token en Axios
    console.log("CSRF token configurado:", csrfToken);
  } catch (error) {
    console.error("Error obteniendo el CSRF token:", error);
  }
}