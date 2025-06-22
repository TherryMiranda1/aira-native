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
import { FullExerciseRoutineInput } from "@/types/Assistant";

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
  const [formData, setFormData] = useState<FullExerciseRoutineInput>({
    userInput: initialData?.userInput || "",
    fitnessLevel: initialData?.fitnessLevel || "",
    availableEquipment: initialData?.availableEquipment || "",
    timePerSession: initialData?.timePerSession || "",
    daysPerWeek: initialData?.daysPerWeek || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      label: "Rutina en casa - Principiante",
      value: "Necesito una rutina de ejercicios para hacer en casa, soy principiante",
      fitnessLevel: "Principiante",
      availableEquipment: "Solo peso corporal",
      timePerSession: "30 minutos",
      daysPerWeek: "3 días",
    },
    {
      label: "Rutina de fuerza - Gimnasio",
      value: "Quiero una rutina de fuerza para el gimnasio",
      fitnessLevel: "Intermedio",
      availableEquipment: "Acceso completo al gimnasio",
      timePerSession: "60 minutos",
      daysPerWeek: "4 días",
    },
    {
      label: "Rutina rápida - Oficina",
      value: "Necesito ejercicios rápidos que pueda hacer en la oficina",
      fitnessLevel: "Cualquier nivel",
      availableEquipment: "Sin equipamiento",
      timePerSession: "15 minutos",
      daysPerWeek: "5 días",
    },
    {
      label: "Rutina de tonificación",
      value: "Quiero una rutina para tonificar todo el cuerpo",
      fitnessLevel: "Intermedio",
      availableEquipment: "Mancuernas y bandas elásticas",
      timePerSession: "45 minutos",
      daysPerWeek: "4 días",
    },
  ];

  const handleQuickOption = (option: typeof quickOptions[0]) => {
    setFormData((prev) => ({
      ...prev,
      userInput: option.value,
      fitnessLevel: option.fitnessLevel,
      availableEquipment: option.availableEquipment,
      timePerSession: option.timePerSession,
      daysPerWeek: option.daysPerWeek,
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            ¿Qué tipo de rutina necesitas? *
          </ThemedText>
          <TextInput
            style={[styles.textArea, errors.userInput && styles.inputError]}
            value={formData.userInput}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, userInput: text }))
            }
            placeholder="Ej: Necesito una rutina de fuerza para 3 días a la semana en el gimnasio..."
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
                onPress={() => handleQuickOption(option)}
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
            Nivel de condición física (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.fitnessLevel}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, fitnessLevel: text }))
            }
            placeholder="Ej: Principiante, Intermedio, Avanzado..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Equipamiento disponible (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.availableEquipment}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, availableEquipment: text }))
            }
            placeholder="Ej: Solo peso corporal, mancuernas, acceso al gimnasio..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Tiempo por sesión (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.timePerSession}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, timePerSession: text }))
            }
            placeholder="Ej: 30 minutos, 1 hora, 45 minutos..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Días por semana (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.daysPerWeek}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, daysPerWeek: text }))
            }
            placeholder="Ej: 3 días, 4-5 días, todos los días..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8"]}
            style={styles.submitGradient}
          >
            {isLoading ? (
              <ThemedText style={styles.submitText}>
                Generando rutina...
              </ThemedText>
            ) : (
              <>
                <Ionicons name="fitness" size={20} color="white" />
                <ThemedText style={styles.submitText}>
                  Generar Rutina de Ejercicio
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
    color: "#3B82F6",
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