import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ModalScreen } from "@/components/navigation/ModalScreen";
import { LoadingState } from "@/components/States/LoadingState";
import { EmptyState } from "@/components/States/EmptyState";
import { exerciseService, Exercise } from "@/services/api/exercise.service";
import { ScheduleEventModal } from "@/components/modals/ScheduleEventModal";
import { ThemedView } from "@/components/ThemedView";

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scheduleModal, setScheduleModal] = useState({
    visible: false,
    exerciseId: "",
    exerciseTitle: "",
  });

  useEffect(() => {
    async function fetchExercise() {
      if (!id) {
        setError("ID de ejercicio no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const exerciseData = await exerciseService.getExerciseById(
          id as string
        );
        setExercise(exerciseData);
      } catch (err) {
        console.error("Error al cargar el ejercicio:", err);
        setError(
          "No pudimos cargar el ejercicio. Por favor, intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchExercise();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleScheduleExercise = () => {
    if (exercise) {
      setScheduleModal({
        visible: true,
        exerciseId: exercise.id,
        exerciseTitle: exercise.nombre,
      });
    }
  };

  const handleCloseScheduleModal = () => {
    setScheduleModal({
      visible: false,
      exerciseId: "",
      exerciseTitle: "",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "principiante":
        return "#22C55E";
      case "intermedio":
        return "#F59E0B";
      case "avanzado":
        return "#EF4444";
      default:
        return AiraColors.mutedForeground;
    }
  };

  if (loading) {
    return (
      <ModalScreen title="">
        <LoadingState />
      </ModalScreen>
    );
  }

  if (error || !exercise) {
    return (
      <ModalScreen title="">
        <EmptyState
          title="Ejercicio no encontrado"
          description="Lo siento, no pudimos encontrar el ejercicio que buscas."
          buttonText="Volver"
          onPress={() => router.back()}
        />
      </ModalScreen>
    );
  }

  return (
    <ModalScreen title="">
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {exercise.imagen && (
            <Image
              source={{ uri: exercise.imagen }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.heroOverlay}>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={handleScheduleExercise}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={toggleFavorite}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={isFavorite ? "#FF6B6B" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <ThemedText type="title" style={styles.title}>
              {exercise.nombre}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {exercise.grupos_musculares
                .map((grupo) => grupo.replace("_", " "))
                .join(", ")}
            </ThemedText>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor:
                      getDifficultyColor(exercise.nivel_dificultad) + "20",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.statText,
                    { color: getDifficultyColor(exercise.nivel_dificultad) },
                  ]}
                >
                  {exercise.nivel_dificultad}
                </ThemedText>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="fitness-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.statText}>
                {exercise.tipo_ejercicio}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.statText}>
                {exercise.modalidad}
              </ThemedText>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText style={styles.description}>
              {exercise.descripcion}
            </ThemedText>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Instrucciones
            </ThemedText>
            <View style={styles.stepsList}>
              {exercise.instrucciones.map((instruccion, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <ThemedText style={styles.stepNumberText}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.stepText}>{instruccion}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Metrics */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Métricas recomendadas
            </ThemedText>
            <View style={styles.metricsGrid}>
              {exercise.valores_ejemplo_mujer_principiante?.series && (
                <ThemedView variant="border" style={styles.metricCard}>
                  <Ionicons
                    name="layers-outline"
                    size={20}
                    color={AiraColors.primary}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                    {exercise.valores_ejemplo_mujer_principiante.series}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>Series</ThemedText>
                </ThemedView>
              )}

              {exercise.valores_ejemplo_mujer_principiante?.repeticiones && (
                <ThemedView variant="border" style={styles.metricCard}>
                  <Ionicons
                    name="repeat-outline"
                    size={20}
                    color={AiraColors.primary}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                    {exercise.valores_ejemplo_mujer_principiante.repeticiones}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>Reps</ThemedText>
                </ThemedView>
              )}

              {exercise.valores_ejemplo_mujer_principiante?.peso_kg && (
                <ThemedView variant="border" style={styles.metricCard}>
                  <Ionicons
                    name="barbell-outline"
                    size={20}
                    color={AiraColors.primary}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                    {exercise.valores_ejemplo_mujer_principiante.peso_kg} kg
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>Peso</ThemedText>
                </ThemedView>
              )}

              {exercise.valores_ejemplo_mujer_principiante
                ?.descanso_entre_series_segundos && (
                <ThemedView variant="border" style={styles.metricCard}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={AiraColors.primary}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                    {
                      exercise.valores_ejemplo_mujer_principiante
                        .descanso_entre_series_segundos
                    }
                    s
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>Descanso</ThemedText>
                </ThemedView>
              )}
            </View>
          </View>

          {/* Equipment */}
          {exercise.equipamiento_necesario.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Equipamiento
              </ThemedText>
              <View style={styles.equipmentList}>
                {exercise.equipamiento_necesario.map((equipo, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <View style={styles.equipmentDot} />
                    <ThemedText style={styles.equipmentText}>
                      {equipo.replace("_", " ")}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Warning */}
          {exercise.advertencias && (
            <View style={styles.warningSection}>
              <View style={styles.warningHeader}>
                <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                <ThemedText style={styles.warningTitle}>
                  Precauciones
                </ThemedText>
              </View>
              <ThemedText style={styles.warningText}>
                {exercise.advertencias}
              </ThemedText>
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Schedule Modal */}
      <ScheduleEventModal
        visible={scheduleModal.visible}
        onClose={handleCloseScheduleModal}
        type="exercise"
        itemId={scheduleModal.exerciseId}
        itemTitle={scheduleModal.exerciseTitle}
      />
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    position: "relative",
    height: 280,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
  },
  scheduleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: "row",
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AiraColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    color: AiraColors.primaryForeground,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  metricValue: {
    fontSize: 20,
  },
  metricLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  equipmentList: {
    gap: 16,
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  equipmentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AiraColors.primary,
  },
  equipmentText: {
    fontSize: 16,
  },
  warningSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    color: "#92400E",
  },
  warningText: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
