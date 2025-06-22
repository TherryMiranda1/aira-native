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
    label: "Ejercicio rápido (10-15 min)",
    input: "Necesito un ejercicio rápido de 10-15 minutos para hacer en casa",
    fitnessLevel: "principiante",
  },
  {
    label: "Ejercicio para relajarme",
    input: "Busco un ejercicio suave para relajarme y liberar tensión",
    fitnessLevel: "principiante",
  },
  {
    label: "Algo para activarme",
    input: "Quiero un ejercicio energizante para activar mi cuerpo",
    fitnessLevel: "intermedio",
  },
  {
    label: "Ejercicio sin equipamiento",
    input:
      "Necesito un ejercicio que pueda hacer sin ningún equipamiento especial",
    fitnessLevel: "principiante",
  },
];

export function ExerciseSuggestionForm({
  onSubmit,
  isLoading = false,
}: ExerciseSuggestionFormProps) {
  const [selectedFitnessLevel, setSelectedFitnessLevel] =
    useState("principiante");
  const [userInput, setUserInput] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleQuickOption = (option: (typeof QUICK_OPTIONS)[0]) => {
    const formData: ExerciseSuggestionInput = {
      fitnessLevel: option.fitnessLevel,
      userInput: option.input,
    };
    onSubmit(formData);
  };

  const handleCustomSubmit = () => {
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

  if (showCustomForm) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowCustomForm(false)}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={24} color={AiraColors.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Personalizar ejercicio</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Nivel de condición física
          </ThemedText>
          <View style={styles.optionsContainer}>
            {FITNESS_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.optionButton,
                  selectedFitnessLevel === level.value && styles.selectedOption,
                ]}
                onPress={() => setSelectedFitnessLevel(level.value)}
                disabled={isLoading}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    selectedFitnessLevel === level.value &&
                      styles.selectedOptionText,
                  ]}
                >
                  {level.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            ¿Qué tipo de ejercicio buscas?
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Describe cómo te sientes hoy, qué zona del cuerpo quieres trabajar,
            o qué tipo de movimiento necesitas
          </ThemedText>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Ej: Quiero algo para fortalecer mis brazos y hombros..."
              placeholderTextColor={AiraColors.foreground}
              value={userInput}
              onChangeText={setUserInput}
              editable={!isLoading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleCustomSubmit}
          disabled={isLoading || !userInput.trim()}
        >
          <LinearGradient
            colors={[AiraColors.primary, AiraColors.secondary]}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.submitButtonText}>
              {isLoading ? "Generando..." : "Generar ejercicio"}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.quickOptionsSection}>
        <ThemedText style={styles.title}>Sugerencia de ejercicio</ThemedText>
        <ThemedText style={styles.subtitle}>
          Elige una opción rápida o personaliza tu ejercicio
        </ThemedText>

        <View style={styles.quickOptionsGrid}>
          {QUICK_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickOptionCard,
                isLoading && styles.disabledButton,
              ]}
              onPress={() => handleQuickOption(option)}
              disabled={isLoading}
            >
              <View style={styles.quickOptionContent}>
                <ThemedText style={styles.quickOptionTitle}>
                  {option.label}
                </ThemedText>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={AiraColors.primary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.customButton, isLoading && styles.disabledButton]}
          onPress={() => setShowCustomForm(true)}
          disabled={isLoading}
        >
          <View style={styles.customButtonContent}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={AiraColors.primary}
            />
            <ThemedText style={styles.customButtonText}>
              Personalizar ejercicio
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AiraColors.foreground}
            />
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,

    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  quickOptionsSection: {
    padding: 20,
  },
  quickOptionsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  quickOptionCard: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  quickOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quickOptionTitle: {
    fontSize: 16,
    fontWeight: "500",

    flex: 1,
  },
  customButton: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  customButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: AiraColors.primary,
    flex: 1,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,

    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  selectedOption: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderColor: AiraColors.primary,
  },
  optionText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  selectedOptionText: {
    color: AiraColors.primary,
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    padding: 16,
  },
  textInput: {
    fontSize: 16,

    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
