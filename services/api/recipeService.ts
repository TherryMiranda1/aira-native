import { API_CONFIG } from "./config";

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
  /**
   * Fetches recipes from the CMS with pagination
   */
  async getRecipes(params: PaginationParams = {}): Promise<{
    recipes: Recipe[];
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
        API_CONFIG.ENDPOINTS.RECIPES
      }?${queryParams.toString()}&where[tipo_plato][equals]=${
        where.tipo_plato
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching recipes: ${response.status}`);
      }

      const data: PaginatedResponse<RecipeFromCMS> = await response.json();
      const recipes = (data.docs || []).map(transformRecipe);

      // Return both the recipes and pagination info
      const { docs, ...paginationInfo } = data;
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
   * Fetches all recipes from the CMS (legacy method, use getRecipes instead)
   * @deprecated Use getRecipes instead
   */
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const { recipes } = await this.getRecipes({ limit: 100 });
      return recipes;
    } catch (error) {
      console.error("Failed to fetch all recipes:", error);
      return [];
    }
  },

  /**
   * Fetches a single recipe by ID
   */
  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECIPES}/${id}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching recipe: ${response.status}`);
      }

      const recipe: RecipeFromCMS = await response.json();
      return transformRecipe(recipe);
    } catch (error) {
      console.error(`Failed to fetch recipe with ID ${id}:`, error);
      return null;
    }
  },
};
