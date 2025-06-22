import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { DailyWorkoutRoutine } from "@/services/api/dailyWorkoutRoutine.service";

interface ExistingWorkoutRoutinesSectionProps {
  routines: DailyWorkoutRoutine[];
  onRoutineSelect?: (routine: DailyWorkoutRoutine) => void;
  onRoutineDelete?: (routineId: string) => void;
}

export const ExistingWorkoutRoutinesSection = ({
  routines,
  onRoutineSelect,
  onRoutineDelete,
}: ExistingWorkoutRoutinesSectionProps) => {
  const router = useRouter();

  const handleRoutinePress = (routine: DailyWorkoutRoutine) => {
    if (onRoutineSelect) {
      onRoutineSelect(routine);
    } else {
      router.push(`/dashboard/plans/workout-routine/${routine.id}` as any);
    }
  };

  const handleDeletePress = (routine: DailyWorkoutRoutine) => {
    Alert.alert(
      "Eliminar Rutina de Ejercicio",
      `¿Estás segura de que quieres eliminar "${routine.routineName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onRoutineDelete?.(routine.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTotalExercises = (routine: DailyWorkoutRoutine): number => {
    return routine.sessions.reduce(
      (total, session) => total + session.exercises.length,
      0
    );
  };

  if (routines.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Ionicons
            name="fitness"
            size={48}
            color={AiraColors.mutedForeground}
          />
          <ThemedText style={styles.emptyTitle}>
            No tienes rutinas de ejercicio guardadas
          </ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Genera tu primera rutina de ejercicio y se guardará aquí automáticamente
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.sectionTitle}>
          Tus Rutinas de Ejercicio
        </ThemedText>
        <View style={styles.countBadge}>
          <ThemedText style={styles.countText}>{routines.length}</ThemedText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.routinesContainer}
      >
        {routines.map((routine) => (
          <TouchableOpacity
            key={routine.id}
            style={styles.routineCard}
            onPress={() => handleRoutinePress(routine)}
          >
            <View style={styles.routineHeader}>
              <LinearGradient
                colors={["#3B82F6", "#1D4ED8"]}
                style={styles.routineIcon}
              >
                <Ionicons name="fitness" size={20} color="white" />
              </LinearGradient>

              <View style={styles.routineHeaderActions}>
                {routine.isFavorite && (
                  <Ionicons name="heart" size={16} color="#3B82F6" />
                )}
                {onRoutineDelete && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePress(routine)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={AiraColors.mutedForeground}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.routineContent}>
              <ThemedText style={styles.routineTitle} numberOfLines={2}>
                {routine.routineName}
              </ThemedText>

              <View style={styles.routineMeta}>
                <View style={styles.routineTypeContainer}>
                  <ThemedText style={styles.routineType}>
                    Rutina de Ejercicio
                  </ThemedText>
                </View>

                <ThemedText style={styles.routineDate}>
                  {formatDate(routine.createdAt)}
                </ThemedText>
              </View>

              {routine.inputParameters.fitnessLevel && (
                <View style={styles.routineDetail}>
                  <Ionicons name="speedometer" size={12} color="#3B82F6" />
                  <ThemedText style={styles.detailText} numberOfLines={1}>
                    {routine.inputParameters.fitnessLevel}
                  </ThemedText>
                </View>
              )}

              {routine.inputParameters.daysPerWeek && (
                <View style={styles.routineDetail}>
                  <Ionicons name="calendar" size={12} color={AiraColors.accent} />
                  <ThemedText style={styles.detailText} numberOfLines={1}>
                    {routine.inputParameters.daysPerWeek}
                  </ThemedText>
                </View>
              )}

              <View style={styles.sessionsInfo}>
                <Ionicons name="list" size={12} color={AiraColors.mutedForeground} />
                <ThemedText style={styles.sessionsCount}>
                  {routine.sessions.length} sesiones, {getTotalExercises(routine)} ejercicios
                </ThemedText>
              </View>
            </View>

            <View style={styles.routineFooter}>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={AiraColors.mutedForeground}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  countBadge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  routinesContainer: {
    gap: 12,
    paddingRight: 20,
  },
  routineCard: {
    width: 280,
    height: 200,
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    padding: 16,
    gap: 12,
  },
  routineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routineIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  routineHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  routineContent: {
    flex: 1,
    gap: 8,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  routineMeta: {
    gap: 6,
  },
  routineTypeContainer: {
    alignSelf: "flex-start",
  },
  routineType: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3B82F6",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  routineDate: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  routineDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: AiraColors.foreground,
    flex: 1,
  },
  sessionsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionsCount: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    fontWeight: "500",
  },
  routineFooter: {
    alignItems: "flex-end",
  },
  emptyContainer: {
    marginTop: 20,
  },
  emptyCard: {
    backgroundColor: AiraColors.card,
    padding: 32,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
}); 