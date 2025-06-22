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
import { FullExerciseRoutineInput, FullExerciseRoutineOutput } from "@/types/Assistant";

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
            colors={["#3B82F6", "#1D4ED8"]}
            style={styles.headerGradient}
          >
            <Ionicons name="fitness" size={32} color="white" />
            <ThemedText style={styles.routineTitle}>{routine.nombreRutina}</ThemedText>
            <ThemedText style={styles.description}>
              {routine.descripcionGeneral}
            </ThemedText>
          </LinearGradient>
        </View>

        {routine.advertencias && (
          <View style={styles.warningSection}>
            <View style={styles.warningHeader}>
              <Ionicons name="warning" size={20} color={AiraColors.destructive} />
              <ThemedText style={styles.warningTitle}>
                Advertencias Importantes
              </ThemedText>
            </View>
            <ThemedText style={styles.warningText}>{routine.advertencias}</ThemedText>
          </View>
        )}

        <View style={styles.sessionsSection}>
          <ThemedText style={styles.sectionTitle}>
            Sesiones de Entrenamiento
          </ThemedText>
          {routine.sesiones.map((session, index) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <ThemedText style={styles.sessionName}>{session.nombreSesion}</ThemedText>
                {session.enfoque && (
                  <View style={styles.focusTag}>
                    <ThemedText style={styles.focusText}>{session.enfoque}</ThemedText>
                  </View>
                )}
              </View>

              {session.calentamiento && (
                <View style={styles.warmupSection}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="flame" size={16} color="#F59E0B" />
                    <ThemedText style={styles.subsectionTitle}>Calentamiento</ThemedText>
                  </View>
                  <ThemedText style={styles.subsectionText}>{session.calentamiento}</ThemedText>
                </View>
              )}

              <View style={styles.exercisesSection}>
                <View style={styles.subsectionHeader}>
                  <Ionicons name="barbell" size={16} color="#3B82F6" />
                  <ThemedText style={styles.subsectionTitle}>Ejercicios</ThemedText>
                </View>
                {session.ejercicios.map((exercise, exerciseIndex) => (
                  <View key={exerciseIndex} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <ThemedText style={styles.exerciseName}>
                        {exercise.nombreEjercicio}
                      </ThemedText>
                      <ThemedText style={styles.exerciseSets}>
                        {exercise.seriesRepeticiones}
                      </ThemedText>
                    </View>
                    
                    <ThemedText style={styles.exerciseDescription}>
                      {exercise.descripcionDetallada}
                    </ThemedText>
                    
                    <View style={styles.exerciseDetails}>
                      <View style={styles.exerciseDetailRow}>
                        <Ionicons name="body" size={14} color={AiraColors.mutedForeground} />
                        <ThemedText style={styles.exerciseDetailLabel}>Músculos:</ThemedText>
                        <ThemedText style={styles.exerciseDetailText}>
                          {exercise.musculosImplicados}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.exerciseDetailRow}>
                        <Ionicons name="time" size={14} color={AiraColors.mutedForeground} />
                        <ThemedText style={styles.exerciseDetailLabel}>Descanso:</ThemedText>
                        <ThemedText style={styles.exerciseDetailText}>
                          {exercise.descanso}
                        </ThemedText>
                      </View>
                    </View>

                    {exercise.consejosEjecucion && (
                      <View style={styles.tipsSection}>
                        <Ionicons name="checkmark-circle" size={14} color={AiraColors.primary} />
                        <ThemedText style={styles.tipsText}>{exercise.consejosEjecucion}</ThemedText>
                      </View>
                    )}

                    {exercise.alternativaOpcional && (
                      <View style={styles.alternativeSection}>
                        <Ionicons name="swap-horizontal" size={14} color={AiraColors.accent} />
                        <ThemedText style={styles.alternativeText}>
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
                    <Ionicons name="snow" size={16} color="#06B6D4" />
                    <ThemedText style={styles.subsectionTitle}>Enfriamiento</ThemedText>
                  </View>
                  <ThemedText style={styles.subsectionText}>{session.enfriamiento}</ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        {routine.sugerenciasAdicionales && (
          <View style={styles.suggestionsSection}>
            <View style={styles.suggestionsHeader}>
              <Ionicons name="bulb" size={20} color={AiraColors.primary} />
              <ThemedText style={styles.suggestionsTitle}>
                Sugerencias Adicionales
              </ThemedText>
            </View>
            <ThemedText style={styles.suggestionsText}>{routine.sugerenciasAdicionales}</ThemedText>
          </View>
        )}

        {routine.suggestedNextActions && routine.suggestedNextActions.length > 0 && (
          <View style={styles.actionsSection}>
            <ThemedText style={styles.sectionTitle}>
              ¿Qué te gustaría hacer ahora?
            </ThemedText>
            <View style={styles.actionsGrid}>
              {routine.suggestedNextActions.map((action, index) => (
                <TouchableOpacity key={index} style={styles.actionButton}>
                  <ThemedText style={styles.actionText}>
                    {action.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[styles.controlButton, styles.editButton]}
            onPress={onEditParams}
          >
            <Ionicons name="create" size={20} color="#3B82F6" />
            <ThemedText style={styles.editButtonText}>
              Editar Parámetros
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.regenerateButton]}
            onPress={onRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="refresh" size={20} color="white" />
            )}
            <ThemedText style={styles.regenerateButtonText}>
              {isRegenerating ? "Regenerando..." : "Regenerar Rutina"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={["#3B82F6", "#1D4ED8"]}
              style={styles.saveGradient}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="bookmark" size={20} color="white" />
              )}
              <ThemedText style={styles.saveButtonText}>
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
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginBottom: 24,
  },
  headerGradient: {
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  routineTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
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
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.destructive,
  },
  warningText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  sessionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    flex: 1,
  },
  focusTag: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  focusText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  warmupSection: {
    marginBottom: 16,
  },
  cooldownSection: {
    marginTop: 16,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  subsectionText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
    paddingLeft: 24,
  },
  exercisesSection: {
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.02),
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginLeft: 24,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
    flex: 1,
    marginRight: 8,
  },
  exerciseSets: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3B82F6",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  exerciseDescription: {
    fontSize: 13,
    color: AiraColors.foreground,
    lineHeight: 18,
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
    fontSize: 12,
    fontWeight: "500",
    color: AiraColors.mutedForeground,
    minWidth: 60,
  },
  exerciseDetailText: {
    fontSize: 12,
    color: AiraColors.foreground,
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
    fontSize: 12,
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 16,
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
    fontSize: 12,
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 16,
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
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.primary,
  },
  suggestionsText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
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
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  controlsSection: {
    gap: 12,
  },
  controlButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  editButton: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3B82F6",
  },
  regenerateButton: {
    backgroundColor: AiraColors.mutedForeground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: "500",
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
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
}); 