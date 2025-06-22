import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  userFavoritesService,
  UserFavorite,
  ContentType,
  CreateUserFavoriteData,
} from "@/services/api/userFavorites.service";
import { useToast } from "@/hooks/use-toast";

export const useUserFavorites = (contentType?: ContentType) => {
  const { user } = useUser();
  const { toast } = useToast();

  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  // Cargar favoritos del usuario
  const loadFavorites = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let userFavorites: UserFavorite[];
      if (contentType) {
        userFavorites = await userFavoritesService.getUserFavoritesByType(
          user.id,
          contentType
        );
      } else {
        userFavorites = await userFavoritesService.getUserFavorites(user.id);
      }

      setFavorites(userFavorites);
    } catch (err) {
      setError("Error al cargar favoritos");
      console.error("Failed to load user favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, contentType]);

  // Verificar si un contenido específico es favorito
  const isFavorite = useCallback(
    (contentId: string, contentTypeToCheck?: ContentType): boolean => {
      if (!user?.id) return false;

      const typeToCheck = contentTypeToCheck || contentType;
      if (!typeToCheck) return false;

      return favorites.some(
        (fav) => fav.contentId === contentId && fav.contentType === typeToCheck
      );
    },
    [favorites, user?.id, contentType]
  );

  // Obtener favorito específico
  const getFavorite = useCallback(
    (
      contentId: string,
      contentTypeToCheck?: ContentType
    ): UserFavorite | null => {
      if (!user?.id) return null;

      const typeToCheck = contentTypeToCheck || contentType;
      if (!typeToCheck) return null;

      return (
        favorites.find(
          (fav) =>
            fav.contentId === contentId && fav.contentType === typeToCheck
        ) || null
      );
    },
    [favorites, user?.id, contentType]
  );

  // Agregar a favoritos
  const addToFavorites = useCallback(
    async (
      contentId: string,
      contentTypeToAdd: ContentType,
      notes?: string
    ): Promise<UserFavorite | null> => {
      if (!user?.id) {
        toast({
          title: "Inicia sesión",
          description: "Necesitas iniciar sesión para guardar favoritos.",
          variant: "error",
        });
        return null;
      }

      try {
        setToggleLoading(contentId);

        const favoriteData: CreateUserFavoriteData = {
          userId: user.id,
          contentType: contentTypeToAdd,
          contentId,
          notes,
        };

        const newFavorite = await userFavoritesService.addToFavorites(
          favoriteData
        );

        setFavorites((prev) => [newFavorite, ...prev]);

        toast({
          title: "¡Agregado a favoritos! ⭐",
          description: "Este contenido se guardó en tu lista de favoritos.",
        });

        return newFavorite;
      } catch (err) {
        toast({
          title: "Error al guardar",
          description: "No pudimos agregar este contenido a favoritos.",
          variant: "error",
        });
        console.error("Failed to add to favorites:", err);
        return null;
      } finally {
        setToggleLoading(null);
      }
    },
    [user?.id, toast]
  );

  // Quitar de favoritos
  const removeFromFavorites = useCallback(
    async (
      contentId: string,
      contentTypeToRemove?: ContentType
    ): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        setToggleLoading(contentId);

        const typeToRemove = contentTypeToRemove || contentType;
        if (!typeToRemove) return false;

        await userFavoritesService.removeFromFavoritesByContent(
          user.id,
          typeToRemove,
          contentId
        );

        setFavorites((prev) =>
          prev.filter(
            (fav) =>
              !(fav.contentId === contentId && fav.contentType === typeToRemove)
          )
        );

        toast({
          title: "Eliminado de favoritos",
          description: "Este contenido se quitó de tu lista de favoritos.",
        });

        return true;
      } catch (err) {
        toast({
          title: "Error al eliminar",
          description: "No pudimos quitar este contenido de favoritos.",
          variant: "error",
        });
        console.error("Failed to remove from favorites:", err);
        return false;
      } finally {
        setToggleLoading(null);
      }
    },
    [user?.id, contentType, toast]
  );

  // Toggle favorito (agregar o quitar)
  const toggleFavorite = useCallback(
    async (
      contentId: string,
      contentTypeToToggle: ContentType,
      notes?: string
    ): Promise<boolean> => {
      const isCurrentlyFavorite = isFavorite(contentId, contentTypeToToggle);

      if (isCurrentlyFavorite) {
        return await removeFromFavorites(contentId, contentTypeToToggle);
      } else {
        const result = await addToFavorites(
          contentId,
          contentTypeToToggle,
          notes
        );
        return result !== null;
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  // Incrementar contador de acceso
  const incrementAccessCount = useCallback(
    async (
      contentId: string,
      contentTypeToIncrement?: ContentType
    ): Promise<void> => {
      if (!user?.id) return;

      const favorite = getFavorite(contentId, contentTypeToIncrement);
      if (!favorite) return;

      try {
        const updatedFavorite = await userFavoritesService.incrementAccessCount(
          favorite.id
        );

        setFavorites((prev) =>
          prev.map((fav) => (fav.id === favorite.id ? updatedFavorite : fav))
        );
      } catch (err) {
        console.error("Failed to increment access count:", err);
      }
    },
    [user?.id, getFavorite]
  );

  // Obtener estadísticas de favoritos
  const getFavoritesStats = useCallback(async () => {
    if (!user?.id) return null;

    try {
      return await userFavoritesService.getUserFavoritesStats(user.id);
    } catch (err) {
      console.error("Failed to get favorites stats:", err);
      return null;
    }
  }, [user?.id]);

  // Buscar en favoritos
  const searchFavorites = useCallback(
    async (query: string): Promise<UserFavorite[]> => {
      if (!user?.id || !query.trim()) return [];

      try {
        return await userFavoritesService.searchUserFavorites(
          user.id,
          query.trim()
        );
      } catch (err) {
        console.error("Failed to search favorites:", err);
        return [];
      }
    },
    [user?.id]
  );

  // Obtener favoritos por categoría
  const getFavoritesByCategory = useCallback(
    (category: string): UserFavorite[] => {
      return favorites.filter((fav) => fav.category === category);
    },
    [favorites]
  );

  // Obtener favoritos más accedidos
  const getMostAccessedFavorites = useCallback(
    (limit: number = 5): UserFavorite[] => {
      return favorites
        .filter((fav) => fav.accessCount > 0)
        .sort((a, b) => b.accessCount - a.accessCount)
        .slice(0, limit);
    },
    [favorites]
  );

  // Obtener favoritos recientes
  const getRecentFavorites = useCallback(
    (limit: number = 10): UserFavorite[] => {
      return favorites.slice(0, limit);
    },
    [favorites]
  );

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Utilidades para verificar estado de carga
  const isToggling = useCallback(
    (contentId: string): boolean => {
      return toggleLoading === contentId;
    },
    [toggleLoading]
  );

  // Obtener conteo por tipo de contenido
  const getCountByType = useCallback(
    (type: ContentType): number => {
      return favorites.filter((fav) => fav.contentType === type).length;
    },
    [favorites]
  );

  return {
    // Estado
    favorites,
    loading,
    error,

    // Funciones principales
    isFavorite,
    getFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,

    // Funciones auxiliares
    incrementAccessCount,
    getFavoritesStats,
    searchFavorites,
    getFavoritesByCategory,
    getMostAccessedFavorites,
    getRecentFavorites,
    getCountByType,

    // Estado de carga
    isToggling,

    // Refrescar datos
    refresh: loadFavorites,
  };
};
