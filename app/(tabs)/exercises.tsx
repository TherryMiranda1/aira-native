import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Importamos los datos de ejercicios
import biceps from "@/mocks/exercises/biceps.json";
import espalda from "@/mocks/exercises/espalda.json";
import hombros from "@/mocks/exercises/hombros.json";
import pecho from "@/mocks/exercises/pecho.json";
import piernas from "@/mocks/exercises/piernas.json";
import triceps from "@/mocks/exercises/triceps.json";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { SearchModal } from "@/components/exercises/SearchModal";
import { FilterModal } from "@/components/exercises/FilterModal";
import { Topbar } from "@/components/ui/Topbar";
import { PageView } from "@/components/ui/PageView";
import { ActionButton } from "@/components/Buttons/ActionButton";

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

// Función para obtener el color según la dificultad
const getDifficultyColor = (dificultad: string) => {
  switch (dificultad.toLowerCase()) {
    case "principiante":
      return "#4ade80"; // verde
    case "intermedio":
      return "#facc15"; // amarillo
    case "avanzado":
      return "#f87171"; // rojo
    default:
      return AiraColors.mutedForeground; // gris
  }
};

// Función para obtener el color según el tipo de ejercicio
const getTypeColor = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "fuerza":
      return AiraColors.primary; // morado
    case "cardio":
      return "#60a5fa"; // azul
    case "flexibilidad":
      return "#34d399"; // verde
    default:
      return AiraColors.mutedForeground; // gris
  }
};

