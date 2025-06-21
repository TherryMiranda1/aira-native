import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  userProfileService,
  UserProfile,
  CreateUserProfileData,
} from "@/services/api/userProfile.service";

export const useUserProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userProfile = await userProfileService.getUserProfile(user.id);
      setProfile(userProfile);
    } catch (err) {
      setError("Error al cargar el perfil");
      console.error("Failed to load user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (
    profileData: Omit<CreateUserProfileData, "userId" | "email">
  ) => {
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const newProfile = await userProfileService.createUserProfile({
        ...profileData,
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
      });

      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      setError("Error al crear el perfil");
      console.error("Failed to create user profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = async (updates: Partial<CreateUserProfileData>) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const updatedProfile = await userProfileService.updateUserProfile(
        user.id,
        updates
      );
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError("Error al actualizar el perfil");
      console.error("Failed to update user profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async () => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      await userProfileService.deleteUserProfile(user.id);
      setProfile(null);
    } catch (err) {
      setError("Error al eliminar el perfil");
      console.error("Failed to delete user profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    saving,
    createProfile,
    updateProfile,
    deleteProfile,
    refetch: loadProfile,
  };
};
