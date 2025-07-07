import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { useToastHelpers } from "@/components/ui/ToastSystem";

interface SaveButtonProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
  isDisabled?: boolean;
  label?: string;
}

export function SaveButton({
  onSave,
  isSaving,
  isDisabled = false,
  label = "Guardar en mi biblioteca",
}: SaveButtonProps) {
  const { user } = useUser();
  const { showErrorToast } = useToastHelpers();

  const handlePress = async () => {
    if (!user) {
      showErrorToast("Error", "Debes iniciar sesión para guardar contenido");
      return;
    }

    try {
      await onSave();
    } catch (error) {
      console.error("Error en SaveButton:", error);
    }
  };

  const disabled = isSaving || isDisabled || !user;

  return (
    <TouchableOpacity
      style={[styles.saveButton, disabled && styles.saveButtonDisabled]}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={styles.savingContainer}>
        <Ionicons
          name={isSaving ? "time" : "bookmark"}
          size={16}
          color={disabled ? AiraColors.mutedForeground : AiraColors.primary}
        />
        <ThemedText
          style={[
            styles.saveButtonText,
            disabled && styles.saveButtonTextDisabled,
          ]}
        >
          {isSaving ? "Guardando..." : label}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginTop: 12,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  saveButtonDisabled: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.3),
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  savingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    fontSize: 14,
    color: AiraColors.primary,
    marginLeft: 8,
  },
  saveButtonTextDisabled: {
    color: AiraColors.mutedForeground,
  },
});
