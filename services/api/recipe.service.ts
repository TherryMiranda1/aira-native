import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

/**
 * Interface for recipe data from the CMS
 */
export interface RecipeFromCMS {
  id: string;
  titulo: string;
  ingrediente_principal: string;
  descripcion_corta?: string;
  preparacion: {
    paso: string;
  }[];
  ingredientes: {
    item: string;
    cantidad: string;
    notas?: string;
  }[];
  calorias: string;
  tiempo_preparacion: string;
  dificultad: string;
  tipo_plato?: string;
  media?: {
    imagen?: {
      url: string;
    };
    video_url?: string;
  };
  tags_busqueda?: {
    tag: string;
  }[];
  notas_adicionales?: any;
}

/**
 * Interface for recipe data used in the application
 */
export interface Recipe {
  id: string;
  titulo: string;
  ingrediente_principal: string;
  preparacion: string;
  ingredientes: {
    item: string;
    cantidad: string;
  }[];
  calorias: string;
  tiempo_preparacion: string;
  dificultad: string;
  categoria?: string;
  imagen?: string;
  video_url?: string;
}

/**
 * Transforms a CMS recipe to the application recipe format
 */
const transformRecipe = (cmsRecipe: RecipeFromCMS): Recipe => {
  // Convert preparation steps array to a single string with numbered steps
  const preparationText = cmsRecipe.preparacion
    .map((step, index) => `${index + 1}. ${step.paso}`)
    .join("\n\n");

  // Map the tipo_plato to categoria if available
  const categoria = cmsRecipe.tipo_plato
    ? mapTipoPlato(cmsRecipe.tipo_plato)
    : undefined;

  return {
    id: cmsRecipe.id,
    titulo: cmsRecipe.titulo,
    ingrediente_principal: cmsRecipe.ingrediente_principal,
    preparacion: preparationText,
    ingredientes: cmsRecipe.ingredientes.map((ing) => ({
      item: ing.item,
      cantidad: ing.cantidad,
    })),
    calorias: cmsRecipe.calorias,
    tiempo_preparacion: cmsRecipe.tiempo_preparacion,
    dificultad: cmsRecipe.dificultad,
    categoria,
    imagen: cmsRecipe.media?.imagen?.url,
    video_url: cmsRecipe.media?.video_url,
  };
};

/**
 * Maps tipo_plato values to categoria values
 */
const mapTipoPlato = (tipoPlato: string): string => {
  const mapping: Record<string, string> = {
    desayuno: "desayunos",
    almuerzo: "almuerzos",
    cena: "cenas",
    merienda: "meriendas",
    postre: "postres",
    bebida: "bebidas",
  };

  return mapping[tipoPlato] || tipoPlato;
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
 * Pagination parameters for recipe requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}

/**
 * Recipe service for fetching recipe data from the CMS
 */
export const recipeService = {
  async getRecipes(params: PaginationParams = {}): Promise<{
    recipes: Recipe[];
    pagination: Omit<PaginatedResponse<any>, "docs">;
  }> {
    try {
      const { page = 1, limit = 9, sort = "-createdAt", where = {} } = params;

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
      };

      if (Object.keys(where).length > 0) {
        queryObj.where = where;
      }

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.RECIPES}${queryString}`
      );

      const recipes = (response.data.docs || []).map(transformRecipe);

      const { docs, ...paginationInfo } = response.data;
      return {
        recipes,
        pagination: paginationInfo,
      };
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      throw error;
    }
  },

  /**
   * Fetches a single recipe by ID
   */
  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.RECIPES}/${id}`
      );

      return transformRecipe(response.data);
    } catch (error) {
      console.error(`Failed to fetch recipe with ID ${id}:`, error);
      return null;
    }
  },
};
