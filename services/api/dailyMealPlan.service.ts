import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

type DailyMealPlanInput = {
  userInput: string;
  history?:
    | {
        role: "user" | "model";
        text: string;
      }[]
    | undefined;
  dietaryPreferences?: string | undefined;
  allergies?: string | undefined;
  dislikedFoods?: string | undefined;
  mainGoal?: string | undefined;
};

type DailyMealPlanOutput = {
  planTitle: string;
  meals: {
    options: string[];
    mealType: string;
  }[];
  suggestedNextActions?:
    | {
        label: string;
        actionPrompt: string;
      }[]
    | undefined;
  introduction?: string | undefined;
  generalTips?: string | undefined;
};

export interface DailyMealPlanFromCMS {
  id: string;
  userId: string;
  planTitle: string;
  introduction?: string;
  meals: {
    mealType: string;
    options: { option: string }[];
  }[];
  generalTips?: string;
  suggestedNextActions?: {
    label: string;
    actionPrompt: string;
  }[];
  inputParameters: {
    userInput?: string;
    dietaryPreferences?: string;
    allergies?: string;
    dislikedFoods?: string;
    mainGoal?: string;
  };
  isFavorite: boolean;
  tags: { tag: string }[];
  notes?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMealPlan {
  id: string;
  userId: string;
  planTitle: string;
  introduction?: string;
  meals: {
    mealType: string;
    options: string[];
  }[];
  generalTips?: string;
  suggestedNextActions?: {
    label: string;
    actionPrompt: string;
  }[];
  inputParameters: DailyMealPlanInput;
  isFavorite: boolean;
  tags: string[];
  notes?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyMealPlanData {
  userId: string;
  planTitle?: string;
  planData: DailyMealPlanOutput;
  inputParameters: DailyMealPlanInput;
  tags?: string[];
  notes?: string;
}

const transformDailyMealPlan = (
  cmsPlan: DailyMealPlanFromCMS
): DailyMealPlan => {
  const meals = cmsPlan.meals.map((meal) => ({
    mealType: meal.mealType,
    options: meal.options.map((opt) => opt.option),
  }));

  return {
    id: cmsPlan.id,
    userId: cmsPlan.userId,
    planTitle: cmsPlan.planTitle,
    introduction: cmsPlan.introduction,
    meals,
    generalTips: cmsPlan.generalTips,
    suggestedNextActions: cmsPlan.suggestedNextActions,
    inputParameters: cmsPlan.inputParameters as DailyMealPlanInput,
    isFavorite: cmsPlan.isFavorite,
    tags: cmsPlan.tags.map((tag) => tag.tag),
    notes: cmsPlan.notes,
    lastAccessedAt: cmsPlan.lastAccessedAt,
    createdAt: cmsPlan.createdAt,
    updatedAt: cmsPlan.updatedAt,
  };
};

const transformCreateData = (data: CreateDailyMealPlanData): any => {
  const transformed: any = {
    userId: data.userId,
    planTitle: data.planTitle || data.planData.planTitle,
    introduction: data.planData.introduction,
    meals: data.planData.meals.map((meal) => ({
      mealType: meal.mealType,
      options: meal.options.map((option) => ({ option })),
    })),
    generalTips: data.planData.generalTips,
    suggestedNextActions: data.planData.suggestedNextActions,
    inputParameters: data.inputParameters,
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

export const dailyMealPlanService = {
  async getUserPlans(userId: string): Promise<DailyMealPlan[]> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: "50",
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(
        `/api/daily-meal-plans${queryString}`
      );

      return response.data.docs.map(transformDailyMealPlan);
    } catch (error) {
      console.error(
        `Failed to fetch daily meal plans for userId ${userId}:`,
        error
      );
      return [];
    }
  },

  async getPlanById(planId: string): Promise<DailyMealPlan | null> {
    try {
      const response = await apiClient.get(`/api/daily-meal-plans/${planId}`);

      return transformDailyMealPlan(response.data);
    } catch (error) {
      console.error(`Failed to fetch daily meal plan ${planId}:`, error);
      return null;
    }
  },

  async createPlan(planData: CreateDailyMealPlanData): Promise<DailyMealPlan> {
    try {
      const transformedData = transformCreateData(planData);

      const response = await apiClient.post(
        `/api/daily-meal-plans`,
        transformedData
      );

      return transformDailyMealPlan(response.data.doc);
    } catch (error) {
      console.error("Failed to create daily meal plan:", error);
      throw error;
    }
  },

  async updatePlan(
    planId: string,
    updates: Partial<Pick<CreateDailyMealPlanData, "tags" | "notes">> & {
      planTitle?: string;
    }
  ): Promise<DailyMealPlan> {
    try {
      const transformedData: any = {};

      if (updates.planTitle) transformedData.planTitle = updates.planTitle;
      if (updates.notes !== undefined) transformedData.notes = updates.notes;
      if (updates.tags) {
        transformedData.tags = updates.tags.map((tag) => ({ tag }));
      }

      const response = await apiClient.patch(
        `/api/daily-meal-plans/${planId}`,
        transformedData
      );

      return transformDailyMealPlan(response.data);
    } catch (error) {
      console.error("Failed to update daily meal plan:", error);
      throw error;
    }
  },

  async toggleFavorite(
    planId: string,
    isFavorite: boolean
  ): Promise<DailyMealPlan> {
    try {
      const response = await apiClient.patch(
        `/api/daily-meal-plans/${planId}`,
        { isFavorite }
      );

      return transformDailyMealPlan(response.data);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      throw error;
    }
  },

  async deletePlan(planId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/daily-meal-plans/${planId}`);
    } catch (error) {
      console.error("Failed to delete daily meal plan:", error);
      throw error;
    }
  },

  async getFavoritePlans(userId: string): Promise<DailyMealPlan[]> {
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

      const response = await apiClient.get(
        `/api/daily-meal-plans${queryString}`
      );

      return response.data.docs.map(transformDailyMealPlan);
    } catch (error) {
      console.error(
        `Failed to fetch favorite daily meal plans for userId ${userId}:`,
        error
      );
      return [];
    }
  },

  async getRecentPlans(
    userId: string,
    limit: number = 5
  ): Promise<DailyMealPlan[]> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: limit.toString(),
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(
        `/api/daily-meal-plans${queryString}`
      );

      return response.data.docs.map(transformDailyMealPlan);
    } catch (error) {
      console.error(
        `Failed to fetch recent daily meal plans for userId ${userId}:`,
        error
      );
      return [];
    }
  },
};
