import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

export const DEFAULT_AIRA_PROFILE = {
  name: "Mi Aira",
  personality: {
    communicationTone: "warm",
    energyLevel: "balanced",
    motivationStyle: "supportive",
    empathyLevel: "high",
  },
  communication: {
    responseLength: "medium",
    emojiUsage: "minimal",
    languageStyle: "casual-friendly",
    questioningStyle: "gentle",
  },
  guidance: {
    adviceDepth: "balanced",
    focusAreas: ["emotional-support"],
    suggestionStyle: "collaborative",
  },
  customization: {
    preferredGreetings: [],
    avoidTerms: [],
    specialInstructions: "",
  },
};

export interface AssistantProfileFromCMS {
  id: string;
  userId: string;
  name: string;
  personality: {
    communicationTone: string;
    energyLevel: string;
    motivationStyle: string;
    empathyLevel: string;
  };
  communication: {
    responseLength: string;
    emojiUsage: string;
    languageStyle: string;
    questioningStyle: string;
  };
  guidance: {
    adviceDepth: string;
    focusAreas: {
      area: string;
    }[];
    suggestionStyle: string;
  };
  customization: {
    preferredGreetings: {
      greeting: string;
    }[];
    avoidTerms: {
      term: string;
    }[];
    specialInstructions?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AssistantProfile {
  id: string;
  userId: string;
  name: string;
  isActive?: boolean;
  personality: {
    communicationTone: string;
    energyLevel: string;
    motivationStyle: string;
    empathyLevel: string;
  };
  communication: {
    responseLength: string;
    emojiUsage: string;
    languageStyle: string;
    questioningStyle: string;
  };
  guidance: {
    adviceDepth: string;
    focusAreas: string[];
    suggestionStyle: string;
  };
  customization: {
    preferredGreetings: string[];
    avoidTerms: string[];
    specialInstructions?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const transformAssistantProfile = (
  cmsProfile: AssistantProfileFromCMS,
  isActive: boolean = false
): AssistantProfile => {
  const focusAreas =
    cmsProfile.guidance?.focusAreas?.map((item) => item.area) || [];
  const preferredGreetings =
    cmsProfile.customization?.preferredGreetings?.map(
      (item) => item.greeting
    ) || [];
  const avoidTerms =
    cmsProfile.customization?.avoidTerms?.map((item) => item.term) || [];

  return {
    id: cmsProfile.id,
    userId: cmsProfile.userId,
    name: cmsProfile.name,
    isActive,
    personality: cmsProfile.personality || DEFAULT_AIRA_PROFILE.personality,
    communication: cmsProfile.communication || DEFAULT_AIRA_PROFILE.communication,
    guidance: {
      adviceDepth:
        cmsProfile.guidance?.adviceDepth ||
        DEFAULT_AIRA_PROFILE.guidance.adviceDepth,
      focusAreas,
      suggestionStyle:
        cmsProfile.guidance?.suggestionStyle ||
        DEFAULT_AIRA_PROFILE.guidance.suggestionStyle,
    },
    customization: {
      preferredGreetings,
      avoidTerms,
      specialInstructions: cmsProfile.customization?.specialInstructions,
    },
    createdAt: cmsProfile.createdAt,
    updatedAt: cmsProfile.updatedAt,
  };
};

export interface CreateAssistantProfileData {
  userId: string;
  name: string;
  personality: {
    communicationTone: string;
    energyLevel: string;
    motivationStyle: string;
    empathyLevel: string;
  };
  communication: {
    responseLength: string;
    emojiUsage: string;
    languageStyle: string;
    questioningStyle: string;
  };
  guidance: {
    adviceDepth: string;
    focusAreas: string[];
    suggestionStyle: string;
  };
  customization: {
    preferredGreetings: string[];
    avoidTerms: string[];
    specialInstructions?: string;
  };
}

const transformCreateData = (
  data: Partial<CreateAssistantProfileData>
): any => {
  const transformedData: any = {
    userId: data.userId,
    name: data.name,
    personality: data.personality,
    communication: data.communication,
    guidance: {
      adviceDepth: data.guidance?.adviceDepth,
      suggestionStyle: data.guidance?.suggestionStyle,
      focusAreas: data.guidance?.focusAreas?.map((area) => ({ area })) || [],
    },
    customization: {
      preferredGreetings:
        data.customization?.preferredGreetings?.map((greeting) => ({
          greeting,
        })) || [],
      avoidTerms:
        data.customization?.avoidTerms?.map((term) => ({ term })) || [],
      specialInstructions: data.customization?.specialInstructions,
    },
  };

  return transformedData;
};

class AssistantProfileService {
  private baseUrl = API_CONFIG.ENDPOINTS.ASSISTANT_PROFILES;

  async getUserAssistantProfiles(userId: string): Promise<AssistantProfile[]> {
    try {
      const queryParams = stringify({
        where: {
          userId: {
            equals: userId,
          },
        },
        sort: "-updatedAt",
      });

      const response = await apiClient.get(`${this.baseUrl}?${queryParams}`);
      
      // Obtener el perfil activo del usuario para marcar cuál está activo
      const activeProfile = await this.getActiveAssistantProfile(userId);
      
      return response.data.docs?.map((profile: AssistantProfileFromCMS) => 
        transformAssistantProfile(profile, activeProfile?.id === profile.id)
      ) || [];
    } catch (error) {
      console.error("Error fetching user assistant profiles:", error);
      throw error;
    }
  }

  async getActiveAssistantProfile(
    userId: string
  ): Promise<AssistantProfile | null> {
    try {
      // Obtener el user profile que contiene la referencia al perfil activo
      const userProfileQuery = stringify({
        where: {
          userId: { equals: userId },
        },
        populate: {
          activeAssistantProfile: {
            populate: true,
          },
        },
        limit: 1,
      });

      const userProfileResponse = await apiClient.get(`/api/user-profiles?${userProfileQuery}`);
      
      const userProfile = userProfileResponse.data.docs?.[0];
      if (!userProfile?.activeAssistantProfile) {
        return null;
      }

      return transformAssistantProfile(userProfile.activeAssistantProfile, true);
    } catch (error) {
      console.error("Error fetching active assistant profile:", error);
      return null;
    }
  }

  async getAssistantProfile(
    profileId: string
  ): Promise<AssistantProfile | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${profileId}`);

      return transformAssistantProfile(response.data, false);
    } catch (error) {
      console.error("Error fetching assistant profile:", error);
      throw error;
    }
  }

  async createAssistantProfile(
    profileData: CreateAssistantProfileData
  ): Promise<AssistantProfile> {
    try {
      const transformedData = transformCreateData(profileData);
      const response = await apiClient.post(this.baseUrl, transformedData);

      return transformAssistantProfile(response.data, false);
    } catch (error) {
      console.error("Error creating assistant profile:", error);
      throw error;
    }
  }

  async updateAssistantProfile(
    profileId: string,
    updates: Partial<CreateAssistantProfileData>
  ): Promise<AssistantProfile> {
    try {
      const transformedUpdates = transformCreateData(updates);
      const response = await apiClient.patch(
        `${this.baseUrl}/${profileId}`,
        transformedUpdates
      );

      // Verificar si este perfil es el activo
      const activeProfile = await this.getActiveAssistantProfile(updates.userId || "");
      const isActive = activeProfile?.id === profileId;

      return transformAssistantProfile(response.data, isActive);
    } catch (error) {
      console.error("Error updating assistant profile:", error);
      throw error;
    }
  }

  async setActiveProfile(
    userId: string,
    profileId: string
  ): Promise<AssistantProfile> {
    try {
      // Primero obtener el user profile
      const userProfileQuery = stringify({
        where: {
          userId: { equals: userId },
        },
        limit: 1,
      });

      const userProfileResponse = await apiClient.get(`/api/user-profiles?${userProfileQuery}`);
      const userProfile = userProfileResponse.data.docs?.[0];

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Actualizar el user profile con el nuevo perfil activo
      await apiClient.patch(`/api/user-profiles/${userProfile.id}`, {
        activeAssistantProfile: profileId,
      });

      // Obtener el perfil actualizado
      const profileResponse = await apiClient.get(`${this.baseUrl}/${profileId}`);
      
      return transformAssistantProfile(profileResponse.data, true);
    } catch (error) {
      console.error("Error setting active assistant profile:", error);
      throw error;
    }
  }

  async deleteAssistantProfile(profileId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${profileId}`);
    } catch (error) {
      console.error("Error deleting assistant profile:", error);
      throw error;
    }
  }

  async duplicateProfile(
    profileId: string,
    newName: string
  ): Promise<AssistantProfile> {
    try {
      const originalProfile = await this.getAssistantProfile(profileId);
      
      if (!originalProfile) {
        throw new Error("Original profile not found");
      }

      const duplicateData: CreateAssistantProfileData = {
        userId: originalProfile.userId,
        name: newName,
        personality: originalProfile.personality,
        communication: originalProfile.communication,
        guidance: originalProfile.guidance,
        customization: originalProfile.customization,
      };

      return await this.createAssistantProfile(duplicateData);
    } catch (error) {
      console.error("Error duplicating assistant profile:", error);
      throw error;
    }
  }
}

export const assistantProfileService = new AssistantProfileService();
