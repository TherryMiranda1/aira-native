/**
 * Tipos para el módulo de ejercicios
 */

export interface MetricaConfigurable {
  metrica: string;
  unidad: string | null;
  tipo_input: string;
}

export interface ValoresEjemplo {
  peso_kg?: number;
  repeticiones?: number;
  series?: number;
  duracion_minutos?: number;
  distancia_km?: number;
  descanso_entre_series_segundos?: number;
}

export interface Exercise {
  id_ejercicio: string;
  nombre: string;
  descripcion: string;
  instrucciones: string[];
  tipo_ejercicio: string;
  modalidad: string;
  grupos_musculares: string[];
  equipamiento_necesario: string[];
  nivel_dificultad: string;
  media: {
    imagen_url: string;
    video_url: string;
  };
  metricas_configurables?: MetricaConfigurable[];
  valores_ejemplo_mujer_principiante: ValoresEjemplo;
  tags_busqueda: string[];
  advertencias: string;
  categoria?: string;
}

export interface Category {
  id: string;
  label: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons['glyphMap'];
}
