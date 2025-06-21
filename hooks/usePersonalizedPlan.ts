import { aiClientService } from "@/services/api/aiClient.service";
import {
  PersonalizedPlanInput,
  PersonalizedPlanOutput,
} from "@/services/api/generatedPlan.service";

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

  const checkServiceStatus = async () => {
    try {
      const response = await aiClientService.checkServiceStatus();
      return { available: true, data: response };
    } catch (error) {
      console.error("Error verificando estado del servicio:", error);
      return { available: false, reason: "Error de conexión" };
    }
  };

  return {
    generatePersonalizedPlan,
    checkServiceStatus,
  };
};
