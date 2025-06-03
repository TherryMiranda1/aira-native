import { API_CONFIG } from "./config";

/**
 * Interface for exercise data from the CMS
 */
export interface ExerciseFromCMS {
  id: string;
  id_ejercicio: string;
  nombre: string;
  descripcion: string;
  instrucciones: {
    paso: string;
  }[];
  tipo_ejercicio: string;
  modalidad: string;
  grupos_musculares: {
    grupo: string;
  }[];
  equipamiento_necesario: {
    equipo: string;
  }[];
  nivel_dificultad: string;
  media: {
    imagen?: {
      url: string;
    };
    video_url?: string;
  };
  valores_ejemplo: {
    repeticiones?: number;
    series?: number;
    duracion_minutos?: number;
    distancia_km?: number;
    descanso_entre_series_segundos?: number;
  };
  tags_busqueda: {
    tag: string;
  }[];
  advertencias: string;
  categoria: string;
}

/**
 * Interface for exercise data used in the application
 */
export interface Exercise {
  id: string;
  id_ejercicio: string;
  nombre: string;
  descripcion: string;
  instrucciones: string[];
  tipo_ejercicio: string;
  modalidad: string;
  grupos_musculares: string[];
  equipamiento_necesario: string[];
  nivel_dificultad: string;
  imagen?: string;
  video_url?: string;
  valores_ejemplo: {
    repeticiones?: number;
    series?: number;
    duracion_minutos?: number;
    distancia_km?: number;
    descanso_entre_series_segundos?: number;
  };
  tags_busqueda: string[];
  advertencias: string;
  categoria: string;
}

/**
 * Transforms a CMS exercise to the application exercise format
 */
const transformExercise = (cmsExercise: ExerciseFromCMS): Exercise => {
  return {
    id: cmsExercise.id,
    id_ejercicio: cmsExercise.id_ejercicio || cmsExercise.id,
    nombre: cmsExercise.nombre,
    descripcion: cmsExercise.descripcion,
    instrucciones: cmsExercise.instrucciones.map((step) => step.paso),
    tipo_ejercicio: cmsExercise.tipo_ejercicio,
    modalidad: cmsExercise.modalidad,
    grupos_musculares: cmsExercise.grupos_musculares.map((gm) => gm.grupo),
    equipamiento_necesario: cmsExercise.equipamiento_necesario.map(
      (eq) => eq.equipo
    ),
    nivel_dificultad: cmsExercise.nivel_dificultad,
    imagen: cmsExercise.media?.imagen?.url,
    video_url: cmsExercise.media?.video_url,
    valores_ejemplo: cmsExercise.valores_ejemplo || {},
    tags_busqueda: cmsExercise.tags_busqueda.map((tag) => tag.tag),
    advertencias: cmsExercise.advertencias,
    categoria: cmsExercise.categoria,
  };
};

/**
 * Pagination response from the CMS
 */
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * Pagination parameters for exercise requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}

/**
 * Exercise service for fetching exercise data from the CMS
 */
export const exerciseService = {
  /**
   * Fetches exercises from the CMS with pagination
   */
  async getExercises(params: PaginationParams = {}): Promise<{
    exercises: Exercise[];
    pagination: Omit<PaginatedResponse<any>, "docs">;
  }> {
    try {
      // Default values
      const { page = 1, limit = 9, sort = "-createdAt", where = {} } = params;

      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit.toString());
      queryParams.append("page", page.toString());
      queryParams.append("sort", sort);

      const url = `${API_CONFIG.BASE_URL}${
        API_CONFIG.ENDPOINTS.EXERCISES
      }?${queryParams.toString()}&where[categoria][equals]=${where.categoria}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching exercises: ${response.status}`);
      }

      const data: PaginatedResponse<ExerciseFromCMS> = await response.json();
      const exercises = (data.docs || []).map(transformExercise);

      // Return both the exercises and pagination info
      const { docs, ...paginationInfo } = data;
      return {
        exercises,
        pagination: paginationInfo,
      };
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
      throw error;
    }
  },

  /**
   * Fetches all exercises from the CMS (legacy method, use getExercises instead)
   * @deprecated Use getExercises instead
   */
  async getAllExercises(): Promise<Exercise[]> {
    try {
      const { exercises } = await this.getExercises({ limit: 100 });
      return exercises;
    } catch (error) {
      console.error("Failed to fetch all exercises:", error);
      return [];
    }
  },

  /**
   * Fetches a single exercise by ID
   */
  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EXERCISES}/${id}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching exercise: ${response.status}`);
      }

      const cmsExercise: ExerciseFromCMS = await response.json();
      return transformExercise(cmsExercise);
    } catch (error) {
      console.error(`Failed to fetch exercise with id ${id}:`, error);
      return null;
    }
  },
};
