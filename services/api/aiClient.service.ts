import { PersonalizedPlanInput } from "@/ai/flows/personalized-plan-flow";
import { apiClient } from "./apiClient";

class AIClientService {
  // Método específico para generar planes personalizados
  async generatePersonalizedPlan(
    planInput: PersonalizedPlanInput
  ): Promise<any> {
    const URL = `/api/ai/personalized-plan`;
    const response = await apiClient.post(URL, { planInput });

    return response.data;
  }

  // Método para verificar el estado del servicio
  async checkServiceStatus(): Promise<any> {
    return apiClient.get(`/api/ai/personalized-plan`);
  }
}

export const aiClientService = new AIClientService();
