import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ExerciseSuggestionInput } from "@/types/Assistant";

interface ExerciseSuggestionFormProps {
  onSubmit: (data: ExerciseSuggestionInput) => void;
  isLoading?: boolean;
}

const FITNESS_LEVELS = [
  { label: "Principiante", value: "principiante" },
  { label: "Intermedio", value: "intermedio" },
  { label: "Avanzado", value: "avanzado" },
];

const QUICK_OPTIONS = [
  {
    label: "Ejercicio rápido",
    description: "10-15 minutos",
    input: "Necesito un ejercicio rápido de 10-15 minutos para hacer en casa",
    fitnessLevel: "principiante",
  },
  {
    label: "Para relajarme",
    description: "Suave y calmante",
    input: "Busco un ejercicio suave para relajarme y liberar tensión",
    fitnessLevel: "principiante",
  },
  {
    label: "Para activarme",
    description: "Energizante",
    input: "Quiero un ejercicio energizante para activar mi cuerpo",
    fitnessLevel: "intermedio",
  },
  {
    label: "Sin equipamiento",
    description: "Solo con mi cuerpo",
    input: "Necesito un ejercicio que pueda hacer sin ningún equipamiento especial",
    fitnessLevel: "principiante",
  },
];

export function ExerciseSuggestionForm({
  onSubmit,
  isLoading = false,
}: ExerciseSuggestionFormProps) {
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState("principiante");
  const [userInput, setUserInput] = useState("");
  const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(null);

  const handleQuickOption = (option: (typeof QUICK_OPTIONS)[0]) => {
    setSelectedQuickOption(option.input);
    setUserInput(option.input);
    setSelectedFitnessLevel(option.fitnessLevel);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) {
      Alert.alert(
        "Campo requerido",
        "Por favor describe qué tipo de ejercicio buscas"
      );
      return;
    }

    const formData: ExerciseSuggestionInput = {
      fitnessLevel: selectedFitnessLevel,
      userInput: userInput.trim(),
    };
    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            ¿Qué tipo de ejercicio buscas?
          </ThemedText>
          
          <View style={styles.quickOptionsGrid}>
            {QUICK_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickOption,
                  selectedQuickOption === option.input && styles.quickOptionSelected,
                ]}
                onPress={() => handleQuickOption(option)}
                disabled={isLoading}
              >
                <View style={styles.quickOptionContent}>
                  <ThemedText
                    type="small"
                    style={[
                      styles.quickOptionTitle,
                      selectedQuickOption === option.input && styles.quickOptionTitleSelected,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={[
                      styles.quickOptionDescription,
                      selectedQuickOption === option.input && styles.quickOptionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </ThemedText>
                </View>
                {selectedQuickOption === option.input && (
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={3}
            placeholder="O describe tu ejercicio personalizado..."
            placeholderTextColor={AiraColors.mutedForeground}
            value={userInput}
            onChangeText={(text) => {
              setUserInput(text);
              setSelectedQuickOption(null);
            }}
            editable={!isLoading}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fitnessSection}>
          <ThemedText type="defaultSemiBold" style={styles.fitnessTitle}>
            Nivel de condición física
          </ThemedText>
          <View style={styles.fitnessLevels}>
            {FITNESS_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.fitnessLevel,
                  selectedFitnessLevel === level.value && styles.fitnessLevelSelected,
                ]}
                onPress={() => setSelectedFitnessLevel(level.value)}
                disabled={isLoading}
              >
                <ThemedText
                  type="small"
                  style={[
                    styles.fitnessLevelText,
                    selectedFitnessLevel === level.value && styles.fitnessLevelTextSelected,
                  ]}
                >
                  {level.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !userInput.trim()}
        >
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.accent]}
            style={styles.submitGradient}
          >
            {isLoading ? (
              <ThemedText type="defaultSemiBold" style={styles.submitText}>
                Generando...
              </ThemedText>
            ) : (
              <>
                <Ionicons name="fitness" size={20} color="white" />
                <ThemedText type="defaultSemiBold" style={styles.submitText}>
                  Generar Ejercicio
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
    backgroundColor: AiraColors.primary,
    borderColor: AiraColors.primary,
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
  textInput: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 80,
  },
  fitnessSection: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  fitnessTitle: {
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  fitnessLevels: {
    flexDirection: "row",
    gap: 8,
  },
  fitnessLevel: {
    flex: 1,
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  fitnessLevelSelected: {
    backgroundColor: AiraColors.primary,
    borderColor: AiraColors.primary,
  },
  fitnessLevelText: {
    color: AiraColors.foreground,
  },
  fitnessLevelTextSelected: {
    color: "white",
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