export default function ExercisesScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Modal states
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Recent searches (could be stored in AsyncStorage in a real app)
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Scroll animation
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    // Cargar los ejercicios cuando el componente se monte
    setExercises(allExercises);
  }, []);

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchTerm)) {
        setRecentSearches([searchTerm, ...recentSearches.slice(0, 4)]);
      }
      setSearchModalVisible(false);
    }
  };

  // Handle selecting a recent search
  const handleSelectRecentSearch = (search: string) => {
    setSearchTerm(search);
    setSearchModalVisible(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterDifficulty("");
    setFilterType("");
    setFilterCategory("");
  };

  // Apply filters and close modal
  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.grupos_musculares.some((grupo) =>
        grupo.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (exercise.tags_busqueda &&
        exercise.tags_busqueda.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesDifficulty =
      filterDifficulty === "" || exercise.nivel_dificultad === filterDifficulty;
    const matchesType =
      filterType === "" || exercise.tipo_ejercicio === filterType;
    const matchesCategory =
      filterCategory === "" || exercise.categoria === filterCategory;
    return matchesSearch && matchesDifficulty && matchesType && matchesCategory;
  });

  return (
    <PageView>
      <Topbar
        title="Ejercicios 💪"
        actions={
          <>
            <ActionButton
              onPress={() => setSearchModalVisible(true)}
              icon="search"
            />
            <ActionButton
              onPress={() => setFilterModalVisible(true)}
              icon="filter"
            />
          </>
        }
      />

      <Animated.ScrollView
        style={styles.exercisesContainer}
        contentContainerStyle={styles.exercisesContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <View key={exercise.id_ejercicio} style={styles.exerciseCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        getDifficultyColor(exercise.nivel_dificultad) + "20",
                      borderColor: getDifficultyColor(
                        exercise.nivel_dificultad
                      ),
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(exercise.nivel_dificultad) },
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
                        getTypeColor(exercise.tipo_ejercicio) + "20",
                      borderColor: getTypeColor(exercise.tipo_ejercicio),
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.typeText,
                      { color: getTypeColor(exercise.tipo_ejercicio) },
                    ]}
                  >
                    {exercise.tipo_ejercicio.charAt(0).toUpperCase() +
                      exercise.tipo_ejercicio.slice(1)}
                  </ThemedText>
                </View>
              </View>

              <ThemedText style={styles.exerciseTitle}>
                {exercise.nombre}
              </ThemedText>

              <ThemedText style={styles.exerciseMuscles}>
                🎯{" "}
                {exercise.grupos_musculares
                  .map((grupo) => grupo.replace("_", " "))
                  .join(", ")}
              </ThemedText>

              <ThemedText style={styles.exerciseCategory}>
                💪{" "}
                {exercise.categoria &&
                  exercise.categoria.charAt(0).toUpperCase() +
                    exercise.categoria.slice(1)}
              </ThemedText>

              <View style={styles.exerciseDetails}>
                <View style={styles.exerciseDetail}>
                  <Ionicons name="barbell-outline" size={16} color="#6b7280" />
                  <ThemedText style={styles.exerciseDetailText}>
                    {exercise.modalidad.charAt(0).toUpperCase() +
                      exercise.modalidad.slice(1)}
                  </ThemedText>
                </View>
                {exercise.valores_ejemplo_mujer_principiante?.repeticiones && (
                  <View style={styles.exerciseDetail}>
                    <Ionicons name="repeat-outline" size={16} color="#6b7280" />
                    <ThemedText style={styles.exerciseDetailText}>
                      {exercise.valores_ejemplo_mujer_principiante.repeticiones}{" "}
                      reps
                    </ThemedText>
                  </View>
                )}
                {exercise.valores_ejemplo_mujer_principiante
                  ?.duracion_minutos && (
                  <View style={styles.exerciseDetail}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <ThemedText style={styles.exerciseDetailText}>
                      {
                        exercise.valores_ejemplo_mujer_principiante
                          .duracion_minutos
                      }{" "}
                      min
                    </ThemedText>
                  </View>
                )}
              </View>

              <ThemedText style={styles.exerciseDescription} numberOfLines={3}>
                {exercise.descripcion}
              </ThemedText>

              <View style={styles.equipmentContainer}>
                <ThemedText style={styles.equipmentTitle}>
                  Equipamiento:
                </ThemedText>
                <View style={styles.equipmentList}>
                  {exercise.equipamiento_necesario.map((equipo, index) => (
                    <View key={index} style={styles.equipmentItem}>
                      <ThemedText style={styles.equipmentText}>
                        {equipo.replace("_", " ")}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  // @ts-ignore - Ignoramos el error de tipado en la navegación
                  router.push(`/exercise/${exercise.id_ejercicio}`);
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.viewButtonText}
                >
                  Ver Ejercicio
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={50} color="#9ca3af" />
            <ThemedText style={styles.emptyText}>
              No se encontraron ejercicios que coincidan con tu búsqueda.
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Intenta con otros términos o filtros.
            </ThemedText>
          </View>
        )}
      </Animated.ScrollView>

      {/* Search Modal */}
      <SearchModal
        visible={searchModalVisible}
        searchTerm={searchTerm}
        onChangeText={setSearchTerm}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        recentSearches={recentSearches}
        onSelectRecentSearch={handleSelectRecentSearch}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        filterDifficulty={filterDifficulty}
        setFilterDifficulty={setFilterDifficulty}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />
    </PageView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  activeFilterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AiraVariants.tagRadius,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
  },
  activeFilterText: {
    fontSize: 12,
    color: AiraColors.primary,
    marginRight: 4,
  },
  clearAllFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  clearAllFiltersText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  exercisesContainer: {
    flex: 1,
  },
  exercisesContent: {
    padding: 8,
    backgroundColor: AiraColors.background,
  },
  exerciseCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  difficultyText: {
    fontSize: 12,
    color: AiraColors.foreground,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  typeText: {
    fontSize: 12,
    color: AiraColors.foreground,
  },
  exerciseTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  exerciseMuscles: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginBottom: 12,
  },
  exerciseDetails: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 12,
  },
  exerciseDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exerciseDetailText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  exerciseDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  equipmentContainer: {
    marginBottom: 16,
  },
  equipmentTitle: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  equipmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
  },
  equipmentText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  viewButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 12,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
  },
  viewButtonText: {
    color: AiraColors.background,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: AiraColors.mutedForeground,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
});
