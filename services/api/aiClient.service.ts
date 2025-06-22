import { aiApiClient } from "./apiClient";
import { 
  PersonalizedPlanInput, 
  DailyMealPlanInput,
  FullExerciseRoutineInput,
  SuggestRecipeInput,
  ExerciseSuggestionInput,
  ProvideMotivationInput
} from "@/types/Assistant";

class AIClientService {
  // Método específico para generar planes personalizados
  async generatePersonalizedPlan(
    planInput: PersonalizedPlanInput
  ): Promise<any> {
    const URL = `/api/ai/personalized-plan`;
    const response = await aiApiClient.post(URL, { planInput });

    return response.data;
  }

  async generateDailyMealPlan(planInput: DailyMealPlanInput): Promise<any> {
    const URL = `/api/ai/daily-meal-plan`;
    const response = await aiApiClient.post(URL, { planInput });

    return response.data;
  }

  async generateFullExerciseRoutine(routineInput: FullExerciseRoutineInput): Promise<any> {
    const URL = `/api/ai/full-exercise-routine`;
    const response = await aiApiClient.post(URL, { routineInput });

    return response.data;
  }

  async generateRecipeSuggestion(recipeInput: SuggestRecipeInput): Promise<any> {
    const URL = `/api/ai/recipe-suggestion`;
    const response = await aiApiClient.post(URL, { recipeInput });

    return response.data;
  }

  async generateExerciseSuggestion(exerciseInput: ExerciseSuggestionInput): Promise<any> {
    const URL = `/api/ai/exercise-suggestion`;
    const response = await aiApiClient.post(URL, { exerciseInput });

    return response.data;
  }

  async generateMotivationalSupport(motivationInput: ProvideMotivationInput): Promise<any> {
    const URL = `/api/ai/motivational-support`;
    const response = await aiApiClient.post(URL, { motivationInput });

    return response.data;
  }
}

export const aiClientService = new AIClientService();
