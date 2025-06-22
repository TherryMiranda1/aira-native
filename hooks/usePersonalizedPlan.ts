import { aiClientService } from "@/services/api/aiClient.service";
import {
  DailyMealPlanInput,
  DailyMealPlanOutput,
  ExerciseSuggestionInput,
  FullExerciseRoutineInput,
  FullExerciseRoutineOutput,
  PersonalizedPlanInput,
  PersonalizedPlanOutput,
  SuggestRecipeInput,
  SuggestRecipeOutput,
} from "@/types/Assistant";

interface APIResponse {
  success: boolean;
  plan?: PersonalizedPlanOutput;
  inputParams?: PersonalizedPlanInput;
  metadata?: {
    userId: string;
    generatedAt: string;
  };
  error?: string;
  message?: string;
}

interface DailyMealPlanAPIResponse {
  success: boolean;
  plan?: DailyMealPlanOutput;
  inputParams?: DailyMealPlanInput;
  metadata?: {
    userId: string;
    generatedAt: string;
  };
  error?: string;
  message?: string;
}

interface FullExerciseRoutineAPIResponse {
  success: boolean;
  routine?: FullExerciseRoutineOutput;
  inputParams?: FullExerciseRoutineInput;
  metadata?: {
    userId: string;
    generatedAt: string;
  };
  error?: string;
  message?: string;
}

interface RecipeSuggestionAPIResponse {
  success: boolean;
  recipe?: SuggestRecipeOutput;
  inputParams?: SuggestRecipeInput;
  metadata?: {
    userId: string;
    generatedAt: string;
  };
  error?: string;
  message?: string;
}

interface ExerciseSuggestionAPIResponse {
  success: boolean;
  exercise?: any;
  inputParams?: ExerciseSuggestionInput;
  metadata?: {
    userId: string;
    generatedAt: string;
  };
  error?: string;
  message?: string;
}

export const usePersonalizedPlan = () => {
  const generatePersonalizedPlan = async (
    input: PersonalizedPlanInput
  ): Promise<PersonalizedPlanOutput> => {
    try {
      const data: APIResponse = await aiClientService.generatePersonalizedPlan(
        input
      );

      if (!data.success || !data.plan) {
        throw new Error(
          data.message || "No se pudo generar el plan personalizado"
        );
      }

      return data.plan;
    } catch (error) {
      console.error("Error al generar plan personalizado:", error);
      throw error;
    }
  };

  const generateDailyMealPlan = async (
    input: DailyMealPlanInput
  ): Promise<DailyMealPlanOutput> => {
    try {
      const data: DailyMealPlanAPIResponse =
        await aiClientService.generateDailyMealPlan(input);

      if (!data.success || !data.plan) {
        throw new Error(
          data.message || "No se pudo generar el plan de comidas diarias"
        );
      }

      return data.plan;
    } catch (error) {
      console.error("Error al generar plan de comidas diarias:", error);
      throw error;
    }
  };

  const generateFullExerciseRoutine = async (
    input: FullExerciseRoutineInput
  ): Promise<FullExerciseRoutineOutput> => {
    try {
      const data: FullExerciseRoutineAPIResponse =
        await aiClientService.generateFullExerciseRoutine(input);

      if (!data.success || !data.routine) {
        throw new Error(
          data.message || "No se pudo generar la rutina de ejercicio"
        );
      }

      return data.routine;
    } catch (error) {
      console.error("Error al generar rutina de ejercicio:", error);
      throw error;
    }
  };

  const generateRecipeSuggestion = async (
    input: SuggestRecipeInput
  ): Promise<SuggestRecipeOutput> => {
    try {
      const data: RecipeSuggestionAPIResponse =
        await aiClientService.generateRecipeSuggestion(input);

      if (!data.success || !data.recipe) {
        throw new Error(
          data.message || "No se pudo generar la sugerencia de receta"
        );
      }

      return data.recipe;
    } catch (error) {
      console.error("Error al generar sugerencia de receta:", error);
      throw error;
    }
  };

  const generateExerciseSuggestion = async (
    input: ExerciseSuggestionInput
  ): Promise<any> => {
    try {
      const data: ExerciseSuggestionAPIResponse =
        await aiClientService.generateExerciseSuggestion(input);

      if (!data.success || !data.exercise) {
        throw new Error(
          data.message || "No se pudo generar la sugerencia de ejercicio"
        );
      }

      return data.exercise;
    } catch (error) {
      console.error("Error al generar sugerencia de ejercicio:", error);
      throw error;
    }
  };

  return {
    generatePersonalizedPlan,
    generateDailyMealPlan,
    generateFullExerciseRoutine,
    generateRecipeSuggestion,
    generateExerciseSuggestion,
  };
};
