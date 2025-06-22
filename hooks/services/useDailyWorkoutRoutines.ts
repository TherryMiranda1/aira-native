import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  dailyWorkoutRoutineService,
  DailyWorkoutRoutine,
  CreateDailyWorkoutRoutineData,
} from "@/services/api/dailyWorkoutRoutine.service";

export const useDailyWorkoutRoutines = () => {
  const { user } = useUser();
  const [routines, setRoutines] = useState<DailyWorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRoutines = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userRoutines = await dailyWorkoutRoutineService.getUserRoutines(
        user.id
      );
      setRoutines(userRoutines);
    } catch (err) {
      setError("Error al cargar las rutinas");
      console.error("Failed to load workout routines:", err);
    } finally {
      setLoading(false);
    }
  };

  const createRoutine = async (
    routineData: CreateDailyWorkoutRoutineData
  ): Promise<DailyWorkoutRoutine> => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const newRoutine = await dailyWorkoutRoutineService.createRoutine(
        user.id,
        routineData
      );
      setRoutines((prev) => [newRoutine, ...prev]);
      return newRoutine;
    } catch (err) {
      setError("Error al guardar la rutina");
      console.error("Failed to create workout routine:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateRoutine = async (
    routineId: string,
    updates: Partial<DailyWorkoutRoutine>
  ): Promise<DailyWorkoutRoutine> => {
    try {
      setSaving(true);
      setError(null);

      const updatedRoutine = await dailyWorkoutRoutineService.updateRoutine(
        routineId,
        updates
      );
      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === routineId ? updatedRoutine : routine
        )
      );
      return updatedRoutine;
    } catch (err) {
      setError("Error al actualizar la rutina");
      console.error("Failed to update workout routine:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteRoutine = async (routineId: string): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      await dailyWorkoutRoutineService.deleteRoutine(routineId);
      setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
    } catch (err) {
      setError("Error al eliminar la rutina");
      console.error("Failed to delete workout routine:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = async (
    routineId: string,
    isFavorite: boolean
  ): Promise<void> => {
    try {
      const updatedRoutine = await dailyWorkoutRoutineService.toggleFavorite(
        routineId,
        isFavorite
      );
      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === routineId ? updatedRoutine : routine
        )
      );
    } catch (err) {
      setError("Error al actualizar favoritos");
      console.error("Failed to toggle favorite:", err);
      throw err;
    }
  };

  const updateNotes = async (
    routineId: string,
    notes: string
  ): Promise<void> => {
    try {
      const updatedRoutine = await dailyWorkoutRoutineService.updateNotes(
        routineId,
        notes
      );
      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === routineId ? updatedRoutine : routine
        )
      );
    } catch (err) {
      setError("Error al actualizar las notas");
      console.error("Failed to update notes:", err);
      throw err;
    }
  };

  const searchRoutines = async (
    searchTerm: string
  ): Promise<DailyWorkoutRoutine[]> => {
    if (!user?.id) return [];

    try {
      return await dailyWorkoutRoutineService.searchRoutines(
        user.id,
        searchTerm
      );
    } catch (err) {
      console.error("Failed to search workout routines:", err);
      return [];
    }
  };

  const getRecentRoutines = (limit: number = 5): DailyWorkoutRoutine[] => {
    return routines.slice(0, limit);
  };

  const getFavoriteRoutines = (): DailyWorkoutRoutine[] => {
    return routines.filter((routine) => routine.isFavorite);
  };

  const getRoutinesByTag = (tag: string): DailyWorkoutRoutine[] => {
    return routines.filter((routine) =>
      routine.tags.some((routineTag) =>
        routineTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  };

  const updateLastAccessed = async (routineId: string): Promise<void> => {
    try {
      await dailyWorkoutRoutineService.updateLastAccessed(routineId);
    } catch (err) {
      console.warn("Failed to update last accessed time:", err);
    }
  };

  const getRoutineById = async (
    routineId: string
  ): Promise<DailyWorkoutRoutine | null> => {
    try {
      return await dailyWorkoutRoutineService.getRoutineById(routineId);
    } catch (err) {
      console.error("Failed to get workout routine by id:", err);
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadRoutines();
    }
  }, [user?.id]);

  return {
    routines,
    loading,
    error,
    saving,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    toggleFavorite,
    updateNotes,
    searchRoutines,
    getRecentRoutines,
    getFavoriteRoutines,
    getRoutinesByTag,
    updateLastAccessed,
    getRoutineById,
    refetch: loadRoutines,
  };
};
