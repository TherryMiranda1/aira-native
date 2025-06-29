import { memo } from "react";
import { Exercise } from "@/services/api/exercise.service";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import {
  getExerciseDifficultyColor,
  getExerciseTypeColor,
} from "@/utils/colors";
import { AiraVariants } from "@/constants/Themes";

interface ExerciseItemProps {
  exercise: Exercise;
  onPress: (id: string) => void;
  onSchedule?: (exerciseId: string, exerciseTitle: string) => void;
}

export const ExerciseItem = memo(
  ({
    exercise,
    onPress,
    onSchedule,
  }: ExerciseItemProps) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(exercise.id)}
        style={styles.exerciseCard}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badgesContainer}>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor:
                    getExerciseDifficultyColor(exercise.nivel_dificultad) + "20",
                  borderColor: getExerciseDifficultyColor(
                    exercise.nivel_dificultad
                  ),
                },
              ]}
            >
              <ThemedText
                type="small"
                style={[
                  styles.difficultyText,
                  {
                    color: getExerciseDifficultyColor(exercise.nivel_dificultad),
                  },
                ]}
              >
                {exercise.nivel_dificultad.charAt(0).toUpperCase() +
                  exercise.nivel_dificultad.slice(1)}
              </ThemedText>
            </View>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor:
                    getExerciseTypeColor(exercise.tipo_ejercicio) + "20",
                  borderColor: getExerciseTypeColor(exercise.tipo_ejercicio),
                },
              ]}
            >
              <ThemedText
                type="small"
                style={[
                  styles.typeText,
                  { color: getExerciseTypeColor(exercise.tipo_ejercicio) },
                ]}
              >
                {exercise.tipo_ejercicio.charAt(0).toUpperCase() +
                  exercise.tipo_ejercicio.slice(1)}
              </ThemedText>
            </View>
          </View>
          {onSchedule && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onSchedule(exercise.id, exercise.nombre);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={AiraColors.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ThemedText style={styles.exerciseTitle}>{exercise.nombre}</ThemedText>

        <ThemedText style={styles.exerciseCategory}>
          💪{" "}
          {exercise.categoria &&
            exercise.categoria.charAt(0).toUpperCase() +
              exercise.categoria.slice(1)}
        </ThemedText>

        <View style={styles.exerciseDetails}>
          <View style={styles.exerciseDetail}>
            <Ionicons
              name="barbell-outline"
              size={16}
              color={AiraColors.mutedForeground}
            />
            <ThemedText type="small" style={styles.exerciseDetailText}>
              {exercise.modalidad.charAt(0).toUpperCase() +
                exercise.modalidad.slice(1)}
            </ThemedText>
          </View>
          {exercise.valores_ejemplo_mujer_principiante?.repeticiones && (
            <View style={styles.exerciseDetail}>
              <Ionicons
                name="repeat-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText type="small" style={styles.exerciseDetailText}>
                {exercise.valores_ejemplo_mujer_principiante?.repeticiones} reps
              </ThemedText>
            </View>
          )}
          {exercise.valores_ejemplo_mujer_principiante?.duracion_minutos && (
            <View style={styles.exerciseDetail}>
              <Ionicons
                name="time-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText type="small" style={styles.exerciseDetailText}>
                {exercise.valores_ejemplo_mujer_principiante?.duracion_minutos}{" "}
                min
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText style={styles.exerciseDescription} numberOfLines={3}>
          {exercise.descripcion}
        </ThemedText>

        <View>
          <ThemedText type="small">Equipamiento:</ThemedText>
          <View style={styles.equipmentList}>
            {exercise.equipamiento_necesario.map((equipo, index) => (
              <View key={index} style={styles.equipmentItem}>
                <ThemedText type="small">{equipo.replace("_", " ")}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

// Añadir displayName para resolver error de lint
ExerciseItem.displayName = "ExerciseItem";

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.foregroundWithOpacity(0.1),
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleButton: {
    padding: 8,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
     
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 12,
     
  },
  exerciseTitle: {
    fontSize: 18,
     
    marginBottom: 8,
  },
  exerciseMuscles: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  exerciseDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  exerciseDetailText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginLeft: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
    marginBottom: 16,
  },

  equipmentTitle: {
    fontSize: 14,
     
    marginBottom: 4,
  },
  equipmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  equipmentItem: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  viewButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    alignItems: "center",
  },
  viewButtonText: {
    color: AiraColors.background,
    fontSize: 14,
  },
});
