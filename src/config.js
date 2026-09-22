// Centralized API config
// Reads VITE_API_URL from .env (or Netlify env vars in production)
// Falls back to localhost if not set

// Centralized API config
const API_URL = import.meta.env.VITE_API_URL || 'https://meal-track-backend-production.up.railway.app'

export const UPLOADS_URL = `${API_URL}/uploads`

export default API_URL