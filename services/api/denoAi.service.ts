import {
  ProvideMotivationInput,
  ExerciseSuggestionInput,
  SuggestRecipeInput,
  FullExerciseRoutineInput,
  DailyMealPlanInput,
  PersonalizedPlanInput,
  MotivationalOutput,
  ExerciseSuggestionOutput,
  SuggestRecipeOutput,
  FullExerciseRoutineOutput,
  DailyMealPlanOutput,
  PersonalizedPlanOutput,
} from "@/types/Assistant";
import { aiApiClient } from "./apiClient";

class DenoAIService {
  async provideMotivation(
    motivationInput: ProvideMotivationInput
  ): Promise<MotivationalOutput> {
    const response = await aiApiClient.post<any>(
      "/api/ai/motivational-support",
      { motivationInput }
    );

    if (!response.data) {
      throw new Error("Error al obtener apoyo motivacional");
    }

    return response.data.motivation;
  }

  async suggestExercise(
    exerciseInput: ExerciseSuggestionInput
  ): Promise<ExerciseSuggestionOutput> {
    const response = await aiApiClient.post<any>(
      "/api/ai/exercise-suggestion",
      { exerciseInput }
    );

    if (!response.data) {
      throw new Error("Error al obtener sugerencia de ejercicio");
    }

    return response.data.exercise;
  }

  async suggestRecipe(
    recipeInput: SuggestRecipeInput
  ): Promise<SuggestRecipeOutput> {
    const response = await aiApiClient.post<any>(
      "/api/ai/recipe-suggestion",
      { recipeInput }
    );

    if (!response.data) {
      throw new Error("Error al obtener sugerencia de receta");
    }

    return response.data.recipe;
  }

  async suggestFullExerciseRoutine(
    routineInput: FullExerciseRoutineInput
  ): Promise<FullExerciseRoutineOutput> {
    const response = await aiApiClient.post<any>(
      "/api/ai/full-exercise-routine",
      { routineInput }
    );

    if (!response.data) {
      throw new Error("Error al obtener rutina completa");
    }

    return response.data.routine;
  }

  async suggestDailyMealPlan(
    mealPlanInput: DailyMealPlanInput
  ): Promise<DailyMealPlanOutput> {
    const response = await aiApiClient.post<any>(
      "/api/ai/daily-meal-plan",
      { mealPlanInput }
    );

    if (!response.data) {
      throw new Error("Error al obtener plan de comidas");
    }

    return response.data.mealPlan;
  }

  async generatePersonalizedPlan(
    planInput: PersonalizedPlanInput
  ): Promise<PersonalizedPlanOutput> {
    const response = await aiApiClient.post<any>(
      "/api/ai/personalized-plan",
      { planInput }
    );

    if (!response.data) {
      throw new Error("Error al generar plan personalizado");
    }

    return response.data.plan;
  }

  async checkHealth(): Promise<boolean> {
    const response = await aiApiClient.get("/api/health");
    return response.status === 200;
  }
}

export const denoAiService = new DenoAIService(); 