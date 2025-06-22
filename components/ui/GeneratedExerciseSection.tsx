import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { ExerciseSuggestionInput } from "@/types/Assistant";

interface GeneratedExerciseSectionProps {
  exercise: any;
  inputParams: ExerciseSuggestionInput;
  onRegenerate: () => void;
  onEditParams: () => void;
  isRegenerating?: boolean;
}

export function GeneratedExerciseSection({
  exercise,
  inputParams,
  onRegenerate,
  onEditParams,
  isRegenerating = false,
}: GeneratedExerciseSectionProps) {
  const handleSuggestedAction = (actionPrompt: string) => {
    Alert.alert(
      "Acción sugerida",
      `¿Te gustaría continuar con: "${actionPrompt}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Continuar",
          onPress: () => console.log("Continuar con:", actionPrompt),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {exercise.clarificationQuestion ? (
          <View style={styles.clarificationSection}>
            <View style={styles.questionHeader}>
              <Ionicons
                name="help-circle"
                size={24}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.questionTitle}>
                Necesito más información
              </ThemedText>
            </View>
            <ThemedText style={styles.clarificationText}>
              {exercise.clarificationQuestion}
            </ThemedText>

            {exercise.suggestedNextActions &&
              exercise.suggestedNextActions.length > 0 && (
                <View style={styles.actionsSection}>
                  <ThemedText style={styles.actionsTitle}>
                    Opciones sugeridas:
                  </ThemedText>
                  {exercise.suggestedNextActions.map(
                    (action: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                        onPress={() =>
                          handleSuggestedAction(action.actionPrompt)
                        }
                      >
                        <ThemedText style={styles.actionButtonText}>
                          {action.label}
                        </ThemedText>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color={AiraColors.primary}
                        />
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}
          </View>
        ) : (
          <View style={styles.exerciseSection}>
            <View style={styles.exerciseHeader}>
              <Ionicons name="fitness" size={24} color={AiraColors.primary} />
              <ThemedText style={styles.exerciseName}>
                {exercise.exerciseName}
              </ThemedText>
            </View>

            <View style={styles.instructionsSection}>
              <ThemedText style={styles.sectionTitle}>Instrucciones</ThemedText>
              <ThemedText style={styles.instructionsText}>
                {exercise.instructions}
              </ThemedText>
            </View>

            <View style={styles.benefitsSection}>
              <ThemedText style={styles.sectionTitle}>Beneficios</ThemedText>
              <ThemedText style={styles.benefitsText}>
                {exercise.benefits}
              </ThemedText>
            </View>

            {exercise.suggestedNextActions &&
              exercise.suggestedNextActions.length > 0 && (
                <View style={styles.actionsSection}>
                  <ThemedText style={styles.actionsTitle}>
                    ¿Qué te gustaría hacer después?
                  </ThemedText>
                  {exercise.suggestedNextActions.map(
                    (action: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                        onPress={() =>
                          handleSuggestedAction(action.actionPrompt)
                        }
                      >
                        <ThemedText style={styles.actionButtonText}>
                          {action.label}
                        </ThemedText>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color={AiraColors.primary}
                        />
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}
          </View>
        )}

        <View style={styles.parametersSection}>
          <ThemedText style={styles.parametersTitle}>
            Parámetros utilizados
          </ThemedText>
          <View style={styles.parameterItem}>
            <ThemedText style={styles.parameterLabel}>
              Nivel de condición:
            </ThemedText>
            <ThemedText style={styles.parameterValue}>
              {inputParams.fitnessLevel}
            </ThemedText>
          </View>
          <View style={styles.parameterItem}>
            <ThemedText style={styles.parameterLabel}>Solicitud:</ThemedText>
            <ThemedText style={styles.parameterValue}>
              {inputParams.userInput}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              isRegenerating && styles.disabledButton,
            ]}
            onPress={onEditParams}
            disabled={isRegenerating}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={AiraColors.primary}
            />
            <ThemedText style={styles.secondaryButtonText}>
              Editar parámetros
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isRegenerating && styles.disabledButton,
            ]}
            onPress={onRegenerate}
            disabled={isRegenerating}
          >
            <LinearGradient
              colors={[AiraColors.primary, AiraColors.secondary]}
              style={styles.gradientButton}
            >
              <Ionicons
                name="refresh"
                size={20}
                color={AiraColors.foreground}
                style={[isRegenerating && styles.spinIcon]}
              />
              <ThemedText style={styles.primaryButtonText}>
                {isRegenerating ? "Regenerando..." : "Regenerar"}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  },
  clarificationSection: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 18,
    marginLeft: 12,
  },
  clarificationText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  exerciseSection: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
  },
  instructionsSection: {
    marginBottom: 20,
  },
  benefitsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.primary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 15,
    lineHeight: 22,
  },
  benefitsText: {
    fontSize: 15,
    lineHeight: 22,
  },
  actionsSection: {
    marginTop: 20,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "600",

    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  actionButtonText: {
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "500",
    flex: 1,
  },
  parametersSection: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  parametersTitle: {
    fontSize: 14,

    marginBottom: 12,
  },
  parameterItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  parameterLabel: {
    fontSize: 14,

    width: 120,
  },
  parameterValue: {
    fontSize: 14,
    color: AiraColors.foreground,
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: AiraColors.primary,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.primary,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  spinIcon: {
    transform: [{ rotate: "45deg" }],
  },
});
