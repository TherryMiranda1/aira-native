import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";
import type {
  PersonalizedPlanInput,
  PersonalizedPlanOutput,
} from "@/ai/flows/personalized-plan-flow";

export interface GeneratedPlanFromCMS {
  id: string;
  userId: string;
  title: string;
  planType: "comprehensive" | "nutrition" | "workout" | "wellness";
  planData: {
    planNutricional: {
      mensajeIntroductorio: string;
      desgloseMacros: {
        caloriasTotales: string;
        proteinas: string;
        carbohidratos: string;
        grasas: string;
      };
      distribucionComidas: string;
      ejemplosRecetasPlatos: {
        tipoComida: string;
        opciones: { opcion: string }[];
      }[];
      consejosPreparacionTiming: string;
    };
    programaEntrenamiento: {
      tipoEjercicio: string;
      frecuenciaVolumenSemanal: string;
      ejerciciosDetalladosPorSesion: {
        nombreSesion: string;
        descripcionSesion?: string;
        ejercicios: {
          nombreEjercicio: string;
          seriesRepeticiones: string;
          descanso: string;
          alternativaOpcional?: string;
        }[];
      }[];
      opcionesAlternativas?: string;
    };
    sugerenciasSeguimientoAjustes: {
      indicadoresProgreso: string;
      frecuenciaRevisionesModificaciones: string;
      estrategiasMotivacionAdherencia: string;
      mensajeFinalMotivador: string;
    };
  };
  inputParameters: {
    fullName?: string;
    age?: number;
    sexo?: string;
    altura?: number;
    peso?: number;
    imc?: number;
    objetivo?: string;
    plazo?: string;
    condiciones_medicas?: string;
    alergias?: string;
    preferencias_nutricionales?: string;
    habitos_alimenticios?: string;
    nivel_actividad_actual?: string;
    nivel_entrenamiento?: string;
    equipamiento_disponible?: string;
    personalPriorities?: string;
    cookingAvailability?: string;
  };
  isFromCompleteProfile: boolean;
  isFavorite: boolean;
  tags: { tag: string }[];
  notes?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedPlan {
  id: string;
  userId: string;
  title: string;
  planType: "comprehensive" | "nutrition" | "workout" | "wellness";
  planData: PersonalizedPlanOutput;
  inputParameters: PersonalizedPlanInput;
  isFromCompleteProfile: boolean;
  isFavorite: boolean;
  tags: string[];
  notes?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGeneratedPlanData {
  userId: string;
  title?: string;
  planType?: "comprehensive" | "nutrition" | "workout" | "wellness";
  planData?: PersonalizedPlanOutput;
  inputParameters: PersonalizedPlanInput;
  isFromCompleteProfile: boolean;
  tags?: string[];
  notes?: string;
}

const transformGeneratedPlan = (
  cmsPlan: GeneratedPlanFromCMS
): GeneratedPlan => {
  // Transformar ejemplos de recetas
  const ejemplosRecetasPlatos =
    cmsPlan.planData.planNutricional.ejemplosRecetasPlatos.map((ejemplo) => ({
      tipoComida: ejemplo.tipoComida,
      opciones: ejemplo.opciones.map((opt) => opt.opcion),
    }));

  return {
    id: cmsPlan.id,
    userId: cmsPlan.userId,
    title: cmsPlan.title,
    planType: cmsPlan.planType,
    planData: {
      planNutricional: {
        mensajeIntroductorio:
          cmsPlan.planData.planNutricional.mensajeIntroductorio,
        desgloseMacros: cmsPlan.planData.planNutricional.desgloseMacros,
        distribucionComidas:
          cmsPlan.planData.planNutricional.distribucionComidas,
        ejemplosRecetasPlatos,
        consejosPreparacionTiming:
          cmsPlan.planData.planNutricional.consejosPreparacionTiming,
      },
      programaEntrenamiento: cmsPlan.planData.programaEntrenamiento,
      sugerenciasSeguimientoAjustes:
        cmsPlan.planData.sugerenciasSeguimientoAjustes,
    },
    inputParameters: cmsPlan.inputParameters as PersonalizedPlanInput,
    isFromCompleteProfile: cmsPlan.isFromCompleteProfile,
    isFavorite: cmsPlan.isFavorite,
    tags: cmsPlan.tags.map((tag) => tag.tag),
    notes: cmsPlan.notes,
    lastAccessedAt: cmsPlan.lastAccessedAt,
    createdAt: cmsPlan.createdAt,
    updatedAt: cmsPlan.updatedAt,
  };
};

const transformCreateData = (data: CreateGeneratedPlanData): any => {
  console.log("data", data);
  const transformed: any = {
    userId: data.userId,
    title: data.title,
    planType: data.planType || "comprehensive",
    isFromCompleteProfile: data.isFromCompleteProfile,
    inputParameters: data.inputParameters,
    planData: {
      planNutricional: {
        mensajeIntroductorio:
          data.planData?.planNutricional.mensajeIntroductorio,
        desgloseMacros: data.planData?.planNutricional.desgloseMacros,
        distribucionComidas: data.planData?.planNutricional.distribucionComidas,
        ejemplosRecetasPlatos:
          data.planData?.planNutricional.ejemplosRecetasPlatos.map(
            (ejemplo) => ({
              tipoComida: ejemplo.tipoComida,
              opciones: ejemplo.opciones.map((opcion) => ({ opcion })),
            })
          ),
        consejosPreparacionTiming:
          data.planData?.planNutricional.consejosPreparacionTiming,
      },
      programaEntrenamiento: data.planData?.programaEntrenamiento,
      sugerenciasSeguimientoAjustes:
        data.planData?.sugerenciasSeguimientoAjustes,
    },
  };

  const tags =
    data.tags && data.tags.length > 0 ? data.tags.map((tag) => ({ tag })) : [];
  const notes = data.notes && data.notes.trim() ? data.notes : undefined;

  return {
    ...transformed,
    tags,
    notes,
  };
};

export const generatedPlanService = {
  async getUserPlans(userId: string): Promise<GeneratedPlan[]> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: "50",
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`/api/generated-plans${queryString}`);

      return response.data.docs.map(transformGeneratedPlan);
    } catch (error) {
      console.error(`Failed to fetch plans for userId ${userId}:`, error);
      return [];
    }
  },

  async getPlanById(planId: string): Promise<GeneratedPlan | null> {
    try {
      const response = await apiClient.get(`/api/generated-plans/${planId}`);

      return transformGeneratedPlan(response.data);
    } catch (error) {
      console.error(`Failed to fetch plan ${planId}:`, error);
      return null;
    }
  },

  async createPlan(planData: CreateGeneratedPlanData): Promise<GeneratedPlan> {
    try {
      console.log("planData", planData);

      const transformedData = transformCreateData(planData);

      const response = await apiClient.post(`/api/generated-plans`, transformedData);

      return transformGeneratedPlan(response.data.doc);
    } catch (error) {
      console.error("Failed to create plan:", error);
      throw error;
    }
  },

  async updatePlan(
    planId: string,
    updates: Partial<Pick<CreateGeneratedPlanData, "title" | "tags" | "notes">>
  ): Promise<GeneratedPlan> {
    try {
      const transformedData: any = {};

      if (updates.title) transformedData.title = updates.title;
      if (updates.notes !== undefined) transformedData.notes = updates.notes;
      if (updates.tags) {
        transformedData.tags = updates.tags.map((tag) => ({ tag }));
      }

      const response = await apiClient.patch(`/api/generated-plans/${planId}`, transformedData);

      return transformGeneratedPlan(response.data);
    } catch (error) {
      console.error("Failed to update plan:", error);
      throw error;
    }
  },

  async toggleFavorite(
    planId: string,
    isFavorite: boolean
  ): Promise<GeneratedPlan> {
    try {
      const response = await apiClient.patch(`/api/generated-plans/${planId}`, { isFavorite });

      return transformGeneratedPlan(response.data);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      throw error;
    }
  },

  async deletePlan(planId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/generated-plans/${planId}`);
    } catch (error) {
      console.error("Failed to delete plan:", error);
      throw error;
    }
  },

  async getFavoritePlans(userId: string): Promise<GeneratedPlan[]> {
    try {
      const queryObj = {
        where: {
          and: [
            { userId: { equals: userId } },
            { isFavorite: { equals: true } },
          ],
        },
        limit: "20",
        sort: "-updatedAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`/api/generated-plans${queryString}`);

      return response.data.docs.map(transformGeneratedPlan);
    } catch (error) {
      console.error(
        `Failed to fetch favorite plans for userId ${userId}:`,
        error
      );
      return [];
    }
  },

  async getRecentPlans(
    userId: string,
    limit: number = 5
  ): Promise<GeneratedPlan[]> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: limit.toString(),
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`/api/generated-plans${queryString}`);

      return response.data.docs.map(transformGeneratedPlan);
    } catch (error) {
      console.error(
        `Failed to fetch recent plans for userId ${userId}:`,
        error
      );
      return [];
    }
  },
};
