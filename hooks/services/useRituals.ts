import { useState, useEffect, useCallback, useRef } from "react";
import {
  ritualService,
  Ritual,
  RitualFilters,
} from "@/services/api/ritual.service";

interface UseRitualsOptions {
  filters?: RitualFilters;
  autoFetch?: boolean;
}

interface UseRitualsReturn {
  rituals: Ritual[];
  loading: boolean;
  error: string | null;
  categories: Array<{ key: string; label: string; icon: string }>;
  moments: Array<{ key: string; label: string; icon: string }>;
  energyLevels: Array<{ key: string; label: string; icon: string }>;

  fetchRituals: (filters?: RitualFilters) => Promise<void>;
  fetchRitualsByCategory: (categoria: string) => Promise<void>;
  fetchRitualsByMoment: (momento: string) => Promise<void>;
  fetchRitualsByEnergyLevel: (nivel: string) => Promise<void>;
  fetchRandomRituals: (count?: number) => Promise<void>;
  searchRituals: (query: string) => Promise<void>;
  incrementPopularity: (id: string) => Promise<void>;
  refreshRituals: () => Promise<void>;

  getCategoryIcon: (categoria: string) => string;
  getMomentIcon: (momento: string) => string;
  getEnergyIcon: (nivel: string) => string;
  getStepCategoryLabel: (categoria: string) => string;
}

export const useRituals = (
  options: UseRitualsOptions = {}
): UseRitualsReturn => {
  const { filters: initialFilters = {}, autoFetch = false } = options;

  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersRef = useRef(initialFilters);
  const hasInitialized = useRef(false);

  const handleError = useCallback((err: unknown) => {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";
    console.error("Error en useRituals:", err);
    setError(errorMessage);
  }, []);

  const fetchRituals = useCallback(
    async (filters: RitualFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ritualService.getRituals(filters);
        setRituals(response.docs);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchRitualsByCategory = useCallback(
    async (categoria: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ritualService.getRitualsByCategory(categoria);
        setRituals(response.docs);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchRitualsByMoment = useCallback(
    async (momento: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ritualService.getRitualsByMoment(momento);
        setRituals(response.docs);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchRitualsByEnergyLevel = useCallback(
    async (nivel: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ritualService.getRitualsByEnergyLevel(nivel);
        setRituals(response.docs);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchRandomRituals = useCallback(
    async (count: number = 5) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ritualService.getRandomRituals(count);
        setRituals(response.docs);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const searchRituals = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ritualService.searchRituals(query);
        setRituals(response.docs);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const incrementPopularity = useCallback(
    async (id: string) => {
      try {
        await ritualService.incrementPopularity(id);

        setRituals((prevRituals) =>
          prevRituals.map((ritual) =>
            ritual.id === id
              ? { ...ritual, popularidad: ritual.popularidad + 1 }
              : ritual
          )
        );
      } catch (err) {
        handleError(err);
      }
    },
    [handleError]
  );

  const refreshRituals = useCallback(async () => {
    await fetchRituals(filtersRef.current);
  }, [fetchRituals]);

  const getCategoryIcon = useCallback((categoria: string) => {
    return ritualService.getCategoryIcon(categoria);
  }, []);

  const getMomentIcon = useCallback((momento: string) => {
    return ritualService.getMomentIcon(momento);
  }, []);

  const getEnergyIcon = useCallback((nivel: string) => {
    return ritualService.getEnergyIcon(nivel);
  }, []);

  const getStepCategoryLabel = useCallback((categoria: string) => {
    return ritualService.getStepCategoryLabel(categoria);
  }, []);

  useEffect(() => {
    if (autoFetch && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchRituals(filtersRef.current);
    }
  }, [autoFetch, fetchRituals]);

  const categories = ritualService.getCategories();
  const moments = ritualService.getMoments();
  const energyLevels = ritualService.getEnergyLevels();

  return {
    rituals,
    loading,
    error,
    categories,
    moments,
    energyLevels,
    fetchRituals,
    fetchRitualsByCategory,
    fetchRitualsByMoment,
    fetchRitualsByEnergyLevel,
    fetchRandomRituals,
    searchRituals,
    incrementPopularity,
    refreshRituals,
    getCategoryIcon,
    getMomentIcon,
    getEnergyIcon,
    getStepCategoryLabel,
  };
};
