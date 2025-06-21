import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from 'qs-esm';

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
  categoria: string;
  imagen?: string;
  video_url?: string;
  valores_ejemplo_mujer_principiante: {
    peso_kg?: number;
    repeticiones?: number;
    series?: number;
    duracion_minutos?: number;
    distancia_km?: number;
    descanso_entre_series_segundos?: number;
  };
  tags_busqueda: string[];
  advertencias: string;
}

const transformExercise = (cmsExercise: ExerciseFromCMS): Exercise => {
  const instrucciones = cmsExercise.instrucciones.map((inst) => inst.paso);
  const grupos_musculares = cmsExercise.grupos_musculares.map(
    (grupo) => grupo.grupo
  );
  const equipamiento_necesario = cmsExercise.equipamiento_necesario.map(
    (equipo) => equipo.equipo
  );
  const tags_busqueda = cmsExercise.tags_busqueda.map((tag) => tag.tag);

  return {
    id: cmsExercise.id,
    id_ejercicio: cmsExercise.id_ejercicio,
    nombre: cmsExercise.nombre,
    descripcion: cmsExercise.descripcion,
    instrucciones,
    tipo_ejercicio: cmsExercise.tipo_ejercicio,
    modalidad: cmsExercise.modalidad,
    grupos_musculares,
    equipamiento_necesario,
    nivel_dificultad: cmsExercise.nivel_dificultad,
    categoria: cmsExercise.categoria,
    imagen: cmsExercise.media?.imagen?.url,
    video_url: cmsExercise.media?.video_url,
    valores_ejemplo_mujer_principiante: {
      repeticiones: cmsExercise.valores_ejemplo?.repeticiones,
      series: cmsExercise.valores_ejemplo?.series,
      duracion_minutos: cmsExercise.valores_ejemplo?.duracion_minutos,
      distancia_km: cmsExercise.valores_ejemplo?.distancia_km,
      descanso_entre_series_segundos:
        cmsExercise.valores_ejemplo?.descanso_entre_series_segundos,
    },
    tags_busqueda,
    advertencias: cmsExercise.advertencias,
  };
};

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

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}

export const exerciseService = {
  async getExercises(params: PaginationParams = {}): Promise<{
    exercises: Exercise[];
    pagination: Omit<PaginatedResponse<any>, "docs">;
  }> {
    try {
      const { page = 1, limit = 15, sort = "-createdAt", where = {} } = params;

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
      };

      if (Object.keys(where).length > 0) {
        queryObj.where = where;
      }

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.EXERCISES}${queryString}`);

      const exercises = (response.data.docs || []).map(transformExercise);

      const { docs, ...paginationInfo } = response.data;
      return {
        exercises,
        pagination: paginationInfo,
      };
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
      throw error;
    }
  },

  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.EXERCISES}/${id}`);

      return transformExercise(response.data);
    } catch (error) {
      console.error(`Failed to fetch exercise with ID ${id}:`, error);
      return null;
    }
  },
};
