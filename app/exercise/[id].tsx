import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { ModalScreen } from "@/components/navigation/ModalScreen";

// Importamos los datos de ejercicios
import biceps from "@/mocks/exercises/biceps.json";
import espalda from "@/mocks/exercises/espalda.json";
import hombros from "@/mocks/exercises/hombros.json";
import pecho from "@/mocks/exercises/pecho.json";
import piernas from "@/mocks/exercises/piernas.json";
import triceps from "@/mocks/exercises/triceps.json";
import { AiraVariants } from "@/constants/Themes";
import {
  getExerciseDifficultyColor,
  getExerciseTypeColor,
} from "@/utils/colors";

interface MetricaConfigurable {
  metrica: string;
  unidad: string | null;
  tipo_input: string;
}

interface ValoresEjemplo {
  peso_kg?: number;
  repeticiones?: number;
  series?: number;
  duracion_minutos?: number;
  distancia_km?: number;
  descanso_entre_series_segundos?: number;
}

interface Exercise {
  id_ejercicio: string;
  nombre: string;
  descripcion: string;
  instrucciones: string[];
  tipo_ejercicio: string;
  modalidad: string;
  grupos_musculares: string[];
  equipamiento_necesario: string[];
  nivel_dificultad: string;
  media: {
    imagen_url: string;
    video_url: string;
  };
  metricas_configurables?: MetricaConfigurable[];
  valores_ejemplo_mujer_principiante: ValoresEjemplo;
  tags_busqueda: string[];
  advertencias: string;
  categoria?: string;
}

// Función para procesar los ejercicios y añadir categoría
const processExercises = (exercises: any[], categoria: string): Exercise[] => {
  return exercises.map((exercise) => ({
    ...exercise,
    categoria,
  }));
};

