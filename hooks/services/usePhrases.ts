import { useState, useEffect, useCallback, useRef } from "react";
import {
  phraseService,
  Phrase,
  PhraseFilters,
} from "@/services/api/phrase.service";
import { useUser } from "@clerk/clerk-expo";

interface UsePhrasesOptions {
  filters?: PhraseFilters;
  autoFetch?: boolean;
}

interface UsePhrasesReturn {
  phrases: Phrase[];
  loading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string | null;

  // Funciones de fetch
  fetchPhrases: (filters?: PhraseFilters) => Promise<void>;
  fetchPhrasesByCategory: (categoria: string) => Promise<void>;
  fetchPhrasesByMoment: (
    momento: "manana" | "dia" | "tarde" | "noche" | "cualquier-momento"
  ) => Promise<void>;
  fetchPhrasesByEmotion: (estado: string) => Promise<void>;
  fetchPopularPhrases: (limit?: number) => Promise<void>;
  fetchRandomPhrases: (limit?: number) => Promise<void>;
  searchPhrases: (query: string) => Promise<void>;

  // Funciones de filtrado
  setCategory: (categoria: string | null) => void;
  clearFilters: () => void;

  // Utilidades
  getPhrasesByCategory: (categoria: string) => Phrase[];
  getRandomPhrase: () => Phrase | null;
  getCategoryIcon: (categoria: string) => string;
  getMomentLabel: (momento: string) => string;
  getEmotionLabel: (estado: string) => string;
}

export function usePhrases(options: UsePhrasesOptions = {}): UsePhrasesReturn {
  const { filters = {}, autoFetch = true } = options;
  const { user } = useUser();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    filters.categoria || null
  );

  const filtersRef = useRef(filters);
  const hasInitialized = useRef(false);

  // Actualizar ref cuando cambien los filtros
  useEffect(() => {
    filtersRef.current = filters;
  }, [JSON.stringify(filters)]);

  const fetchPhrases = useCallback(async (customFilters?: PhraseFilters) => {
    setLoading(true);
    setError(null);

    try {
      const finalFilters = { ...filtersRef.current, ...customFilters };
      const response = await phraseService.getPhrases(finalFilters);
      setPhrases(response.docs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las frases"
      );
      setPhrases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPhrasesByCategory = useCallback(async (categoria: string) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(categoria);

    try {
      const categoryPhrases = await phraseService.getPhrasesByCategory(
        categoria
      );
      setPhrases(categoryPhrases);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar las frases de la categoría"
      );
      setPhrases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPhrasesByMoment = useCallback(
    async (
      momento: "manana" | "dia" | "tarde" | "noche" | "cualquier-momento"
    ) => {
      setLoading(true);
      setError(null);
      setSelectedCategory(null);

      try {
        const momentPhrases = await phraseService.getPhrasesByMoment(momento);
        setPhrases(momentPhrases);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar las frases por momento"
        );
        setPhrases([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchPhrasesByEmotion = useCallback(async (estado: string) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);

    try {
      const emotionPhrases = await phraseService.getPhrasesByEmotion(estado);
      setPhrases(emotionPhrases);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar las frases por estado emocional"
      );
      setPhrases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularPhrases = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);

    try {
      const popularPhrases = await phraseService.getPopularPhrases(limit);
      setPhrases(popularPhrases);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar las frases populares"
      );
      setPhrases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandomPhrases = useCallback(async (limit = 5) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);

    try {
      const randomPhrases = await phraseService.getRandomPhrases(limit);
      setPhrases(randomPhrases);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar frases aleatorias"
      );
      setPhrases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPhrases = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);

    try {
      const searchResults = await phraseService.searchPhrases(query);
      setPhrases(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar frases");
      setPhrases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const availableCategories = await phraseService.getAvailableCategories();
      setCategories(availableCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const setCategory = useCallback(
    (categoria: string | null) => {
      setSelectedCategory(categoria);
      if (categoria) {
        fetchPhrasesByCategory(categoria);
      } else {
        fetchPhrases();
      }
    },
    [fetchPhrases, fetchPhrasesByCategory]
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    fetchPhrases({ activo: true });
  }, [fetchPhrases]);

  // Funciones utilitarias que no cambian
  const getPhrasesByCategory = useCallback(
    (categoria: string): Phrase[] => {
      return phrases.filter((phrase) => phrase.categoria === categoria);
    },
    [phrases]
  );

  const getRandomPhrase = useCallback((): Phrase | null => {
    if (phrases.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  }, [phrases]);

  const getCategoryIcon = useCallback((categoria: string): string => {
    return phraseService.getCategoryIcon(categoria);
  }, []);

  const getMomentLabel = useCallback((momento: string): string => {
    return phraseService.getMomentLabel(momento);
  }, []);

  const getEmotionLabel = useCallback((estado: string): string => {
    return phraseService.getEmotionLabel(estado);
  }, []);

  // Efecto inicial optimizado - solo se ejecuta una vez
  useEffect(() => {
    if (autoFetch && !hasInitialized.current && user?.id) {
      hasInitialized.current = true;
      fetchPhrases();
      fetchCategories();
    }
  }, [autoFetch, fetchPhrases, fetchCategories, user?.id]);

  return {
    phrases,
    loading,
    error,
    categories,
    selectedCategory,

    // Funciones de fetch
    fetchPhrases,
    fetchPhrasesByCategory,
    fetchPhrasesByMoment,
    fetchPhrasesByEmotion,
    fetchPopularPhrases,
    fetchRandomPhrases,
    searchPhrases,

    // Funciones de filtrado
    setCategory,
    clearFilters,

    // Utilidades
    getPhrasesByCategory,
    getRandomPhrase,
    getCategoryIcon,
    getMomentLabel,
    getEmotionLabel,
  };
}
