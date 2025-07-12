import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { FullExerciseRoutineInput } from "@/types/Assistant";
import { ThemedInput } from "../../components/ThemedInput";
import { useAlertHelpers } from "@/components/ui/AlertSystem";

interface FullExerciseRoutineFormProps {
  onSubmit: (formData: FullExerciseRoutineInput) => void;
  isLoading: boolean;
  initialData?: FullExerciseRoutineInput;
}

export function FullExerciseRoutineForm({
  onSubmit,
  isLoading,
  initialData,
}: FullExerciseRoutineFormProps) {
  const { showError } = useAlertHelpers();
  const [formData, setFormData] = useState<FullExerciseRoutineInput>({
    userInput: initialData?.userInput || "",
    fitnessLevel: initialData?.fitnessLevel || "",
    availableEquipment: initialData?.availableEquipment || "",
    timePerSession: initialData?.timePerSession || "",
    daysPerWeek: initialData?.daysPerWeek || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(
    null
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userInput.trim()) {
      newErrors.userInput = "Describe qué tipo de rutina necesitas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showError(
        "Formulario incompleto",
        "Por favor completa los campos requeridos"
      );
      return;
    }

    onSubmit(formData);
  };

  const quickOptions = [
    {
      label: "En casa - Principiante",
      description: "30 min, 3 días",
      value:
        "Necesito una rutina de ejercicios para hacer en casa, soy principiante",
      fitnessLevel: "Principiante",
      availableEquipment: "Solo peso corporal",
      timePerSession: "30 minutos",
      daysPerWeek: "3 días",
    },
    {
      label: "Fuerza - Gimnasio",
      description: "60 min, 4 días",
      value: "Quiero una rutina de fuerza para el gimnasio",
      fitnessLevel: "Intermedio",
      availableEquipment: "Acceso completo al gimnasio",
      timePerSession: "60 minutos",
      daysPerWeek: "4 días",
    },
    {
      label: "Rápida - Oficina",
      description: "15 min, 5 días",
      value: "Necesito ejercicios rápidos que pueda hacer en la oficina",
      fitnessLevel: "Cualquier nivel",
      availableEquipment: "Sin equipamiento",
      timePerSession: "15 minutos",
      daysPerWeek: "5 días",
    },
    {
      label: "Tonificación",
      description: "45 min, 4 días",
      value: "Quiero una rutina para tonificar todo el cuerpo",
      fitnessLevel: "Intermedio",
      availableEquipment: "Mancuernas y bandas elásticas",
      timePerSession: "45 minutos",
      daysPerWeek: "4 días",
    },
  ];

  const handleQuickOption = (option: (typeof quickOptions)[0]) => {
    setSelectedQuickOption(option.value);
    setFormData((prev) => ({
      ...prev,
      userInput: option.value,
      fitnessLevel: option.fitnessLevel,
      availableEquipment: option.availableEquipment,
      timePerSession: option.timePerSession,
      daysPerWeek: option.daysPerWeek,
    }));
    setErrors((prev) => ({ ...prev, userInput: "" }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            ¿Qué tipo de rutina necesitas?
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
                  selectedQuickOption === option.value &&
                    styles.quickOptionSelected,
                ]}
                onPress={() => handleQuickOption(option)}
              >
                <View style={styles.quickOptionContent}>
                  <ThemedText
                    type="small"
                    style={[
                      styles.quickOptionTitle,
                      selectedQuickOption === option.value &&
                        styles.quickOptionTitleSelected,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={[
                      styles.quickOptionDescription,
                      selectedQuickOption === option.value &&
                        styles.quickOptionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </ThemedText>
                </View>
                {selectedQuickOption === option.value && (
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <ThemedInput
            variant="textarea"
            style={[errors.userInput && styles.inputError]}
            value={formData.userInput}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, userInput: text }));
              setSelectedQuickOption(null);
              setErrors((prev) => ({ ...prev, userInput: "" }));
            }}
            placeholder="O describe tu rutina personalizada..."
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
              Nivel de condición física
            </ThemedText>
            <ThemedInput
              value={formData.fitnessLevel}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, fitnessLevel: text }))
              }
              placeholder="Principiante, Intermedio, Avanzado..."
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.inputLabel}>
              Equipamiento disponible
            </ThemedText>
            <ThemedInput
              value={formData.availableEquipment}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, availableEquipment: text }))
              }
              placeholder="Solo peso corporal, mancuernas, gimnasio..."
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.inputLabel}>
              Tiempo por sesión
            </ThemedText>
            <ThemedInput
              value={formData.timePerSession}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, timePerSession: text }))
              }
              placeholder="30 minutos, 1 hora, 45 minutos..."
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.inputLabel}>
              Días por semana
            </ThemedText>
            <ThemedInput
              value={formData.daysPerWeek}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, daysPerWeek: text }))
              }
              placeholder="3 días, 4-5 días, todos los días..."
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#EF4444", "#F97316"]}
            style={styles.submitGradient}
          >
            {isLoading ? (
              <ThemedText type="defaultSemiBold" style={styles.submitText}>
                Generando rutina...
              </ThemedText>
            ) : (
              <>
                <Ionicons name="fitness" size={20} color="white" />
                <ThemedText type="defaultSemiBold" style={styles.submitText}>
                  Generar Rutina
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
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  required: {
    color: AiraColors.mutedForeground,
    marginBottom: 16,
  },
  quickOptionsGrid: {
    gap: 8,
    marginBottom: 16,
  },
  quickOption: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quickOptionSelected: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  quickOptionContent: {
    flex: 1,
  },
  quickOptionTitle: {
    color: AiraColors.primary,
    marginBottom: 2,
  },
  quickOptionTitleSelected: {
    color: "white",
  },
  quickOptionDescription: {
    color: AiraColors.mutedForeground,
  },
  quickOptionDescriptionSelected: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  textArea: {
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    fontSize: 16,
     
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
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    fontSize: 16,
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
