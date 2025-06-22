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
      "Eliminar Rutina",
      `¿Segura que quieres eliminar "${routine.routineName}"?`,
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hoy";
    if (diffDays === 2) return "Ayer";
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`;
    
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const getTotalExercises = (routine: DailyWorkoutRoutine): number => {
    return routine.sessions.reduce(
      (total, session) => total + session.exercises.length,
      0
    );
  };

  const getMainInfo = (routine: DailyWorkoutRoutine) => {
    if (routine.inputParameters.fitnessLevel) {
      return {
        icon: "speedometer" as const,
        text: routine.inputParameters.fitnessLevel,
        color: AiraColors.primary,
      };
    }
    if (routine.inputParameters.daysPerWeek) {
      return {
        icon: "calendar" as const,
        text: routine.inputParameters.daysPerWeek,
        color: AiraColors.accent,
      };
    }
    return null;
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
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No tienes rutinas guardadas
          </ThemedText>
          <ThemedText type="small" style={styles.emptyDescription}>
            Genera tu primera rutina de ejercicio y aparecerá aquí
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Rutinas de Ejercicio
        </ThemedText>
        <View style={styles.countBadge}>
          <ThemedText type="small" style={styles.countText}>
            {routines.length}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.routinesContainer}
      >
        {routines.map((routine) => {
          const mainInfo = getMainInfo(routine);
          
          return (
            <TouchableOpacity
              key={routine.id}
              style={styles.routineCard}
              onPress={() => handleRoutinePress(routine)}
            >
              <View style={styles.routineHeader}>
                <LinearGradient
                  colors={["#EF4444", "#F97316"]}
                  style={styles.routineIcon}
                >
                  <Ionicons name="fitness" size={18} color="white" />
                </LinearGradient>

                <View style={styles.routineHeaderActions}>
                  {routine.isFavorite && (
                    <Ionicons name="heart" size={14} color={AiraColors.accent} />
                  )}
                  {onRoutineDelete && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletePress(routine)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={AiraColors.mutedForeground}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.routineContent}>
                <ThemedText type="defaultSemiBold" style={styles.routineTitle} numberOfLines={2}>
                  {routine.routineName}
                </ThemedText>

                <View style={styles.routineMeta}>
                  <ThemedText type="small" style={styles.routineDate}>
                    {formatDate(routine.createdAt)}
                  </ThemedText>
                  <ThemedText type="small" style={styles.sessionsCount}>
                    {routine.sessions.length} sesiones
                  </ThemedText>
                </View>

                {mainInfo && (
                  <View style={styles.routineInfo}>
                    <Ionicons 
                      name={mainInfo.icon} 
                      size={12} 
                      color={mainInfo.color} 
                    />
                    <ThemedText type="small" style={styles.infoText} numberOfLines={1}>
                      {mainInfo.text}
                    </ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.routineFooter}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={AiraColors.mutedForeground}
                />
              </View>
            </TouchableOpacity>
          );
        })}
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
    color: AiraColors.foreground,
  },
  countBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    color: "white",
  },
  routinesContainer: {
    gap: 12,
    paddingRight: 20,
  },
  routineCard: {
    width: 260,
    height: 160,
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
    width: 32,
    height: 32,
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
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  routineMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routineDate: {
    color: AiraColors.mutedForeground,
  },
  sessionsCount: {
    color: AiraColors.mutedForeground,
  },
  routineInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: AiraColors.foreground,
    flex: 1,
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
    color: AiraColors.foreground,
    textAlign: "center",
  },
  emptyDescription: {
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
}); 