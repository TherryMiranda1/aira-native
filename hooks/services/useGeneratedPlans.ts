import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  generatedPlanService,
  GeneratedPlan,
  CreateGeneratedPlanData,
} from "@/services/api/generatedPlan.service";

export const useGeneratedPlans = () => {
  const { user } = useUser();
  const [plans, setPlans] = useState<GeneratedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadPlans = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userPlans = await generatedPlanService.getUserPlans(user.id);
      setPlans(userPlans);
    } catch (err) {
      setError("Error al cargar los planes");
      console.error("Failed to load plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (
    planData: Omit<CreateGeneratedPlanData, "userId">
  ) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const newPlan = await generatedPlanService.createPlan({
        ...planData,
        userId: user.id,
      });

      setPlans((prev) => [newPlan, ...prev]);
      return newPlan;
    } catch (err) {
      setError("Error al guardar el plan");
      console.error("Failed to create plan:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updatePlan = async (
    planId: string,
    updates: Partial<Pick<CreateGeneratedPlanData, "title" | "tags" | "notes">>
  ) => {
    try {
      setSaving(true);
      setError(null);

      const updatedPlan = await generatedPlanService.updatePlan(
        planId,
        updates
      );
      setPlans((prev) =>
        prev.map((plan) => (plan.id === planId ? updatedPlan : plan))
      );
      return updatedPlan;
    } catch (err) {
      setError("Error al actualizar el plan");
      console.error("Failed to update plan:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = async (planId: string, isFavorite: boolean) => {
    try {
      const updatedPlan = await generatedPlanService.toggleFavorite(
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

      await generatedPlanService.deletePlan(planId);
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
    } catch (err) {
      setError("Error al eliminar el plan");
      console.error("Failed to delete plan:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const getPlanById = (planId: string): GeneratedPlan | undefined => {
    return plans.find((plan) => plan.id === planId);
  };

  const getFavoritePlans = () => {
    return plans.filter((plan) => plan.isFavorite);
  };

  const getRecentPlans = (limit: number = 5) => {
    return plans.slice(0, limit);
  };

  const getPlansByType = (
    planType: "comprehensive" | "nutrition" | "workout" | "wellness"
  ) => {
    return plans.filter((plan) => plan.planType === planType);
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
    isLoading: loading,
    createPlan,
    updatePlan,
    deletePlan,
    toggleFavorite,
    getPlanById,
    getFavoritePlans,
    getRecentPlans,
    getPlansByType,
    refetch: loadPlans,
    refresh: loadPlans,
  };
};
