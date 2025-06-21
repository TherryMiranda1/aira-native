import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  assistantProfileService,
  AssistantProfile,
  CreateAssistantProfileData,
  DEFAULT_AIRA_PROFILE,
} from "@/services/api/assistantProfile.service";

export const useAssistantProfile = () => {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<AssistantProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<AssistantProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingDefaultProfile, setIsCreatingDefaultProfile] =
    useState(false);

  const loadProfiles = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userProfiles =
        await assistantProfileService.getUserAssistantProfiles(user.id);
      setProfiles(userProfiles);

      const active = userProfiles.find((profile) => profile.isActive);
      setActiveProfile(active || null);
    } catch (err) {
      setError("Error al cargar las configuraciones del asistente");
      console.error("Failed to load assistant profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveProfile = async () => {
    if (!user?.id) return null;

    try {
      const active = await assistantProfileService.getActiveAssistantProfile(
        user.id
      );
      setActiveProfile(active);
      return active;
    } catch (err) {
      console.error("Failed to load active assistant profile:", err);
      return null;
    }
  };

  const createProfile = async (
    profileData: Omit<CreateAssistantProfileData, "userId">
  ) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const newProfile = await assistantProfileService.createAssistantProfile({
        ...profileData,
        userId: user.id,
      });

      await loadProfiles();
      return newProfile;
    } catch (err) {
      setError("Error al crear la configuración del asistente");
      console.error("Failed to create assistant profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = async (
    profileId: string,
    updates: Partial<CreateAssistantProfileData>
  ) => {
    try {
      setSaving(true);
      setError(null);

      const updatedProfile =
        await assistantProfileService.updateAssistantProfile(
          profileId,
          updates
        );

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === profileId ? updatedProfile : profile
        )
      );

      if (updatedProfile.isActive) {
        setActiveProfile(updatedProfile);
      }

      return updatedProfile;
    } catch (err) {
      setError("Error al actualizar la configuración del asistente");
      console.error("Failed to update assistant profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const setActive = async (profileId: string) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const updatedProfile = await assistantProfileService.setActiveProfile(
        user.id,
        profileId
      );

      setProfiles((prev) =>
        prev.map((profile) => ({
          ...profile,
          isActive: profile.id === profileId,
        }))
      );

      setActiveProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError("Error al activar la configuración del asistente");
      console.error("Failed to set active assistant profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async (profileId: string) => {
    try {
      setSaving(true);
      setError(null);

      await assistantProfileService.deleteAssistantProfile(profileId);

      setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));

      if (activeProfile?.id === profileId) {
        setActiveProfile(null);
      }
    } catch (err) {
      setError("Error al eliminar la configuración del asistente");
      console.error("Failed to delete assistant profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const duplicateProfile = async (profileId: string, newName: string) => {
    try {
      setSaving(true);
      setError(null);

      const duplicatedProfile = await assistantProfileService.duplicateProfile(
        profileId,
        newName
      );

      await loadProfiles();
      return duplicatedProfile;
    } catch (err) {
      setError("Error al duplicar la configuración del asistente");
      console.error("Failed to duplicate assistant profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    const defaultProfile: Omit<CreateAssistantProfileData, "userId"> = {
      ...DEFAULT_AIRA_PROFILE,
    };

    const newProfile = await createProfile(defaultProfile);

    // Establecer como perfil activo automáticamente si es el primero
    if (profiles.length === 0) {
      await setActive(newProfile.id);
    }

    return newProfile;
  };

  const ensureProfileExists = async () => {
    if (!user?.id || isCreatingDefaultProfile) return null;

    if (profiles.length === 0) {
      try {
        setIsCreatingDefaultProfile(true);
        return await createDefaultProfile();
      } catch (error) {
        console.error("Failed to create default profile:", error);
        return null;
      } finally {
        setIsCreatingDefaultProfile(false);
      }
    }

    if (!activeProfile) {
      const firstProfile = profiles[0];
      if (firstProfile) {
        try {
          return await setActive(firstProfile.id);
        } catch (error) {
          console.error("Failed to set first profile as active:", error);
          return firstProfile;
        }
      }
    }

    return activeProfile;
  };

  useEffect(() => {
    if (user?.id) {
      loadProfiles();
    }
  }, [user?.id]);

  return {
    profiles,
    activeProfile,
    loading,
    saving,
    error,
    createProfile,
    updateProfile,
    setActive,
    deleteProfile,
    duplicateProfile,
    createDefaultProfile,
    ensureProfileExists,
    refetch: loadProfiles,
    loadActiveProfile,
  };
};
