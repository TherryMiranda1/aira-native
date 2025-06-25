/**
 * Configuración global de la aplicación
 */

// URL base de la API
export const API_BASE_URL = 'http://localhost:3000';

// Otras configuraciones globales
export const APP_CONFIG = {
  // Versión de la aplicación
  VERSION: '1.0.0',
  
  // Configuración de timeouts para peticiones API (en milisegundos)
  API_TIMEOUT: 10000,
  
  // Configuración de caché
  CACHE_DURATION: 3600000, // 1 hora
};

// Configuración de RevenueCat
export const REVENUECAT_CONFIG = {
  // API Keys - Reemplazar con las claves reales de RevenueCat
  API_KEYS: {
    IOS: 'appl_YOUR_IOS_API_KEY_HERE',
    ANDROID: 'goog_YOUR_ANDROID_API_KEY_HERE',
    AMAZON: 'amzn_YOUR_AMAZON_API_KEY_HERE'
  },
  
  // IDs de productos para las suscripciones
  PRODUCT_IDS: {
    BASIC_MONTHLY: 'aira_basic_monthly',
    PRO_MONTHLY: 'aira_pro_monthly'
  },
  
  // IDs de entitlements
  ENTITLEMENTS: {
    BASIC: 'basic_features',
    PRO: 'pro_features'
  },
  
  // Configuración de planes
  PLANS: {
    FREE: {
      id: 'free',
      name: 'Plan Gratuito',
      price: 0,
      features: [
        'Acceso básico a rutinas',
        'Seguimiento básico de progreso',
        'Biblioteca limitada de ejercicios'
      ]
    },
    BASIC: {
      id: 'basic',
      name: 'Plan Básico',
      price: 5.99,
      productId: 'aira_basic_monthly',
      entitlementId: 'basic_features',
      features: [
        'Todas las características gratuitas',
        'Rutinas personalizadas ilimitadas',
        'Seguimiento avanzado de métricas',
        'Acceso completo a biblioteca de ejercicios',
        'Planes de alimentación básicos'
      ]
    },
    PRO: {
      id: 'pro',
      name: 'Plan Pro',
      price: 7.99,
      productId: 'aira_pro_monthly',
      entitlementId: 'pro_features',
      features: [
        'Todas las características del plan básico',
        'IA personalizada para recomendaciones',
        'Análisis detallado de progreso',
        'Planes de alimentación premium',
        'Soporte prioritario',
        'Acceso anticipado a nuevas funciones'
      ]
    }
  }
};
