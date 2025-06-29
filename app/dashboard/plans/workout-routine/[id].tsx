import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Topbar } from "@/components/ui/Topbar";
import { useDailyWorkoutRoutines } from "@/hooks/services/useDailyWorkoutRoutines";
import { DailyWorkoutRoutine } from "@/services/api/dailyWorkoutRoutine.service";
import { PageView } from "@/components/ui/PageView";

export default function WorkoutRoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRoutineById, deleteRoutine, updateRoutine, loading } =
    useDailyWorkoutRoutines();

  const [routine, setRoutine] = useState<DailyWorkoutRoutine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoutine();
  }, [id]);

  const loadRoutine = async () => {
    if (!id) {
      setError("ID de rutina no válido");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const routineData = await getRoutineById(id);

      if (!routineData) {
        setError("Rutina no encontrada");
        return;
      }

      setRoutine(routineData);
    } catch (error) {
      console.error("Error cargando rutina:", error);
      setError("Error al cargar la rutina");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!routine) return;

    Alert.alert(
      "Eliminar Rutina",
      `¿Estás segura de que quieres eliminar "${routine.routineName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoutine(routine.id);
              Alert.alert(
                "Rutina Eliminada",
                "La rutina se ha eliminado exitosamente",
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch (error) {
              console.error("Error eliminando rutina:", error);
              Alert.alert("Error", "No se pudo eliminar la rutina");
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (!routine) return;

    try {
      const updatedRoutine = {
        ...routine,
        isFavorite: !routine.isFavorite,
      };

      await updateRoutine(routine.id, updatedRoutine);
      setRoutine(updatedRoutine);
    } catch (error) {
      console.error("Error actualizando favorito:", error);
      Alert.alert("Error", "No se pudo actualizar la rutina");
    }
  };

  const handleShare = async () => {
    if (!routine) return;

    try {
      const shareContent = `${routine.routineName}\n\n${routine.sessions
        .map(
          (session, index) =>
            `Sesión ${index + 1}: ${session.sessionName}\n${session.exercises
              .map(
                (exercise) =>
                  `• ${exercise.exerciseName} - ${exercise.setsReps}`
              )
              .join("\n")}`
        )
        .join("\n\n")}\n\nGenerado por Aira`;

      await Share.share({
        message: shareContent,
        title: routine.routineName,
      });
    } catch (error) {
      console.error("Error compartiendo rutina:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalExercises = (): number => {
    if (!routine) return 0;
    return routine.sessions.reduce(
      (total, session) => total + session.exercises.length,
      0
    );
  };

  const renderActions = () => {
    if (!routine) return null;

    return (
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={routine.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={AiraColors.foreground}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share" size={24} color={AiraColors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash" size={24} color={AiraColors.foreground} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoadingView = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <ThemedText style={styles.loadingText}>Cargando rutina...</ThemedText>
    </View>
  );

  const renderErrorView = () => (
    <View style={styles.errorContainer}>
      <View style={styles.errorCard}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={AiraColors.destructive}
        />
        <ThemedText style={styles.errorTitle}>Error</ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error || "No se pudo cargar la rutina"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadRoutine}>
          <ThemedText style={styles.retryButtonText}>
            Intentar de nuevo
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRoutineContent = () => {
    if (!routine) return null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Ionicons name="fitness" size={24} color="#3B82F6" />
            </View>
            <View style={styles.summaryInfo}>
              <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>
                Resumen de la Rutina
              </ThemedText>
              <ThemedText style={styles.summarySubtitle}>
                {routine.sessions.length} sesiones • {getTotalExercises()}{" "}
                ejercicios
              </ThemedText>
            </View>
          </View>

          <View style={styles.summaryStats}>
            {routine.inputParameters.daysPerWeek && (
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={16} color="#3B82F6" />
                <ThemedText style={styles.statLabel}>Frecuencia</ThemedText>
                <ThemedText style={styles.statValue}>
                  {routine.inputParameters.daysPerWeek}
                </ThemedText>
              </View>
            )}

            {routine.inputParameters.timePerSession && (
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color="#3B82F6" />
                <ThemedText style={styles.statLabel}>Duración</ThemedText>
                <ThemedText style={styles.statValue}>
                  {routine.inputParameters.timePerSession}
                </ThemedText>
              </View>
            )}

            {routine.inputParameters.fitnessLevel && (
              <View style={styles.statItem}>
                <Ionicons name="speedometer" size={16} color="#3B82F6" />
                <ThemedText style={styles.statLabel}>Nivel</ThemedText>
                <ThemedText style={styles.statValue}>
                  {routine.inputParameters.fitnessLevel}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {routine.inputParameters.availableEquipment && (
          <View style={styles.equipmentCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="barbell" size={20} color="#3B82F6" />
              <ThemedText style={styles.cardTitle}>Equipamiento</ThemedText>
            </View>
            <ThemedText style={styles.equipmentText}>
              {routine.inputParameters.availableEquipment}
            </ThemedText>
          </View>
        )}

        <View style={styles.sessionsSection}>
          <ThemedText style={styles.sectionTitle}>
            Sesiones de Entrenamiento
          </ThemedText>
          {routine.sessions.map((session, sessionIndex) => (
            <View key={sessionIndex} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <ThemedText style={styles.sessionName}>
                  {session.sessionName}
                </ThemedText>
                <View style={styles.sessionBadge}>
                  <ThemedText style={styles.sessionBadgeText}>
                    {session.exercises.length} ejercicios
                  </ThemedText>
                </View>
              </View>

              {session.focus && (
                <View style={styles.sessionFocus}>
                  <Ionicons name="pulse" size={14} color="#3B82F6" />
                  <ThemedText style={styles.sessionFocusText}>
                    {session.focus}
                  </ThemedText>
                </View>
              )}

              {session.warmup && (
                <View style={styles.sessionSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="flame" size={16} color="#F59E0B" />
                    <ThemedText style={styles.sectionHeaderText}>
                      Calentamiento
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.sectionText}>
                    {session.warmup}
                  </ThemedText>
                </View>
              )}

              <View style={styles.exercisesSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="list" size={16} color="#3B82F6" />
                  <ThemedText style={styles.sectionHeaderText}>
                    Ejercicios
                  </ThemedText>
                </View>
                {session.exercises.map((exercise, exerciseIndex) => (
                  <View key={exerciseIndex} style={styles.exerciseItem}>
                    <View style={styles.exerciseHeader}>
                      <ThemedText style={styles.exerciseName}>
                        {exercise.exerciseName}
                      </ThemedText>
                      <ThemedText style={styles.exerciseSets}>
                        {exercise.setsReps}
                      </ThemedText>
                    </View>

                    {exercise.detailedDescription && (
                      <ThemedText style={styles.exerciseDescription}>
                        {exercise.detailedDescription}
                      </ThemedText>
                    )}

                    <View style={styles.exerciseDetails}>
                      {exercise.musclesInvolved && (
                        <View style={styles.exerciseDetailRow}>
                          <Ionicons
                            name="body"
                            size={12}
                            color={AiraColors.mutedForeground}
                          />
                          <ThemedText style={styles.exerciseDetailText}>
                            {exercise.musclesInvolved}
                          </ThemedText>
                        </View>
                      )}

                      {exercise.rest && (
                        <View style={styles.exerciseDetailRow}>
                          <Ionicons
                            name="time"
                            size={12}
                            color={AiraColors.mutedForeground}
                          />
                          <ThemedText style={styles.exerciseDetailText}>
                            {exercise.rest}
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    {exercise.executionTips && (
                      <View style={styles.exerciseTips}>
                        <Ionicons
                          name="checkmark-circle"
                          size={12}
                          color="#3B82F6"
                        />
                        <ThemedText style={styles.exerciseTipsText}>
                          {exercise.executionTips}
                        </ThemedText>
                      </View>
                    )}

                    {exercise.optionalAlternative && (
                      <View style={styles.exerciseAlternative}>
                        <Ionicons
                          name="swap-horizontal"
                          size={12}
                          color={AiraColors.accent}
                        />
                        <ThemedText style={styles.exerciseAlternativeText}>
                          Alternativa: {exercise.optionalAlternative}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {session.cooldown && (
                <View style={styles.sessionSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="snow" size={16} color="#06B6D4" />
                    <ThemedText style={styles.sectionHeaderText}>
                      Enfriamiento
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.sectionText}>
                    {session.cooldown}
                  </ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        {routine.warnings && (
          <View style={styles.warningsCard}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="warning"
                size={20}
                color={AiraColors.destructive}
              />
              <ThemedText style={styles.warningTitle}>Advertencias</ThemedText>
            </View>
            <ThemedText style={styles.warningText}>
              {routine.warnings}
            </ThemedText>
          </View>
        )}

        {routine.additionalSuggestions && (
          <View style={styles.suggestionsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="bulb" size={20} color="#3B82F6" />
              <ThemedText style={styles.cardTitle}>
                Sugerencias Adicionales
              </ThemedText>
            </View>
            <ThemedText style={styles.suggestionsText}>
              {routine.additionalSuggestions}
            </ThemedText>
          </View>
        )}

        <View style={styles.tagsSection}>
          <ThemedText style={styles.tagsTitle}>Etiquetas</ThemedText>
          <View style={styles.tagsContainer}>
            {routine.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <PageView>
        <Topbar
          title="Rutina de Ejercicio"
          showBackButton={true}
          onBack={() => router.back()}
        />
        {renderLoadingView()}
      </PageView>
    );
  }

  if (error || !routine) {
    return (
      <PageView>
        <Topbar
          title="Rutina de Ejercicio"
          showBackButton={true}
          onBack={() => router.back()}
        />
        {renderErrorView()}
      </PageView>
    );
  }

  return (
    <PageView>
      <Topbar
        title={routine?.routineName || "Rutina de Ejercicio"}
        showBackButton={true}
        onBack={() => router.back()}
        actions={renderActions()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {renderRoutineContent()}
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorCard: {
    backgroundColor: AiraColors.card,
    padding: 32,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  errorTitle: {
    fontSize: 20,
     
    color: AiraColors.foreground,
  },
  errorMessage: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: AiraVariants.cardRadius,
    marginTop: 8,
  },
  retryButtonText: {
    color: "white",
     
  },
  summaryCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AiraColors.border,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
     
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  summaryStats: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 120,
  },
  statLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  statValue: {
    fontSize: 12,
    color: AiraColors.foreground,
     
  },
  equipmentCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AiraColors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
     
    color: AiraColors.foreground,
  },
  equipmentText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  sessionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
     
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
    marginBottom: 12,
  },
  sessionName: {
    fontSize: 16,
     
    color: "#3B82F6",
    flex: 1,
  },
  sessionBadge: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionBadgeText: {
    fontSize: 12,
    color: "#3B82F6",
  },
  sessionFocus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sessionFocusText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  sessionSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
     
    color: AiraColors.foreground,
  },
  sectionText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
    paddingLeft: 24,
  },
  exercisesSection: {
    marginBottom: 16,
  },
  exerciseItem: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.02),
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    marginBottom: 8,
    marginLeft: 24,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  exerciseName: {
    fontSize: 14,
     
    color: AiraColors.foreground,
    flex: 1,
    marginRight: 8,
  },
  exerciseSets: {
    fontSize: 12,

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
    marginBottom: 6,
  },
  exerciseDetails: {
    gap: 4,
    marginBottom: 6,
  },
  exerciseDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  exerciseDetailText: {
    fontSize: 12,
    color: AiraColors.foreground,
    flex: 1,
  },
  exerciseTips: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    padding: 8,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 4,
  },
  exerciseTipsText: {
    fontSize: 12,
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 16,
  },
  exerciseAlternative: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.05),
    padding: 8,
    borderRadius: 6,
  },
  exerciseAlternativeText: {
    fontSize: 12,
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 16,
  },
  warningsCard: {
    backgroundColor: AiraColorsWithAlpha.destructiveWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.destructiveWithOpacity(0.1),
  },
  warningTitle: {
    fontSize: 16,
     
    color: AiraColors.destructive,
  },
  warningText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  suggestionsCard: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  suggestionsText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 16,
     
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: "#3B82F6",
  },
});
