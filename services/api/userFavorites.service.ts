import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";
import { API_CONFIG } from "./config";

export type ContentType =
  | "articles"
  | "challenges"
  | "exercises"
  | "phrases"
  | "recipes"
  | "rituals";

export interface UserFavorite {
  id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  favoriteTitle: string;
  tags: { tag: string }[];
  category?: string;
  metadata: {
    title?: string;
    description?: string;
    imageUrl?: string;
    duration?: string;
    difficulty?: string;
  };
  lastAccessedAt?: string;
  accessCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserFavoriteData {
  userId: string;
  contentType: ContentType;
  contentId: string;
  notes?: string;
}

export interface UpdateUserFavoriteData {
  notes?: string;
  lastAccessedAt?: string;
  accessCount?: number;
}

interface UserFavoriteFromCMS {
  id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  favoriteTitle: string;
  tags: { tag: string; id?: string }[];
  category?: string;
  metadata: {
    title?: string;
    description?: string;
    imageUrl?: string;
    duration?: string;
    difficulty?: string;
  };
  lastAccessedAt?: string;
  accessCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const transformUserFavorite = (
  cmsFavorite: UserFavoriteFromCMS
): UserFavorite => {
  return {
    id: cmsFavorite.id,
    userId: cmsFavorite.userId,
    contentType: cmsFavorite.contentType,
    contentId: cmsFavorite.contentId,
    favoriteTitle: cmsFavorite.favoriteTitle,
    tags: cmsFavorite.tags?.map((tag) => ({ tag: tag.tag })) || [],
    category: cmsFavorite.category,
    metadata: cmsFavorite.metadata,
    lastAccessedAt: cmsFavorite.lastAccessedAt,
    accessCount: cmsFavorite.accessCount,
    notes: cmsFavorite.notes,
    createdAt: cmsFavorite.createdAt,
    updatedAt: cmsFavorite.updatedAt,
  };
};

const transformCreateData = (data: CreateUserFavoriteData): any => {
  return {
    userId: data.userId,
    contentType: data.contentType,
    contentId: data.contentId,
    notes: data.notes,
  };
};

export const userFavoritesService = {
  // Obtener todos los favoritos de un usuario
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: "100",
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.USER_FAVORITES}${queryString}`
      );

      return response.data.docs.map(transformUserFavorite);
    } catch (error) {
      console.error(
        `Failed to fetch user favorites for userId ${userId}:`,
        error
      );
      return [];
    }
  },

  // Obtener favoritos por tipo de contenido
  async getUserFavoritesByType(
    userId: string,
    contentType: ContentType
  ): Promise<UserFavorite[]> {
    try {
      const queryObj = {
        where: {
          and: [
            { userId: { equals: userId } },
            { contentType: { equals: contentType } },
          ],
        },
        limit: "100",
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.USER_FAVORITES}${queryString}`
      );

      return response.data.docs.map(transformUserFavorite);
    } catch (error) {
      console.error(
        `Failed to fetch ${contentType} favorites for userId ${userId}:`,
        error
      );
      return [];
    }
  },

  // Verificar si un contenido está marcado como favorito
  async isFavorite(
    userId: string,
    contentType: ContentType,
    contentId: string
  ): Promise<UserFavorite | null> {
    try {
      const queryObj = {
        where: {
          and: [
            { userId: { equals: userId } },
            { contentType: { equals: contentType } },
            { contentId: { equals: contentId } },
          ],
        },
        limit: "1",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.USER_FAVORITES}${queryString}`
      );

      if (response.data.docs.length > 0) {
        return transformUserFavorite(response.data.docs[0]);
      }

      return null;
    } catch (error) {
      console.error(`Failed to check if content is favorite:`, error);
      return null;
    }
  },

  // Agregar a favoritos
  async addToFavorites(
    favoriteData: CreateUserFavoriteData
  ): Promise<UserFavorite> {
    try {
      const transformedData = transformCreateData(favoriteData);
      const response = await apiClient.post(
        "/api/user-favorites",
        transformedData
      );

      return transformUserFavorite(response.data.doc);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    }
  },

  // Quitar de favoritos
  async removeFromFavorites(favoriteId: string): Promise<void> {
    try {
      await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.USER_FAVORITES}/${favoriteId}`
      );
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      throw error;
    }
  },

  // Quitar de favoritos por contenido
  async removeFromFavoritesByContent(
    userId: string,
    contentType: ContentType,
    contentId: string
  ): Promise<void> {
    try {
      const favorite = await this.isFavorite(userId, contentType, contentId);
      if (favorite) {
        await this.removeFromFavorites(favorite.id);
      }
    } catch (error) {
      console.error("Failed to remove from favorites by content:", error);
      throw error;
    }
  },

  // Actualizar favorito (notas, acceso, etc.)
  async updateFavorite(
    favoriteId: string,
    updates: UpdateUserFavoriteData
  ): Promise<UserFavorite> {
    try {
      const response = await apiClient.patch(
        `${API_CONFIG.ENDPOINTS.USER_FAVORITES}/${favoriteId}`,
        updates
      );
      return transformUserFavorite(response.data);
    } catch (error) {
      console.error("Failed to update favorite:", error);
      throw error;
    }
  },

  // Incrementar contador de acceso
  async incrementAccessCount(favoriteId: string): Promise<UserFavorite> {
    try {
      const response = await apiClient.patch(
        `${API_CONFIG.ENDPOINTS.USER_FAVORITES}/${favoriteId}`,
        {
          lastAccessedAt: new Date().toISOString(),
          $inc: { accessCount: 1 },
        }
      );
      return transformUserFavorite(response.data);
    } catch (error) {
      console.error("Failed to increment access count:", error);
      throw error;
    }
  },

  // Obtener estadísticas de favoritos del usuario
  async getUserFavoritesStats(userId: string): Promise<{
    total: number;
    byType: Record<ContentType, number>;
    mostAccessed: UserFavorite[];
    recent: UserFavorite[];
  }> {
    try {
      const favorites = await this.getUserFavorites(userId);

      const byType = favorites.reduce((acc, fav) => {
        acc[fav.contentType] = (acc[fav.contentType] || 0) + 1;
        return acc;
      }, {} as Record<ContentType, number>);

      const mostAccessed = favorites
        .filter((fav) => fav.accessCount > 0)
        .sort((a, b) => b.accessCount - a.accessCount)
        .slice(0, 5);

      const recent = favorites.slice(0, 10);

      return {
        total: favorites.length,
        byType,
        mostAccessed,
        recent,
      };
    } catch (error) {
      console.error("Failed to get favorites stats:", error);
      return {
        total: 0,
        byType: {} as Record<ContentType, number>,
        mostAccessed: [],
        recent: [],
      };
    }
  },

  // Buscar en favoritos
  async searchUserFavorites(
    userId: string,
    query: string
  ): Promise<UserFavorite[]> {
    try {
      const queryObj = {
        where: {
          and: [
            { userId: { equals: userId } },
            {
              or: [
                { favoriteTitle: { contains: query } },
                { "metadata.title": { contains: query } },
                { "metadata.description": { contains: query } },
                { category: { contains: query } },
              ],
            },
          ],
        },
        limit: "50",
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });
      const response = await apiClient.get(`/api/user-favorites${queryString}`);

      return response.data.docs.map(transformUserFavorite);
    } catch (error) {
      console.error("Failed to search favorites:", error);
      return [];
    }
  },
};
