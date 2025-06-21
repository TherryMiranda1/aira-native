import { apiClient } from "./apiClient";
import { API_CONFIG } from "./config";
import { stringify } from "qs-esm";

export interface RitualStep {
  icono: string;
  titulo: string;
  descripcion: string;
  categoria_paso?: string;
  duracion?: string;
  orden?: number;
}

export interface Ritual {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  momento_recomendado?: string;
  duracion_total?: string;
  nivel_energia?: string;
  pasos: RitualStep[];
  beneficios?: Array<{ beneficio: string }>;
  tags?: Array<{ tag: string }>;
  estado_emocional_objetivo?: Array<{ estado: string }>;
  activo: boolean;
  popularidad: number;
  createdAt: string;
  updatedAt: string;
}

export interface RitualFilters {
  categoria?: string;
  momento_recomendado?: string;
  nivel_energia?: string;
  estado_emocional?: string;
  activo?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
  search?: string;
}

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

class RitualService {
  private baseUrl = API_CONFIG.ENDPOINTS.RITUALS;

  async getRituals(
    filters: RitualFilters = {}
  ): Promise<PaginatedResponse<Ritual>> {
    try {
      const {
        categoria,
        momento_recomendado,
        nivel_energia,
        estado_emocional,
        activo,
        limit = 10,
        page = 1,
        sort = "-popularidad",
        search,
      } = filters;

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
      };

      const where: any = {};

      if (categoria) where.categoria = { equals: categoria };
      if (momento_recomendado)
        where.momento_recomendado = { equals: momento_recomendado };
      if (nivel_energia) where.nivel_energia = { equals: nivel_energia };
      if (estado_emocional) {
        where["estado_emocional_objetivo.estado"] = { contains: estado_emocional };
      }
      if (activo !== undefined) where.activo = { equals: activo };
      
      if (search) {
        where.or = [
          { titulo: { contains: search } },
          { descripcion: { contains: search } },
        ];
      }

      if (Object.keys(where).length > 0) {
        queryObj.where = where;
      }

      const queryString = stringify(queryObj, { addQueryPrefix: true });
      const response = await apiClient.get(`${this.baseUrl}${queryString}`);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching rituals:", error);
      throw new Error("Error al obtener los rituales");
    }
  }

  async getRitualById(id: string): Promise<Ritual> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ritual:", error);
      throw new Error("Error al obtener el ritual");
    }
  }

  async getRitualsByCategory(
    categoria: string
  ): Promise<{ docs: Ritual[]; totalDocs: number }> {
    try {
      const response = await this.getRituals({
        categoria,
        activo: true,
        limit: 100,
        sort: "-popularidad",
      });
      return {
        docs: response.docs,
        totalDocs: response.totalDocs,
      };
    } catch (error) {
      console.error("Error fetching rituals by category:", error);
      throw new Error("Error al obtener rituales por categoría");
    }
  }

  async getRitualsByMoment(
    momento: string
  ): Promise<{ docs: Ritual[]; totalDocs: number }> {
    try {
      const response = await this.getRituals({
        momento_recomendado: momento,
        activo: true,
        limit: 100,
        sort: "-popularidad",
      });
      return {
        docs: response.docs,
        totalDocs: response.totalDocs,
      };
    } catch (error) {
      console.error("Error fetching rituals by moment:", error);
      throw new Error("Error al obtener rituales por momento");
    }
  }

  async getRitualsByEnergyLevel(
    nivel: string
  ): Promise<{ docs: Ritual[]; totalDocs: number }> {
    try {
      const response = await this.getRituals({
        nivel_energia: nivel,
        activo: true,
        limit: 100,
        sort: "-popularidad",
      });
      return {
        docs: response.docs,
        totalDocs: response.totalDocs,
      };
    } catch (error) {
      console.error("Error fetching rituals by energy level:", error);
      throw new Error("Error al obtener rituales por nivel de energía");
    }
  }

  async getRandomRituals(
    count: number = 5
  ): Promise<{ docs: Ritual[]; totalDocs: number }> {
    try {
      const allRituals = await this.getRituals({
        activo: true,
        limit: 50,
      });
      const shuffled = allRituals.docs.sort(() => Math.random() - 0.5);

      return {
        docs: shuffled.slice(0, count),
        totalDocs: shuffled.length,
      };
    } catch (error) {
      console.error("Error fetching random rituals:", error);
      throw new Error("Error al obtener rituales aleatorios");
    }
  }

  async searchRituals(
    query: string
  ): Promise<{ docs: Ritual[]; totalDocs: number }> {
    try {
      const response = await this.getRituals({
        search: query,
        activo: true,
        limit: 20,
        sort: "-popularidad",
      });
      return {
        docs: response.docs,
        totalDocs: response.totalDocs,
      };
    } catch (error) {
      console.error("Error searching rituals:", error);
      throw new Error("Error al buscar rituales");
    }
  }

  async incrementPopularity(id: string): Promise<Ritual> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/increment-popularity`);
      return response.data;
    } catch (error) {
      console.error("Error incrementing popularity:", error);
      throw new Error("Error al incrementar popularidad");
    }
  }

  async createRitual(
    ritual: Omit<Ritual, "id" | "createdAt" | "updatedAt">
  ): Promise<Ritual> {
    try {
      const response = await apiClient.post(this.baseUrl, ritual);
      return response.data;
    } catch (error) {
      console.error("Error creating ritual:", error);
      throw new Error("Error al crear ritual");
    }
  }

  async updateRitual(id: string, updates: Partial<Ritual>): Promise<Ritual> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating ritual:", error);
      throw new Error("Error al actualizar ritual");
    }
  }

  async deleteRitual(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting ritual:", error);
      throw new Error("Error al eliminar ritual");
    }
  }

  getCategories(): Array<{ key: string; label: string; icon: string }> {
    return [
      { key: "despertar-energia", label: "Despertar y Energía", icon: "🌅" },
      { key: "anti-estres", label: "Anti-Estrés", icon: "😌" },
      {
        key: "creatividad-enfoque",
        label: "Creatividad y Enfoque",
        icon: "💡",
      },
      {
        key: "nutricion-consciente",
        label: "Nutrición Consciente",
        icon: "🥗",
      },
      { key: "conexion-social", label: "Conexión Social", icon: "💝" },
      { key: "descanso-nocturno", label: "Descanso Nocturno", icon: "🌙" },
      { key: "productividad-suave", label: "Productividad Suave", icon: "📝" },
      { key: "autoestima", label: "Autoestima", icon: "💖" },
      { key: "activacion-corporal", label: "Activación Corporal", icon: "🏃‍♀️" },
      { key: "juego-diversion", label: "Juego y Diversión", icon: "🎈" },
      { key: "fortaleza-interior", label: "Fortaleza Interior", icon: "💪" },
      { key: "bienestar-fisico", label: "Bienestar Físico", icon: "✨" },
    ];
  }

  getMoments(): Array<{ key: string; label: string; icon: string }> {
    return [
      { key: "manana", label: "Mañana", icon: "🌅" },
      { key: "mediodia", label: "Medio día", icon: "☀️" },
      { key: "tarde", label: "Tarde", icon: "🌇" },
      { key: "noche", label: "Noche", icon: "🌙" },
      { key: "cualquier-momento", label: "Cualquier momento", icon: "🕐" },
    ];
  }

  getEnergyLevels(): Array<{ key: string; label: string; icon: string }> {
    return [
      { key: "bajo", label: "Bajo", icon: "🌱" },
      { key: "medio", label: "Medio", icon: "🌿" },
      { key: "alto", label: "Alto", icon: "🌳" },
    ];
  }

  getCategoryIcon(categoria: string): string {
    const categoryMap: { [key: string]: string } = {
      "despertar-energia": "🌅",
      "anti-estres": "😌",
      "creatividad-enfoque": "💡",
      "nutricion-consciente": "🥗",
      "conexion-social": "💝",
      "descanso-nocturno": "🌙",
      "productividad-suave": "📝",
      autoestima: "💖",
      "activacion-corporal": "🏃‍♀️",
      "juego-diversion": "🎈",
      "fortaleza-interior": "💪",
      "bienestar-fisico": "✨",
    };

    return categoryMap[categoria] || "🌸";
  }

  getMomentIcon(momento: string): string {
    const momentMap: { [key: string]: string } = {
      manana: "🌅",
      mediodia: "☀️",
      tarde: "🌇",
      noche: "🌙",
      "cualquier-momento": "🕐",
    };

    return momentMap[momento] || "🕐";
  }

  getEnergyIcon(nivel: string): string {
    const energyMap: { [key: string]: string } = {
      bajo: "🌱",
      medio: "🌿",
      alto: "🌳",
    };

    return energyMap[nivel] || "🌿";
  }

  getStepCategoryLabel(categoria: string): string {
    const categoryMap: { [key: string]: string } = {
      "mindfulness-bienestar": "Mindfulness",
      "nutricion-snacks": "Nutrición",
      "pausas-activas": "Pausas Activas",
      "productividad-enfoque": "Productividad",
      "autocuidado-belleza": "Autocuidado",
      "gestion-estres": "Anti-Estrés",
      "creatividad-juego": "Creatividad",
      "sueno-rutinas": "Descanso",
      "movimiento-fitness": "Movimiento",
      "conexion-social": "Conexión",
    };

    return categoryMap[categoria] || categoria;
  }

  async getAvailableCategories(): Promise<string[]> {
    try {
      const response = await this.getRituals({
        activo: true,
        limit: 500,
      });
      
      const categories = [...new Set(response.docs.map(ritual => ritual.categoria))];
      return categories.sort();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Error al obtener las categorías");
    }
  }
}

export const ritualService = new RitualService();
