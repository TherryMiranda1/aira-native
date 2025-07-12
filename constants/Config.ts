/**
 * Configuración global de la aplicación
 */

// URL base de la API
export const API_BASE_URL = "http://localhost:3000";

// Otras configuraciones globales
export const APP_CONFIG = {
  // Versión de la aplicación
  VERSION: "1.0.0",

  // Configuración de timeouts para peticiones API (en milisegundos)
  API_TIMEOUT: 10000,

  // Configuración de caché
  CACHE_DURATION: 3600000, // 1 hora
};

// Configuración de Cloudinary
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dtlaxm8gi",
  UPLOAD_PRESET: "aira_wall",
  API_URL: "https://api.cloudinary.com/v1_1/dtlaxm8gi/upload",
};
