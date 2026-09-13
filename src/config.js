// Centralized API config
// Reads VITE_API_URL from .env (or Netlify env vars in production)
// Falls back to localhost if not set

const API_URL = import.meta.env.VITE_API_URL || 'https://xlct408n-5000.euw.devtunnels.ms'

export const UPLOADS_URL = `${API_URL}/uploads`

export default API_URL