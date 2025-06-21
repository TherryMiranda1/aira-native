import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

export interface UserProfileFromCMS {
  id: string;
  userId: string;
  email: string;
  personalInfo: {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  health: {
    healthConditions: {
      condition: string;
    }[];
    allergies: {
      allergy: string;
    }[];
    medications?: string;
    injuries?: string;
  };
  goals: {
    primaryGoal: string;
    timeline: string;
    commitment: string;
    priorities: {
      priority: string;
    }[];
  };
  nutrition: {
    eatingHabits: {
      habit: string;
    }[];
    dietaryPreferences: {
      preference: string;
    }[];
    foodAversions: {
      aversion: string;
    }[];
    cookingFrequency?: string;
    budget?: string;
  };
  activity: {
    currentActivity?: string;
    experience?: string;
    preferences: {
      preference: string;
    }[];
    equipment: {
      item: string;
    }[];
    frequency?: string;
    duration?: string;
  };
  lifestyle: {
    schedule?: string;
    sleepHours?: string;
    stressLevel?: string;
    support?: string;
  };
  completedOnboarding: boolean;
  onboardingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  personalInfo: {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  health: {
    healthConditions: string[];
    allergies: string[];
    medications?: string;
    injuries?: string;
  };
  goals: {
    primaryGoal: string;
    timeline: string;
    commitment: string;
    priorities: string[];
  };
  nutrition: {
    eatingHabits: string[];
    dietaryPreferences: string[];
    foodAversions: string[];
    cookingFrequency?: string;
    budget?: string;
  };
  activity: {
    currentActivity?: string;
    experience?: string;
    preferences: string[];
    equipment: string[];
    frequency?: string;
    duration?: string;
  };
  lifestyle: {
    schedule?: string;
    sleepHours?: string;
    stressLevel?: string;
    support?: string;
  };
  completedOnboarding: boolean;
  onboardingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const transformUserProfile = (cmsProfile: UserProfileFromCMS): UserProfile => {
  const healthConditions =
    cmsProfile.health?.healthConditions?.map((item) => item.condition) || [];
  const allergies =
    cmsProfile.health?.allergies?.map((item) => item.allergy) || [];
  const priorities =
    cmsProfile.goals?.priorities?.map((item) => item.priority) || [];
  const eatingHabits =
    cmsProfile.nutrition?.eatingHabits?.map((item) => item.habit) || [];
  const dietaryPreferences =
    cmsProfile.nutrition?.dietaryPreferences?.map((item) => item.preference) ||
    [];
  const foodAversions =
    cmsProfile.nutrition?.foodAversions?.map((item) => item.aversion) || [];
  const activityPreferences =
    cmsProfile.activity?.preferences?.map((item) => item.preference) || [];
  const equipment =
    cmsProfile.activity?.equipment?.map((item) => item.item) || [];

  return {
    id: cmsProfile.id,
    userId: cmsProfile.userId,
    email: cmsProfile.email,
    personalInfo: cmsProfile.personalInfo,
    health: {
      healthConditions,
      allergies,
      medications: cmsProfile.health?.medications,
      injuries: cmsProfile.health?.injuries,
    },
    goals: {
      primaryGoal: cmsProfile.goals?.primaryGoal || "",
      timeline: cmsProfile.goals?.timeline || "",
      commitment: cmsProfile.goals?.commitment || "",
      priorities,
    },
    nutrition: {
      eatingHabits,
      dietaryPreferences,
      foodAversions,
      cookingFrequency: cmsProfile.nutrition?.cookingFrequency,
      budget: cmsProfile.nutrition?.budget,
    },
    activity: {
      currentActivity: cmsProfile.activity?.currentActivity,
      experience: cmsProfile.activity?.experience,
      preferences: activityPreferences,
      equipment,
      frequency: cmsProfile.activity?.frequency,
      duration: cmsProfile.activity?.duration,
    },
    lifestyle: cmsProfile.lifestyle || {},
    completedOnboarding: cmsProfile.completedOnboarding,
    onboardingCompletedAt: cmsProfile.onboardingCompletedAt,
    createdAt: cmsProfile.createdAt,
    updatedAt: cmsProfile.updatedAt,
  };
};

export interface CreateUserProfileData {
  userId: string;
  email: string;
  personalInfo: {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  health: {
    healthConditions: string[];
    allergies: string[];
    medications?: string;
    injuries?: string;
  };
  goals: {
    primaryGoal: string;
    timeline: string;
    commitment: string;
    priorities: string[];
  };
  nutrition: {
    eatingHabits: string[];
    dietaryPreferences: string[];
    foodAversions: string[];
    cookingFrequency?: string;
    budget?: string;
  };
  activity: {
    currentActivity?: string;
    experience?: string;
    preferences: string[];
    equipment: string[];
    frequency?: string;
    duration?: string;
  };
  lifestyle: {
    schedule?: string;
    sleepHours?: string;
    stressLevel?: string;
    support?: string;
  };
  completedOnboarding: boolean;
}

const transformCreateData = (data: Partial<CreateUserProfileData>): any => {
  const transformed: any = {};

  if (data.userId) transformed.userId = data.userId;
  if (data.email) transformed.email = data.email;
  if (data.personalInfo) transformed.personalInfo = data.personalInfo;

  if (data.health) {
    transformed.health = {};
    if (data.health.healthConditions) {
      transformed.health.healthConditions = data.health.healthConditions.map(
        (condition) => ({ condition })
      );
    }
    if (data.health.allergies) {
      transformed.health.allergies = data.health.allergies.map((allergy) => ({
        allergy,
      }));
    }
    if (data.health.medications && data.health.medications.trim()) {
      transformed.health.medications = data.health.medications;
    }
    if (data.health.injuries && data.health.injuries.trim()) {
      transformed.health.injuries = data.health.injuries;
    }
  }

  if (data.goals) {
    transformed.goals = {};
    if (data.goals.primaryGoal)
      transformed.goals.primaryGoal = data.goals.primaryGoal;
    if (data.goals.timeline) transformed.goals.timeline = data.goals.timeline;
    if (data.goals.commitment)
      transformed.goals.commitment = data.goals.commitment;
    if (data.goals.priorities) {
      transformed.goals.priorities = data.goals.priorities.map((priority) => ({
        priority,
      }));
    }
  }

  if (data.nutrition) {
    transformed.nutrition = {};
    if (data.nutrition.eatingHabits) {
      transformed.nutrition.eatingHabits = data.nutrition.eatingHabits.map(
        (habit) => ({ habit })
      );
    }
    if (data.nutrition.dietaryPreferences) {
      transformed.nutrition.dietaryPreferences =
        data.nutrition.dietaryPreferences.map((preference) => ({ preference }));
    }
    if (data.nutrition.foodAversions) {
      transformed.nutrition.foodAversions = data.nutrition.foodAversions.map(
        (aversion) => ({ aversion })
      );
    }
    if (
      data.nutrition.cookingFrequency &&
      data.nutrition.cookingFrequency.trim()
    ) {
      transformed.nutrition.cookingFrequency = data.nutrition.cookingFrequency;
    }
    if (data.nutrition.budget && data.nutrition.budget.trim()) {
      transformed.nutrition.budget = data.nutrition.budget;
    }
  }

  if (data.activity) {
    transformed.activity = {};
    if (data.activity.currentActivity && data.activity.currentActivity.trim()) {
      transformed.activity.currentActivity = data.activity.currentActivity;
    }
    if (data.activity.experience && data.activity.experience.trim()) {
      transformed.activity.experience = data.activity.experience;
    }
    if (data.activity.preferences) {
      transformed.activity.preferences = data.activity.preferences.map(
        (preference) => ({ preference })
      );
    }
    if (data.activity.equipment) {
      transformed.activity.equipment = data.activity.equipment.map((item) => ({
        item,
      }));
    }
    if (data.activity.frequency && data.activity.frequency.trim()) {
      transformed.activity.frequency = data.activity.frequency;
    }
    if (data.activity.duration && data.activity.duration.trim()) {
      transformed.activity.duration = data.activity.duration;
    }
  }

  if (data.lifestyle) {
    transformed.lifestyle = {};
    if (data.lifestyle.schedule && data.lifestyle.schedule.trim()) {
      transformed.lifestyle.schedule = data.lifestyle.schedule;
    }
    if (data.lifestyle.sleepHours && data.lifestyle.sleepHours.trim()) {
      transformed.lifestyle.sleepHours = data.lifestyle.sleepHours;
    }
    if (data.lifestyle.stressLevel && data.lifestyle.stressLevel.trim()) {
      transformed.lifestyle.stressLevel = data.lifestyle.stressLevel;
    }
    if (data.lifestyle.support && data.lifestyle.support.trim()) {
      transformed.lifestyle.support = data.lifestyle.support;
    }
  }

  if (data.completedOnboarding !== undefined) {
    transformed.completedOnboarding = data.completedOnboarding;
  }

  return transformed;
};

export const userProfileService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: "1",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`/api/user-profiles${queryString}`);

      if (response.data.docs.length === 0) {
        return null;
      }

      return transformUserProfile(response.data.docs[0]);
    } catch (error) {
      console.error(
        `Failed to fetch user profile for userId ${userId}:`,
        error
      );
      return null;
    }
  },

  async createUserProfile(
    profileData: CreateUserProfileData
  ): Promise<UserProfile> {
    try {
      const transformedData = transformCreateData(profileData);

      const response = await apiClient.post(`/api/user-profiles`, transformedData);

      return transformUserProfile(response.data);
    } catch (error) {
      console.error("Failed to create user profile:", error);
      throw error;
    }
  },

  async updateUserProfile(
    userId: string,
    updates: Partial<CreateUserProfileData>
  ): Promise<UserProfile> {
    try {
      const transformedData = transformCreateData(updates);

      const existingProfile = await this.getUserProfile(userId);
      if (!existingProfile) {
        throw new Error("User profile not found");
      }

      const response = await apiClient.patch(`/api/user-profiles/${existingProfile.id}`, transformedData);

      return transformUserProfile(response.data);
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  },

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      const existingProfile = await this.getUserProfile(userId);
      if (!existingProfile) {
        throw new Error("User profile not found");
      }

      await apiClient.delete(`/api/user-profiles/${existingProfile.id}`);
    } catch (error) {
      console.error("Failed to delete user profile:", error);
      throw error;
    }
  },
};
