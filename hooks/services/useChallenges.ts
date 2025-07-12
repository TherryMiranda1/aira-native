import { useState, useEffect, useCallback, useRef } from "react";
import {
  challengeService,
  Challenge,
  ChallengeFilters,
} from "@/services/api/challenge.service";
import { useUser } from "@clerk/clerk-expo";

interface UseChallengesOptions {
  filters?: ChallengeFilters;
  autoFetch?: boolean;
}

interface UseChallengesReturn {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string | null;

  // Funciones de fetch
  fetchChallenges: (filters?: ChallengeFilters) => Promise<void>;
  fetchChallengesByCategory: (categoria: string) => Promise<void>;
  fetchPopularChallenges: (limit?: number) => Promise<void>;
  fetchRandomChallenges: (limit?: number) => Promise<void>;
  searchChallenges: (query: string) => Promise<void>;
  getRandomChallenge: () => Challenge | null;
  // Funciones de filtrado
  setCategory: (categoria: string | null) => void;
  clearFilters: () => void;

  // Utilidades
  getChallengesByCategory: (categoria: string) => Challenge[];
  getCategoryIcon: (categoria: string) => string;
  getDifficultyLabel: (dificultad: string) => string;
}

export function useChallenges(
  options: UseChallengesOptions = {}
): UseChallengesReturn {
  const { user } = useUser();
  const { filters = {}, autoFetch = true } = options;

  const [challenges, setChallenges] = useState<Challenge[]>([]);
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

  const fetchChallenges = useCallback(
    async (customFilters?: ChallengeFilters) => {
      setLoading(true);
      setError(null);

      try {
        const finalFilters = { ...filtersRef.current, ...customFilters };
        const response = await challengeService.getChallenges(finalFilters);
        setChallenges(response.docs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los mini retos"
        );
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchChallengesByCategory = useCallback(async (categoria: string) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(categoria);

    try {
      const categoryChangelles = await challengeService.getChallengesByCategory(
        categoria
      );
      setChallenges(categoryChangelles);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los mini retos de la categoría"
      );
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularChallenges = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);

    try {
      const popularChallenges = await challengeService.getPopularChallenges(
        limit
      );
      setChallenges(popularChallenges);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los mini retos populares"
      );
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandomChallenges = useCallback(async (limit = 5) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);

    try {
      const randomChallenges = await challengeService.getRandomChallenges(
        limit
      );
      setChallenges(randomChallenges);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar mini retos aleatorios"
      );
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchChallenges = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);

    try {
      const searchResults = await challengeService.searchChallenges(query);
      setChallenges(searchResults);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al buscar mini retos"
      );
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const availableCategories =
        await challengeService.getAvailableCategories();
      setCategories(availableCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const setCategory = useCallback(
    (categoria: string | null) => {
      setSelectedCategory(categoria);
      if (categoria) {
        fetchChallengesByCategory(categoria);
      } else {
        fetchChallenges();
      }
    },
    [fetchChallenges, fetchChallengesByCategory]
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    fetchChallenges({ activo: true });
  }, [fetchChallenges]);

  // Funciones utilitarias
  const getChallengesByCategory = useCallback(
    (categoria: string): Challenge[] => {
      return challenges.filter(
        (challenge) => challenge.categoria === categoria
      );
    },
    [challenges]
  );

  const getRandomChallenge = useCallback((): Challenge | null => {
    if (challenges.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  }, [challenges]);

  const getCategoryIcon = useCallback((categoria: string): string => {
    return challengeService.getCategoryIcon(categoria);
  }, []);

  const getDifficultyLabel = useCallback((dificultad: string): string => {
    return challengeService.getDifficultyLabel(dificultad);
  }, []);

  // Efecto inicial optimizado - solo se ejecuta una vez
  useEffect(() => {
    if (autoFetch && !hasInitialized.current && user?.id) {
      hasInitialized.current = true;
      fetchChallenges();
      fetchCategories();
    }
  }, [autoFetch, fetchChallenges, fetchCategories, user?.id]);

  return {
    challenges,
    loading,
    error,
    categories,
    selectedCategory,

    // Funciones de fetch
    fetchChallenges,
    fetchChallengesByCategory,
    fetchPopularChallenges,
    fetchRandomChallenges,
    searchChallenges,
    getRandomChallenge,

    // Funciones de filtrado
    setCategory,
    clearFilters,

    // Utilidades
    getChallengesByCategory,
    getCategoryIcon,
    getDifficultyLabel,
  };
}
