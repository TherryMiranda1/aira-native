import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { DailyMealPlanInput } from "@/types/Assistant";

interface DailyMealPlanFormProps {
  onSubmit: (formData: DailyMealPlanInput) => void;
  isLoading: boolean;
  initialData?: DailyMealPlanInput;
}

export function DailyMealPlanForm({
  onSubmit,
  isLoading,
  initialData,
}: DailyMealPlanFormProps) {
  const [formData, setFormData] = useState<DailyMealPlanInput>({
    userInput: initialData?.userInput || "",
    dietaryPreferences: initialData?.dietaryPreferences || "",
    allergies: initialData?.allergies || "",
    dislikedFoods: initialData?.dislikedFoods || "",
    mainGoal: initialData?.mainGoal || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userInput.trim()) {
      newErrors.userInput = "Describe qué tipo de plan de comidas necesitas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert(
        "Formulario incompleto",
        "Por favor completa los campos requeridos"
      );
      return;
    }

    onSubmit(formData);
  };

  const quickOptions = [
    {
      label: "Plan saludable",
      value: "Necesito un plan de comidas saludable y equilibrado para hoy",
    },
    {
      label: "Comidas rápidas",
      value:
        "Dame opciones de comidas rápidas de preparar pero nutritivas para todo el día",
    },
    {
      label: "Plan vegetariano",
      value: "Quiero un plan de comidas vegetariano completo para hoy",
    },
    {
      label: "Bajo en carbohidratos",
      value: "Necesito un plan de comidas bajo en carbohidratos para hoy",
    },
  ];

  const handleQuickOption = (value: string) => {
    setFormData((prev) => ({ ...prev, userInput: value }));
    setErrors((prev) => ({ ...prev, userInput: "" }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            ¿Qué tipo de plan necesitas?
          </ThemedText>
          <ThemedText type="small" style={styles.required}>
            * Campo requerido
          </ThemedText>
          
          <View style={styles.quickOptionsGrid}>
            {quickOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickOption,
                  formData.userInput === option.value && styles.quickOptionSelected,
                ]}
                onPress={() => handleQuickOption(option.value)}
              >
                <ThemedText
                  type="small"
                  style={[
                    styles.quickOptionText,
                    formData.userInput === option.value && styles.quickOptionTextSelected,
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.textArea, errors.userInput && styles.inputError]}
            value={formData.userInput}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, userInput: text }));
              setErrors((prev) => ({ ...prev, userInput: "" }));
            }}
            placeholder="O describe tu plan personalizado..."
            placeholderTextColor={AiraColors.mutedForeground}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {errors.userInput && (
            <ThemedText type="small" style={styles.errorText}>
              {errors.userInput}
            </ThemedText>
          )}
        </View>

        <View style={styles.optionalSection}>
          <ThemedText type="defaultSemiBold" style={styles.optionalTitle}>
            Información adicional (opcional)
          </ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.inputLabel}>
              Preferencias alimentarias
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.dietaryPreferences}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, dietaryPreferences: text }))
              }
              placeholder="Vegetariana, vegana, keto..."
              placeholderTextColor={AiraColors.mutedForeground}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.inputLabel}>
              Alergias o intolerancias
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.allergies}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, allergies: text }))
              }
              placeholder="Frutos secos, lactosa, gluten..."
              placeholderTextColor={AiraColors.mutedForeground}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.inputLabel}>
              Alimentos a evitar
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.dislikedFoods}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, dislikedFoods: text }))
              }
              placeholder="Pescado, espinacas, picante..."
              placeholderTextColor={AiraColors.mutedForeground}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.inputLabel}>
              Objetivo principal
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.mainGoal}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, mainGoal: text }))
              }
              placeholder="Pérdida de peso, ganar energía..."
              placeholderTextColor={AiraColors.mutedForeground}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.accent]}
            style={styles.submitGradient}
          >
            {isLoading ? (
              <ThemedText type="defaultSemiBold" style={styles.submitText}>
                Generando plan...
              </ThemedText>
            ) : (
              <>
                <Ionicons name="restaurant" size={20} color="white" />
                <ThemedText type="defaultSemiBold" style={styles.submitText}>
                  Generar Plan
                </ThemedText>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  required: {
    color: AiraColors.mutedForeground,
    marginBottom: 16,
  },
  quickOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  quickOption: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  quickOptionSelected: {
    backgroundColor: AiraColors.primary,
    borderColor: AiraColors.primary,
  },
  quickOptionText: {
    color: AiraColors.primary,
  },
  quickOptionTextSelected: {
    color: "white",
  },
  textArea: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 80,
  },
  inputError: {
    borderColor: AiraColors.destructive,
  },
  errorText: {
    color: AiraColors.destructive,
    marginTop: 4,
  },
  optionalSection: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  optionalTitle: {
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: AiraColors.mutedForeground,
    marginBottom: 6,
  },
  input: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 44,
  },
  submitButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: {
    color: "white",
  },
});