// Combinamos todos los ejercicios en un solo array
const allExercises: Exercise[] = [
  ...processExercises(biceps, "biceps"),
  ...processExercises(espalda, "espalda"),
  ...processExercises(hombros, "hombros"),
  ...processExercises(pecho, "pecho"),
  ...processExercises(piernas, "piernas"),
  ...processExercises(triceps, "triceps"),
];

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>("instrucciones");
  const [exercise, setExercise] = useState<Exercise | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar el ejercicio por ID
    const foundExercise = allExercises.find((e) => e.id_ejercicio === id);
    setExercise(foundExercise || undefined);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <PageView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={AiraColors.primary} />
          <ThemedText style={styles.loadingText}>
            Cargando ejercicio...
          </ThemedText>
        </View>
      </PageView>
    );
  }

  if (!exercise) {
    return (
      <ModalScreen title="Ejercicio no encontrado">
        <View style={styles.notFoundContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={AiraColors.mutedForeground}
          />
          <ThemedText style={styles.notFoundText}>
            No se encontró el ejercicio solicitado
          </ThemedText>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>
              Volver a Ejercicios
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ModalScreen>
    );
  }

  return (
    <ModalScreen title={exercise.nombre}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con badges */}
        <View style={styles.headerBadges}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: getExerciseDifficultyColor(
                  exercise.nivel_dificultad
                ),
                borderColor: getExerciseDifficultyColor(
                  exercise.nivel_dificultad
                ),
              },
            ]}
          >
            <ThemedText style={[styles.badgeText]}>
              {exercise.nivel_dificultad.charAt(0).toUpperCase() +
                exercise.nivel_dificultad.slice(1)}
            </ThemedText>
          </View>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: getExerciseTypeColor(exercise.tipo_ejercicio),
                borderColor: getExerciseTypeColor(exercise.tipo_ejercicio),
              },
            ]}
          >
            <ThemedText style={[styles.badgeText]}>
              {exercise.tipo_ejercicio.charAt(0).toUpperCase() +
                exercise.tipo_ejercicio.slice(1)}
            </ThemedText>
          </View>

          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>
              {exercise.modalidad.charAt(0).toUpperCase() +
                exercise.modalidad.slice(1)}
            </ThemedText>
          </View>
        </View>

        {/* Título y descripción */}
        <ThemedText style={styles.title}>{exercise.nombre}</ThemedText>

        <ThemedText style={styles.category}>
          💪{" "}
          {exercise.categoria &&
            exercise.categoria.charAt(0).toUpperCase() +
              exercise.categoria.slice(1)}
        </ThemedText>

        <ThemedText style={styles.muscleGroups}>
          🎯{" "}
          {exercise.grupos_musculares
            .map((grupo) => grupo.replace("_", " "))
            .join(", ")}
        </ThemedText>

        <ThemedText style={styles.description}>
          {exercise.descripcion}
        </ThemedText>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "instrucciones" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("instrucciones")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "instrucciones" && styles.activeTabText,
              ]}
            >
              Instrucciones
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "metricas" && styles.activeTab]}
            onPress={() => setActiveTab("metricas")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "metricas" && styles.activeTabText,
              ]}
            >
              Métricas
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "equipo" && styles.activeTab]}
            onPress={() => setActiveTab("equipo")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "equipo" && styles.activeTabText,
              ]}
            >
              Equipo
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Contenido de las tabs */}
        <View style={styles.tabContent}>
          {activeTab === "instrucciones" && (
            <View>
              <ThemedText style={styles.sectionTitle}>Instrucciones</ThemedText>
              {exercise.instrucciones.map((instruccion, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <ThemedText style={styles.instructionNumberText}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.instructionText}>
                    {instruccion}
                  </ThemedText>
                </View>
              ))}

              {exercise.advertencias && (
                <View style={styles.warningContainer}>
                  <ThemedText style={styles.warningTitle}>
                    ⚠️ Advertencias
                  </ThemedText>
                  <ThemedText style={styles.warningText}>
                    {exercise.advertencias}
                  </ThemedText>
                </View>
              )}
            </View>
          )}

          {activeTab === "metricas" && (
            <View>
              <ThemedText style={styles.sectionTitle}>
                Métricas recomendadas
              </ThemedText>
              <View style={styles.metricsContainer}>
                {exercise.valores_ejemplo_mujer_principiante?.peso_kg && (
                  <View style={styles.metricItem}>
                    <Ionicons
                      name="barbell-outline"
                      size={24}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.metricLabel}>Peso</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {exercise.valores_ejemplo_mujer_principiante.peso_kg} kg
                    </ThemedText>
                  </View>
                )}

                {exercise.valores_ejemplo_mujer_principiante?.repeticiones && (
                  <View style={styles.metricItem}>
                    <Ionicons
                      name="repeat-outline"
                      size={24}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.metricLabel}>
                      Repeticiones
                    </ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {
                        exercise.valores_ejemplo_mujer_principiante
                          ?.repeticiones
                      }
                    </ThemedText>
                  </View>
                )}

                {exercise.valores_ejemplo_mujer_principiante?.series && (
                  <View style={styles.metricItem}>
                    <Ionicons
                      name="layers-outline"
                      size={24}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.metricLabel}>Series</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {exercise.valores_ejemplo_mujer_principiante.series}
                    </ThemedText>
                  </View>
                )}

                {exercise.valores_ejemplo_mujer_principiante
                  ?.descanso_entre_series_segundos && (
                  <View style={styles.metricItem}>
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.metricLabel}>Descanso</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {
                        exercise.valores_ejemplo_mujer_principiante
                          .descanso_entre_series_segundos
                      }{" "}
                      seg
                    </ThemedText>
                  </View>
                )}

                {exercise.valores_ejemplo_mujer_principiante
                  ?.duracion_minutos && (
                  <View style={styles.metricItem}>
                    <Ionicons
                      name="stopwatch-outline"
                      size={24}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.metricLabel}>Duración</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {
                        exercise.valores_ejemplo_mujer_principiante
                          .duracion_minutos
                      }{" "}
                      min
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          )}

          {activeTab === "equipo" && (
            <View>
              <ThemedText style={styles.sectionTitle}>
                Equipamiento necesario
              </ThemedText>
              <View style={styles.equipmentContainer}>
                {exercise.equipamiento_necesario.map((equipo, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Ionicons
                      name="fitness-outline"
                      size={20}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.equipmentText}>
                      {equipo.replace("_", " ")}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <ThemedText style={styles.tagsTitle}>Etiquetas</ThemedText>
          <View style={styles.tagsList}>
            {exercise.tags_busqueda?.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <ThemedText style={styles.tagText}>
                  {tag.replace("_", " ")}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Botón para volver */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>
            Volver a Ejercicios
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerBadges: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
  },
  badgeText: {
    fontSize: 12,
    color: AiraColors.foreground,
  },
  title: {
    fontSize: 24,
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  muscleGroups: {
    fontSize: 14,
    color: AiraColors.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    lineHeight: 24,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: AiraColors.primary,
  },
  tabText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  activeTabText: {
    color: AiraColors.primary,
  },
  tabContent: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    color: AiraColors.primaryForeground,
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: AiraColors.mutedForeground,
    lineHeight: 24,
  },
  warningContainer: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginTop: 16,
  },
  warningTitle: {
    fontSize: 16,
    color: AiraColors.destructive,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: AiraColors.destructive,
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metricItem: {
    width: "45%",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginTop: 8,
  },
  metricValue: {
    fontSize: 18,
    color: AiraColors.foreground,
    marginTop: 4,
  },
  equipmentContainer: {
    gap: 12,
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    gap: 8,
  },
  equipmentText: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagItem: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.tagRadius,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  backButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 14,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    marginTop: 8,
  },
  backButtonText: {
    color: AiraColors.primaryForeground,
    fontSize: 16,
  },
});
