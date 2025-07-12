import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import {
  FullExerciseRoutineInput,
  FullExerciseRoutineOutput,
} from "@/types/Assistant";

interface GeneratedFullExerciseRoutineSectionProps {
  routine: FullExerciseRoutineOutput;
  inputParams: FullExerciseRoutineInput;
  onSave: () => Promise<void>;
  onRegenerate: () => void;
  onEditParams: () => void;
  isSaving: boolean;
  isRegenerating: boolean;
}

export function GeneratedFullExerciseRoutineSection({
  routine,
  inputParams,
  onSave,
  onRegenerate,
  onEditParams,
  isSaving,
  isRegenerating,
}: GeneratedFullExerciseRoutineSectionProps) {
  const handleSave = async () => {
    try {
      await onSave();
    } catch (error) {
      console.error("Error al guardar rutina:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <LinearGradient
            colors={["#EF4444", "#F97316"]}
            style={styles.headerGradient}
          >
            <Ionicons name="fitness" size={28} color="white" />
            <ThemedText type="title" style={styles.routineTitle}>
              {routine.nombreRutina}
            </ThemedText>
            <ThemedText type="default" style={styles.description}>
              {routine.descripcionGeneral}
            </ThemedText>
          </LinearGradient>
        </View>

        {routine.advertencias && (
          <View style={styles.warningSection}>
            <View style={styles.warningHeader}>
              <Ionicons
                name="warning"
                size={18}
                color={AiraColors.destructive}
              />
              <ThemedText type="defaultSemiBold" style={styles.warningTitle}>
                Advertencias Importantes
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.warningText}>
              {routine.advertencias}
            </ThemedText>
          </View>
        )}

        <View style={styles.sessionsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Sesiones de Entrenamiento
          </ThemedText>
          {routine.sesiones.map((session, index) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <ThemedText type="defaultSemiBold" style={styles.sessionName}>
                  {session.nombreSesion}
                </ThemedText>
                {session.enfoque && (
                  <View style={styles.focusTag}>
                    <ThemedText type="small" style={styles.focusText}>
                      {session.enfoque}
                    </ThemedText>
                  </View>
                )}
              </View>

              {session.calentamiento && (
                <View style={styles.warmupSection}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="flame" size={14} color="#F59E0B" />
                    <ThemedText type="small" style={styles.subsectionTitle}>
                      Calentamiento
                    </ThemedText>
                  </View>
                  <ThemedText type="small" style={styles.subsectionText}>
                    {session.calentamiento}
                  </ThemedText>
                </View>
              )}

              <View style={styles.exercisesSection}>
                <View style={styles.subsectionHeader}>
                  <Ionicons name="barbell" size={14} color="#EF4444" />
                  <ThemedText type="small" style={styles.subsectionTitle}>
                    Ejercicios
                  </ThemedText>
                </View>
                {session.ejercicios.map((exercise, exerciseIndex) => (
                  <View key={exerciseIndex} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <ThemedText type="small" style={styles.exerciseName}>
                        {exercise.nombreEjercicio}
                      </ThemedText>
                      <ThemedText type="small" style={styles.exerciseSets}>
                        {exercise.seriesRepeticiones}
                      </ThemedText>
                    </View>

                    <ThemedText type="small" style={styles.exerciseDescription}>
                      {exercise.descripcionDetallada}
                    </ThemedText>

                    <View style={styles.exerciseDetails}>
                      <View style={styles.exerciseDetailRow}>
                        <Ionicons
                          name="body"
                          size={12}
                          color={AiraColors.mutedForeground}
                        />
                        <ThemedText
                          type="small"
                          style={styles.exerciseDetailLabel}
                        >
                          Músculos:
                        </ThemedText>
                        <ThemedText
                          type="small"
                          style={styles.exerciseDetailText}
                        >
                          {exercise.musculosImplicados}
                        </ThemedText>
                      </View>

                      <View style={styles.exerciseDetailRow}>
                        <Ionicons
                          name="time"
                          size={12}
                          color={AiraColors.mutedForeground}
                        />
                        <ThemedText
                          type="small"
                          style={styles.exerciseDetailLabel}
                        >
                          Descanso:
                        </ThemedText>
                        <ThemedText
                          type="small"
                          style={styles.exerciseDetailText}
                        >
                          {exercise.descanso}
                        </ThemedText>
                      </View>
                    </View>

                    {exercise.consejosEjecucion && (
                      <View style={styles.tipsSection}>
                        <Ionicons
                          name="checkmark-circle"
                          size={12}
                          color={AiraColors.primary}
                        />
                        <ThemedText type="small" style={styles.tipsText}>
                          {exercise.consejosEjecucion}
                        </ThemedText>
                      </View>
                    )}

                    {exercise.alternativaOpcional && (
                      <View style={styles.alternativeSection}>
                        <Ionicons
                          name="swap-horizontal"
                          size={12}
                          color={AiraColors.accent}
                        />
                        <ThemedText type="small" style={styles.alternativeText}>
                          Alternativa: {exercise.alternativaOpcional}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {session.enfriamiento && (
                <View style={styles.cooldownSection}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="snow" size={14} color="#06B6D4" />
                    <ThemedText type="small" style={styles.subsectionTitle}>
                      Enfriamiento
                    </ThemedText>
                  </View>
                  <ThemedText type="small" style={styles.subsectionText}>
                    {session.enfriamiento}
                  </ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        {routine.sugerenciasAdicionales && (
          <View style={styles.suggestionsSection}>
            <View style={styles.suggestionsHeader}>
              <Ionicons name="bulb" size={18} color={AiraColors.primary} />
              <ThemedText
                type="defaultSemiBold"
                style={styles.suggestionsTitle}
              >
                Sugerencias Adicionales
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.suggestionsText}>
              {routine.sugerenciasAdicionales}
            </ThemedText>
          </View>
        )}

        {routine.suggestedNextActions &&
          routine.suggestedNextActions.length > 0 && (
            <View style={styles.actionsSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                ¿Qué te gustaría hacer ahora?
              </ThemedText>
              <View style={styles.actionsGrid}>
                {routine.suggestedNextActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <TouchableOpacity key={index} style={styles.actionButton}>
                      <ThemedText type="small" style={styles.actionText}>
                        {action.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          )}

        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.editButton} onPress={onEditParams}>
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
              {isRegenerating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="refresh" size={18} color="white" />
              )}
              <ThemedText type="small" style={styles.regenerateButtonText}>
                {isRegenerating ? "Regenerando..." : "Regenerar"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={["#EF4444", "#F97316"]}
              style={styles.saveGradient}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="bookmark" size={20} color="white" />
              )}
              <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
                {isSaving ? "Guardando..." : "Guardar Rutina"}
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
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginBottom: 24,
  },
  headerGradient: {
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  routineTitle: {
    color: "white",
    textAlign: "center",
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  warningSection: {
    backgroundColor: AiraColorsWithAlpha.destructiveWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.destructiveWithOpacity(0.1),
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    color: AiraColors.destructive,
  },
  warningText: {
     
    lineHeight: 18,
  },
  sessionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
     
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AiraColors.border,
  },
  sessionHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sessionName: {
    color: "#EF4444",
    flex: 1,
  },
  focusTag: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  focusText: {
    color: "#EF4444",
  },
  warmupSection: {
    marginBottom: 16,
  },
  cooldownSection: {
    marginTop: 16,
  },
  subsectionHeader: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  subsectionTitle: {
     
  },
  subsectionText: {
     
    lineHeight: 18,
    paddingLeft: 20,
  },
  exercisesSection: {
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.02),
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginLeft: 20,
  },
  exerciseHeader: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  exerciseName: {
     
    flex: 1,
    marginRight: 8,
  },
  exerciseSets: {
    color: "#EF4444",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  exerciseDescription: {
     
    lineHeight: 16,
    marginBottom: 8,
  },
  exerciseDetails: {
    gap: 4,
    marginBottom: 8,
  },
  exerciseDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  exerciseDetailLabel: {
    color: AiraColors.mutedForeground,
    minWidth: 60,
  },
  exerciseDetailText: {
     
    flex: 1,
  },
  tipsSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  tipsText: {
     
    flex: 1,
    lineHeight: 14,
  },
  alternativeSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.05),
    padding: 8,
    borderRadius: 6,
  },
  alternativeText: {
     
    flex: 1,
    lineHeight: 14,
  },
  suggestionsSection: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  suggestionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  suggestionsTitle: {
    color: AiraColors.primary,
  },
  suggestionsText: {
     
    lineHeight: 18,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: AiraColors.primary,
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
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
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
    backgroundColor: AiraColors.mutedForeground,
    borderRadius: AiraVariants.cardRadius,
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
  saveButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  saveGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    color: "white",
  },
});
