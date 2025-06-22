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
      label: "Plan saludable para hoy",
      value: "Necesito un plan de comidas saludable y equilibrado para hoy",
    },
    {
      label: "Comidas rápidas y nutritivas",
      value:
        "Dame opciones de comidas rápidas de preparar pero nutritivas para todo el día",
    },
    {
      label: "Plan vegetariano",
      value: "Quiero un plan de comidas vegetariano completo para hoy",
    },
    {
      label: "Opciones bajas en carbohidratos",
      value: "Necesito un plan de comidas bajo en carbohidratos para hoy",
    },
  ];

  const handleQuickOption = (value: string) => {
    setFormData((prev) => ({ ...prev, userInput: value }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            ¿Qué tipo de plan de comidas necesitas? *
          </ThemedText>
          <TextInput
            style={[styles.textArea, errors.userInput && styles.inputError]}
            value={formData.userInput}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, userInput: text }))
            }
            placeholder="Ej: Necesito un plan de comidas saludable para hoy, con opciones vegetarianas..."
            placeholderTextColor={AiraColors.mutedForeground}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.userInput && (
            <ThemedText style={styles.errorText}>{errors.userInput}</ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Opciones rápidas</ThemedText>
          <View style={styles.quickOptionsGrid}>
            {quickOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickOption}
                onPress={() => handleQuickOption(option.value)}
              >
                <ThemedText style={styles.quickOptionText}>
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Preferencias alimentarias (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.dietaryPreferences}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, dietaryPreferences: text }))
            }
            placeholder="Ej: Vegetariana, vegana, keto, mediterránea..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Alergias o intolerancias (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.allergies}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, allergies: text }))
            }
            placeholder="Ej: Frutos secos, lactosa, gluten..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Alimentos que prefieres evitar (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.dislikedFoods}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, dislikedFoods: text }))
            }
            placeholder="Ej: Pescado, espinacas, comida muy picante..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Objetivo principal (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.mainGoal}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, mainGoal: text }))
            }
            placeholder="Ej: Pérdida de peso, ganar energía, mejorar digestión..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.accent]}
            style={styles.submitGradient}
          >
            {isLoading ? (
              <ThemedText style={styles.submitText}>
                Generando plan...
              </ThemedText>
            ) : (
              <>
                <Ionicons name="restaurant" size={20} color="white" />
                <ThemedText style={styles.submitText}>
                  Generar Plan de Comidas
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
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  input: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 50,
  },
  textArea: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 100,
  },
  inputError: {
    borderColor: AiraColors.destructive,
  },
  errorText: {
    fontSize: 12,
    color: AiraColors.destructive,
    marginTop: 4,
  },
  quickOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickOption: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickOptionText: {
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  submitButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginTop: 16,
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
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
