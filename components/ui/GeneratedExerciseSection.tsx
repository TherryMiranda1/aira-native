import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ExerciseSuggestionInput } from "@/types/Assistant";
import { useAlertHelpers } from "@/components/ui/AlertSystem";

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
  const { showConfirm } = useAlertHelpers();

  const handleSuggestedAction = (actionPrompt: string) => {
    showConfirm(
      "Acción sugerida",
      `¿Te gustaría continuar con: "${actionPrompt}"?`,
      () => {
        console.log("Continuar con:", actionPrompt);
      }
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
                size={20}
                color={AiraColors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.questionTitle}>
                Necesito más información
              </ThemedText>
            </View>
            <ThemedText type="default" style={styles.clarificationText}>
              {exercise.clarificationQuestion}
            </ThemedText>

            {exercise.suggestedNextActions &&
              exercise.suggestedNextActions.length > 0 && (
                <View style={styles.actionsSection}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.actionsTitle}
                  >
                    Opciones sugeridas:
                  </ThemedText>
                  {exercise.suggestedNextActions
                    .slice(0, 3)
                    .map((action: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                        onPress={() =>
                          handleSuggestedAction(action.actionPrompt)
                        }
                      >
                        <ThemedText
                          type="small"
                          style={styles.actionButtonText}
                        >
                          {action.label}
                        </ThemedText>
                        <Ionicons
                          name="arrow-forward"
                          size={14}
                          color={AiraColors.primary}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              )}
          </View>
        ) : (
          <View style={styles.exerciseSection}>
            <View style={styles.exerciseHeader}>
              <LinearGradient
                colors={["#EF4444", "#F97316"]}
                style={styles.exerciseIcon}
              >
                <Ionicons name="fitness" size={20} color="white" />
              </LinearGradient>
              <ThemedText type="title" style={styles.exerciseName}>
                {exercise.exerciseName}
              </ThemedText>
            </View>

            <View style={styles.instructionsSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Instrucciones
              </ThemedText>
              <ThemedText type="default" style={styles.instructionsText}>
                {exercise.instructions}
              </ThemedText>
            </View>

            <View style={styles.benefitsSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Beneficios
              </ThemedText>
              <ThemedText type="default" style={styles.benefitsText}>
                {exercise.benefits}
              </ThemedText>
            </View>

            {exercise.suggestedNextActions &&
              exercise.suggestedNextActions.length > 0 && (
                <View style={styles.actionsSection}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.actionsTitle}
                  >
                    ¿Qué te gustaría hacer después?
                  </ThemedText>
                  {exercise.suggestedNextActions
                    .slice(0, 3)
                    .map((action: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                        onPress={() =>
                          handleSuggestedAction(action.actionPrompt)
                        }
                      >
                        <ThemedText
                          type="small"
                          style={styles.actionButtonText}
                        >
                          {action.label}
                        </ThemedText>
                        <Ionicons
                          name="arrow-forward"
                          size={14}
                          color={AiraColors.primary}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              )}
          </View>
        )}

        <View style={styles.parametersSection}>
          <ThemedText type="defaultSemiBold" style={styles.parametersTitle}>
            Parámetros utilizados
          </ThemedText>
          <View style={styles.parameterItem}>
            <ThemedText type="small" style={styles.parameterLabel}>
              Nivel de condición:
            </ThemedText>
            <ThemedText type="small" style={styles.parameterValue}>
              {inputParams.fitnessLevel}
            </ThemedText>
          </View>
          <View style={styles.parameterItem}>
            <ThemedText type="small" style={styles.parameterLabel}>
              Solicitud:
            </ThemedText>
            <ThemedText type="small" style={styles.parameterValue}>
              {inputParams.userInput}
            </ThemedText>
          </View>
        </View>

        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={onEditParams}
              disabled={isRegenerating}
            >
              <Ionicons name="create" size={18} color={AiraColors.primary} />
              <ThemedText type="small" style={styles.editButtonText}>
                Editar
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={onRegenerate}
              disabled={isRegenerating}
            >
              <LinearGradient
                colors={["#EF4444", "#F97316"]}
                style={styles.regenerateGradient}
              >
                <Ionicons name="refresh" size={18} color="white" />
                <ThemedText type="small" style={styles.regenerateButtonText}>
                  {isRegenerating ? "Regenerando..." : "Regenerar"}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
  clarificationSection: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  questionTitle: {
    color: AiraColors.foreground,
  },
  clarificationText: {
    color: AiraColors.foreground,
    lineHeight: 20,
    marginBottom: 16,
  },
  exerciseSection: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  exerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseName: {
    color: AiraColors.foreground,
    flex: 1,
  },
  instructionsSection: {
    marginBottom: 16,
  },
  benefitsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: AiraColors.primary,
    marginBottom: 8,
  },
  instructionsText: {
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  benefitsText: {
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  actionsSection: {
    marginTop: 16,
  },
  actionsTitle: {
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    color: AiraColors.primary,
    flex: 1,
  },
  parametersSection: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
  },
  parametersTitle: {
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  parameterItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  parameterLabel: {
    color: AiraColors.mutedForeground,
    width: 120,
  },
  parameterValue: {
    color: AiraColors.foreground,
    flex: 1,
  },
  controlsSection: {
    gap: 12,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderRadius: AiraVariants.cardRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  editButtonText: {
    color: AiraColors.primary,
  },
  regenerateButton: {
    flex: 1,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  regenerateGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  regenerateButtonText: {
    color: "white",
  },
});
