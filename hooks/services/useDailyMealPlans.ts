import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  dailyMealPlanService,
  DailyMealPlan,
  CreateDailyMealPlanData,
} from "@/services/api/dailyMealPlan.service";

export const useDailyMealPlans = () => {
  const { user } = useUser();
  const [plans, setPlans] = useState<DailyMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadPlans = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userPlans = await dailyMealPlanService.getUserPlans(user.id);
      setPlans(userPlans);
    } catch (err) {
      setError("Error al cargar los planes de comidas");
      console.error("Failed to load daily meal plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (
    planData: Omit<CreateDailyMealPlanData, "userId">
  ) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const newPlan = await dailyMealPlanService.createPlan({
        ...planData,
        userId: user.id,
      });

      setPlans((prev) => [newPlan, ...prev]);
      return newPlan;
    } catch (err) {
      setError("Error al guardar el plan de comidas");
      console.error("Failed to create daily meal plan:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updatePlan = async (
    planId: string,
    updates: Partial<Pick<CreateDailyMealPlanData, "tags" | "notes">> & {
      planTitle?: string;
    }
  ) => {
    try {
      setSaving(true);
      setError(null);

      const updatedPlan = await dailyMealPlanService.updatePlan(
        planId,
        updates
      );
      setPlans((prev) =>
        prev.map((plan) => (plan.id === planId ? updatedPlan : plan))
      );
      return updatedPlan;
    } catch (err) {
      setError("Error al actualizar el plan de comidas");
      console.error("Failed to update daily meal plan:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = async (planId: string, isFavorite: boolean) => {
    try {
      const updatedPlan = await dailyMealPlanService.toggleFavorite(
        planId,
        isFavorite
      );
      setPlans((prev) =>
        prev.map((plan) => (plan.id === planId ? updatedPlan : plan))
      );
      return updatedPlan;
    } catch (err) {
      setError("Error al actualizar favorito");
      console.error("Failed to toggle favorite:", err);
      throw err;
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      setSaving(true);
      setError(null);

      await dailyMealPlanService.deletePlan(planId);
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
    } catch (err) {
      setError("Error al eliminar el plan de comidas");
      console.error("Failed to delete daily meal plan:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const getFavoritePlans = () => {
    return plans.filter((plan) => plan.isFavorite);
  };

  const getRecentPlans = (limit: number = 5) => {
    return plans.slice(0, limit);
  };

  const getPlansByDateRange = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return plans.filter((plan) => new Date(plan.createdAt) >= cutoffDate);
  };

  const searchPlans = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return plans.filter(
      (plan) =>
        plan.planTitle.toLowerCase().includes(term) ||
        plan.meals.some(
          (meal) =>
            meal.mealType.toLowerCase().includes(term) ||
            meal.options.some((option) => option.toLowerCase().includes(term))
        ) ||
        plan.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  };

  useEffect(() => {
    if (user?.id) {
      loadPlans();
    }
  }, [user?.id]);

  return {
    plans,
    loading,
    error,
    saving,
    createPlan,
    updatePlan,
    deletePlan,
    toggleFavorite,
    getFavoritePlans,
    getRecentPlans,
    getPlansByDateRange,
    searchPlans,
    refetch: loadPlans,
  };
};
