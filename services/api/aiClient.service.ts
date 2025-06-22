import { aiApiClient } from "./apiClient";
import { 
  PersonalizedPlanInput, 
  DailyMealPlanInput,
  FullExerciseRoutineInput 
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
}

export const aiClientService = new AIClientService();
